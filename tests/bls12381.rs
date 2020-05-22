//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]
extern crate wasm_bindgen_test;
use bbs::prelude::*;
use wasm::prelude::*;
// use wasm::log;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[allow(non_snake_case)]
#[wasm_bindgen_test]
fn bls_public_key_to_bbs_key_test() {
    let (dpk, _) = DeterministicPublicKey::new(None);
    let request = Bls12381ToBbsRequest {
        keyPair: BlsKeyPair {
            publicKey: Some(dpk),
            secretKey: None,
        },
        messageCount: 5,
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();
    let bbs_res = bls_public_key_to_bbs_key(js_value);
    assert!(bbs_res.is_ok());
    let bbs = bbs_res.unwrap();
    assert!(bbs.is_object());
    let public_key_res = serde_wasm_bindgen::from_value::<BbsKeyPair>(bbs);
    assert!(public_key_res.is_ok());
    let bbsKeyPair = public_key_res.unwrap();
    assert_eq!(bbsKeyPair.publicKey.to_bytes_compressed_form().len(), 388);
}

#[allow(non_snake_case)]
#[wasm_bindgen_test]
fn bls_secret_key_to_bbs_key_test() {
    let (_, sk) = DeterministicPublicKey::new(None);
    let request = Bls12381ToBbsRequest {
        keyPair: BlsKeyPair {
            publicKey: None,
            secretKey: Some(sk)
        },
        messageCount: 5
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();
    let bbs_res = bls_secret_key_to_bbs_key(js_value);
    assert!(bbs_res.is_ok());
    let bbs = bbs_res.unwrap();
    assert!(bbs.is_object());
    let public_key_res = serde_wasm_bindgen::from_value::<BbsKeyPair>(bbs);
    assert!(public_key_res.is_ok());
    let pk_bytes = public_key_res.unwrap();
    assert_eq!(pk_bytes.publicKey.to_bytes_compressed_form().len(), 388);
}

#[allow(non_snake_case)]
#[wasm_bindgen_test]
fn bls_generate_key_from_seed_test() {
    let key = bls_generate_key(Some(vec![0u8; 16]));

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
    let public_key_res = serde_wasm_bindgen::from_value::<Vec<u8>>(values.get(0));
    let secret_key_res = serde_wasm_bindgen::from_value::<Vec<u8>>(values.get(1));
    assert!(public_key_res.is_ok());
    assert!(secret_key_res.is_ok());
    let public_key = public_key_res.unwrap();
    let secret_key = secret_key_res.unwrap();
    assert_eq!(public_key.len(), 96);
    assert_eq!(
        public_key,
        vec![
            149, 24, 232, 64, 238, 67, 137, 51, 92, 227, 233, 238, 58, 35, 223, 100, 195, 189, 17,
            242, 44, 153, 122, 144, 111, 191, 114, 124, 139, 70, 100, 94, 44, 208, 180, 7, 166,
            249, 39, 2, 13, 122, 33, 79, 243, 88, 21, 131, 22, 190, 29, 71, 249, 100, 255, 84, 14,
            119, 216, 41, 28, 16, 141, 143, 252, 125, 76, 186, 53, 50, 194, 103, 53, 66, 249, 172,
            78, 75, 126, 29, 72, 215, 10, 15, 221, 120, 205, 169, 86, 111, 74, 240, 31, 87, 160,
            155
        ]
    );
    assert_eq!(secret_key.len(), 32);
    assert_eq!(
        secret_key,
        vec![
            79, 39, 150, 177, 236, 152, 132, 139, 85, 146, 82, 139, 146, 192, 245, 41, 220, 2, 193,
            129, 84, 175, 137, 116, 174, 202, 242, 90, 167, 29, 75, 1
        ]
    );
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
