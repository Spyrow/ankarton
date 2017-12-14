#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = require("yargs");
const AccountsGenerator_1 = require("./AccountsGenerator");
yargs_1.usage("Usage: $0 -out [filePath] -proxy [filePath] -total [num]");
yargs_1.demandOption(["out"]);
yargs_1.defaults({ total: 1 });
yargs_1.alias("out", "o");
yargs_1.alias("proxy", "p");
yargs_1.alias("total", "t");
yargs_1.describe("out", "File to append accounts");
yargs_1.describe("proxy", "Proxy list (otherwise proxies will be generated but take longer)");
yargs_1.describe("total", "Number of accounts to be generated");
const start = async () => {
    if (yargs_1.argv.proxy) {
        await AccountsGenerator_1.AccountsGenerator.generateWithProxy(yargs_1.argv.proxy, yargs_1.argv.total, yargs_1.argv.out);
    }
    else {
        await AccountsGenerator_1.AccountsGenerator.generateWithoutProxy(yargs_1.argv.total, yargs_1.argv.out);
    }
    console.log("All accounts were added successfully!");
};
start();
//# sourceMappingURL=index.js.map