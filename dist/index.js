#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("winston");
const yargs_1 = require("yargs");
const AccountsGenerator_1 = require("./AccountsGenerator");
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
            timestamp: true,
        }),
    ],
});
yargs_1.usage("Usage: $0 -out [filePath] -proxy [filePath] -total [num]");
yargs_1.demandOption(["out"]);
yargs_1.defaults({ total: 1 });
yargs_1.alias("out", "o");
yargs_1.alias("proxy", "p");
yargs_1.alias("total", "t");
yargs_1.describe("out", "File to append accounts");
yargs_1.describe("proxy", "Proxy list (otherwise proxies will be generated but take longer)");
yargs_1.describe("total", "Number of accounts to be generated");
yargs_1.epilog("Copyright © 2018 DevChris");
const start = async () => {
    if (yargs_1.argv.proxy) {
        await AccountsGenerator_1.AccountsGenerator.generateWithProxy(yargs_1.argv.proxy, yargs_1.argv.total, yargs_1.argv.out);
    }
    else {
        await AccountsGenerator_1.AccountsGenerator.generateWithoutProxy(yargs_1.argv.total, yargs_1.argv.out);
    }
    logger.info("All accounts were added successfully!");
};
start();
//# sourceMappingURL=index.js.map