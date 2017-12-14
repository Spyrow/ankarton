"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
const Dofus_1 = require("./Dofus");
const Mailsac_1 = require("./Mailsac");
const ProxyHelpers_1 = require("./ProxyHelpers");
const Utils_1 = require("./Utils");
class AccountsGenerator {
    static async generateWithProxy(proxyPath, total, output) {
        const NS_PER_SEC = 1e9;
        const time = process.hrtime();
        await ProxyHelpers_1.ProxyHelpers.initProxies(proxyPath);
        for (let i = 0; i < total; i++) {
            if (await this.generate(output, proxyPath) === false) {
                i--;
            }
            else {
                console.log(`${i + 1} accounts added.`);
            }
        }
        const diff = process.hrtime(time);
        console.log(`All accounts added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
    }
    static async generateWithoutProxy(total, output) {
        const NS_PER_SEC = 1e9;
        const time = process.hrtime();
        for (let i = 0; i < total; i++) {
            if (await this.generate(output) === false) {
                i--;
            }
            else {
                console.log(`${i + 1} accounts added.`);
            }
        }
        const diff = process.hrtime(time);
        console.log(`All accounts added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
    }
    static generate(output, proxyPath) {
        return new Promise(async (resolve, reject) => {
            const NS_PER_SEC = 1e9;
            const time = process.hrtime();
            let account;
            if (!proxyPath) {
                Dofus_1.Dofus.proxy = await ProxyHelpers_1.ProxyHelpers.getValidProxyOnline();
                account = await Dofus_1.Dofus.createAccount();
            }
            else {
                Dofus_1.Dofus.proxy = await ProxyHelpers_1.ProxyHelpers.getValidProxy();
                account = await Dofus_1.Dofus.createAccount(false);
            }
            if (!account) {
                console.error("Error while creating account, trying again...");
                return reject(false);
            }
            await Utils_1.sleep(1000);
            const messages = await this.mailsac.getMessages(account.login + "@mailsac.com");
            console.log(messages);
            // const mailid = messages.find(m => m.subject === "ANKAMA - Validation de votre compte").Id;
            const message = messages.find((m) => m.subject.includes("Validation"));
            if (!message) {
                return reject(false);
            }
            const link = await this.mailsac.getLinkInEmail(`${account.login}@mailsac.com`, message._id);
            console.log("link1", link);
            console.log("links", message.links);
            axios_1.default.get(link)
                .then((response) => {
                fs.writeFileSync(output, `${account.login}:${account.password}\n`);
                const diff = process.hrtime(time);
                console.log(`Account ${account.login} added in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds.`);
                return resolve(true);
            })
                .catch((error) => {
                console.error("Error while activate account...");
                return reject(false);
            });
        });
    }
}
AccountsGenerator.mailsac = new Mailsac_1.Mailsac("qfq33y6eckbb7ko40sau1edlsdgav2u5j6drljmne8lc4xsbhv5d7fq4i2qwsv2p");
exports.AccountsGenerator = AccountsGenerator;
//# sourceMappingURL=AccountsGenerator.js.map