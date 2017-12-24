import axios from "axios-proxy-fix";
import * as fs from "fs";
import * as logger from "winston";
import { Dofus, IAccount } from "./Dofus";
import { ProxyHelpers } from "./ProxyHelpers";

export class AccountsGenerator {

  public static async generateWithProxy(proxyPath: string, total: number, output: string) {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();

    await ProxyHelpers.initProxies(proxyPath);

    for (let i = 0; i < total; i++) {
      await this.generate(output, proxyPath);
      logger.info(`${i + 1} accounts added.`);
    }

    const diff = process.hrtime(time);
    logger.info(`All accounts added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
  }

  public static async generateWithoutProxy(total: number, output: string) {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();

    for (let i = 0; i < total; i++) {
      await this.generate(output);
      logger.info(`${i + 1} accounts added.`);
    }

    const diff = process.hrtime(time);
    logger.info(`All accounts added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
  }

  private static async generate(output: string, proxyPath?: string) {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();
    let account: IAccount;

    if (!proxyPath) {
      account = await Dofus.createAccount();
    } else {
      account = await Dofus.createAccount(false);
    }

    fs.appendFileSync(output, `${account.login}:${account.password}\n`);
    const diff = process.hrtime(time);
    logger.info(`Account ${account.login} added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
  }
}
