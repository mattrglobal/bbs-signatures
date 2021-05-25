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

import init from "./wasm.js";
import * as wasm from "./wasm.js";

export const BBS_SIGNATURE_LENGTH = 112;

export const DEFAULT_BLS12381_PRIVATE_KEY_LENGTH = 32;

export const DEFAULT_BLS12381_G1_PUBLIC_KEY_LENGTH = 48;

export const DEFAULT_BLS12381_G2_PUBLIC_KEY_LENGTH = 96;

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
    initializedModule = await init(new URL("wasm_bg.wasm", import.meta.url));
  }
};

export const generateBls12381G1KeyPair = async (seed) => {
  await initialize();
  var result = await throwErrorOnRejectedPromise(
    wasm.generateBls12381G1KeyPair(seed ? seed : null)
  );
  return {
    secretKey: new Uint8Array(result.secretKey),
    publicKey: new Uint8Array(result.publicKey),
  };
};

export const generateBls12381G2KeyPair = async (seed) => {
  await initialize();
  var result = await throwErrorOnRejectedPromise(
    wasm.generateBls12381G2KeyPair(seed ? seed : null)
  );
  return {
    secretKey: new Uint8Array(result.secretKey),
    publicKey: new Uint8Array(result.publicKey),
  };
};

export const bls12381toBbs = async (request) => {
  await initialize();
  var result = await throwErrorOnRejectedPromise(wasm.bls12381toBbs(request));
  return {
    publicKey: new Uint8Array(result.publicKey),
    secretKey: result.secretKey ? new Uint8Array(result.secretKey) : undefined,
    messageCount: result.messageCount,
  };
};

export const sign = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.sign(request));
};

export const blsSign = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.blsSign(request));
};

export const verify = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.verify(request));
};

export const blsVerify = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.blsVerify(request));
};

export const createProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(
    wasm.createProof(request),
    "Failed to create proof"
  );
};

export const blsCreateProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(
    wasm.blsCreateProof(request),
    "Failed to create proof"
  );
};

export const verifyProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.verifyProof(request));
};

export const blsVerifyProof = async (request) => {
  await initialize();
  return await throwErrorOnRejectedPromise(wasm.blsVerifyProof(request));
};
