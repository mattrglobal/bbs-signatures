//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;
use wasm_bbs_signatures::prelude::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[allow(non_snake_case)]
#[wasm_bindgen_test]
fn bls_generate_key_test() {
    let key = bls_generate_key(None);

    assert!(key.is_object());
    let obj = js_sys::Object::try_from(&key);
    assert!(obj.is_some());
    let obj = obj.unwrap();
    let entries = js_sys::Object::entries(&obj).to_vec();
    assert_eq!(entries.len(), 2);
    let keys = js_sys::Object::keys(&obj);
    let values = js_sys::Object::values(&obj);
    assert_eq!(keys.get(0), "publicKey");
    assert_eq!(keys.get(1), "secretKey");
    let publicKey = js_sys::Array::from(&values.get(0));
    let secretKey = js_sys::Array::from(&values.get(1));
    assert_eq!(publicKey.length(), 96);
    assert_eq!(secretKey.length(), 32);
}