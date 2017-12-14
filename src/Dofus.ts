import axios, { AxiosInstance } from "axios-proxy-fix";
import * as logger from "winston";
import { IProxy, ProxyHelpers } from "./ProxyHelpers";
import { randomString, readableString } from "./Utils";

export interface IAccount {
  login: string;
  password: string;
}

export class Dofus {

  public static createAccount(useOnlineProxy: boolean = true): Promise<IAccount> {
    return new Promise(async (resolve, reject) => {
      try {

        if (useOnlineProxy) {
          this.proxy = await ProxyHelpers.getValidProxyOnline();
        } else {
          this.proxy = await ProxyHelpers.getValidProxy();
        }

        let guest;
        while (!guest) {
          guest = await this.createGuest();
        }
        let account: IAccount;
        while (!account) {
          account = await this.validateGuest(guest.data.login, guest.xpassword);
        }
        return resolve(account);
      } catch (error) {
        this.createAccount(useOnlineProxy);
        // return reject(error);
      }
    });
  }

  private static axios: AxiosInstance = axios.create({ timeout: 6000 });

  private static set proxy(proxy: IProxy) {
    this.axios = axios.create({
      proxy: {
        host: proxy.host,
        port: proxy.port,
      },
      timeout: 6000,
    });
  }

  private static async createGuest() {
    return new Promise((resolve, reject) => {
      logger.info("Step 1/2: Creating the account...");
      this.axios.get("https://haapi.ankama.com/json/Ankama/v2/Account/CreateGuest?game=18&lang=fr")
        .then((response) => {
          const xpassword = response.headers["x-password"];
          if (xpassword) {
            logger.debug("xpassword", xpassword);
            return resolve({ data: response.data, xpassword });
          } else {
            logger.warn("No xpassword found ... retrying");
            return reject();
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 602) {
              logger
                .error(`IP Daily Rate Reached. (${this.axios.defaults.proxy.host}:${this.axios.defaults.proxy.port})`);
              return reject();
            }
            logger.warn("err", error);
            logger.error("text", error.response.data.text);
            return reject();
          } else {
            logger.warn("err2", error);
            return reject();
          }
        });
    });
  }

  private static validateGuest(guestLogin: string, guestPassword: string): Promise<IAccount> {
    logger.info("Step 2/2: validate the account...");
    return new Promise((resolve, reject) => {
      const readable = readableString(8);
      const password = randomString(8);

      const params = {
        email: readable + "@mailsac.com",
        guestLogin,
        guestPassword,
        lang: "fr",
        login: readable,
        nickname: readable + "nick",
        password,
      };

      this.axios.get("https://proxyconnection.touch.dofus.com/haapi/validateGuest", { params })
        .then((response) => {
          const str = response.data as string;
          if (str.includes("BRUTEFORCE")) {
            logger.error
              (`Blacklisted IP By Dofus. (${this.axios.defaults.proxy.host}:${this.axios.defaults.proxy.port})`);
            return reject();
          }
          if (str.includes("Votre pseudo Ankama est incorrect")) {
            logger.error(`Wrong Ankama Nickname. (${readable + "nick"})`);
            return reject();
          }
          return resolve({ login: readable, password });
        })
        .catch((error) => {
          logger.error(error);
          return reject(error);
        });
    });
  }
}
