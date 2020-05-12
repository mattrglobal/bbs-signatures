use bbs::prelude::*;
use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct KeyPair {
    publicKey: Option<DeterministicPublicKey>,
    secretKey: Option<SecretKey>
}

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
        secretKey: Some(sk)
    };
    JsValue::from_serde(&keypair).unwrap()
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct Bls12381ToBbsRequest {
    keyPair: KeyPair,
    messageCount: usize
}

#[wasm_bindgen]
pub fn bls_secret_key_to_bbs_key(request: Bls12381ToBbsRequest) -> JsValue {
    if request.keyPair.secretKey.is_none() {
        return JsValue::from("SecretKey cannot be empty");
    }

    let (dpk, _) = DeterministicPublicKey::new(request.keyPair.secretKey.map(|s| KeyGenOption::FromSecretKey(s)));
    let res = match dpk.to_public_key(request.messageCount) {
        Ok(pk) => JsValue::from_serde(&pk).unwrap(),
        Err(e) => JsValue::from(&format!("{:?}", e))
    };
    res
}

#[wasm_bindgen]
pub fn bls_public_key_to_bbs_key(request: Bls12381ToBbsRequest) -> JsValue {
    if request.keyPair.publicKey.is_none() {
        return JsValue::from("PublicKey cannot be empty");
    }
    let res = match request.keyPair.publicKey.unwrap().to_public_key(request.messageCount) {
        Ok(pk) => JsValue::from_serde(&pk).unwrap(),
        Err(e) => JsValue::from(&format!("{:?}", e))
    };
    res
}
