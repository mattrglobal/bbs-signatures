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

wasm_object_impl!(
    /// Convenience struct for interfacing with JS.
    /// Option allows both of the keys to be JS::null
    /// or only one of them set.
    #[allow(non_snake_case)]
    #[wasm_bindgen]
    #[derive(Debug, Deserialize, Serialize)]
    KeyPair,
    publicKey: Option<DeterministicPublicKey>,
    secretKey: Option<SecretKey>
);

wasm_object_impl!(Bls12381ToBbsRequest, keyPair: KeyPair, messageCount: usize);

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
        publicKey: Some(pk),
        secretKey: Some(sk),
    };
    JsValue::from_serde(&keypair).unwrap()
}

/// Get the BBS public key associated with the private key
#[wasm_bindgen]
pub fn bls_secret_key_to_bbs_key(request: Bls12381ToBbsRequest) -> JsValue {
    if request.keyPair.secretKey.is_none() {
        return JsValue::from("SecretKey cannot be empty");
    }

    let (dpk, _) = DeterministicPublicKey::new(
        request
            .keyPair
            .secretKey
            .map(|s| KeyGenOption::FromSecretKey(s)),
    );
    let res = match dpk.to_public_key(request.messageCount) {
        Ok(pk) => JsValue::from_serde(&pk).unwrap(),
        Err(e) => JsValue::from(&format!("{:?}", e)),
    };
    res
}

/// Get the BBS public key associated with the public key
#[wasm_bindgen]
pub fn bls_public_key_to_bbs_key(request: Bls12381ToBbsRequest) -> JsValue {
    if request.keyPair.publicKey.is_none() {
        return JsValue::from("PublicKey cannot be empty");
    }
    let res = match request
        .keyPair
        .publicKey
        .unwrap()
        .to_public_key(request.messageCount)
    {
        Ok(pk) => JsValue::from_serde(&pk).unwrap(),
        Err(e) => JsValue::from(&format!("{:?}", e)),
    };
    res
}
