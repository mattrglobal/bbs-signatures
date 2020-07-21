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
  BbsVerifyProofRequest,
  verifyProof,
  blsVerifyProof,
  BbsCreateProofRequest,
  createProof,
} from "../../lib";
import { base64Decode, stringToBytes } from "../utilities";

describe("bbsSignature", () => {
  describe("verifyProof", () => {
    it("should verify proof with all messages revealed from single message signature", () => {
      const messages = [stringToBytes("KNK0ITRAF+NrGg==")];
      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pboZyjM38YgjaUBcjftZi5gb58Qz13XeRJpiuUHH06I7/1Eb8oVtIW5SGMNfKaqKhBAAAAAYPPztgxfWWw01/0SSug1oLfVuI4XUqhgyZ3rS6eTkOLjnyR3ObXb0XCD2Mfcxiv6w=="
      );
      const proof = base64Decode(
        "AAEBoyrn7FHZEDAfMBckBd9x4N1m5kpnjh/Oryw5XYkpqr7iqtSxYIqS7pmKAA/DjDt7lFkfu7oAYdKJlSD6WVGokHwtOW/EDkJXjrjQ4NVktiu0vfy0dEhy+CBhhcnwBQyfseuIeIuTZ1+2cAVaiOlzdc/K/yEKjSAQPqIOkmj9OaLLkfmljd5abf7dYMap0UugAAAAdKdyg+I6PbYt6HpcGCEX9KhVD0axbsNjch87YqUy3daNKsV5IQB3e3rKK5yR2sPpjgAAAAJvj/vM9cIsN/hZQEVpMwGVGAp39yWx0zsguRORUz2gXg8/IuO8e6l4L1ZZ7viCOgP9hYK9ZCeoMknyF4OhsuwpqF2pddX8+5FEuN2IDZTX+NFYmPnp/60HGLU4lmN2xS1XIWU5UzFAi6N6VQLyOQbKAAAAAlXEI+c6GIRznGyDVAj3UaukO+z2I3V/HsS9XQFrjwgPDphFi+XQwULUNGUzGins9XMU+m44a+SqiRu6tahdZFk="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: bbsPublicKey,
        messages,
        nonce: stringToBytes("v3bb/Mz+JajUdiM2URfZYcPuqxw="),
      };

      expect(verifyProof(request).verified).toBeTruthy();
    });

    it("should verify proof with all messages revealed from multi message signature", () => {
      const messages = [
        stringToBytes("BVB6lAn912sz9Q=="),
        stringToBytes("b45VqRkIo5R5Zw=="),
        stringToBytes("yPqox0TIKS6vCA=="),
      ];
      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const proof = base64Decode(
        "AAMHlMA5fdGj+q/odkuWQqeIvwJhBybYDWNB4n2FHNfjz7FQyhYhynyqCzsZML0zxgobtvW8h2yWKhO6lJdNngoSZCz9NBukGK9XNT1f+9/9oej8Kb7kQZn8bvBBGTTq7AiHl4JJ9jzleS691Rm1M22QAbGQB1hFvN6ztPLgj2ySTvxQAS8InyH4PIhdWvtdXOm0AAAAdJlx5B4XLCodJI5Iz0gbd4OUnB23Kp1d95P0IMSF1qQPxhWkdQply9gIYL7jGo709QAAAAIN6CB7Wg/HGNwlz1Ez0w+H0/pHU7lXQLqlPbr1q16ZBDNOD83l6YwklUo844OgBBqlgEWyBYYreSumlOlt/LRHpu6bsdZEk6dKs9DOZVteFKF7J26HoPnIZu382Aq3HpXvRADR+kax0U2BEHOZkYugAAAAAgw5IFEkwfqSDw5ZACA9NUpvUscXQVuKWTQxA2vjmmNpL+OWDHRphIyOtLGY7ss1LKJg4BO760sBClRA73Si2LI="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: bbsPublicKey,
        messages,
        nonce: stringToBytes("dVPpzuQtJVAZzAw73beWiXLtoT4="),
      };

      expect(verifyProof(request).verified).toBeTruthy();
    });

    it("should verify proof with one message revealed from multi-message signature", () => {
      const messages = [
        stringToBytes("+FxEv3VLcNZ8sA=="),
        stringToBytes("eI2RcRExnbP8hw=="),
        stringToBytes("wll4zckqWAb0Kg=="),
      ];
      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbiZ/pmArLDr3oSCqthKgSZw4VFzzJMFEuHP9AAnOnUJmqkOmvI1ctGLO6kCLFuwQVAAAAA4GrOHdyZEbTWRrTwIdz+KXWcEUHdIx41XSr/RK0TE5+qU7irAhQekOGFpGWQY4rYrDxoHToB4DblaJWUgkSZQLQ5sOfJg3qUJr9MpnDNJ8nNNitL65e6mqnpfsbbT3k94LBQI3/HijeRl29y5dGcLhOxldMtx2SvQg//kWOJ/Ug8e1aVo3V07XkR1Ltx76uzA=="
      );
      const proof = base64Decode(
        "AAMBtYbI5XYKqYgFVgMdEovJHnlRl8lDQip5D8N6JD9YfLwUmGPaPRbRw8aR3QJHLhkWtALo0Msuiql9AaDMhkshRATUutehh842NnKmZtdd0OhXYhpJvwoC7WLGrAEB+LQFph77cf1v2xSmY95BfHzRz3vX8+YUQRyuwsIse0opGRUp1kdZr2eO+TNk7PcRQJTFAAAAdKxmSYThRhrGI/WGgsTjDwWHh1LTrll49TJRC3mph2OJFdGDbcILW9qevWaQzA12AwAAAAIVaiyc+IcLxbPeujcSffRFOCms5hlJiTv4ljz11PyAOwg/cw6SgfblY8GQ6pwEfn+MlJko4ibs06UeXGLnqVmepTylcwtv226DzfPm0Qpgkh7j5q5zCzLu9LVyCMDfrIEnmjIJZtucRqGwDJ2GBOn6AAAABAPNp8y82DB6+pHDbww2JP3PYlfiP1b5+rqPdTUupcPeO7dPtKgXMJuSYQBbZDv6U5URXZVW5nH34nPjeqJe/hcrupRMQSfLv4KVoQW3z5EgaoXJmJiWHc4L8yNGU0nP9hNOg+RWgFRJyMxFH8nP7ffI7QSbp3dYSN66LolK9yoi"
      );

      const revealedMessages = messages.slice(0, 1);

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: bbsPublicKey,
        messages: revealedMessages,
        nonce: stringToBytes("NoWZhtX+u1wWLtUfPMmku1FtU2I="),
      };

      expect(verifyProof(request).verified).toBeTruthy();
    });

    it("should not verify with bad nonce", () => {
      const messages = [stringToBytes("KNK0ITRAF+NrGg==")];
      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pboZyjM38YgjaUBcjftZi5gb58Qz13XeRJpiuUHH06I7/1Eb8oVtIW5SGMNfKaqKhBAAAAAYPPztgxfWWw01/0SSug1oLfVuI4XUqhgyZ3rS6eTkOLjnyR3ObXb0XCD2Mfcxiv6w=="
      );
      const proof = base64Decode(
        "AAEBoyrn7FHZEDAfMBckBd9x4N1m5kpnjh/Oryw5XYkpqr7iqtSxYIqS7pmKAA/DjDt7lFkfu7oAYdKJlSD6WVGokHwtOW/EDkJXjrjQ4NVktiu0vfy0dEhy+CBhhcnwBQyfseuIeIuTZ1+2cAVaiOlzdc/K/yEKjSAQPqIOkmj9OaLLkfmljd5abf7dYMap0UugAAAAdKdyg+I6PbYt6HpcGCEX9KhVD0axbsNjch87YqUy3daNKsV5IQB3e3rKK5yR2sPpjgAAAAJvj/vM9cIsN/hZQEVpMwGVGAp39yWx0zsguRORUz2gXg8/IuO8e6l4L1ZZ7viCOgP9hYK9ZCeoMknyF4OhsuwpqF2pddX8+5FEuN2IDZTX+NFYmPnp/60HGLU4lmN2xS1XIWU5UzFAi6N6VQLyOQbKAAAAAlXEI+c6GIRznGyDVAj3UaukO+z2I3V/HsS9XQFrjwgPDphFi+XQwULUNGUzGins9XMU+m44a+SqiRu6tahdZFk="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: bbsPublicKey,
        messages,
        nonce: stringToBytes("bad"),
      };

      expect(verifyProof(request).verified).toBeFalsy();
    });

    it("should not verify with a message that wasn't signed", () => {
      // Expects messages to be ["Message1", "Message2", "Message3", "Message4"];
      const messages = [
        stringToBytes("BadMessage1"),
        stringToBytes("Message2"),
        stringToBytes("Message3"),
        stringToBytes("Message4"),
      ];
      const bbsPublicKey = base64Decode(
        "S+bRoSJJOet/8hKDpXFV+8TXzg0gPcD64lMFtIUzhYtMJAnNqfJRJnFIS0Vs2VC8AK6MBa6TYgILMqVv4RTSEl3H66mOF6jrEOHelKGlkJCNY8u3bI2aXrmqTkhnjxck"
      );
      const proof = base64Decode(
        "AAMBtYbI5XYKqYgFVgMdEovJHnlRl8lDQip5D8N6JD9YfLwUmGPaPRbRw8aR3QJHLhkWtALo0Msuiql9AaDMhkshRATUutehh842NnKmZtdd0OhXYhpJvwoC7WLGrAEB+LQFph77cf1v2xSmY95BfHzRz3vX8+YUQRyuwsIse0opGRUp1kdZr2eO+TNk7PcRQJTFAAAAdKxmSYThRhrGI/WGgsTjDwWHh1LTrll49TJRC3mph2OJFdGDbcILW9qevWaQzA12AwAAAAIVaiyc+IcLxbPeujcSffRFOCms5hlJiTv4ljz11PyAOwg/cw6SgfblY8GQ6pwEfn+MlJko4ibs06UeXGLnqVmepTylcwtv226DzfPm0Qpgkh7j5q5zCzLu9LVyCMDfrIEnmjIJZtucRqGwDJ2GBOn6AAAABAPNp8y82DB6+pHDbww2JP3PYlfiP1b5+rqPdTUupcPeO7dPtKgXMJuSYQBbZDv6U5URXZVW5nH34nPjeqJe/hcrupRMQSfLv4KVoQW3z5EgaoXJmJiWHc4L8yNGU0nP9hNOg+RWgFRJyMxFH8nP7ffI7QSbp3dYSN66LolK9yoi"
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: bbsPublicKey,
        messages,
        nonce: stringToBytes("0123456789"),
      };
      expect(verifyProof(request).verified).toBeFalsy();
    });
  });

  it("should not verify with revealed message that was supposed to be hidden", () => {
    const messages = [
      stringToBytes("Message1"),
      stringToBytes("Message2"),
      stringToBytes("Message3"),
      stringToBytes("Message4"),
    ];
    const signature = base64Decode(
      "j46NB7z6EBzD6q8bwBfzNYmjab3LPVoU7swcxO4qukq+qx0TrJhmo1TAW5UpDIFWSdb5kgWLAda2giwW4GImPTl8yWwIBJksnfT7zD8nonsvVaJh15/YrQ/n5KlknD4OtLTquji9RJK1U/xWzERHtA=="
    );
    const bbsPublicKey = base64Decode(
      "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbosOXSMyokWdxxfboF4VchlaYCp6XTOpMx4eyDYmBELxlb71I+QX1EGjnMnqAWZALAAAABKw+umnxXMNjIO3KXpByQV8QUtZdLanMRAho0zu8eUHbpCa8+v+Hlz+ziXN62rCmToaOrGXpFkFlUDFdw3gMUlYoWo40rF5sy4v8gci5xS1SHYnz3SAeUJ/wzT3RKEv3PbIxyz5fihZJFqz1XdL7KK2I8eNtnTU7L3xFrsFQ4YTkl2bQSS/cix8zYW3ane6WGIbfFUf4yFDsXmDT0THKKoly245B3nW/s5VfMDDaqWfsK4HThMgm9bOyeOuNultvNg=="
    );
    const nonce = stringToBytes("0123456789");

    const proofRequest: BbsCreateProofRequest = {
      signature,
      publicKey: bbsPublicKey,
      messages,
      revealed: [0],
      nonce,
    };
    const proof = createProof(proofRequest);

    let proofMessages = [stringToBytes("BadMessage9")];
    let request = {
      proof,
      publicKey: bbsPublicKey,
      messageCount: 4,
      messages: proofMessages,
      nonce,
      revealed: [0],
    };

    expect(verifyProof(request).verified).toBeFalsy();

    proofMessages = [stringToBytes("Message1")];
    request = {
      proof,
      publicKey: bbsPublicKey,
      messageCount: 4,
      messages: proofMessages,
      nonce,
      revealed: [0],
    };
    expect(verifyProof(request).verified).toBeTruthy();
  });

  describe("blsVerifyProof", () => {
    it("should verify proof with all messages revealed from single message signature", () => {
      const messages = [stringToBytes("KnYAbm0fw3mlUA==")];
      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const proof = base64Decode(
        "AAEBlxMcouHOZ6b8jB1yXFkF1sz8o0jlYfYvv4Vn8cqskc1fNn5fz0xdaolDVWLHnxN9tY7oYLy1M0/q6yvTqsQSYIZEu1lb2hGqlQ5iKg7J/rZxVZPIw13r7TN5gfURyVnRrZkOZXMVlmbgxhdROMeS0jVAThEjNd45lWtU9g66+dm++cfxsNH8S4Uvo7mMhW5eAAAAdLjPzHTAl3FDUhSRAYYD3Y9z5dEZ665A+VKEjYlo2FGWMnJQ8lUin6UmtEseOfgOQQAAAAJtzOCturB1W8AuPZi8EhmQUpS8D7+Eo8awBnz8ku7ismKM1DsKxdP11fXRpylhh6S0/Thrjt8Jz55Illt4vWq0shXQfTmIDa0JwXsvdVO2EBdw6uYa3EoAxGwzSox6XSus+ZbqFjTRDhHJoiS7eDcCAAAAAjH/+DldtUN8PaaWWRsJNcAtyCg7aQM12FLub3RfWMzzI8wHEti6hHliLym8zYc8tXpJJi+ySV/Xw5NeVzCgMaA="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: blsPublicKey,
        messages,
        nonce: stringToBytes("4OS3nji2HNReo3QPHrdlxjOf8gc="),
      };

      expect(blsVerifyProof(request).verified).toBeTruthy();
    });

    it("should verify proof with all messages revealed from multi message signature", () => {
      const messages = [
        stringToBytes("ODLpUKee6nyz7g=="),
        stringToBytes("v2zteJajIyIh5Q=="),
        stringToBytes("x64hA8TTn4gYXg=="),
      ];
      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const proof = base64Decode(
        "AAMHqjf96+kLYIsewyEX9d4fspX3bHKRjP1vrIEYBG75QN48Z2CrpYxCfhY5tdq21dwImZa0MkTKXQxJAvb6S/eECOTCXsEvc2P57OiUFsEGhSV3VUAFIX9d6bBOvCeKAwdRrUJycm/fU6cyw/NrJ3Ay1BTtCkLnOo9KbsktWUSSe6FsneTU4qtnn8c55vhLQjOgAAAAdLnn6KffV5sl//eRoYNt5MGBPdda/mgiovk8q3vsID7ZxlimMlQfHAgyimwcFUN1mwAAAAIQwtBPjUpLqDcyOJbpu0ELkh9/+MSeLIlBytwF4g1oIBnNI0r6PM5H+7gisAhDJZUOY4wSRzKWiitDU6QGU0cLgOH0klGdaE+U0Oh7urA3vUS+shOIrK0Q3XTZqpd+n3FlZWEOvLb/51ESohOjYC9PAAAAAhqFn9NbLK6xFMwdSL9SO4dSWhExnruoIJn602X/OSEOM8eU/bTWLbsnMENhGse4gDuP0QEMkhoCSF02SRor7Qo="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: blsPublicKey,
        messages,
        nonce: stringToBytes("ujMevaaq2n7Cg3ZLzXktqT/WRgM="),
      };

      expect(blsVerifyProof(request).verified).toBeTruthy();
    });

    it("should verify proof with one message revealed from multi-message signature", () => {
      const messages = [
        stringToBytes("8NhsJO/MKxO74A=="),
        stringToBytes("0noLBcl29ASJ2w=="),
        stringToBytes("eMPpY348vqGDNA=="),
      ];
      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const proof = base64Decode(
        "AAMBjl1W6j/1y/M3V4OIluw3BSTvgKCYRh+2SSeNNfDSZzKqNJAlQMGfHvBzpFQN55MZscHwEmMM6yWK2dqKGVhecvkwUvOIogpMFTbf3ikMor375ddSB3MAuHvgmlZKdLz7iwbxoCrf4+zfDvYeeLF6QR1uMdUa7v50ix2ZeSllsmOk5NxrEVMZXJ/+SDfASgTZAAAAdJeaUx4qwv5W72EKCDSBIYfxwlj28IGx0TnDm0E1y10n3hE0SIKYzgqqE81SPV9jfwAAAAIdssV4x73UeqxXmgQJSMO4XKDiiyxprlrpyz+1tINi7QbUABSCe4T1pdYOS0miYLDwzy2/zS2uuJ12yfqj6S1hl0U/uNbr03t8xypruPQhYreQGanMpFCnZquOJ9CYTGSPwMl1Hlva5hW0Jcrwugn1AAAABDLHtpcxsutFpn2EiPTYZMEeNnVr2x5AggpCAuLfd0+JBKEEwHKANSeajnWKBZ0YkZ/MpXkpU3ThRYWijpb6EsE4QJzkzSzKt5ZQCXsRkFLg/gWZIAUzKEjk3G2ELrFHlR9AedW1eANiHF/4ZuQPAtlRYg+mxeiEp87/xoLdq+OA"
      );

      const revealedMessages = messages.slice(0, 1);

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: blsPublicKey,
        messages: revealedMessages,
        nonce: stringToBytes("I03DvFXcpVdOPuOiyXgcBf4voAA="),
      };

      expect(blsVerifyProof(request).verified).toBeTruthy();
    });

    it("should not verify with bad nonce", () => {
      const messages = [stringToBytes("KnYAbm0fw3mlUA==")];
      const blsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pb"
      );
      const proof = base64Decode(
        "AAEBlxMcouHOZ6b8jB1yXFkF1sz8o0jlYfYvv4Vn8cqskc1fNn5fz0xdaolDVWLHnxN9tY7oYLy1M0/q6yvTqsQSYIZEu1lb2hGqlQ5iKg7J/rZxVZPIw13r7TN5gfURyVnRrZkOZXMVlmbgxhdROMeS0jVAThEjNd45lWtU9g66+dm++cfxsNH8S4Uvo7mMhW5eAAAAdLjPzHTAl3FDUhSRAYYD3Y9z5dEZ665A+VKEjYlo2FGWMnJQ8lUin6UmtEseOfgOQQAAAAJtzOCturB1W8AuPZi8EhmQUpS8D7+Eo8awBnz8ku7ismKM1DsKxdP11fXRpylhh6S0/Thrjt8Jz55Illt4vWq0shXQfTmIDa0JwXsvdVO2EBdw6uYa3EoAxGwzSox6XSus+ZbqFjTRDhHJoiS7eDcCAAAAAjH/+DldtUN8PaaWWRsJNcAtyCg7aQM12FLub3RfWMzzI8wHEti6hHliLym8zYc8tXpJJi+ySV/Xw5NeVzCgMaA="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: blsPublicKey,
        messages,
        nonce: stringToBytes("bad"),
      };

      expect(blsVerifyProof(request).verified).toBeFalsy();
    });
  });
});
