import axios from "axios-proxy-fix";
import * as fs from "fs";
import * as logger from "winston";
import { Dofus, IAccount } from "./Dofus";
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
        return this.generate(output, proxyPath);
      }

      logger.verbose("account 2", account);

      if (!account) {
        logger.error("Error while creating account, trying again...");
        return this.generate(output, proxyPath);
      }

      await sleep(1000);

      logger.verbose("account 3", account);

      let result = false;
      while (!result) {
        result = await Dofus.activateAccount(account);
      }

      fs.appendFileSync("saved.txt", Dofus.httpsProxy.slice(8));
      fs.appendFileSync(output, `${account.login}:${account.password}\n`);
      const diff = process.hrtime(time);
      logger.info(`Account ${account.login} added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
      return resolve(true);
    });
  }
}
