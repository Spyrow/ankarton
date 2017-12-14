#!/usr/bin/env node

import axios from "axios-proxy-fix";
import * as path from "path";
import * as logger from "winston";
import { alias, argv, defaults, demandOption, describe, epilog, usage } from "yargs";
import { AccountsGenerator } from "./AccountsGenerator";

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

usage("Usage: $0 --out [filePath] --proxy [filePath] --total [num]");
demandOption(["out"]);
defaults({ total: 1 });
alias("out", "o");
alias("proxy", "p");
alias("total", "t");
describe("out", "File to append accounts");
describe("proxy", "Proxy list (otherwise proxies will be generated but take longer)");
describe("total", "Number of accounts to be generated");
epilog("Copyright © 2018 DevChris");

const start = async () => {
  if (argv.proxy) {
    await AccountsGenerator.generateWithProxy(argv.proxy, argv.total, argv.out);
  } else {
    await AccountsGenerator.generateWithoutProxy(argv.total, argv.out);
  }
  // axios.post("https://account.ankama.com/fr/creer-un-compte", {
  // "_pjax": ".ak-registerform-container",
  //   "g-recaptcha-response": "03AO6mBfxgTQupPSFrRnM0CjKh8tnF9uam_eJj" +
  //   "zFl7KR4k6QGqOl6YJEKn19JUkP6vSf-2LxnE2nlGpe0bye3BPs_h-WgSzPZ_sZ_" +
  //   "7KVR2Y2RD0-lQDeUPilBnFt8Pe74UGnmqboT976H8PIDXFffh60w8cdNTK6JRxLxtjE" +
  //   "qzCcP-UHEbhaLFLmFPt_ar95uGQ6Cg12HlXHFNTGubsBMi6ijg2wed8gpbEPlwQc9tmLJ" +
  //   "cHW0RfWTVblALgESTkl5XUZ675oHyWx8tgvHMKTt9MsRYzIaxH3XwFbgWrXagXBy9oHQvLWP" +
  //   "WC6X6k6g3qRDUWq3aaR_MfmWC1wvVVduS-WdP8BE6WUbjOiJk-gq50oTKaiEqOqUK6YQ5bc-0" +
  //   "3tZ_QF9Dx8gxDMAwgrlsQTO1QOdErgH3KXqIChxTsiDkwy1GeDevLiudpWQ",
  //   "sAction": "submit",
  //   "useremail": "azefaefafaezfef@mailsac.com",
  //   "userlogin": "azefaefafaezfef",
  //   "userpassword": "eU!eDskeef",
  // })
  //   .then((resp) => {
  //     logger.info("resp", resp.data);
  //     return;
  //   })
  //   .catch((err) => {
  //     logger.info("err", err.message);
  //     return;
  //   });

  logger.info("All accounts were added successfully!");
};

start();
