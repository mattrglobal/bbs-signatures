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
use std::{
    collections::{BTreeMap, BTreeSet},
    iter::FromIterator,
    convert::TryInto,
};
use wasm_bindgen::prelude::*;

wasm_impl!(
    #[allow(non_snake_case)]
    #[derive(Debug, Deserialize, Serialize)]
    BbsSignRequest,
    publicKey: PublicKey,
    secretKey: SecretKey,
    messages: Vec<String>
);

wasm_impl!(
    #[allow(non_snake_case)]
    #[derive(Debug, Deserialize, Serialize)]
    BbsVerifyRequest,
    publicKey: PublicKey,
    signature: Signature,
    messages: Vec<String>
);

wasm_object_impl!(
    BlindSignatureContextRequest,
    publicKey: PublicKey,
    messages: Vec<String>,
    blinded: Vec<usize>,
    nonce: String
);

wasm_object_impl!(
    #[allow(non_snake_case)]
    #[wasm_bindgen]
    #[derive(Serialize)]
    BlindSignatureContextResponse,
    commitment: Commitment,
    proofOfHiddenMessages: ProofG1,
    challengeHash: ProofChallenge,
    blindingFactor: SignatureBlinding
);

wasm_object_impl!(
    BlindSignatureVerifyContextRequest,
    commitment: Commitment,
    proofOfHiddenMessages: ProofG1,
    challengeHash: ProofChallenge,
    publicKey: PublicKey,
    blinded: BTreeSet<usize>,
    nonce: String
);

wasm_object_impl!(
    BlindSignContextRequest,
    commitment: Commitment,
    publicKey: PublicKey,
    secretKey: SecretKey,
    messages: Vec<String>,
    known: Vec<usize>
);

wasm_object_impl!(
    UnblindSignatureRequest,
    signature: BlindSignature,
    blindingFactor: SignatureBlinding
);

wasm_object_impl!(
    CreateProofRequest,
    signature: Signature,
    publicKey: PublicKey,
    messages: Vec<String>,
    revealed: Vec<usize>,
    nonce: String
);

wasm_object_impl!(
    VerifyProofContext,
    proof: PoKOfSignatureProof,
    publicKey: PublicKey,
    messages: Vec<String>,
    revealed: Vec<usize>,
    nonce: String
);

#[wasm_bindgen]
pub fn bbs_sign(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BbsSignRequest = request.try_into()?;
    let messages: Vec<SignatureMessage> = request
        .messages
        .iter()
        .map(|m| SignatureMessage::hash(m))
        .collect();
    match Signature::new(messages.as_slice(), &request.secretKey, &request.publicKey) {
        Ok(sig) => Ok(serde_wasm_bindgen::to_value(&sig).unwrap()),
        Err(e) => Err(JsValue::from(&format!("{:?}", e))),
    }
}

#[wasm_bindgen]
pub fn bbs_verify(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BbsVerifyRequest = request.try_into()?;
    let messages: Vec<SignatureMessage> = request
        .messages
        .iter()
        .map(|m| SignatureMessage::hash(m))
        .collect();
    match request
        .signature
        .verify(messages.as_slice(), &request.publicKey)
    {
        Ok(b) => Ok(JsValue::from_bool(b)),
        Err(e) => Err(JsValue::from(&format!("{:?}", e))),
    }
}

#[wasm_bindgen]
pub fn bbs_blind_signature_commitment(request: BlindSignatureContextRequest) -> JsValue {
    if request.messages.len() != request.blinded.len() {
        return JsValue::from("messages.len() != blinded.len()");
    }
    if request
        .blinded
        .iter()
        .any(|b| *b > request.publicKey.message_count())
    {
        return JsValue::from("blinded value is out of bounds");
    }
    let mut messages = BTreeMap::new();
    for i in 0..request.blinded.len() {
        messages.insert(
            request.blinded[i],
            SignatureMessage::hash(&request.messages[i]),
        );
    }
    let nonce = ProofNonce::hash(&request.nonce);
    match Prover::new_blind_signature_context(&request.publicKey, &messages, &nonce) {
        Err(e) => JsValue::from(&format!("{:?}", e)),
        Ok((cx, bf)) => {
            let response = BlindSignatureContextResponse {
                commitment: cx.commitment,
                proofOfHiddenMessages: cx.proof_of_hidden_messages,
                challengeHash: cx.challenge_hash,
                blindingFactor: bf,
            };
            serde_wasm_bindgen::to_value(&response).unwrap()
        }
    }
}

