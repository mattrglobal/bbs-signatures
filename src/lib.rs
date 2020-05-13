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
    log("test key gen");
    JsValue::from_serde(&keypair).unwrap()
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    pub fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    pub fn log_many(a: &str, b: &str);
}


