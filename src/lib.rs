mod utils;

use bbs::prelude::*;
use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-bbs-signatures!");
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct KeyPair {
    publicKey: Option<DeterministicPublicKey>,
    secretKey: Option<SecretKey>
}

#[wasm_bindgen]
pub fn bls_generate_key() -> JsValue {
	let (pk, sk) = DeterministicPublicKey::new(None);
    let keypair = KeyPair {
        publicKey: Some(pk),
        secretKey: Some(sk)
    };
    JsValue::from_serde(&keypair).unwrap()
}