#[wasm_bindgen]
pub fn bbs_verify_blind_signature_proof(request: BlindSignatureVerifyContextRequest) -> JsValue {
    let total = request.publicKey.message_count();
    if request.blinded.iter().any(|b| *b > total) {
        return JsValue::from("blinded value is out of bounds");
    }
    let messages = (0..total)
        .filter(|i| !request.blinded.contains(i))
        .collect();
    let nonce = ProofNonce::hash(&request.nonce);
    let ctx = BlindSignatureContext {
        commitment: request.commitment,
        challenge_hash: request.challengeHash,
        proof_of_hidden_messages: request.proofOfHiddenMessages,
    };
    match ctx.verify(&messages, &request.publicKey, &nonce) {
        Err(e) => JsValue::from(&format!("{:?}", e)),
        Ok(b) => JsValue::from_bool(b),
    }
}

#[wasm_bindgen]
pub fn bbs_blind_sign(request: BlindSignContextRequest) -> JsValue {
    if request.messages.len() != request.known.len() {
        return JsValue::from("messages.len() != known.len()");
    }
    if request
        .known
        .iter()
        .any(|k| *k > request.publicKey.message_count())
    {
        return JsValue::from("known value is out of bounds");
    }
    let messages: BTreeMap<usize, SignatureMessage> = request
        .known
        .iter()
        .zip(request.messages.iter())
        .map(|(k, m)| (*k, SignatureMessage::hash(m)))
        .collect();
    match BlindSignature::new(
        &request.commitment,
        &messages,
        &request.secretKey,
        &request.publicKey,
    ) {
        Ok(s) => serde_wasm_bindgen::to_value(&s).unwrap(),
        Err(e) => JsValue::from(&format!("{:?}", e)),
    }
}

#[wasm_bindgen]
pub fn bbs_get_unblinded_signature(request: UnblindSignatureRequest) -> JsValue {
    serde_wasm_bindgen::to_value(&request.signature.to_unblinded(&request.blindingFactor)).unwrap()
}

#[wasm_bindgen]
pub fn bbs_create_proof(request: CreateProofRequest) -> JsValue {
    if request
        .revealed
        .iter()
        .any(|r| *r > request.publicKey.message_count())
    {
        return JsValue::from("revealed value is out of bounds");
    }
    let revealed = BTreeSet::from_iter(request.revealed.iter());
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
    match PoKOfSignature::init(&request.signature, &request.publicKey, messages.as_slice()) {
        Err(e) => return JsValue::from(&format!("{:?}", e)),
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
                Ok(proof) => serde_wasm_bindgen::to_value(&proof).unwrap(),
                Err(e) => JsValue::from(&format!("{:?}", e)),
            }
        }
    }
}

#[wasm_bindgen]
pub fn bbs_verify_proof(request: VerifyProofContext) -> JsValue {
    let nonce = if request.nonce.is_empty() {
        ProofNonce::from([0u8; FR_COMPRESSED_SIZE])
    } else {
        ProofNonce::hash(&request.nonce)
    };
    let proof_request = ProofRequest {
        revealed_messages: BTreeSet::from_iter(request.revealed.clone().into_iter()),
        verification_key: request.publicKey,
    };

    let mut revealed_messages = BTreeMap::new();
    for i in &request.revealed {
        revealed_messages.insert(*i, SignatureMessage::hash(&request.messages[*i]));
    }

    let signature_proof = SignatureProof {
        revealed_messages,
        proof: request.proof,
    };

    JsValue::from_bool(
        Verifier::verify_signature_pok(&proof_request, &signature_proof, &nonce).is_ok(),
    )
}
