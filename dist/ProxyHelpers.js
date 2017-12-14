"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
const readline = require("readline");
const Utils_1 = require("./Utils");
class ProxyHelpers {
    static async initProxies(inputFile = "data/proxy.txt") {
        return new Promise((resolve, reject) => {
            this.proxies = [];
            const instream = fs.createReadStream(inputFile);
            const rl = readline.createInterface({
                input: instream,
                output: null,
            });
            rl.on("line", (line) => {
                const p = line.split(":");
                this.proxies.push({ host: p[0], port: parseInt(p[1], 10) });
            });
            rl.on("close", (line) => {
                console.log("Initialized proxies: " + this.proxies.length);
                return resolve();
            });
        });
    }
    static getValidProxyOnline() {
        return new Promise(async (resolve, reject) => {
            console.log("Starting to search a valid proxy online...");
            const NS_PER_SEC = 1e9;
            const time = process.hrtime();
            let myProxy;
            let pTest;
            let test = false;
            do {
                myProxy = await this.getProxyOnline();
                const p = myProxy.split(":");
                pTest = {
                    host: p[0],
                    port: parseInt(p[1], 10),
                };
                process.stdout.write(`Testing: ${pTest.host}:${pTest.port} ... `);
                test = await this.proxyTest(pTest);
                process.stdout.write(`${test}\n`);
            } while (!test);
            const diff = process.hrtime(time);
            console.log(`Proxy found in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds. (${myProxy})`);
            return resolve(pTest);
        });
    }
    static getValidProxy() {
        return new Promise(async (resolve, reject) => {
            console.log("Starting to search a valid proxy...");
            const NS_PER_SEC = 1e9;
            const time = process.hrtime();
            let proxy;
            let test = false;
            do {
                proxy = await this.getProxy();
                process.stdout.write(`Testing: ${proxy.host}:${proxy.port} ... `);
                test = await this.proxyTest(proxy);
                process.stdout.write(`${test}\n`);
            } while (!test);
            const diff = process.hrtime(time);
            console.log(`Proxy found in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds. (${proxy})`);
            return resolve(proxy);
        });
    }
    static proxyTest(proxy, timeout = 10000) {
        return new Promise((resolve, reject) => {
            axios_1.default.get("https://www.dofus.com/fr", {
                proxy: {
                    host: proxy.host,
                    port: proxy.port,
                },
                timeout,
            })
                .then((response) => resolve(true))
                .catch((error) => resolve(false));
        });
    }
    static getProxyOnline() {
        return new Promise((resolve, reject) => {
            axios_1.default.get("http://pubproxy.com/api/proxy?api=cDhCQVlKaGlTWXNlRXpLMmxYOHZDZz09&format=txt&type=http&get=true")
                .then((response) => {
                if (response.data.includes("reached") ||
                    response.data.includes("fast")) {
                    return reject(response.data);
                }
                else {
                    return resolve(response.data);
                }
            })
                .catch((error) => reject(error));
        });
    }
    static getProxy() {
        return new Promise((resolve, reject) => {
            const num = Utils_1.getRandomInt(0, this.proxies.length - 1);
            return resolve(this.proxies[num]);
        });
    }
}
exports.ProxyHelpers = ProxyHelpers;
//# sourceMappingURL=ProxyHelpers.js.map