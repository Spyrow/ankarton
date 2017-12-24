import axios, { AxiosInstance } from "axios-proxy-fix";
import * as https from "https";
import * as HttpsProxyAgent from "https-proxy-agent";
import { Client } from "mailsac";
import * as querystring from "querystring";
import * as logger from "winston";
import { Anticaptcha } from "./Anticaptcha";
import { IProxy, ProxyHelpers } from "./ProxyHelpers";
import { generatePassword, randomString, readableString, sleep } from "./Utils";

export interface IAccount {
  login: string;
  password: string;
  email: string;
  nickname: string;
}

export interface IGuest {
  data: ICreateGuestResponse;
  xpassword: string;
}

/*
  {
    "id": 122674823,
    "type": "GUEST",
    "login": "[GUEST]efb929ba5bf67999",
    "nickname": null,
    "security": [],
    "lang": "fr",
    "community": "COMMUNITY_0",
    "added_date": "2017-12-16T10:40:05+01:00",
    "added_ip": "78.242.102.121",
    "login_date": null,
    "login_ip": "0.0.0.0"
  }
*/

export interface ICreateGuestResponse {
  id: number;
  type: string;
  login: string;
  nickname: string;
  security: any[];
  lang: string;
  community: string;
  added_date: Date;
  added_ip: string;
  login_date: Date;
  login_ip: string;
}

export class Dofus {

  public static activateAccount(account: IAccount): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      logger.info("Step 3/3: ACTIVATION");
      let messages = [];
      while (messages.length === 0) {
        try {
          messages = await this.mailsac.getMessages(account.email);
        } catch (e) {
          logger.error(e);
        }
      }

      // const mailid = messages.find(m => m.subject === "ANKAMA - Validation de votre compte").Id;
      const message = messages.find((m) => m.subject.includes("Validation"));
      if (!message) {
        return resolve(false);
      }

      const link = message.links.find((m) => m.includes("creer-un-compte"));

