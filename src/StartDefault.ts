#!/usr/bin/env node

import * as https from "https";
import * as HttpsProxyAgent from "https-proxy-agent";
import * as path from "path";
import * as logger from "winston";
import { alias, argv, defaults, demandOption, describe, epilog, usage } from "yargs";
import { AccountsGenerator } from "./AccountsGenerator";
import AnkartonConfig from "./AnkartonConfig";

export default class StartDefault {

  public static isImported() {
    let imported = true;
    if (process.argv[1].endsWith("ankarton")) {
      // Used as global ankarton
      imported = false;
    } else if (process.argv[1].endsWith("ankarton/src/index.ts")) {
      imported = false;
    }
    return imported;
  }

  public static startIfNotImported() {
    if (StartDefault.isImported()) {
      return;
    }
    return StartDefault.start();
  }

  public static start() {
    logger.configure({
      emitErrs: true,
      exitOnError: false,
      transports: [
        new logger.transports.Console({
          colorize: true,
          handleExceptions: true,
          json: false,
          level: "debug",
          timestamp: true,
        }),
      ],
    });

    usage("Usage: $0 --out [filePath] --proxy [filePath] --total [num]");
    demandOption(["out"]);
    defaults({ total: 1 });
    alias("out", "o");
    alias("proxy", "p");
    alias("total", "t");
    describe("out", "File to append accounts");
    describe("proxy", "Proxy list (otherwise proxies will be generated but take longer)");
    describe("total", "Number of accounts to be generated");
    epilog("Copyright © 2018 DevChris");

    process.on("unhandledRejection", (reason) => {
      logger.error("Process", reason);
    });

    const start = async () => {
      const config: AnkartonConfig = new AnkartonConfig({
        output: argv.out,
        total: argv.total,
      });
      if (argv.proxy) {
        config.proxyPath = argv.proxy;
      }
      await AccountsGenerator.generate(config);
      logger.info("All accounts were added successfully!");
      process.exit();
    };

    return start();
  }
}
