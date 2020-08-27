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

/**
 * A request to create a BBS signature that features blinded/commited messages
 */
export interface BbsBlindSignRequest {
  /**
   * The resulting commitment of the blinded messages to sign
   */
  readonly commitment: Uint8Array;
  /**
   * The secret key of the signer
   */
  readonly secretKey: Uint8Array;
  /**
   * The known messages to sign
   */
  readonly messages: readonly Uint8Array[];
}
