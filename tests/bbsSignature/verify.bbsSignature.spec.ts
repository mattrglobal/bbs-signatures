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
  waitReady,
  verify,
  BbsVerifyRequest,
  bls12381toBbs,
  BbsSignRequest,
  BlsBbsSignRequest,
  BlsBbsVerifyRequest,
  blsSign,
  blsVerify,
  sign,
  generateBls12381KeyPair,
  BlsKeyPair,
} from "../../lib";
import { Coder } from "@stablelib/base64";

const base64Decode = (string: string): Uint8Array => {
  const coder = new Coder();
  return coder.decode(string);
};

describe("bbsSignature", () => {
  let blsKeyPair: BlsKeyPair;
  beforeAll(async () => {
    await waitReady();
    blsKeyPair = generateBls12381KeyPair();
  });

  describe("verify", () => {
    it("should verify valid signature with a single message", () => {
      const BbsPublicKey = bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const request: BbsSignRequest = {
        keyPair: BbsPublicKey,
        messages: ["ExampleMessage"],
      };
      const signature = sign(request);
      const verifyRequest: BbsVerifyRequest = {
        publicKey: BbsPublicKey.publicKey,
        messages: ["ExampleMessage"],
        signature,
      };
      const result = verify(verifyRequest);
      expect(result.verified).toBeTruthy();
    });

    it("should verify valid signature with multiple messages", () => {
      const BbsPublicKey = bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 3,
      });
      const request: BbsSignRequest = {
        keyPair: BbsPublicKey,
        messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
      };
      const signature = sign(request);
      const verifyRequest: BbsVerifyRequest = {
        publicKey: BbsPublicKey.publicKey,
        messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
        signature: signature,
      };
      expect(verify(verifyRequest).verified).toBeTruthy();
    });

    it("should not verify valid signature with wrong single message", () => {
      const messages = ["BadMessage"];
      const BbsPublicKey = bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const verifyRequest: BbsVerifyRequest = {
        publicKey: BbsPublicKey.publicKey,
        messages,
        signature: base64Decode(
          "kTV8dar9xLWQZ5EzaWYqTRmgA6dw6wcrUw5c///crRD2QQPXX9Di+lgCPCXAA5D8Pytuh6bNSx6k4NZTR9KfSNdaejKl2zTU9poRfzZ2SIskdgSHTZ2y7jLm/UEGKsAs3tticBVj1Pm2GNhQI/OlXQ=="
        ),
      };
      expect(verify(verifyRequest).verified).toBeFalsy();
    });

    it("should not verify valid signature with wrong messages", () => {
      const messages = ["BadMessage", "BadMessage", "BadMessage"];
      const BbsPublicKey = bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 3,
      });
      const verifyRequest: BbsVerifyRequest = {
        publicKey: BbsPublicKey.publicKey,
        messages,
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect(verify(verifyRequest).verified).toBeFalsy();
    });

    it("should throw error when messages empty", () => {
      const BbsPublicKey = bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const request: BbsVerifyRequest = {
        publicKey: BbsPublicKey.publicKey,
        messages: [],
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect(verify(request).verified).toBeFalsy();
    });

    it("should throw error when public key invalid length", () => {
      const request: BbsVerifyRequest = {
        publicKey: new Uint8Array(20),
        messages: [],
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect(verify(request).verified).toBeFalsy();
    });
  });
  describe("blsVerify", () => {
    it("should verify valid signature with a single message", () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: ["ExampleMessage"],
      };
      const signature = blsSign(request);
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages: ["ExampleMessage"],
        signature,
      };
      expect(blsVerify(verifyRequest).verified).toBeTruthy();
    });

    it("should verify valid signature with multiple messages", () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
      };
      const signature = blsSign(request);
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
        signature,
      };
      expect(blsVerify(verifyRequest).verified).toBeTruthy();
    });

    it("should not verify valid signature with wrong single message", () => {
      const messages = ["BadMessage"];
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages,
        signature: base64Decode(
          "kTV8dar9xLWQZ5EzaWYqTRmgA6dw6wcrUw5c///crRD2QQPXX9Di+lgCPCXAA5D8Pytuh6bNSx6k4NZTR9KfSNdaejKl2zTU9poRfzZ2SIskdgSHTZ2y7jLm/UEGKsAs3tticBVj1Pm2GNhQI/OlXQ=="
        ),
      };
      expect(blsVerify(verifyRequest).verified).toBeFalsy();
    });

    it("should not verify valid signature with wrong messages", () => {
      const messages = ["BadMessage", "BadMessage", "BadMessage"];
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages,
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect(verify(verifyRequest).verified).toBeFalsy();
    });

    it("should not verify when messages empty", () => {
      const request: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages: [],
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect(blsVerify(request).verified).toBeFalsy();
    });

    it("should not verify when public key invalid length", () => {
      const request: BlsBbsVerifyRequest = {
        publicKey: new Uint8Array(20),
        messages: [],
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect(blsVerify(request).verified).toBeFalsy();
    });
  });
});
