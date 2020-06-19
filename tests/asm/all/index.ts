import wasm from "../../../lib/index";
import bls12381 from "./bls12381";
import bls12381ToBbs from "./bls12381ToBbs";
import createProof from "./bbsSignature/createProof";
import sign from "./bbsSignature/sign";
import verify from "./bbsSignature/verify";
import verifyProof from "./bbsSignature/verifyProof";

type TestType = Record<string, Function>;
const tests: TestType = {
  ...bls12381,
  ...bls12381ToBbs,
  ...createProof,
  ...sign,
  ...verify,
  ...verifyProof,
};

function beforeAll(): Promise<boolean> {
  return wasm.waitReady();
}

function runAll(): void {
  const failed: string[] = [];
  let count = 0;

  Object.keys(tests).forEach((name: string) => {
    count++;
    try {
      console.time("\t" + name);
      console.log(name);

      tests[name](wasm);

      console.timeEnd("\t" + name);
      // Newline
      console.log();
    } catch (error) {
      console.error(error);
      failed.push(name);
    }
  });

  if (failed.length) {
    throw new Error(
      `Failed: ${failed.length} of ${count}: ${failed.concat(", ")}`
    );
  }
}

function run(): void {
  (async () => {
    await beforeAll();

    runAll();
  })().catch((error) => {
    console.error(error);
    process.exit(-1);
  });
}

export { beforeAll, runAll, run, tests, wasm };
