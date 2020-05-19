//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]
extern crate wasm_bindgen_test;
use bbs::prelude::*;
use std::collections::{BTreeMap, BTreeSet};
use std::convert::TryFrom;
use wasm::log;
use wasm::prelude::*;
use wasm_bindgen::JsValue;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[allow(non_snake_case)]
#[wasm_bindgen_test]
pub fn bbs_sign_tests() {
    let (pk, sk) = generate(1).unwrap();
    let messages = vec!["Message1".to_string()];
    let request = BbsSignRequest::new(pk, sk, messages);
    let s = bbs_sign(request);
    assert!(s.is_object());
    let sig_res = JsValue::into_serde::<Vec<u8>>(&s);
    assert!(sig_res.is_ok());

    let (pk, sk) = generate(5).unwrap();
    let messages = vec![
        "Message1".to_string(),
        "Message2".to_string(),
        "Message3".to_string(),
        "Message4".to_string(),
        "Message5".to_string(),
    ];
    let request = BbsSignRequest::new(pk, sk, messages);
    let s = bbs_sign(request);
    assert!(s.is_object());
    let sig_res = JsValue::into_serde::<Vec<u8>>(&s);
    assert!(sig_res.is_ok());
}

#[allow(non_snake_case)]
#[wasm_bindgen_test]
pub fn bbs_verify_tests() {
    let (pk, sk) = generate(1).unwrap();
    let messages = vec![SignatureMessage::hash(b"Message1")];
    let signature = Signature::new(messages.as_slice(), &sk, &pk).unwrap();
    let request =
        BbsVerifyRequest::new(pk.clone(), signature.clone(), vec!["Message1".to_string()]);
    let result = bbs_verify(request);
    assert!(result.is_truthy());
    let request = BbsVerifyRequest::new(pk, signature, vec!["BadMessage".to_string()]);
    let result = bbs_verify(request);
    assert!(result.is_falsy());
}

#[allow(non_snake_case)]
#[wasm_bindgen_test]
pub fn bbs_blind_sign_tests() {
    let (pk, sk) = generate(3).unwrap();
    let messages = vec!["Message1".to_string()];
    let request =
        BlindSignatureContextRequest::new(pk.clone(), messages, vec![0], "dummy nonce".to_string());
    let result = bbs_blind_signature_commitment(request);

    assert!(result.is_object());

    let obj = js_sys::Object::try_from(&result).unwrap();
    let entries = js_sys::Object::entries(&obj).to_vec();
    assert_eq!(entries.len(), 4);

    let keys = js_sys::Object::keys(&obj);
    let values = js_sys::Object::values(&obj);

    let mut fields = BTreeMap::new();
    for i in 0..4 {
        let name = JsValue::into_serde::<String>(&keys.get(i));
        let value = JsValue::into_serde::<Vec<u8>>(&values.get(i));
        assert!(name.is_ok());
        assert!(value.is_ok());
        fields.insert(name.unwrap(), value.unwrap());
    }

    let commit = fields.get("commitment").unwrap();
    let commitment = Commitment::try_from(commit.as_slice()).unwrap();
    let proof_of_hidden_messages = fields.get("proofOfHiddenMessages").unwrap();
    let proofOfHiddenMessages =
        ProofG1::try_from(proof_of_hidden_messages.as_slice()).unwrap();
    let challenge_hash = fields.get("challengeHash").unwrap();
    let challengeHash = ProofChallenge::try_from(challenge_hash.as_slice()).unwrap();

    let mut blinded = BTreeSet::new();
    blinded.insert(0);

    let request = BlindSignatureVerifyContextRequest::new(
        commitment.clone(),
        proofOfHiddenMessages.clone(),
        challengeHash.clone(),
        pk.clone(),
        blinded.clone(),
        "dummy nonce".to_string(),
    );

    let result = bbs_verify_blind_signature_proof(request);
    assert!(result.is_truthy());

    let request = BlindSignatureVerifyContextRequest::new(
        commitment.clone(),
        proofOfHiddenMessages.clone(),
        challengeHash.clone(),
        pk.clone(),
        blinded.clone(),
        "bad nonce".to_string()
    );

    let result = bbs_verify_blind_signature_proof(request);
    assert!(result.is_falsy());

    log(&format!("{:?}", fields));
}
