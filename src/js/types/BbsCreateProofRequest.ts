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
 * A request to create a BBS proof from a supplied BBS signature
 */
export interface BbsCreateProofRequest {
  /**
   * BBS signature to generate the BBS proof from
   */
  readonly signature: Uint8Array;
  /**
   * Public key of the original signer of the signature
   */
  readonly publicKey: Uint8Array;
  /**
   * The messages that were originally signed
   */
  readonly messages: readonly Uint8Array[];
  /**
   * The zero based indicies of which messages to reveal
   */
  readonly revealed: readonly number[];
  /**
   * A nonce for the resulting proof
   */
  readonly nonce: Uint8Array;
}
