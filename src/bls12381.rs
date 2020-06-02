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
use crate::BbsVerifyResponse;
use bbs::prelude::*;
use serde::{
    Deserialize, Serialize,
};
use std::convert::TryInto;
use wasm_bindgen::prelude::*;

wasm_impl!(
    /// Convenience struct for interfacing with JS.
    /// Option allows both of the keys to be JS::null
    /// or only one of them set.
    #[allow(non_snake_case)]
    #[derive(Debug, Deserialize, Serialize)]
    BlsKeyPair,
    publicKey: Option<DeterministicPublicKey>,
    secretKey: Option<SecretKey>
);

wasm_impl!(
    Bls12381ToBbsRequest,
    keyPair: BlsKeyPair,
    messageCount: usize
);

wasm_impl!(
    BbsKeyPair,
    publicKey: PublicKey,
    secretKey: Option<SecretKey>,
    messageCount: usize
);

wasm_impl!(
    BlsBbsSignRequest,
    keyPair: BlsKeyPair,
    messages: Vec<String>
);

wasm_impl!(
    BlsBbsVerifyRequest,
    publicKey: DeterministicPublicKey,
    signature: Signature,
    messages: Vec<String>
);

/// Generate a BLS 12-381 key pair.
///
/// * seed: UIntArray with 32 element
///
/// returned vector is the concatenation of first the private key (32 bytes)
/// followed by the public key (96) bytes.
#[wasm_bindgen(js_name = generateBls12381KeyPair)]
pub fn bls_generate_key(seed: Option<Vec<u8>>) -> JsValue {
    let (pk, sk) = DeterministicPublicKey::new(seed.map(|s| KeyGenOption::UseSeed(s)));
    let keypair = BlsKeyPair {
        publicKey: Some(pk),
        secretKey: Some(sk),
    };
    serde_wasm_bindgen::to_value(&keypair).unwrap()
}

/// Get the BBS public key associated with the private key
#[wasm_bindgen(js_name = bls12381toBbs)]
pub fn bls_to_bbs_key(request: JsValue) -> Result<JsValue, JsValue> {
    let request: Bls12381ToBbsRequest = request.try_into()?;
    let dpk = request
        .keyPair
        .publicKey
        .ok_or_else(|| JsValue::from("PublicKey is not specified"))?;
    let pk = dpk.to_public_key(request.messageCount)?;
    let key_pair = BbsKeyPair {
        publicKey: pk,
        secretKey: request.keyPair.secretKey,
        messageCount: request.messageCount,
    };

    Ok(serde_wasm_bindgen::to_value(&key_pair).unwrap())
}

/// Signs a set of messages with a BLS 12-381 key pair and produces a BBS signature
#[wasm_bindgen(js_name = blsSign)]
pub fn bls_sign(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BlsBbsSignRequest = request.try_into()?;
    let pk_res = request.keyPair.publicKey.unwrap().to_public_key(request.messages.len());
    let pk;
    match pk_res {
        Err(_) => return Err(JsValue::from_str("Failed to convert key")),
        Ok(p) => pk = p,
    };
    if request.keyPair.secretKey.is_none() {
        return Err(JsValue::from_str("Failed to sign"));
    }
    let messages: Vec<SignatureMessage> = request.messages.iter().map(|m| SignatureMessage::hash(m)).collect();
    match Signature::new(messages.as_slice(), &request.keyPair.secretKey.unwrap(), &pk) {
        Ok(sig) => Ok(serde_wasm_bindgen::to_value(&sig).unwrap()),
        Err(e) => Err(JsValue::from(&format!("{:?}", e))),
    }
}

/// Verifies a BBS+ signature for a set of messages with a with a BLS 12-381 public key
#[wasm_bindgen(js_name = blsVerify)]
pub fn bls_verify(request: JsValue) -> Result<JsValue, JsValue> {
    let res = request.try_into();
    let result: BlsBbsVerifyRequest;
    match res {
        Ok(r) => result = r,
        Err(e) => return Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse {
            verified: false,
            error: Some(format!("{:?}", e))
        }).unwrap())
    };
    if result.messages.is_empty() {
        return Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse {
            verified: false,
            error: Some("Messages cannot be empty".to_string())
        }).unwrap());
    }
    let pk = result.publicKey.to_public_key(result.messages.len())?;
    let messages: Vec<SignatureMessage> = result.messages.iter().map(|m| SignatureMessage::hash(m)).collect();
    match result.signature.verify(messages.as_slice(), &pk) {
        Err(e) => Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse {
            verified: false,
            error: Some(format!("{:?}", e))
        }).unwrap()),
        Ok(b) => Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse {
            verified: b,
            error: None
        }).unwrap())
    }
}