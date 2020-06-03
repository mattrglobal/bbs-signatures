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

/* eslint-disable @typescript-eslint/camelcase */
import { benchmark, report } from "@stablelib/benchmark";
import {
  sign,
  verify,
  createProof,
  verifyProof,
  blsCreateProof,
  blsVerify,
  blsSign,
  blsVerifyProof,
  generateBls12381KeyPair,
  bls12381toBbs,
} from "../lib";
import { generateBbsSignRequest, generateBlsSignRequest } from "./helper";

const nonce = "mynonce";

report(
  "BLS 12-381 Key Generation",
  benchmark(() => generateBls12381KeyPair())
);

// main benchmark routine
const runBbsBenchmark = (
  numberOfMessages: number,
  messageSizeInBytes: number,
  numberRevealed: number
): void => {
  const blsKeyPair = generateBls12381KeyPair();
  const bbsKeyPair = bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: numberOfMessages,
  });
  const messageSignRequest = generateBbsSignRequest(
    bbsKeyPair,
    numberOfMessages,
    messageSizeInBytes
  );
  const messageSignature = sign(messageSignRequest);
  const messageVerifyRequest = {
    signature: messageSignature,
    publicKey: bbsKeyPair.publicKey,
    messages: messageSignRequest.messages,
  };

  report(
    `BBS Sign ${numberOfMessages}, ${messageSizeInBytes} byte message(s)`,
    benchmark(() => sign(messageSignRequest))
  );

  report(
    `BBS Verify ${numberOfMessages}, ${messageSizeInBytes} byte message(s)`,
    benchmark(() => verify(messageVerifyRequest))
  );

  const revealedNumbers = [...Array(numberRevealed).keys()];

  const CreateProofRequest = {
    signature: messageSignature,
    publicKey: bbsKeyPair.publicKey,
    messages: messageSignRequest.messages,
    revealed: revealedNumbers,
    nonce,
  };

  const MessageProof = createProof(CreateProofRequest);

  const VerifyProofRequest = {
    proof: MessageProof,
    publicKey: bbsKeyPair.publicKey,
    messages: messageSignRequest.messages.slice(0, numberRevealed),
    revealed: revealedNumbers,
    messageCount: messageSignRequest.messages.length,
    nonce,
  };

  report(
    `BBS Create Proof ${numberOfMessages}, ${messageSizeInBytes} byte message(s), revealing ${numberRevealed} message(s).`,
    benchmark(() => createProof(CreateProofRequest))
  );

  report(
    `BBS Verify Proof ${numberOfMessages}, ${messageSizeInBytes} byte message(s), revealing ${numberRevealed} message(s).`,
    benchmark(() => verifyProof(VerifyProofRequest))
  );
};

// main benchmark routine
const runBlsBenchmark = (
  numberOfMessages: number,
  messageSizeInBytes: number,
  numberRevealed: number
): void => {
  const blsKeyPair = generateBls12381KeyPair();
  const MessageSignRequest = generateBlsSignRequest(
    blsKeyPair,
    numberOfMessages,
    messageSizeInBytes
  );
  const MessageSignature = blsSign(MessageSignRequest);
  const MessageVerifyRequest = {
    signature: MessageSignature,
    publicKey: blsKeyPair.publicKey,
    messages: MessageSignRequest.messages,
  };

  report(
    `BLStoBBS then sign ${numberOfMessages}, ${messageSizeInBytes} byte message(s)`,
    benchmark(() => blsSign(MessageSignRequest))
  );

  report(
    `BLStoBBS then verify ${numberOfMessages}, ${messageSizeInBytes} byte message(s)`,
    benchmark(() => blsVerify(MessageVerifyRequest))
  );

  const revealedNumbers = [...Array(numberRevealed).keys()];

  const CreateProofRequest = {
    signature: MessageSignature,
    publicKey: blsKeyPair.publicKey,
    messages: MessageSignRequest.messages,
    revealed: revealedNumbers,
    nonce,
  };

  const MessageProof = blsCreateProof(CreateProofRequest);

  const VerifyProofRequest = {
    proof: MessageProof,
    publicKey: blsKeyPair.publicKey,
    messages: MessageSignRequest.messages.slice(0, numberRevealed),
    revealed: revealedNumbers,
    messageCount: MessageSignRequest.messages.length,
    nonce,
  };

  report(
    `BLStoBBS then create proof ${numberOfMessages}, ${messageSizeInBytes} byte message(s), revealing ${numberRevealed} message(s).`,
    benchmark(() => blsCreateProof(CreateProofRequest))
  );

  report(
    `BLStoBBS then verify proof ${numberOfMessages}, ${messageSizeInBytes} byte message(s), revealing ${numberRevealed} message(s).`,
    benchmark(() => blsVerifyProof(VerifyProofRequest))
  );
};

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 1, 100 byte message ------------------------------
runBbsBenchmark(1, 100, 1);
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 1, 1000 byte message ------------------------------
runBbsBenchmark(1, 1000, 1);
// ----------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 10, 100 byte messages ------------------------------
runBbsBenchmark(10, 100, 1);
// -----------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 10, 1000 byte messages ------------------------------
runBbsBenchmark(10, 1000, 1);
// ------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 100 byte messages ------------------------------
runBbsBenchmark(100, 100, 1);
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 1000 byte messages ------------------------------
runBbsBenchmark(100, 1000, 1);
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 100 byte messages ------------------------------
runBbsBenchmark(100, 100, 50);
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 1000 byte messages ------------------------------
runBbsBenchmark(100, 1000, 60);
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 1, 100 byte message ------------------------------
runBlsBenchmark(1, 100, 1);
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 1, 1000 byte message ------------------------------
runBlsBenchmark(1, 1000, 1);
// ----------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 10, 100 byte messages ------------------------------
runBlsBenchmark(10, 100, 1);
// -----------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 10, 1000 byte messages ------------------------------
runBlsBenchmark(10, 1000, 1);
// ------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 100 byte messages ------------------------------
runBlsBenchmark(100, 100, 1);
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 1000 byte messages ------------------------------
runBlsBenchmark(100, 1000, 1);
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 100 byte messages ------------------------------
runBlsBenchmark(100, 100, 50);
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------ Sign/Verify/CreateProof/VerifyProof 100, 1000 byte messages ------------------------------
runBlsBenchmark(100, 1000, 60);
// -------------------------------------------------------------------------------------------------------------------------
