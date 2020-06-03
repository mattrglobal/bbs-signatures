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
 * A context to create a blind BBS signature
 */
export interface BbsBlindSignContext {
  /**
   * The resulting commitment of the blinded messages to sign
   */
  readonly commitment: Uint8Array;
  /**
   * The proof of hidden messages to be verified by the signer
   */
  readonly proofOfHiddenMessages: Uint8Array;
  /**
   * Fiat-Shamir challenge
   */
  readonly challengeHash: Uint8Array;
  /**
   * The signature blinding factor
   */
  readonly blindingFactor: Uint8Array;
}