      axios.get(link)
        .then((response) => resolve(true))
        .catch((error) => resolve(false));
    });
  }

  // public static createAccount(useOnlineProxy: boolean = true): Promise<IAccount> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //
  //       if (!this.httpsAgent) {
  //         await this.getProxy(useOnlineProxy);
  //       }
  //
  //       let guest;
  //       do {
  //         guest = await this.createGuest();
  //       } while (!guest);
  //
  //       let account: IAccount;
  //       do {
  //         account = await this.validateGuest(guest.data.login, guest.xpassword);
  //       } while (!account);
  //
  //       await sleep(1000);
  //
  //       let result = false;
  //       do {
  //         result = await this.activateAccount(account);
  //       } while (!result);
  //
  //       return resolve(account);
  //
  //     } catch (error) {
  //       if (error) {
  //         logger.error(error);
  //       }
  //       await this.getProxy(useOnlineProxy);
  //       return this.createAccount(useOnlineProxy);
  //     }
  //   });
  // }

  public static async createAccount(useOnlineProxy: boolean = true): Promise<IAccount> {
    try {

      if (!this.httpsAgent) {
        await this.getProxy(useOnlineProxy);
      }

      let guest;
      do {
        guest = await this.createGuest();
      } while (!guest);

      let account: IAccount;
      do {
        account = await this.validateGuest(guest.data.login, guest.xpassword);
      } while (!account);

      await sleep(1000);

      let result = false;
      do {
        result = await this.activateAccount(account);
      } while (!result);

      return account;

    } catch (error) {
      if (error) {
        logger.error(error);
      }
      await this.getProxy(useOnlineProxy);
      return this.createAccount(useOnlineProxy);
    }
  }

  private static axios: AxiosInstance = axios.create();
  private static httpsAgent: HttpsProxyAgent;
  private static readonly mailsac = new Client("qfq33y6eckbb7ko40sau1edlsdgav2u5j6drljmne8lc4xsbhv5d7fq4i2qwsv2p");

  private static set proxy(proxy: IProxy) {
    this.httpsAgent = new HttpsProxyAgent({
      host: proxy.host,
      port: proxy.port,
      timeout: 10000,
    });
    // this.httpsAgent = new HttpsProxyAgent(`http://${proxy.host}:${proxy.port}`);
    this.axios = axios.create({
      headers: {
        // tslint:disable-next-line
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-T800 Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.107 Safari/537.36",
      },
      proxy: {
        host: proxy.host,
        port: proxy.port,
      },
      timeout: 10000,
    });
  }

  private static async getProxy(useOnlineProxy: boolean = true) {
    try {
      if (useOnlineProxy) {
        this.proxy = await ProxyHelpers.getValidProxyOnline();
      } else {
        this.proxy = await ProxyHelpers.getValidProxy();
      }
    } catch (error) {
      logger.error(error);
      return this.getProxy(useOnlineProxy);
    }
  }

  private static bypassCaptcha(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const ac = new Anticaptcha("889c9c4191912a981f6ee6505066207b");
      // const ac = new Anticaptcha("c7119d9905032f3ba5e7b0482c76a2b3");
      try {
        const balance = await ac.getBalance();
        if (balance > 0) {
          ac.websiteUrl = "https://haapi.ankama.com/json/Ankama/v2/Account/CreateGuest?game=18&lang=fr";
          ac.websiteKey = "6LfbFRsUAAAAACrqF5w4oOiGVxOsjSUjIHHvglJx";

          const task = await ac.createTaskProxyless();
          const solution = await ac.getTaskSolution(task.taskId, 0, (res) => {
            logger.verbose("intermediate", res);
          });
          logger.verbose(`SOLUTION`, solution);
          return resolve(solution.solution.gRecaptchaResponse);
        } else {
          logger.error("AntiCaptcha - Contact DevChris#4592 on Discord :)");
          return process.exit();
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  private static createGuest(): Promise<IGuest> {
    return new Promise(async (resolve, reject) => {
      // logger.info("Step 1/3: Bypass reCaptcha...");
      // let captcha: string;
      // try {
      //   captcha = await this.bypassCaptcha();
      // } catch (error) {
      //   logger.error("No idle workers are available at the moment, please try a bit later");
      //   return this.createGuest();
      // }

      logger.info("Step 1/3: CREATION");

      const req = https.request({
        agent: this.httpsAgent,
        host: "haapi.ankama.com",
        method: "GET",
        path: "/json/Ankama/v2/Account/CreateGuest?game=20&lang=fr",
        port: 443,
      }, (response) => {
        if (response.statusCode === 602) {
          return reject(`IP Daily Rate Reached. (${this.axios.defaults.proxy.host}:${this.axios.defaults.proxy.port})`);
        } else if (response.statusCode === 503) {
          return reject("503 Service Unavailable");
        } else if (response.statusCode === 502) {
          return reject("502 Proxy Error");
        }
        let str = "";
        response.on("data", (chunk) => {
          str += chunk.toString();
        });
        response.on("end", () => {
          if (str === "") {
            return reject(response.statusMessage + " (" + response.statusCode + ")");
          } else if (str.startsWith("A")) {
            return reject(str);
          } else if (str.startsWith("H")) {
            return reject("HTTP/1.1 400 Bad Request");
          } else if (str.startsWith("<")) {
            return reject("400 Bad Request");
          } else if (str.startsWith("Y")) {
            return reject(str);
          } else if (str.startsWith("P")) {
            return reject(str);
          }
          const data = JSON.parse(str);
          if (data.text) {
            return reject(data.text);
          }
          const xpassword = response.headers["x-password"] as string;
          const dataGuest = data as ICreateGuestResponse;
          const dataRet: IGuest = {
            data: dataGuest,
            xpassword,
          };
          return resolve(dataRet);
        });
      });

      req.on("error", (e) => {
        return reject(e.message);
      });

      // req.setTimeout(10000, () => {
      //   logger.warn("timeout");
      //   req.abort();
      //   return reject();
      // });

      req.end();

      // this.axios.get("https://haapi.ankama.com/json/Ankama/v2/Account/CreateGuest", {
      //   params: {
      //     // "g-recaptcha-response": captcha,
      //     game: 20,
      //     lang: "fr",
      //   },
      // })
      //   .then((response) => {
      //     const xpassword = response.headers["x-password"];
      //     if (xpassword) {
      //       logger.debug("xpassword", xpassword);
      //       logger.verbose("Guest", { data: response.data as ICreateGuestResponse, xpassword });
      //       return resolve({ data: response.data as ICreateGuestResponse, xpassword });
      //     } else if (response.data.text) {
      //       return reject(response.data.text);
      //     } else {
      //       const conn = response.headers.connection;
      //       if (conn === "close") {
      //         return reject("Blocked by Cloudfront...");
      //       } else {
      //         return reject("No xpassword found ... retrying");
      //       }
      //     }
      //   })
      //   .catch((error) => {
      //     if (error.response) {
      //       if (error.response.status === 602) {
      //         return reject(`IP Daily Rate Reached.` +
      //           `(${this.axios.defaults.proxy.host}:${this.axios.defaults.proxy.port})`);
      //       }
      //     }
      //     return reject(error.message);
      //   });
    });
  }

  private static validateGuest(guestLogin: string, guestPassword: string): Promise<IAccount> {
    return new Promise((resolve, reject) => {
      logger.info("Step 2/3: VALIDATION");
      const readable = readableString(8);
      const password = generatePassword(3, 2, 3);

      const params = {
        email: readable + "@mailsac.com",
        guestLogin,
        guestPassword,
        lang: "fr",
        login: readable,
        nickname: readable + "nick",
        password,
      };

      const paramsStr = querystring.stringify(params);

      const req = https.request({
        agent: this.httpsAgent,
        host: "proxyconnection.touch.dofus.com",
        method: "GET",
        path: "/haapi/validateGuest?" + paramsStr,
        port: 443,
      }, (response) => {
        let str = "";
        response.on("data", (chunk) => {
          str += chunk.toString();
        });
        response.on("end", () => {
          if (str === "") {
            return reject(response.statusMessage + " (" + response.statusCode + ")");
          }
          if (str.startsWith("M")) {
            return reject(str);
          }

          if (str.startsWith("<")) {
            return reject("400 Bad Request");
          }

          if (str.includes("BRUTEFORCE")) {
            return reject("Blacklisted IP By Dofus." +
              `(${this.axios.defaults.proxy.host}:${this.axios.defaults.proxy.port}))`);
          }
          if (str.includes("Votre pseudo Ankama est incorrect")) {
            return reject(`Wrong Ankama Nickname. (${params.nickname})`);
          }

          const data = JSON.parse(str);
          if (data.text) {
            return reject(data.text);
          }

          return resolve({ login: readable, password, email: params.email, nickname: params.nickname } as IAccount);
        });
      });

      req.on("error", (e) => {
        return reject(e.message);
      });

      req.end();

      // this.axios.get("https://proxyconnection.touch.dofus.com/haapi/validateGuest", { params })
      //   .then((response) => {
      //     const str = response.data as string;
      //     logger.warn(str, typeof str);
      //     if (str.includes("BRUTEFORCE")) {
      //       return reject("Blacklisted IP By Dofus. "
      //         + `(${this.axios.defaults.proxy.host}:${this.axios.defaults.proxy.port}) `);
      //     }
      //     if (str.includes("Votre pseudo Ankama est incorrect")) {
      //       return reject(`Wrong Ankama Nickname. (${params.nickname}) `);
      //     }
      //     logger.verbose("validate", response.data);
      //     return resolve({ login: readable, password, email: params.email, nickname: params.nickname });
      //   })
      //   .catch((error) => reject(error.message));
    });
  }
}
