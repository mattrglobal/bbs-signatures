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
use crate::{
    BbsVerifyResponse,
    PoKOfSignatureProofWrapper,
};
use bbs::prelude::*;
use serde::{
    Deserialize, Serialize,
};
use std::{
    collections::{BTreeMap, BTreeSet},
    convert::TryInto,
    iter::FromIterator
};
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

wasm_impl!(
    BlsCreateProofRequest,
    signature: Signature,
    publicKey: DeterministicPublicKey,
    messages: Vec<String>,
    revealed: Vec<usize>,
    nonce: String
);

wasm_impl!(
    BlsVerifyProofContext,
    proof: PoKOfSignatureProofWrapper,
    publicKey: DeterministicPublicKey,
    messages: Vec<String>,
    nonce: String
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
    if let Some(dpk) = request.keyPair.publicKey {
        let pk = dpk.to_public_key(request.messageCount)?;
        let key_pair = BbsKeyPair {
            publicKey: pk,
            secretKey: request.keyPair.secretKey,
            messageCount: request.messageCount
        };
        Ok(serde_wasm_bindgen::to_value(&key_pair).unwrap())
    } else if let Some(s) = request.keyPair.secretKey {
        let (dpk, sk) = DeterministicPublicKey::new(Some(KeyGenOption::FromSecretKey(s)));
        let pk = dpk.to_public_key(request.messageCount)?;
        let key_pair = BbsKeyPair {
            publicKey: pk,
            secretKey: Some(sk),
            messageCount: request.messageCount
        };
        Ok(serde_wasm_bindgen::to_value(&key_pair).unwrap())
    } else {
        Err(JsValue::from_str("No key is specified"))
    }
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

/// Creates a BBS+ PoK
#[wasm_bindgen(js_name = blsCreateProof)]
pub fn bls_create_proof(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BlsCreateProofRequest = request.try_into()?;
    if request
        .revealed
        .iter()
        .any(|r| *r > request.messages.len())
    {
        return Err(JsValue::from("revealed value is out of bounds"));
    }
    let pk = request.publicKey.to_public_key(request.messages.len())?;
    let revealed: BTreeSet<usize> = BTreeSet::from_iter(request.revealed.into_iter());
    let mut messages = Vec::new();
    for i in 0..request.messages.len() {
        if revealed.contains(&i) {
            messages.push(ProofMessage::Revealed(SignatureMessage::hash(
                &request.messages[i],
            )));
        } else {
            messages.push(ProofMessage::Hidden(HiddenMessage::ProofSpecificBlinding(
                SignatureMessage::hash(&request.messages[i]),
            )));
        }
    }
    match PoKOfSignature::init(&request.signature, &pk, messages.as_slice()) {
        Err(e) => return Err(JsValue::from(&format!("{:?}", e))),
        Ok(pok) => {
            let mut challenge_bytes = pok.to_bytes();
            if request.nonce.is_empty() {
                challenge_bytes.extend_from_slice(&[0u8; FR_COMPRESSED_SIZE]);
            } else {
                let nonce = ProofNonce::hash(&request.nonce);
                challenge_bytes.extend_from_slice(nonce.to_bytes_uncompressed_form().as_ref());
            }
            let challenge_hash = ProofChallenge::hash(&challenge_bytes);
            match pok.gen_proof(&challenge_hash) {
                Ok(proof) => {
                    let out = PoKOfSignatureProofWrapper::new(request.messages.len(), &revealed, proof);
                    Ok(serde_wasm_bindgen::to_value(&out).unwrap())
                }
                Err(e) => Err(JsValue::from(&format!("{:?}", e))),
            }
        }
    }
}

/// Verify a BBS+ PoK
#[wasm_bindgen(js_name = blsVerifyProof)]
pub fn bls_verify_proof(request: JsValue) -> Result<JsValue, JsValue> {
    let res = serde_wasm_bindgen::from_value::<BlsVerifyProofContext>(request);
    let request: BlsVerifyProofContext;
    match res {
        Ok(r) => request = r,
        Err(e)  => return Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse{
            verified: false,
            error: Some(format!("{:?}", e))
        }).unwrap())
    };

    let nonce = if request.nonce.is_empty() {
        ProofNonce::default()
    } else {
        ProofNonce::hash(&request.nonce)
    };
    let message_count = u16::from_be_bytes(*array_ref![request.proof.bit_vector, 0, 2]) as usize;
    let pk = request.publicKey.to_public_key(message_count)?;
    let messages = request.messages.clone();
    let (revealed, proof) = request.proof.unwrap();
    let proof_request = ProofRequest {
        revealed_messages: revealed,
        verification_key: pk
    };

    let mut revealed_messages = BTreeMap::new();
    for i in &proof_request.revealed_messages {
        revealed_messages.insert(*i, SignatureMessage::hash(&messages[*i]));
    }

    let signature_proof = SignatureProof {
        revealed_messages,
        proof
    };

    Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse{
        verified: Verifier::verify_signature_pok(&proof_request, &signature_proof, &nonce).is_ok(),
        error: None
    }).unwrap())
}