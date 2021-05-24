"use strict";
/*
 * Copyright 2020 - MATTR Limited
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { nodejs } = require("./util");

// Inject the RNG source when in NodeJS environments
const { randomBytes } = require("@stablelib/random");

// Translate `wasm.js` to CommonJS which is generated
// as an ES module, syntax that is not supported by NodeJS
const wasm = require("esm")(module)("./wasm.js");

// TODO should be able to remove this duplicate definition syntax by using ESM over index.web.js
// in future

module.exports.DEFAULT_BLS12381_PRIVATE_KEY_LENGTH = 32;

module.exports.DEFAULT_BLS12381_G1_PUBLIC_KEY_LENGTH = 48;

module.exports.DEFAULT_BLS12381_G2_PUBLIC_KEY_LENGTH = 96;

module.exports.BBS_SIGNATURE_LENGTH = 112;

// Casts a rejected promise to an error rather than a
// simple string result
const throwErrorOnRejectedPromise = async (promise, errorMessage) => {
  try {
    return await promise;
  } catch (ex) {
    if (errorMessage) {
      throw new Error(errorMessage);
    }
    throw new Error(ex);
  }
};

let initializedModule;
const initialize = async () => {
  if (!initializedModule) {
    if (nodejs) {
      // Fetch the wasm and load the module manually
      const path = require("path").join(__dirname, "wasm_bg.wasm");
      const bytes = require("fs").readFileSync(path);
      const wasmModule = new WebAssembly.Module(bytes);
      initializedModule = await wasm.default(wasmModule);
    } else {
      initializedModule = await wasm.default();
    }
  }
};

module.exports.generateBls12381G1KeyPair = async (seed) => {
  await initialize();
  var result = await throwErrorOnRejectedPromise(
    wasm.generateBls12381G1KeyPair(seed ? seed : await randomBytes(32))
  );
  return {
    secretKey: new Uint8Array(result.secretKey),
    publicKey: new Uint8Array(result.publicKey),
  };
};

module.exports.generateBls12381G2KeyPair = async (seed) => {
  await initialize();
  var result = await throwErrorOnRejectedPromise(
    wasm.generateBls12381G2KeyPair(seed ? seed : await randomBytes(32))
  );
  return {
    secretKey: new Uint8Array(result.secretKey),
    publicKey: new Uint8Array(result.publicKey),
  };
};

module.exports.bls12381toBbs = async (request) => {
  await initialize();
  var result = await throwErrorOnRejectedPromise(wasm.bls12381toBbs(request));
  return {
    publicKey: new Uint8Array(result.publicKey),
    secretKey: result.secretKey ? new Uint8Array(result.secretKey) : undefined,
    messageCount: result.messageCount,
  };
};

module.exports.sign = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.sign(request));
};

module.exports.blsSign = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.blsSign(request));
};

module.exports.verify = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.verify(request));
};

module.exports.blsVerify = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.blsVerify(request));
};

module.exports.createProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(
    wasm.createProof(request),
    "Failed to create proof"
  );
};

module.exports.blsCreateProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(
    wasm.blsCreateProof(request),
    "Failed to create proof"
  );
};

module.exports.verifyProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.verifyProof(request));
};

module.exports.blsVerifyProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.blsVerifyProof(request));
};
