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

import { BbsCreateProofRequest, createProof, blsCreateProof } from "../../lib";
import { randomBytes } from "@stablelib/random";
import { base64Decode, stringToBytes } from "../utilities";

describe("bbsSignature", () => {
  describe("createProof", () => {
    it("should create proof revealing single message from single message signature", async () => {
      const messages = [stringToBytes("RmtnDBJHso5iSg==")];
      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pboZyjM38YgjaUBcjftZi5gb58Qz13XeRJpiuUHH06I7/1Eb8oVtIW5SGMNfKaqKhBAAAAAYPPztgxfWWw01/0SSug1oLfVuI4XUqhgyZ3rS6eTkOLjnyR3ObXb0XCD2Mfcxiv6w=="
      );
      const signature = base64Decode(
        "rpldJh9DkYe4FvX7WPYI+GNhBM7uB3UGg3NcJX+NTts9E5R9TtHSYszqVfLxdq0Mb45jyd82laouneFYjB5TreM5Qpo9TyO0yNPdaanmfW0wCeLp3r0bhdfOF67GGL01KHY56ojoaSWBmr2lpqRU2Q=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: stringToBytes("0123456789"),
        revealed: [0],
      };

      const proof = await createProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(383);
    });

    it("should create proof revealing all messages from multi-message signature", async () => {
      const messages = [
        stringToBytes("J42AxhciOVkE9w=="),
        stringToBytes("PNMnARWIHP+s2g=="),
        stringToBytes("ti9WYhhEej85jw=="),
      ];

      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const signature = base64Decode(
        "qg3PfohWGvbOCZWxcWIZ779aOuNSafjCXLdDux01TTNGm/Uqhr/kZZ1wSmxKwbEWAhctrDCp2mGE0M0l6DlA5R38chMbtnyWMfQgbQpzMQZgPBPUvVWivJyYEysZnQWrAYzZzRPe36VFbFy5ynWx0w=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0, 1, 2],
      };

      const proof = await createProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(383); //TODO add a reason for this and some constants?
    });

    it("should create proof revealing single message from multi-message signature", async () => {
      const messages = [
        stringToBytes("J42AxhciOVkE9w=="),
        stringToBytes("PNMnARWIHP+s2g=="),
        stringToBytes("ti9WYhhEej85jw=="),
      ];

      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const signature = base64Decode(
        "qg3PfohWGvbOCZWxcWIZ779aOuNSafjCXLdDux01TTNGm/Uqhr/kZZ1wSmxKwbEWAhctrDCp2mGE0M0l6DlA5R38chMbtnyWMfQgbQpzMQZgPBPUvVWivJyYEysZnQWrAYzZzRPe36VFbFy5ynWx0w=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      const proof = await createProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(447); //TODO add a reason for this and some constants?
    });

    it("should create proof revealing multiple messages from multi-message signature", async () => {
      const messages = [
        stringToBytes("J42AxhciOVkE9w=="),
        stringToBytes("PNMnARWIHP+s2g=="),
        stringToBytes("ti9WYhhEej85jw=="),
      ];

      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const signature = base64Decode(
        "qg3PfohWGvbOCZWxcWIZ779aOuNSafjCXLdDux01TTNGm/Uqhr/kZZ1wSmxKwbEWAhctrDCp2mGE0M0l6DlA5R38chMbtnyWMfQgbQpzMQZgPBPUvVWivJyYEysZnQWrAYzZzRPe36VFbFy5ynWx0w=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0, 2],
      };

      const proof = await createProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(415); //TODO evaluate this length properly add a reason for this and some constants?
    });

    it("should fail to create proof when attempting to create one with an unsigned extra message", async () => {
      const messages = [
        stringToBytes("J42AxhciOVkE9w=="),
        stringToBytes("PNMnARWIHP+s2g=="),
        stringToBytes("ti9WYhhEej85jw=="),
        stringToBytes("badmessagex01a=="),
      ];

      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const signature = base64Decode(
        "qg3PfohWGvbOCZWxcWIZ779aOuNSafjCXLdDux01TTNGm/Uqhr/kZZ1wSmxKwbEWAhctrDCp2mGE0M0l6DlA5R38chMbtnyWMfQgbQpzMQZgPBPUvVWivJyYEysZnQWrAYzZzRPe36VFbFy5ynWx0w=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0, 1, 2, 3],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });

    it("should fail to create proof when attempting to create one with a modified message", async () => {
      const messages = [
        stringToBytes("badmessagex01a=="),
        stringToBytes("PNMnARWIHP+s2g=="),
        stringToBytes("ti9WYhhEej85jw=="),
      ];

      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const signature = base64Decode(
        "qg3PfohWGvbOCZWxcWIZ779aOuNSafjCXLdDux01TTNGm/Uqhr/kZZ1wSmxKwbEWAhctrDCp2mGE0M0l6DlA5R38chMbtnyWMfQgbQpzMQZgPBPUvVWivJyYEysZnQWrAYzZzRPe36VFbFy5ynWx0w=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });

    it("should fail to create proof when attempting to create one with missing messages", async () => {
      const messages = [
        stringToBytes("badmessagex01a=="),
        stringToBytes("PNMnARWIHP+s2g=="),
      ];

      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const signature = base64Decode(
        "qg3PfohWGvbOCZWxcWIZ779aOuNSafjCXLdDux01TTNGm/Uqhr/kZZ1wSmxKwbEWAhctrDCp2mGE0M0l6DlA5R38chMbtnyWMfQgbQpzMQZgPBPUvVWivJyYEysZnQWrAYzZzRPe36VFbFy5ynWx0w=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });

    it("should fail to create proof when attempting to create one with messages supplied in wrong order", async () => {
      const messages = [
        stringToBytes("ti9WYhhEej85jw=="),
        stringToBytes("PNMnARWIHP+s2g=="),
        stringToBytes("J42AxhciOVkE9w=="),
      ];

      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const signature = base64Decode(
        "qg3PfohWGvbOCZWxcWIZ779aOuNSafjCXLdDux01TTNGm/Uqhr/kZZ1wSmxKwbEWAhctrDCp2mGE0M0l6DlA5R38chMbtnyWMfQgbQpzMQZgPBPUvVWivJyYEysZnQWrAYzZzRPe36VFbFy5ynWx0w=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: bbsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });
  });

  describe("blsCreateProof", () => {
    it("should create proof revealing single message from single message signature", async () => {
      const messages = [stringToBytes("uzAoQFqLgReidw==")];
      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "r00WeXEj+07DUZb3JY6fbbKhHtQcxtLZsJUVU6liFZQKCLQYu77EXFZx4Vaa5VBtKpPK6tDGovHGgrgyizOm70VUZgzzBb0emvRIGSWhAKkcLL1z1HYwApnUE6XFFb96LUF4XM//QhEM774dX4ciqQ=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: stringToBytes("0123456789"),
        revealed: [0],
      };

      const proof = await blsCreateProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(383);
    });

    it("should create proof revealing all messages from multi-message signature", async () => {
      const messages = [
        stringToBytes("C+n1rPz1/tVzPg=="),
        stringToBytes("h3x8cbySqC4rLA=="),
        stringToBytes("MGf74ofGdRwNbw=="),
      ];

      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "uISPYALbiNZwIgu1ndj9onUbkFA9trrhGFQJqJHFOSWCZYAIDUNTysXziar6+MdbPEiJS34OOlKAzxxnxIhFW0lBd4dbLOKf59LZPMRYc91tALAZeriyKcSVa7RzZl50UPjHfs31JrH6RgZ1V9/OVg=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0, 1, 2],
      };

      const proof = await blsCreateProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(383); //TODO add a reason for this and some constants?
    });

    it("should create proof revealing single message from multi-message signature", async () => {
      const messages = [
        stringToBytes("uiSKIfNoO2rMrA=="),
        stringToBytes("lMoHHrFx0LxwAw=="),
        stringToBytes("wdwqLVm9chMMnA=="),
      ];

      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "jU9tKKvDDqoSUTMPDGfw/1GlnOnRD56wEM2iftL7NPBlT3JxP2YY5SnR32nra0bmR//r8JH7fvgYuqpXHJB+vsYj7xoeyQtvoPZArti0YiYML2utQmsV4zN1W0sWH7+myPL/7H/m6PgxL/CjYzAaRg=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      const proof = await blsCreateProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(447); //TODO add a reason for this and some constants?
    });

    it("should create proof revealing multiple messages from multi-message signature", async () => {
      const messages = [
        stringToBytes("uiSKIfNoO2rMrA=="),
        stringToBytes("lMoHHrFx0LxwAw=="),
        stringToBytes("wdwqLVm9chMMnA=="),
      ];

      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "jU9tKKvDDqoSUTMPDGfw/1GlnOnRD56wEM2iftL7NPBlT3JxP2YY5SnR32nra0bmR//r8JH7fvgYuqpXHJB+vsYj7xoeyQtvoPZArti0YiYML2utQmsV4zN1W0sWH7+myPL/7H/m6PgxL/CjYzAaRg=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0, 2],
      };

      const proof = await blsCreateProof(request);
      expect(proof).toBeInstanceOf(Uint8Array);
      expect(proof.length).toEqual(415); //TODO evaluate this length properly add a reason for this and some constants?
    });

    it("should fail to create proof when attempting to create one with an unsigned extra message", async () => {
      const messages = [
        stringToBytes("uiSKIfNoO2rMrA=="),
        stringToBytes("lMoHHrFx0LxwAw=="),
        stringToBytes("wdwqLVm9chMMnA=="),
        stringToBytes("badmessagex01a=="),
      ];

      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "jU9tKKvDDqoSUTMPDGfw/1GlnOnRD56wEM2iftL7NPBlT3JxP2YY5SnR32nra0bmR//r8JH7fvgYuqpXHJB+vsYj7xoeyQtvoPZArti0YiYML2utQmsV4zN1W0sWH7+myPL/7H/m6PgxL/CjYzAaRg=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0, 1, 2, 3],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });

    it("should fail to create proof when attempting to create one with a modified message", async () => {
      const messages = [
        stringToBytes("badmessagex01a=="),
        stringToBytes("lMoHHrFx0LxwAw=="),
        stringToBytes("wdwqLVm9chMMnA=="),
      ];

      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "jU9tKKvDDqoSUTMPDGfw/1GlnOnRD56wEM2iftL7NPBlT3JxP2YY5SnR32nra0bmR//r8JH7fvgYuqpXHJB+vsYj7xoeyQtvoPZArti0YiYML2utQmsV4zN1W0sWH7+myPL/7H/m6PgxL/CjYzAaRg=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });

    it("should fail to create proof when attempting to create one with missing messages", async () => {
      const messages = [
        stringToBytes("lMoHHrFx0LxwAw=="),
        stringToBytes("wdwqLVm9chMMnA=="),
      ];

      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "jU9tKKvDDqoSUTMPDGfw/1GlnOnRD56wEM2iftL7NPBlT3JxP2YY5SnR32nra0bmR//r8JH7fvgYuqpXHJB+vsYj7xoeyQtvoPZArti0YiYML2utQmsV4zN1W0sWH7+myPL/7H/m6PgxL/CjYzAaRg=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });

    it("should fail to create proof when attempting to create one with a modified message", async () => {
      const messages = [
        stringToBytes("wdwqLVm9chMMnA=="),
        stringToBytes("lMoHHrFx0LxwAw=="),
        stringToBytes("uiSKIfNoO2rMrA=="),
      ];

      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const signature = base64Decode(
        "jU9tKKvDDqoSUTMPDGfw/1GlnOnRD56wEM2iftL7NPBlT3JxP2YY5SnR32nra0bmR//r8JH7fvgYuqpXHJB+vsYj7xoeyQtvoPZArti0YiYML2utQmsV4zN1W0sWH7+myPL/7H/m6PgxL/CjYzAaRg=="
      );

      const request: BbsCreateProofRequest = {
        signature,
        publicKey: blsPublicKey,
        messages,
        nonce: randomBytes(10),
        revealed: [0],
      };

      await expect(createProof(request)).rejects.toThrowError(
        "Failed to create proof"
      );
    });
  });
});
