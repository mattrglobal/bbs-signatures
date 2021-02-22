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
  verify,
  BbsVerifyRequest,
  bls12381toBbs,
  blsVerify,
  BbsSignRequest,
  sign,
  generateBls12381G2KeyPair,
  BlsBbsSignRequest,
  blsSign,
  BlsBbsVerifyRequest,
  BlsKeyPair,
} from "../../lib";
import { base64Decode, stringToBytes } from "../utilities";

describe("bbsSignature", () => {
  describe("verify", () => {
    let blsKeyPair: BlsKeyPair;

    beforeAll(async () => {
      blsKeyPair = await generateBls12381G2KeyPair();
    });

    it("should verify valid signature with a single message", async () => {
      const BbsPublicKey = await bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 1,
      });
      const request: BbsSignRequest = {
        keyPair: BbsPublicKey,
        messages: [stringToBytes("ExampleMessage")],
      };
      const signature = await sign(request);
      const verifyRequest: BbsVerifyRequest = {
        publicKey: BbsPublicKey.publicKey,
        messages: [stringToBytes("ExampleMessage")],
        signature,
      };
      const result = await verify(verifyRequest);
      expect(result.verified).toBeTruthy();
    });

    it("should verify valid signature with multiple messages", async () => {
      const BbsPublicKey = await bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: 3,
      });
      const request: BbsSignRequest = {
        keyPair: BbsPublicKey,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage2"),
          stringToBytes("ExampleMessage3"),
        ],
      };
      const signature = await sign(request);
      const verifyRequest: BbsVerifyRequest = {
        publicKey: BbsPublicKey.publicKey,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage2"),
          stringToBytes("ExampleMessage3"),
        ],
        signature: signature,
      };
      expect((await verify(verifyRequest)).verified).toBeTruthy();
    });

    it("should not verify valid signature with wrong single message", async () => {
      const messages = [stringToBytes("BadMessage")];
      const BbsPublicKey = await bls12381toBbs({
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
      expect((await verify(verifyRequest)).verified).toBeFalsy();
    });

    it("should not verify valid signature with wrong messages", async () => {
      const messages = [
        stringToBytes("BadMessage"),
        stringToBytes("BadMessage"),
        stringToBytes("BadMessage"),
      ];
      const BbsPublicKey = await bls12381toBbs({
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
      expect((await verify(verifyRequest)).verified).toBeFalsy();
    });

    it("should throw error when messages empty", async () => {
      const BbsPublicKey = await bls12381toBbs({
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
      expect((await verify(request)).verified).toBeFalsy();
    });

    it("should throw error when public key invalid length", async () => {
      const request: BbsVerifyRequest = {
        publicKey: new Uint8Array(20),
        messages: [],
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect((await verify(request)).verified).toBeFalsy();
    });
  });
  describe("blsVerify", () => {
    let blsKeyPair: BlsKeyPair;

    beforeAll(async () => {
      blsKeyPair = await generateBls12381G2KeyPair();
    });

    it("should verify valid signature with a single message", async () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: [stringToBytes("ExampleMessage")],
      };
      const signature = await blsSign(request);
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages: [stringToBytes("ExampleMessage")],
        signature,
      };
      expect((await blsVerify(verifyRequest)).verified).toBeTruthy();
    });

    it("should verify valid signature with multiple messages", async () => {
      const request: BlsBbsSignRequest = {
        keyPair: blsKeyPair,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage2"),
          stringToBytes("ExampleMessage3"),
        ],
      };
      const signature = await blsSign(request);
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages: [
          stringToBytes("ExampleMessage"),
          stringToBytes("ExampleMessage2"),
          stringToBytes("ExampleMessage3"),
        ],
        signature,
      };
      expect((await blsVerify(verifyRequest)).verified).toBeTruthy();
    });

    it("should not verify valid signature with wrong single message", async () => {
      const messages = [stringToBytes("BadMessage")];
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages,
        signature: base64Decode(
          "kTV8dar9xLWQZ5EzaWYqTRmgA6dw6wcrUw5c///crRD2QQPXX9Di+lgCPCXAA5D8Pytuh6bNSx6k4NZTR9KfSNdaejKl2zTU9poRfzZ2SIskdgSHTZ2y7jLm/UEGKsAs3tticBVj1Pm2GNhQI/OlXQ=="
        ),
      };
      expect((await blsVerify(verifyRequest)).verified).toBeFalsy();
    });

    it("should not verify valid signature with wrong messages", async () => {
      const messages = [
        stringToBytes("BadMessage"),
        stringToBytes("BadMessage"),
        stringToBytes("BadMessage"),
      ];
      const verifyRequest: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages,
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect((await verify(verifyRequest)).verified).toBeFalsy();
    });

    it("should not verify when messages empty", async () => {
      const request: BlsBbsVerifyRequest = {
        publicKey: blsKeyPair.publicKey,
        messages: [],
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect((await blsVerify(request)).verified).toBeFalsy();
    });

    it("should not verify when public key invalid length", async () => {
      const request: BlsBbsVerifyRequest = {
        publicKey: new Uint8Array(20),
        messages: [],
        signature: base64Decode(
          "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
        ),
      };
      expect((await blsVerify(request)).verified).toBeFalsy();
    });
  });
});
