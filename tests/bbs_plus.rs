//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]
extern crate wasm_bindgen_test;
use bbs::prelude::*;
use wasm::log;
use std::{
    collections::{BTreeMap, BTreeSet},
    convert::{TryFrom, TryInto},
};
use wasm::prelude::*;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[allow(non_snake_case)]
#[wasm_bindgen_test]
pub fn bbs_sign_tests() {
    let (pk, sk) = generate(1).unwrap();
    let messages = vec!["Message1".to_string()];
    let request = BbsSignRequest{
        keyPair: BbsKeyPair {
            publicKey: pk,
            secretKey: Some(sk)
        },
        messages
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();
    let s_res = bbs_sign(js_value);
    assert!(s_res.is_ok());
    let s = s_res.unwrap();
    assert!(s.is_object());
    let sig_res = serde_wasm_bindgen::from_value::<Vec<u8>>(s);
    assert!(sig_res.is_ok());

    let (pk, sk) = generate(5).unwrap();
    let messages = vec![
        "Message1".to_string(),
        "Message2".to_string(),
        "Message3".to_string(),
        "Message4".to_string(),
        "Message5".to_string(),
    ];
    let request = BbsSignRequest {
        keyPair: BbsKeyPair {
            publicKey: pk,
            secretKey: Some(sk)
        },
        messages
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();
    let s_res = bbs_sign(js_value);
    assert!(s_res.is_ok());
    let s = s_res.unwrap();
    assert!(s.is_object());
    let sig_res = serde_wasm_bindgen::from_value::<Vec<u8>>(s);
    assert!(sig_res.is_ok());
}

#[allow(non_snake_case)]
#[wasm_bindgen_test]
pub fn bbs_verify_tests() {
    let (pk, sk) = generate(1).unwrap();
    let messages = vec![SignatureMessage::hash(b"Message1")];
    let signature = Signature::new(messages.as_slice(), &sk, &pk).unwrap();
    let request = BbsVerifyRequest {
        publicKey: pk.clone(),
        signature: signature.clone(),
        messages: vec!["Message1".to_string()]
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();

    let result = bbs_verify(js_value);
    assert!(result.is_ok());
    let result = result.unwrap();
    assert!(result.is_truthy());
    let request = BbsVerifyRequest {
        publicKey: pk,
        signature,
        messages: vec!["BadMessage".to_string()]
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();
    let result = bbs_verify(js_value);
    assert!(result.is_ok());
    let result = result.unwrap();
    assert!(result.is_falsy());
}

#[allow(non_snake_case)]
#[wasm_bindgen_test]
pub fn bbs_blind_sign_tests() {
    let (pk, sk) = generate(3).unwrap();
    let messages = vec!["Message1".to_string()];
    let request = BlindSignatureContextRequest {
            publicKey: pk.clone(),
            messages,
            blinded: vec![0],
            nonce: "dummy nonce".to_string()
        };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();
    let result = bbs_blind_signature_commitment(js_value);
    assert!(result.is_ok());
    let result: BlindSignatureContextResponse = result.unwrap().try_into().unwrap();

    let mut blinded = BTreeSet::new();
    blinded.insert(0);
    let request = BlindSignatureVerifyContextRequest {
        commitment: result.commitment.clone(),
        proofOfHiddenMessages: result.proofOfHiddenMessages.clone(),
        challengeHash: result.challengeHash.clone(),
        publicKey: pk.clone(),
        blinded: blinded.clone(),
        nonce: "dummy nonce".to_string(),
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();

    let res = bbs_verify_blind_signature_proof(js_value);
    assert!(res.is_ok());
    let res = res.unwrap();
    assert!(res.is_truthy());

    let request = BlindSignatureVerifyContextRequest {
        commitment: result.commitment.clone(),
        proofOfHiddenMessages: result.proofOfHiddenMessages.clone(),
        challengeHash: result.challengeHash.clone(),
        publicKey: pk.clone(),
        blinded: blinded.clone(),
        nonce: "bad nonce".to_string()
    };
    let js_value = serde_wasm_bindgen::to_value(&request).unwrap();

    let res = bbs_verify_blind_signature_proof(js_value);
    assert!(res.is_ok());
    let res = res.unwrap();
    assert!(res.is_falsy());
}
