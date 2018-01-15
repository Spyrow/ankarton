import axios from "axios";
import { sleep } from "./Utils";

const connectionTimeout = 20;
const firstAttemptWaitingInterval = 5;
const normalWaitingInterval = 2;

export enum TaskStatus {
  READY = "ready",
  PROCESSING = "processing",
}

export enum IOptionType {
  ImageToTextTask = "ImageToTextTask",
  NoCaptchaTaskProxyless = "NoCaptchaTaskProxyless",
  NoCaptchaTask = "NoCaptchaTask",
}

export interface ITaskResponse {
  errorId: number;
  status: TaskStatus;
  solution: {
    text?: string;
    url?: string;
    gRecaptchaResponse?: string;
  };
  cost: number;
  ip: string;
  createTime: number;
  endTime: number;
  solveCount: string;
}

export class Anticaptcha {
  public clientKey: string;
  public logger: any;
  public url = "https://api.anti-captcha.com/";

  // reCAPTCHA 2
  public proxyAddress = null;
  public proxyLogin = null;
  public proxyPassword = null;
  public proxyPort = null;
  public proxyType = "http";
  public websiteKey = null;
  public websiteSToken = null;
  public websiteUrl = null;

  public userAgent = "";

  // image
  public case = null;
  public math = null;
  public maxLength = null;
  public minLength = null;
  public numeric = null;
  public phrase = null;

  //
  public languagePool = null;
  public softId = null;

  constructor(clientKey: string, logger?: any) {
    this.clientKey = clientKey;
    this.logger = logger;
  }

  public getBalance(): Promise<number> {
    return new Promise((resolve, reject) => {
      const postData = {
        clientKey: this.clientKey,
      };
      this.jsonPostRequest("getBalance", postData)
        .then((response) => {
          return resolve(response.balance);
        })
        .catch((e) => reject(e));
    });
  }

  public getTaskSolution(taskId: string, currentAttempt = 0,
                         tickCb?: (response: ITaskResponse) => any): Promise<ITaskResponse> {
    return new Promise(async (resolve, reject) => {
      const postData = {
        clientKey: this.clientKey,
        taskId,
      };
      let waitingInterval;
      if (currentAttempt === 0) {
        waitingInterval = firstAttemptWaitingInterval;
      } else {
        waitingInterval = normalWaitingInterval;
      }
      if (this.logger !== undefined) {
        this.logger.info(`Waiting ${waitingInterval} seconds`);
      }
      await sleep(waitingInterval * 1000);

      try {
        const res = await this.jsonPostRequest("getTaskResult", postData);

        if (res.status === TaskStatus.PROCESSING) {
          if (tickCb) {
            tickCb(res as ITaskResponse);
          }
          return this.getTaskSolution(taskId, currentAttempt + 1, tickCb);
        } else if (res.status === TaskStatus.READY) {
          if (this.logger !== undefined) {
            this.logger.verbose("getTaskResult", res as ITaskResponse);
          }
          return resolve(res as ITaskResponse);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  public async createTaskProxyless() {
    return this.createTask(IOptionType.NoCaptchaTaskProxyless);
  }

  public async createImageToTextTask() {
    return this.createTask(IOptionType.ImageToTextTask);
  }

  public async createTask(type = IOptionType.NoCaptchaTask, taskData?: any) {
    const taskPostData = this.getPostData(type);
    Object.assign(taskPostData, { type });

    // Merge incoming and already fetched taskData, incoming data has priority
    if (typeof taskData === "object") {
      for (let i = 0; i < taskData.length; i++) {
        taskPostData[i] = taskData[i];
      }
    }

    const postData: any = {
      clientKey: this.clientKey,
      softId: this.softId !== null ? this.softId : 0,
      task: taskPostData,
    };

    if (this.languagePool !== null) {
      postData.languagePool = this.languagePool;
    }

    return await this.jsonPostRequest("createTask", postData);
  }

  private getPostData(type: IOptionType) {
    switch (type) {
      case IOptionType.ImageToTextTask:
        return {
          case: this.case,
          math: this.math,
          maxLength: this.maxLength,
          minLength: this.minLength,
          numeric: this.numeric,
          phrase: this.phrase,
        };
      case IOptionType.NoCaptchaTaskProxyless:
        return {
          websiteKey: this.websiteKey,
          websiteSToken: this.websiteSToken,
          websiteURL: this.websiteUrl,
        };
      default: // NoCaptchaTask
        return {
          websiteKey: this.websiteKey,
          websiteSToken: this.websiteSToken,
          websiteURL: this.websiteUrl,

          proxyAddress: this.proxyAddress,
          proxyLogin: this.proxyLogin,
          proxyPassword: this.proxyPassword,
          proxyPort: this.proxyPort,
          proxyType: this.proxyType,
          userAgent: this.userAgent,
        };
    }
  }

  private jsonPostRequest(methodName: string, data: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        data,
        headers: {
          "accept": "application/json",
          "accept-encoding": "gzip,deflate",
          "content-length": Buffer.byteLength(JSON.stringify(data)),
          "content-type": "application/json; charset=utf-8",
        },
        method: "post",
        timeout: connectionTimeout * 1000,
        url: `${this.url}/${methodName}`,
      };

      axios(options).then((response) => {
        const jsonResult = response.data;
        if (jsonResult.errorId) {
          return reject({ code: jsonResult.errorCode, error: jsonResult.errorDescription });
        }
        return resolve(jsonResult);
      }).catch((e) => reject(e));
    });
  }
}
