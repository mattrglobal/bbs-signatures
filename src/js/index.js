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

const { BBS_SIGNATURES_MODES, FAILED_TO_LOAD_NODE_MODULE } = require("./util");

const nodejs = process && process.versions && process.versions.node;

let useWasm = !(
  nodejs &&
  (!process.env.BBS_SIGNATURES_MODE ||
    process.env.BBS_SIGNATURES_MODE === BBS_SIGNATURES_MODES.nodejs)
);

try {
  if (!useWasm) {
    module.exports = require("@mattrglobal/node-bbs-signatures");
  }
} catch {
  if (process.env.BBS_SIGNATURES_MODE === BBS_SIGNATURES_MODES.nodejs) {
    throw new Error(FAILED_TO_LOAD_NODE_MODULE);
  }
  useWasm = true;
}

if (useWasm) {
  const wasm = require("./wasm");

  // Casts a rejected promise to an error rather than a
  // simple string result
  const throwErrorOnRejectedPromise = async (promise) => {
    try {
      return await promise;
    } catch (ex) {
      throw new Error(ex);
    }
  };

  module.exports.DEFAULT_BLS12381_PRIVATE_KEY_LENGTH = 32;

  module.exports.DEFAULT_BLS12381_G1_PUBLIC_KEY_LENGTH = 48;

  module.exports.DEFAULT_BLS12381_G2_PUBLIC_KEY_LENGTH = 96;

  module.exports.BBS_SIGNATURE_LENGTH = 112;

  module.exports.generateBls12381G1KeyPair = async (seed) => {
    var result = await throwErrorOnRejectedPromise(
      wasm.generateBls12381G1KeyPair(seed ? seed : null)
    );
    return {
      secretKey: new Uint8Array(result.secretKey),
      publicKey: new Uint8Array(result.publicKey),
    };
  };

  module.exports.generateBls12381G2KeyPair = async (seed) => {
    var result = await throwErrorOnRejectedPromise(
      wasm.generateBls12381G2KeyPair(seed ? seed : null)
    );
    return {
      secretKey: new Uint8Array(result.secretKey),
      publicKey: new Uint8Array(result.publicKey),
    };
  };

  module.exports.bls12381toBbs = async (request) => {
    var result = await throwErrorOnRejectedPromise(wasm.bls12381toBbs(request));
    return {
      publicKey: new Uint8Array(result.publicKey),
      secretKey: result.secretKey
        ? new Uint8Array(result.secretKey)
        : undefined,
      messageCount: result.messageCount,
    };
  };

  module.exports.sign = (request) =>
    throwErrorOnRejectedPromise(wasm.sign(request));

  module.exports.blsSign = (request) =>
    throwErrorOnRejectedPromise(wasm.blsSign(request));

  module.exports.verify = (request) =>
    throwErrorOnRejectedPromise(wasm.verify(request));

  module.exports.blsVerify = (request) =>
    throwErrorOnRejectedPromise(wasm.blsVerify(request));

  module.exports.createProof = (request) =>
    throwErrorOnRejectedPromise(wasm.createProof(request));

  module.exports.blsCreateProof = (request) =>
    throwErrorOnRejectedPromise(wasm.blsCreateProof(request));

  module.exports.verifyProof = (request) =>
    throwErrorOnRejectedPromise(wasm.verifyProof(request));

  module.exports.blsVerifyProof = (request) =>
    throwErrorOnRejectedPromise(wasm.blsVerifyProof(request));
}
