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

const nodejs = process && process.versions && process.versions.node;

let useWasm = !nodejs || process.env.BBS_REQUIRE_WASM;

try {
  if (!useWasm) {
    module.exports = require("@mattrglobal/node-bbs-signatures");
  }
} catch {
  useWasm = true;
}

if (useWasm) {
  const wasm = require("./wasm");

  module.exports.DEFAULT_BLS12381_PRIVATE_KEY_LENGTH = 32;

  module.exports.DEFAULT_BLS12381_PUBLIC_KEY_LENGTH = 96;

  module.exports.BBS_SIGNATURE_LENGTH = 112;

  module.exports.generateBls12381KeyPair = (seed) => {
    var result = wasm.generateBls12381KeyPair(seed ? seed : null);
    return {
      secretKey: result.secretKey
        ? new Uint8Array(result.secretKey)
        : undefined,
      publicKey: new Uint8Array(result.publicKey),
    };
  };

  module.exports.bls12381toBbs = (request) => {
    var result = wasm.bls12381toBbs(request);
    return {
      publicKey: new Uint8Array(result.publicKey),
      secretKey: result.secretKey
        ? new Uint8Array(result.secretKey)
        : undefined,
      messageCount: result.messageCount,
    };
  };

  module.exports.Bls12381ToBbsRequest = wasm.Bls12381ToBbsRequest;

  module.exports.sign = wasm.sign;

  module.exports.blsSign = wasm.blsSign;

  module.exports.verify = wasm.verify;

  module.exports.blsVerify = wasm.blsVerify;

  module.exports.createProof = wasm.createProof;

  module.exports.blsCreateProof = wasm.blsCreateProof;

  module.exports.verifyProof = wasm.verifyProof;

  module.exports.blsVerifyProof = wasm.blsVerifyProof;
}
