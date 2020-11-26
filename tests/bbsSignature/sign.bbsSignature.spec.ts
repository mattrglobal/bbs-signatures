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
  generateBls12381G2KeyPair,
  BbsSignRequest,
  BlsBbsSignRequest,
  sign,
  bls12381toBbs,
  BBS_SIGNATURE_LENGTH,
  BbsKeyPair,
  blsSign,
  BlsKeyPair,
} from "../../lib";
import { stringToBytes } from "../utilities";

describe("bbsSignature", () => {
  let blsKeyPair: BlsKeyPair;

  beforeAll(async () => {
    blsKeyPair = await generateBls12381G2KeyPair();
  });

  describe("sign", () => {
    let bbsKeyPair: BbsKeyPair;

    beforeAll(async () => {
      bbsKeyPair = await bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 3,
      });
    });

    it("should sign a single message", async () => {
      const bbsKeyPair = await bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: [stringToBytes("ExampleMessage")],
      };
      const signature = await sign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should sign multiple messages", async () => {
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage2"),
          stringToBytes("ExampleMessage3"),
        ],
      };
      const signature = await sign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should sign multiple messages when public key supports more", async () => {
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage"),
        ],
      };
      const signature = await sign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should throw error if secret key not present", async () => {
      const bbsKey: BbsKeyPair = {
        publicKey: bbsKeyPair.publicKey,
        messageCount: bbsKeyPair.messageCount,
      };
      const request: BbsSignRequest = {
        keyPair: bbsKey,
        messages: [stringToBytes("ExampleMessage")],
      };
      await expect(sign(request)).rejects.toThrowError("Failed to sign");
    });

    it("should throw error if public key does not support message number", async () => {
      const bbsKeyPair = await bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage"),
        ],
      };
      await expect(sign(request)).rejects.toThrowError("Failed to sign");
    });
  });

  describe("blsSign", () => {
    it("should sign a single message", async () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: [stringToBytes("ExampleMessage")],
      };
      const signature = await blsSign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should sign multiple messages", async () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage2"),
          stringToBytes("ExampleMessage3"),
        ],
      };
      const signature = await blsSign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should throw error if secret key not present", async () => {
      const blsKey: BlsKeyPair = {
        publicKey: blsKeyPair.publicKey,
      };
      const request: BlsBbsSignRequest = {
        keyPair: blsKey,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage2"),
          stringToBytes("ExampleMessage3"),
        ],
      };
      await expect(blsSign(request)).rejects.toThrowError("Failed to sign");
    });

    it("should throw error when messages empty", async () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: [],
      };
      await expect(blsSign(request)).rejects.toThrowError(
        "Failed to convert key"
      );
    });
  });
});
