"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_proxy_fix_1 = require("axios-proxy-fix");
class Mailsac {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.axios = axios_proxy_fix_1.default.create({
            baseURL: "https://mailsac.com/api/",
            headers: { "Mailsac-Key": this.apiKey },
            timeout: 3000,
        });
    }
    getMessages(address) {
        return new Promise((resolve, reject) => {
            this.axios.get(`/addresses/${address}/messages`)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }
    getLinkInEmail(address, mailid) {
        return new Promise((resolve, reject) => {
            this.axios.get(`/text/${address}/${mailid}`)
                .then((response) => {
                const regex = "(https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?";
                const match = response.data.match(regex);
                return resolve(match[0]);
            })
                .catch((error) => reject(error));
        });
    }
}
exports.Mailsac = Mailsac;
//# sourceMappingURL=Mailsac.js.map