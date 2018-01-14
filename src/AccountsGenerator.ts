import axios from "axios-proxy-fix";
import * as fs from "fs";
import AnkartonConfig from "./AnkartonConfig";
import { Dofus, IAccount } from "./Dofus";
import { ProxyHelpers } from "./ProxyHelpers";

export class AccountsGenerator {

  public static async generate(config: AnkartonConfig) {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();

    if (config.hasProxyFile) {
      await ProxyHelpers.initProxies(config.proxyPath, config.logger);
    }

    for (let i = 0; i < config.total; i++) {
      await this.generateAccount(config);
      config.logger.info(`${i + 1} accounts added.`);
    }

    const diff = process.hrtime(time);
    config.logger.info(`All accounts added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
  }

  private static async generateAccount(config: AnkartonConfig) {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();
    let account: IAccount;

    account = await Dofus.createAccount(config);
    if (config.hasOutputPath) {
      fs.appendFileSync(config.outputPath, `${account.login}:${account.password}\n`);
    } else if (config.hasOutputCallback) {
      config.outputCallback(null, {
        login: account.login,
        password: account.password,
      });
    }
    const diff = process.hrtime(time);
    config.logger.info(`Account ${account.login} added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);

    return account;
  }
}
