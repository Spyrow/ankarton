#!/usr/bin/env node

import * as https from "https";
import * as HttpsProxyAgent from "https-proxy-agent";
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

  // const agent = new HttpsProxyAgent("http://177.128.157.101:54132");
  // https.request({
  //   agent,
  //   host: "haapi.ankama.com",
  //   method: "GET",
  //   path: "/json/Ankama/v2/Account/CreateGuest?game=20&lang=fr",
  //   port: 443,
  //   timeout: 10000,
  // }, (res) => {
  //   console.log(res.statusCode);
  //   res.on("data", (data) => {
  //     console.log(data.toString());
  //   });
  // }).end();

  logger.info("All accounts were added successfully!");
  return;
};

process.on("unhandledRejection", (reason) => {
  logger.error("Process", reason);
});

start();
