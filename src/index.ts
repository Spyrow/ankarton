#!/usr/bin/env node

import { AccountsGenerator } from "./AccountsGenerator";
import AnkartonConfig from "./AnkartonConfig";
import StartDefault from "./StartDefault";

export default class Ankarton {
  public static async generate(params: any) {
    if (params === undefined) {
      params = {};
    }
    const config: AnkartonConfig = new AnkartonConfig(params);
    return await AccountsGenerator.generate(config);
  }
}

StartDefault.startIfNotImported();
