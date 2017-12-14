"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const ProxyHelpers_1 = require("./ProxyHelpers");
const Utils_1 = require("./Utils");
class Dofus {
    static createAccount(useOnlineProxy = true) {
        return new Promise(async (resolve, reject) => {
            try {
                let guest;
                do {
                    if (useOnlineProxy) {
                        this.proxy = await ProxyHelpers_1.ProxyHelpers.getValidProxyOnline();
                    }
                    else {
                        this.proxy = await ProxyHelpers_1.ProxyHelpers.getValidProxy();
                    }
                    guest = await this.createGuest();
                } while (!guest);
                let account;
                do {
                    if (useOnlineProxy) {
                        this.proxy = await ProxyHelpers_1.ProxyHelpers.getValidProxyOnline();
                    }
                    else {
                        this.proxy = await ProxyHelpers_1.ProxyHelpers.getValidProxy();
                    }
                    account = await this.validateGuest(guest.login, guest.xpassword);
                } while (!account);
                return resolve(account);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    static set proxy(proxy) {
        this.axios = axios_1.default.create({
            proxy: {
                host: proxy.host,
                port: proxy.port,
            },
            timeout: 6000,
        });
    }
    static async createGuest() {
        return new Promise((resolve, reject) => {
            this.axios.get("https://haapi.ankama.com/json/Ankama/v2/Account/CreateGuest?game=18&lang=fr")
                .then((response) => {
                const xpassword = response.headers["x-password"];
                console.log(xpassword);
                return resolve({ data: response.data, xpassword });
            })
                .catch((error) => {
                if (error.response.status === 602) {
                    return reject(`IP Daily Rate Reached. (${this.axios.defaults.proxy})`);
                }
                return reject(error.response.data.text);
            });
        });
    }
    static validateGuest(guestLogin, guestPassword) {
        return new Promise((resolve, reject) => {
            const readable = Utils_1.readableString(8);
            const password = Utils_1.randomString(8);
            const params = {
                email: readable + "@mailsac.com",
                guestLogin,
                guestPassword,
                lang: "fr",
                login: readable,
                nickname: readable + "nick",
                password,
            };
            this.axios.get("https://proxyconnection.touch.dofus.com/haapi/validateGuest", { params })
                .then((response) => {
                const str = response.data;
                if (str.includes("BRUTEFORCE")) {
                    return reject(`Blacklisted IP By Dofus. (${this.axios.defaults.proxy})`);
                }
                if (str.includes("Votre pseudo Ankama est incorrect")) {
                    return reject(`Wrong Ankama Nickname. (${readable + "nick"})`);
                }
                return resolve({ login: readable, password });
            })
                .catch((error) => reject(error));
        });
    }
}
Dofus.axios = axios_1.default.create({ timeout: 6000 });
exports.Dofus = Dofus;
//# sourceMappingURL=Dofus.js.map