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

import { generateBls12381G2KeyPair, bls12381toBbs, BlsKeyPair } from "../lib";

describe("bls12381toBbs", () => {
  it("should be able to convert bls12381 key pair to bbs key", async () => {
    const blsKeyPair = await generateBls12381G2KeyPair();
    expect(blsKeyPair).toBeDefined();
    const bbsKeyPair = await bls12381toBbs({
      keyPair: blsKeyPair,
      messageCount: 10,
    });
    expect(bbsKeyPair).toBeDefined();
    expect(bbsKeyPair.messageCount).toEqual(10);
    expect(bbsKeyPair.secretKey).toBeDefined();
    expect(bbsKeyPair.publicKey).toBeDefined();
    expect(bbsKeyPair.publicKey).toBeInstanceOf(Uint8Array);
    expect(bbsKeyPair.secretKey).toBeInstanceOf(Uint8Array);
  });

  it("should be able to convert bls12381 public key to bbs key", async () => {
    const blsKeyPair = await generateBls12381G2KeyPair();
    expect(blsKeyPair).toBeDefined();
    const blsPublicKey: BlsKeyPair = {
      publicKey: blsKeyPair.publicKey,
    };
    const bbsKeyPair = await bls12381toBbs({
      keyPair: blsPublicKey,
      messageCount: 10,
    });
    expect(bbsKeyPair).toBeDefined();
    expect(bbsKeyPair).toBeDefined();
    expect(bbsKeyPair.messageCount).toEqual(10);
    expect(bbsKeyPair.secretKey).toBeUndefined();
    expect(bbsKeyPair.publicKey).toBeDefined();
    expect(bbsKeyPair.publicKey).toBeInstanceOf(Uint8Array);
  });

  it("should throw error when message count 0", async () => {
    const blsKeyPair = await generateBls12381G2KeyPair();
    expect(blsKeyPair).toBeDefined();

    await expect(
      bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 0,
      })
    ).rejects.toThrowError("Failed to convert key");
  });
});
