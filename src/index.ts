#!/usr/bin/env node

import * as path from "path";
import * as logger from "winston";
import { alias, argv, defaults, demandOption, describe, epilog, usage } from "yargs";
import { AccountsGenerator } from "./AccountsGenerator";

logger.configure({
  emitErrs: true,
  exitOnError: false,
  transports: [
    // new logger.transports.DailyRotateFile({
    //   colorize: false,
    //   datePattern: ".yyyy-MM-ddTHH",
    //   filename: path.join(__dirname, "logs", "log_file.log"),
    //   handleExceptions: true,
    //   json: true,
    //   level: "info",
    //   name: "file",
    //   timestamp: true,
    // }),
    // new logger.transports.File({
    //   colorize: false,
    //   filename: path.join(__dirname, "logs", "log_file.log"),
    //   handleExceptions: true,
    //   json: true,
    //   level: "info",
    //   maxFiles: 5,
    //   maxsize: 5242880, // 5MB
    //   timestamp: true,
    // }),
    new logger.transports.Console({
      colorize: true,
      handleExceptions: true,
      json: false,
      level: "debug",
      // timestamp: true,
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

const start = async () => {
  if (argv.proxy) {
    await AccountsGenerator.generateWithProxy(argv.proxy, argv.total, argv.out);
  } else {
    await AccountsGenerator.generateWithoutProxy(argv.total, argv.out);
  }

  logger.info("All accounts were added successfully!");
};

process.on("unhandledRejection", (reason) => {
  logger.error("Process", reason);
});

start();
