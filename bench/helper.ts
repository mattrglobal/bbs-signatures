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
  BbsSignRequest,
  BbsKeyPair,
  BlsKeyPair,
  BlsBbsSignRequest,
} from "../lib";
import { randomBytes } from "crypto";
import { Coder } from "@stablelib/base64";

export const generateMessages = (
  numberOfMessages: number,
  messageSizeInBytes: number
): Uint8Array[] => {
  const coder = new Coder();
  const messages: Uint8Array[] = [];
  for (let i = 0; i < numberOfMessages; i++) {
    messages[i] = randomBytes(messageSizeInBytes);
  }
  return messages;
};

export const generateBbsSignRequest = (
  keyPair: BbsKeyPair,
  numberOfMessages: number,
  messageSizeInBytes: number
): BbsSignRequest => {
  return {
    keyPair,
    messages: generateMessages(numberOfMessages, messageSizeInBytes),
  };
};

export const generateBlsSignRequest = (
  keyPair: BlsKeyPair,
  numberOfMessages: number,
  messageSizeInBytes: number
): BlsBbsSignRequest => {
  return {
    keyPair,
    messages: generateMessages(numberOfMessages, messageSizeInBytes),
  };
};
