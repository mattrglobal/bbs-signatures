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
use bbs::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use std::convert::{TryFrom, TryInto};

wasm_impl!(
    /// Convenience struct for interfacing with JS.
    /// Option allows both of the keys to be JS::null
    /// or only one of them set.
    #[allow(non_snake_case)]
    #[derive(Debug, Deserialize, Serialize)]
    KeyPair,
    publicKey: DeterministicPublicKey,
    secretKey: SecretKey
);

wasm_impl!(
    #[allow(non_snake_case)]
    #[derive(Debug, Deserialize, Serialize)]
    Bls12381ToBbsRequest,
    key: Vec<u8>,
    messageCount: usize
);

/// Generate a BLS 12-381 key pair.
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the concatenation of first the private key (32 bytes)
/// followed by the public key (96) bytes.
#[wasm_bindgen]
pub fn bls_generate_key(seed: Option<Vec<u8>>) -> JsValue {
    let (pk, sk) = DeterministicPublicKey::new(seed.map(|s| KeyGenOption::UseSeed(s)));
    let keypair = KeyPair {
        publicKey: pk,
        secretKey: sk,
    };
    serde_wasm_bindgen::to_value(&keypair).unwrap()
}

/// Get the BBS public key associated with the private key
#[wasm_bindgen]
pub fn bls_secret_key_to_bbs_key(request: JsValue) -> Result<JsValue, JsValue> {
    let request: Bls12381ToBbsRequest = request.try_into()?;
    let secret_key = SecretKey::try_from(request.key)?;
    let (dpk, _) = DeterministicPublicKey::new(Some(KeyGenOption::FromSecretKey(secret_key)));
    let pk = dpk.to_public_key(request.messageCount)?;
    Ok(serde_wasm_bindgen::to_value(&pk).unwrap())
}

/// Get the BBS public key associated with the public key
#[wasm_bindgen]
pub fn bls_public_key_to_bbs_key(request: JsValue) -> Result<JsValue, JsValue> {
    let request: Bls12381ToBbsRequest = request.try_into()?;
    let dpk = DeterministicPublicKey::try_from(request.key)?;
    let pk = dpk.to_public_key(request.messageCount)?;
    Ok(serde_wasm_bindgen::to_value(&pk).unwrap())
}
