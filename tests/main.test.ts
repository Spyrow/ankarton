import * as chai from "chai";
import * as mocha from "mocha";
import Ankarton from "../src/Library";

const expect = chai.expect;

describe("AccountsGenerator", () => {

  it.skip("should create one account", (done) => {
    Ankarton.generate({}).then(() => { done(); });
  });
  it.skip("should create one account", (done) => {
    Ankarton.generate({
      output: (err: any, data: any) => {
        done();
      },
    }).then(() => {/**/ });
  });

  it.skip("should create one account", (done) => {
    Ankarton.generate({
      output: (err: any, data: any) => {
        console.log(data);
        done();
      },
      passwordGenerator: (): string => {
        return "genpas246";
      },
    }).then(() => {/**/ });
  });

  it.skip("should create one account", (done) => {
    Ankarton.generate({
      proxy: { host: "35.176.15.47", port: "4201" },
      output: (err: any, data: any) => {
        console.log(data);
        done();
      },
      passwordGenerator: (): string => {
        return "genpas246";
      },
      loginGenerator: (generatedLogin: string): string => {
        return "prefix" + generatedLogin;
      }
    }).then(() => {/**/ });
  });

});
