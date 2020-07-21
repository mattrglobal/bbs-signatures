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

import { Coder } from "@stablelib/base64";

/**
 * Encodes a Uint8Array to a base64 string
 * @param bytes Input Uin8Array
 */
export const base64Encode = (bytes: Uint8Array): string => {
  const coder = new Coder();
  return coder.encode(bytes);
};
/**
 * Decodes a base64 string to a Uint8Array
 * @param bytes Input base64 string
 */

export const base64Decode = (string: string): Uint8Array => {
  const coder = new Coder();
  return coder.decode(string);
};

/**
 * Converts a UTF-8 Encoded string to a byte array
 * @param string
 */
export const stringToBytes = (string: string): Uint8Array =>
  Uint8Array.from(Buffer.from(string, "utf-8"));
