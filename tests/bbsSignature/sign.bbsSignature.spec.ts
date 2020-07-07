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
  generateBls12381KeyPair,
  BbsSignRequest,
  sign,
  bls12381toBbs,
  blsSign,
  BBS_SIGNATURE_LENGTH,
  BbsKeyPair,
  BlsBbsSignRequest,
  BlsKeyPair,
} from "../../lib";

describe("bbsSignature", () => {
  let blsKeyPair: BlsKeyPair;
  let bbsKeyPair: BbsKeyPair;
  beforeAll(async () => {
    blsKeyPair = generateBls12381KeyPair();
    bbsKeyPair = bls12381toBbs({ keyPair: blsKeyPair, messageCount: 3 });
  });

  describe("sign", () => {
    it("should sign a single message", () => {
      const bbsKeyPair = bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: ["ExampleMessage"],
      };
      const signature = sign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should sign multiple messages", () => {
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
      };
      const signature = sign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should sign multiple messages when public key supports more", () => {
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: ["ExampleMessage", "ExampleMessage"],
      };
      const signature = sign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should throw error if secret key not present", () => {
      const bbsKey: BbsKeyPair = {
        publicKey: bbsKeyPair.publicKey,
        messageCount: bbsKeyPair.messageCount,
      };
      const request: BbsSignRequest = {
        keyPair: bbsKey,
        messages: ["ExampleMessage"],
      };
      expect(() => sign(request)).toThrowError("Secret Key must be set");
    });

    it("should throw error if public key does not support message number", () => {
      const bbsKeyPair = bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const request: BbsSignRequest = {
        keyPair: bbsKeyPair,
        messages: ["ExampleMessage", "ExampleMessage", "ExampleMessage"],
      };
      expect(() => sign(request)).toThrowError();
    });
  });

  describe("blsSign", () => {
    it("should sign a single message", () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: ["ExampleMessage"],
      };
      const signature = blsSign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should sign multiple messages", () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
      };
      const signature = blsSign(request);
      expect(signature).toBeInstanceOf(Uint8Array);
      expect(signature.length).toEqual(BBS_SIGNATURE_LENGTH);
    });

    it("should throw error if secret key not present", () => {
      const blsKey: BlsKeyPair = {
        publicKey: blsKeyPair.publicKey,
      };
      const request: BlsBbsSignRequest = {
        keyPair: blsKey,
        messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
      };
      expect(() => blsSign(request)).toThrowError("Failed to sign");
    });

    it("should throw error when messages empty", () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: [],
      };
      expect(() => blsSign(request)).toThrowError("Failed to convert key");
    });
  });
});
