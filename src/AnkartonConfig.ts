
import * as logger from "winston";
import { IProxy } from "./ProxyHelpers";

export default class AnkartonConfig {

  private dProxy: string | IProxy | IProxy[];
  private dIsProxyFile: boolean;
  private dTotal: number;
  private dOutput: ((err: any, data: any) => void) | string;
  private dUseOnlineProxy: boolean;
  private dPasswordGenerator: () => string;
  private dLoginGenerator: (generatedLogin: string) => string;
  private dLogger: any;
  private dDelayOnDailyRateReached: number;
  private dDelayOnECONNREFUSED: number;

  constructor(config: any) {
    if (typeof config !== "object") {
      throw new Error("config must be an object");
    }
    this.setDefault();
    if (config.hasOwnProperty("proxyPath")) {
      this.dUseOnlineProxy = false;
      this.proxyPath = config.proxyPath;
    }
    if (config.hasOwnProperty("proxy")) {
      this.dUseOnlineProxy = false;
      this.dIsProxyFile = false;
      this.dProxy = config.proxy;
    }
    if (config.hasOwnProperty("total")) {
      this.dTotal = config.total;
    }
    if (config.hasOwnProperty("output")) {
      this.dOutput = config.output;
    }
    if (config.hasOwnProperty("useOnlineProxy")) {
      this.dUseOnlineProxy = config.useOnlineProxy;
    }
    if (config.hasOwnProperty("passwordGenerator")) {
      this.dPasswordGenerator = config.passwordGenerator;
    }
    if (config.hasOwnProperty("loginGenerator")) {
      this.dLoginGenerator = config.loginGenerator;
    }
    if (config.hasOwnProperty("logger")) {
      this.dLogger = config.logger;
    }
    if (config.hasOwnProperty("delayOnDailyRateReached")) {
      this.dDelayOnDailyRateReached = config.dDelayOnDailyRateReached;
    }
    if (config.hasOwnProperty("delayOnECONNREFUSED")) {
      this.dDelayOnECONNREFUSED = config.delayOnECONNREFUSED;
    }
  }

  private setDefault() {
    this.dProxy = null;
    this.dUseOnlineProxy = true;
    this.dIsProxyFile = false;
    this.dTotal = 1;
    this.dOutput = "accounts.txt";
    this.dPasswordGenerator = null;
    this.dLoginGenerator = null;
    this.dLogger = logger;
    this.dDelayOnDailyRateReached = 1;
    this.dDelayOnECONNREFUSED = 100;
  }

  public get passwordGenerator(): () => string {
    return this.dPasswordGenerator;
  }

  public get hasPasswordGenerator(): boolean {
    return this.dPasswordGenerator != null;
  }

  public get loginGenerator(): (generatedLogin: string) => string {
    return this.dLoginGenerator;
  }

  public get hasLoginGenerator(): boolean {
    return this.dLoginGenerator != null;
  }

  public get proxyPath(): string {
    if (!this.hasProxy) {
      throw new Error("No proxy defined");
    }
    if (!this.hasProxyFile) {
      throw new Error("proxy is not a filepath");
    }
    return this.dProxy as string;
  }

  public set proxyPath(value: string) {
    this.dUseOnlineProxy = false;
    this.dIsProxyFile = true;
    this.dProxy = value;
  }

  public get proxyArray(): IProxy[] {
    if (!this.hasProxy) {
      throw new Error("No proxy defined");
    }
    if (!this.hasProxyArray) {
      throw new Error("proxy is not a filepath");
    }
    return this.dProxy as IProxy[];
  }

  public get proxyValue(): IProxy {
    if (!this.hasProxy) {
      throw new Error("No proxy defined");
    }
    if (!this.hasProxyValue) {
      throw new Error("proxy is not a filepath");
    }
    return this.dProxy as IProxy;
  }

  public get hasProxyValue(): boolean {
    return this.hasProxy && !this.dIsProxyFile;
  }

  public get hasProxyArray(): boolean {
    return this.hasProxy && Array.isArray(this.dProxy);
  }

  public get hasProxyFile(): boolean {
    return this.hasProxy && this.dIsProxyFile;
  }

  public get hasProxy(): boolean {
    return this.dProxy !== null;
  }

  public get total(): number {
    return this.dTotal;
  }

  public get hasOutputPath(): boolean {
    return typeof this.dOutput === "string";
  }

  public get hasOutputCallback(): boolean {
    return !this.hasOutputPath;
  }

  public get outputCallback(): (err: any, data: any) => void {
    if (!this.hasOutputCallback) {
      throw new Error("output is not a callback");
    }
    return this.dOutput as (err: any, data: any) => void;
  }

  public get outputPath(): string {
    if (!this.hasOutputPath) {
      throw new Error("output is not a filepath");
    }
    return this.dOutput as string;
  }

  public get useOnlineProxy(): boolean {
    return this.dUseOnlineProxy;
  }

  public get logger(): any {
    return this.dLogger;
  }

  public get delayOnDailyRateReached(): number {
    return this.dDelayOnDailyRateReached;
  }

  public get delayOnECONNREFUSED(): number {
    return this.dDelayOnECONNREFUSED;
  }
}
