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

import {
  generateBls12381G1KeyPair,
  generateBls12381G2KeyPair,
  DEFAULT_BLS12381_G1_PUBLIC_KEY_LENGTH,
  DEFAULT_BLS12381_G2_PUBLIC_KEY_LENGTH,
  DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
} from "../lib";

describe("bls12381", () => {
  [
    {
      field: "G1",
      generateKeyFn: generateBls12381G1KeyPair,
      secretKeyLength: DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
      publicKeyLength: DEFAULT_BLS12381_G1_PUBLIC_KEY_LENGTH,
    },
    {
      field: "G2",
      generateKeyFn: generateBls12381G2KeyPair,
      secretKeyLength: DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
      publicKeyLength: DEFAULT_BLS12381_G2_PUBLIC_KEY_LENGTH,
    },
  ].forEach((value) => {
    it(`should be able to generate a key pair in ${value.field} field`, async () => {
      const result = await value.generateKeyFn();
      expect(result).toBeDefined();
      expect(result.publicKey).toBeDefined();
      expect(result.secretKey).toBeDefined();
      expect(result.secretKey?.length as number).toEqual(value.secretKeyLength);
      expect(result.publicKey.length).toEqual(value.publicKeyLength);
    });
  });

  [
    {
      field: "G1",
      generateKeyFn: generateBls12381G1KeyPair,
      secretKeyLength: DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
      publicKeyLength: DEFAULT_BLS12381_G1_PUBLIC_KEY_LENGTH,
    },
    {
      field: "G2",
      generateKeyFn: generateBls12381G2KeyPair,
      secretKeyLength: DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
      publicKeyLength: DEFAULT_BLS12381_G2_PUBLIC_KEY_LENGTH,
    },
  ].forEach((value) => {
    it(`should be able to generate a key pairs in ${value.field} field without seed which are random`, async () => {
      const keyPair1 = await value.generateKeyFn();
      const keyPair2 = await value.generateKeyFn();
      expect(keyPair1).toBeDefined();
      expect(keyPair2).toBeDefined();
      expect(
        (keyPair1.secretKey as Uint8Array) ===
          (keyPair2.secretKey as Uint8Array)
      ).toBeFalsy();
      expect(keyPair1.publicKey === keyPair2.publicKey).toBeFalsy();
    });
  });

  [
    {
      field: "G1",
      generateKeyFn: generateBls12381G1KeyPair,
      secretKeyLength: DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
      publicKeyLength: DEFAULT_BLS12381_G1_PUBLIC_KEY_LENGTH,
      seed: new Uint8Array(
        Buffer.from(
          "H297BpoOgkfpXcxr1fJyQRiNx1+ZekeQ+OU/AYV/lVxaPXXhFBIbxeIU8kIAAX68cwQ=",
          "base64"
        )
      ),
      secretKey: new Uint8Array(
        Buffer.from("Cm550dHeqo5I/dVC/bXD9s5Cx8vnyhV/gm7KO5UuviE=", "base64")
      ),
      publicKey: new Uint8Array(
        Buffer.from(
          "ufHHJwY9/xjrtHgGyQD1F9zNRJqiB4zhSXDEBC/MJrNuXJFwI+ILxu2uPASyd5Vf",
          "base64"
        )
      ),
    },
    {
      field: "G2",
      generateKeyFn: generateBls12381G2KeyPair,
      secretKeyLength: DEFAULT_BLS12381_PRIVATE_KEY_LENGTH,
      publicKeyLength: DEFAULT_BLS12381_G2_PUBLIC_KEY_LENGTH,
      seed: new Uint8Array(
        Buffer.from(
          "H297BpoOgkfpXcxr1fJyQRiNx1+ZekeQ+OU/AYV/lVxaPXXhFBIbxeIU8kIAAX68cwQ=",
          "base64"
        )
      ),
      secretKey: new Uint8Array(
        Buffer.from("Cm550dHeqo5I/dVC/bXD9s5Cx8vnyhV/gm7KO5UuviE=", "base64")
      ),
      publicKey: new Uint8Array(
        Buffer.from(
          "pQro1uqpvUPM31sr+jHffz7+KJIpA3kFen4SoKATURRgo7pk582aaqIxSinWsgHDB9j9dwxYRbC3q2ZmICR2OVMX3FHW9LZV2QAauTYFn7gEra1BSeKhdKDpzBxPjI36",
          "base64"
        )
      ),
    },
  ].forEach((value) => {
    it(`should be able to generate a key pair with a seed in ${value.field} field`, async () => {
      const result = await value.generateKeyFn(value.seed);
      expect(result.publicKey).toBeDefined();
      expect(result.secretKey).toBeDefined();
      expect(result.secretKey?.length as number).toEqual(value.secretKeyLength);
      expect(result.publicKey.length).toEqual(value.publicKeyLength);
      expect(result.secretKey as Uint8Array).toEqual(value.secretKey);
      expect(result.publicKey).toEqual(value.publicKey);
    });
  });
});
