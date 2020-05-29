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
  BbsCreateProofRequest,
  createProof,
} from "../../lib";
import { Coder } from "@stablelib/base64";

const base64Decode = (string: string): Uint8Array => {
  const coder = new Coder();
  return coder.decode(string);
};

describe("bbsSignature", () => {
  describe("verifyProof", () => {
    it("should verify proof with all messages revealed from single message signature", () => {
      const messages = ["KNK0ITRAF+NrGg=="];
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
        nonce: "v3bb/Mz+JajUdiM2URfZYcPuqxw=",
      };

      expect(verifyProof(request).verified).toBeTruthy();
    });

    it("should verify proof with all messages revealed from multi message signature", () => {
      const messages = [
        "BVB6lAn912sz9Q==",
        "b45VqRkIo5R5Zw==",
        "yPqox0TIKS6vCA==",
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
        nonce: "dVPpzuQtJVAZzAw73beWiXLtoT4=",
      };

      expect(verifyProof(request).verified).toBeTruthy();
    });

    it("should verify proof with one message revealed from multi-message signature", () => {
      const messages = [
        "+FxEv3VLcNZ8sA==",
        "eI2RcRExnbP8hw==",
        "wll4zckqWAb0Kg==",
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
        nonce: "NoWZhtX+u1wWLtUfPMmku1FtU2I=",
      };

      expect(verifyProof(request).verified).toBeTruthy();
    });

    it("should not verify with bad nonce", () => {
      const messages = ["KNK0ITRAF+NrGg=="];
      const bbsPublicKey = base64Decode(
        "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pboZyjM38YgjaUBcjftZi5gb58Qz13XeRJpiuUHH06I7/1Eb8oVtIW5SGMNfKaqKhBAAAAAYPPztgxfWWw01/0SSug1oLfVuI4XUqhgyZ3rS6eTkOLjnyR3ObXb0XCD2Mfcxiv6w=="
      );
      const proof = base64Decode(
        "pIeLfsSfc1OiVl+pl/JhNuUCU4QgxbWrh65HGF3E+O/RvlZbWxXwQaFlT6FNZjpQqxbiTRy11m4eU4IUyjLUVbJM37Q0WNAHi8ZtHgRzet4WvXAceUAd/uMTMAXkYYcKtejUTHHNznH4lXDfvX0Cwhd9K0jNKtOoH6/cU2UoWs3xXmIU8VzAlK2D5USD0XugAAAAdJVWlU2ZGa5oqSfBbW9r4d2nS/iF/0mC47gK5vAprhIA7cZg2g+a4WvgkGa7O9rr/gAAAAJmNzGETKIxJgvAECZDbURQzj+ty9MXZjja8m1tuy8DCEzM7hSK8BLL63mvSfiPYwuzSPrTAGNHVx2o2+OqXLZyt0ZAl+ObXg7lo5wOtjBrhvh/duOon2bkr+H3lSg9KGsjy4K9Eg8CkHnbKQnJ3R21AAAAAg1ueBGiTp1ucUqlD62vuEiBmR01q16EkdjLB4TYPfBcZ0GeQ3P7t+3ar0k+CZcoVyLktXjwmtsLxcjntzbHyN0="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: bbsPublicKey,
        messages,
        nonce: "bad",
      };

      expect(verifyProof(request).verified).toBeFalsy();
    });

    it("should not verify with a message that wasn't signed", () => {
      // Expects messages to be ["Message1", "Message2", "Message3", "Message4"];
      const messages = ["BadMessage1", "Message2", "Message3", "Message4"];
      const bbsPublicKey = base64Decode(
        "S+bRoSJJOet/8hKDpXFV+8TXzg0gPcD64lMFtIUzhYtMJAnNqfJRJnFIS0Vs2VC8AK6MBa6TYgILMqVv4RTSEl3H66mOF6jrEOHelKGlkJCNY8u3bI2aXrmqTkhnjxck"
      );
      const proof = base64Decode(
        "hB0FDeTQc5KEm00wG5HNRvCJ6uoA9flPeTv08PGQct5URoP+mxn6K4hmgRFUMPDZGGspwrc4fCs5SDF+O0nbSyHNLRemj8IMsoruTqhLWrqDWxDhdDDoPYZ4uYoOGIuTBoJqxkv9uFjDRiRnINGvcIJ+QV2iwzwesAHcFmQnxOu/UBEm4XMCDiU93HABZn1uAAAAdJbRgZKb314nZ/PcSUH79GQacq9OAtiOfrCxyaVL5Nt8wXmoY0ri9cBF3XzrySjY7QAAAAIfsXyZmQFTmcislP+mYAk+9nl3V7hTQnc6VIz1Vzayyyses57/fYftogle+iFyMP9kfMujXAf0AOx268LFfZnuA4+PYfY+mH1l/ieGMkvaTFRrfi+sfxFX14wCTH8Qy7Z4+DjTUIPIBGwqCMiBWZ3ZAAAABUtLeqN3HfQNyXQNf7A5MKx00tYvssxatlylAv+lmU2cD2ke0dY7hltzXgGFJ8LjtPIe6uMlZdmdu6+l/0IHK4RGYhEYGwZ4NHu6mlydV/7XiFpJKd9vtmfGBYXU6nXHkxGZ3I0D3FfFFA30B/UFBYqGZ7EKFIObMmvmcQWbTFkkHYAlabXh2RAVSlTmNL+NrIu1LbLW0CBExF4f+H8kZmM="
      );

      const request: BbsVerifyProofRequest = {
        proof,
        publicKey: bbsPublicKey,
        messages,
        nonce: "0123456789",
      };
      expect(verifyProof(request).verified).toBeFalsy();
    });
  });

  it("should not verify with revealed message that was supposed to be hidden", () => {
    const messages = ["Message1", "Message2", "Message3", "Message4"];
    const signature = base64Decode(
      "j46NB7z6EBzD6q8bwBfzNYmjab3LPVoU7swcxO4qukq+qx0TrJhmo1TAW5UpDIFWSdb5kgWLAda2giwW4GImPTl8yWwIBJksnfT7zD8nonsvVaJh15/YrQ/n5KlknD4OtLTquji9RJK1U/xWzERHtA=="
    );
    const bbsPublicKey = base64Decode(
      "qJgttTOthlZHltz+c0PE07hx3worb/cy7QY5iwRegQ9BfwvGahdqCO9Q9xuOnF5nD/Tq6t8zm9z26EAFCiaEJnL5b50D1cHDgNxBUPEEae+4bUb3JRsHaxBdZWDOo3pbosOXSMyokWdxxfboF4VchlaYCp6XTOpMx4eyDYmBELxlb71I+QX1EGjnMnqAWZALAAAABKw+umnxXMNjIO3KXpByQV8QUtZdLanMRAho0zu8eUHbpCa8+v+Hlz+ziXN62rCmToaOrGXpFkFlUDFdw3gMUlYoWo40rF5sy4v8gci5xS1SHYnz3SAeUJ/wzT3RKEv3PbIxyz5fihZJFqz1XdL7KK2I8eNtnTU7L3xFrsFQ4YTkl2bQSS/cix8zYW3ane6WGIbfFUf4yFDsXmDT0THKKoly245B3nW/s5VfMDDaqWfsK4HThMgm9bOyeOuNultvNg=="
    );
    const nonce = "0123456789";

    const proofRequest: BbsCreateProofRequest = {
      signature,
      publicKey: bbsPublicKey,
      messages,
      revealed: [0],
      nonce,
    };
    const proof = createProof(proofRequest);

    let proofMessages = ["BadMessage9"];
    let request = {
      proof,
      publicKey: bbsPublicKey,
      messageCount: 4,
      messages: proofMessages,
      nonce,
      revealed: [0],
    };

    expect(verifyProof(request).verified).toBeFalsy();

    proofMessages = ["Message1"];
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
});
