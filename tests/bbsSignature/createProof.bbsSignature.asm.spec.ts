import {
  BbsCreateProofRequest,
  createProof,
  blsCreateProof,
} from "../../lib/index.asm";
import { Coder } from "@stablelib/base64";
import { randomBytes } from "@stablelib/random";

const base64Encode = (bytes: Uint8Array): string => {
  const coder = new Coder();
  return coder.encode(bytes);
};

const base64Decode = (string: string): Uint8Array => {
  const coder = new Coder();
  return coder.decode(string);
};

describe("bbsSignature", () => {
  describe("createProof", () => {
    it("should create proof revealing single message from single message signature", () => {
      const messages = ["RmtnDBJHso5iSg=="];
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
        nonce: "0123456789",
        revealed: [0],
      };

      const proof = createProof(request);
      expect(proof.length).toEqual(383);
    });
  });
});
