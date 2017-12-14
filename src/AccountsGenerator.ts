import axios from "axios-proxy-fix";
import * as fs from "fs";
import * as logger from "winston";
import { Dofus, IAccount } from "./Dofus";
import { Mailsac } from "./Mailsac";
import { ProxyHelpers } from "./ProxyHelpers";
import { sleep } from "./Utils";

export class AccountsGenerator {

  public static async generateWithProxy(proxyPath: string, total: number, output: string)  {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();

    await ProxyHelpers.initProxies(proxyPath);

    for (let i = 0; i < total; i++) {
      if (await this.generate(output, proxyPath) === false) {
        i--;
      } else {
        logger.info(`${i + 1} accounts added.`);
      }
    }

    const diff = process.hrtime(time);
    logger.info(`All accounts added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
  }

  public static async generateWithoutProxy(total: number, output: string)  {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();

    for (let i = 0; i < total; i++) {
      if (await this.generate(output) === false) {
        i--;
      } else {
        logger.info(`${i + 1} accounts added.`);
      }
    }

    const diff = process.hrtime(time);
    logger.info(`All accounts added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
  }

  private static readonly mailsac = new Mailsac("qfq33y6eckbb7ko40sau1edlsdgav2u5j6drljmne8lc4xsbhv5d7fq4i2qwsv2p");

  private static generate(output: string, proxyPath?: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const NS_PER_SEC = 1e9;
      const time = process.hrtime();
      let account: IAccount;

      try {
        if (!proxyPath) {
          account = await Dofus.createAccount();
        } else {
          account = await Dofus.createAccount(false);
        }
      } catch (error) {
        if (error) {
          logger.error(error);
        }
        return resolve(false);
      }

      if (!account) {
        logger.error("Error while creating account, trying again...");
        return resolve(false);
      }

      await sleep(1000);

      const messages = await this.mailsac.getMessages(account.login + "@mailsac.com");

      logger.debug("messages", messages);

      // const mailid = messages.find(m => m.subject === "ANKAMA - Validation de votre compte").Id;
      const message = messages.find((m) => m.subject.includes("Validation"));
      if (!message) {
        return resolve(false);
      }

      const link = await this.mailsac.getLinkInEmail(`${account.login}@mailsac.com`, message._id);
      logger.debug("link1", link);
      logger.debug("links", message.links);

      axios.get(link)
        .then((response) => {
          fs.writeFileSync(output, `${account.login}:${account.password}\n`);
          const diff = process.hrtime(time);
          logger.info(`Account ${account.login} added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
          return resolve(true);
        })
        .catch((error) => {
          logger.error("Error while activate account...");
          return resolve(false);
        });
    });
  }
}
