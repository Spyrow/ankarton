import axios from "axios-proxy-fix";
import * as fs from "fs";
import * as https from "https";
import * as HttpsProxyAgent from "https-proxy-agent";
import * as readline from "readline";
import { getRandomInt } from "./Utils";

export interface IProxy {
  host: string;
  port: number;
}

export class ProxyHelpers {

  public static async initProxies(inputFile: string = "data/proxy.txt", logger?: any) {
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
        if (logger !== undefined) {
          logger.info(`Initialized ${this.proxies.length} proxies`);
        }
        return resolve();
      });
    });
  }

  public static getValidProxyOnline(logger?: any): Promise<IProxy> {
    return new Promise(async (resolve, reject) => {
      if (logger !== undefined) {
        logger.info("Starting to search a valid proxy online ...");
      }
      const NS_PER_SEC = 1e9;
      const time = process.hrtime();
      let myProxy: string;
      let pTest: IProxy;
      let test = false;
      do {
        try {
          myProxy = await this.getProxyOnline();
        } catch (err) {
          return reject(err.message);
        }
        const p = myProxy.split(":");
        pTest = {
          host: p[0],
          port: parseInt(p[1], 10),
        };
        if (logger !== undefined) {
          logger.debug(`Testing proxy: ${pTest.host}:${pTest.port}`, "...");
        }
        test = await this.proxyTest(pTest);
        // const CURSOR_UP_ONE = "\x1b[1A";
        // const ERASE_LINE = "\x1b[2K";
        // process.stdout.write(CURSOR_UP_ONE + ERASE_LINE);
        // logger.debug(`Testing: ${pTest.host}:${pTest.port}`,  "...", `${test}`);
      } while (!test);

      const diff = process.hrtime(time);
      if (logger !== undefined) {
        logger.info(`Proxy found in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds. (${pTest.host}:${pTest.port})`);
      }
      return resolve(pTest);
    });
  }

  public static getValidProxy(logger?: any): Promise<IProxy> {
    return new Promise(async (resolve, reject) => {
      if (logger !== undefined) {
        logger.info("Starting to search a valid proxy ...");
      }
      const NS_PER_SEC = 1e9;
      const time = process.hrtime();
      let proxy: IProxy;
      let test = false;
      do {
        proxy = this.getProxy();
        if (logger !== undefined) {
          logger.debug(`Testing proxy: http://${proxy.host}:${proxy.port}`);
        }
        test = await this.proxyTest(proxy);
        // const CURSOR_UP_ONE = "\x1b[1A";
        // const ERASE_LINE = "\x1b[2K";
        // process.stdout.write(CURSOR_UP_ONE + ERASE_LINE);
        // logger.debug(`Testing: ${proxy.host}:${proxy.port} ... ${test}`);
      } while (!test);

      const diff = process.hrtime(time);
      if (logger !== undefined) {
        logger.info(`Proxy found in ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds. (${proxy.host}:${proxy.port})`);
      }
      return resolve(proxy);
    });
  }

  private static proxies: IProxy[];

  private static proxyTest(proxy: IProxy, timeout: number = 10000): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // const httpsAgent = new HttpsProxyAgent({
      //   host: proxy.host,
      //   port: proxy.port,
      //   timeout: 10000,
      // });
      // const req = https.request({
      //   agent: httpsAgent,
      //   host: "ankama.com",
      //   method: "GET",
      //   path: "/",
      //   port: 443,
      // }, (response) => {
      //   if (response.statusCode === 200) {
      //     return resolve(true);
      //   } else {
      //     return resolve(false);
      //   }
      // });
      //
      // req.on("error", (e) => {
      //   return resolve(false);
      // });
      //
      // req.end();

      return resolve(true);

      // axios.get("https://www.dofus.com/fr", {
      //   proxy: {
      //     host: proxy.host,
      //     port: proxy.port,
      //   },
      //   timeout,
      // })
      //   .then((response) => resolve(true))
      //   .catch((error) => resolve(false));
    });
  }

  private static getProxyOnline(): Promise<string> {
    return new Promise((resolve, reject) => {
      // axios.get("https://gimmeproxy.com/api/getProxy?protocol=http") // &supportsHttps=true
      //   .then((response) => {
      //     const proxy = `${response.data.ip}:${response.data.port}`;
      //     return resolve(proxy);
      //   });
      axios.get(
        "http://pubproxy.com/api/proxy?api=cDhCQVlKaGlTWXNlRXpLMmxYOHZDZz09&type=http")
        .then((response) => {
          if (response.data === "No proxy") {
            return reject({
              message: "No proxy",
            });
          }
          return resolve(response.data.data[0].ipPort);
        })
        .catch((error) => reject(error));
    });
  }

  private static getProxy(): IProxy {
    const num = getRandomInt(0, this.proxies.length - 1);
    return this.proxies[num];
  }
}
