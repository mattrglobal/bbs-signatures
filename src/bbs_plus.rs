use bbs::prelude::*;
use serde::Serialize;
use std::collections::BTreeMap;
use std::iter::FromIterator;
use wasm_bindgen::prelude::*;
use wasm_bindgen::__rt::std::collections::BTreeSet;
use bbs::messages::ProofMessage;

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct BbsSignRequest {
    secretKey: SecretKey,
    publicKey: PublicKey,
    messages: Vec<String>
}

#[wasm_bindgen]
pub fn bbs_sign(request: BbsSignRequest) -> JsValue {
    let messages: Vec<SignatureMessage> = request.messages.iter().map(|m| SignatureMessage::hash(m)).collect();
    match Signature::new(messages.as_slice(), &request.secretKey, &request.publicKey) {
        Ok(sig) => JsValue::from_serde(&sig).unwrap(),
        Err(e) => JsValue::from(&format!("{:?}", e))
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct BbsVerifyRequest {
    publicKey: PublicKey,
    signature: Signature,
    messages: Vec<String>,
}

#[wasm_bindgen]
pub fn bbs_verify(request: BbsVerifyRequest) -> JsValue {
    let messages: Vec<SignatureMessage> = request.messages.iter().map(|m| SignatureMessage::hash(m)).collect();
    match request.signature.verify(messages.as_slice(), &request.publicKey) {
        Ok(b) => JsValue::from_bool(b),
        Err(e) => JsValue::from(&format!("{:?}", e))
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct BlindSignatureContextRequest {
    publicKey: PublicKey,
    messages: Vec<String>,
    blinded: Vec<usize>,
    nonce: String
}

#[allow(non_snake_case)]
#[derive(Serialize)]
pub struct BlindSignatureContextResponse {
    commitment: Commitment,
    proofOfHiddenMessages: ProofG1,
    challengeHash: ProofChallenge,
    blindingFactor: SignatureBlinding
}

#[wasm_bindgen]
pub fn bbs_blind_signature_commitment(request: BlindSignatureContextRequest) -> JsValue {
    if request.messages.len() != request.blinded.len() {
        return JsValue::from("messages.len() != blinded.len()");
    }
    if request.blinded.iter().any(|b| *b > request.publicKey.message_count()) {
        return JsValue::from("blinded value is out of bounds");
    }
    let mut messages = BTreeMap::new();
    for i in 0..request.blinded.len() {
        messages.insert(request.blinded[i], SignatureMessage::hash(&request.messages[i]));
    }
    let nonce = ProofNonce::hash(&request.nonce);
    match Prover::new_blind_signature_context(&request.publicKey, &messages, &nonce) {
        Err(e) => JsValue::from(&format!("{:?}", e)),
        Ok((cx, bf)) => {
            let response = BlindSignatureContextResponse {
                commitment: cx.commitment,
                proofOfHiddenMessages: cx.proof_of_hidden_messages,
                challengeHash: cx.challenge_hash,
                blindingFactor: bf
            };
            JsValue::from_serde(&response).unwrap()
        }
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct BlindSignatureVerifyContextRequest {
    commitment: Commitment,
    proofOfHiddenMessages: ProofG1,
    challengeHash: ProofChallenge,
    publicKey: PublicKey,
    blinded: Vec<usize>,
    nonce: String
}

#[wasm_bindgen]
pub fn bbs_verify_blind_signature_proof(request: BlindSignatureVerifyContextRequest) -> JsValue {
    if request.blinded.iter().any(|b| *b > request.publicKey.message_count()) {
        return JsValue::from("blinded value is out of bounds");
    }
    let nonce = ProofNonce::hash(&request.nonce);
    let ctx = BlindSignatureContext {
        commitment: request.commitment,
        challenge_hash: request.challengeHash,
        proof_of_hidden_messages: request.proofOfHiddenMessages,
    };
    let messages: BTreeMap<usize, SignatureMessage> = request.blinded.iter().map(|i| (*i, SignatureMessage::from([0u8; FR_COMPRESSED_SIZE]))).collect();
    match ctx.verify(&messages, &request.publicKey, &nonce) {
        Err(e) => JsValue::from(&format!("{:?}", e)),
        Ok(b) => JsValue::from_bool(b)
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct BlindSignContextRequest {
    commitment: Commitment,
    publicKey: PublicKey,
    secretKey: SecretKey,
    messages: Vec<String>,
    known: Vec<usize>
}

#[wasm_bindgen]
pub fn bbs_blind_sign(request: BlindSignContextRequest) -> JsValue {
    if request.messages.len() != request.known.len() {
        return JsValue::from("messages.len() != known.len()");
    }
    if request.known.iter().any(|k| *k > request.publicKey.message_count()) {
        return JsValue::from("known value is out of bounds");
    }
    let messages: BTreeMap<usize, SignatureMessage> = request.known.iter().zip(request.messages.iter()).map(|(k, m)| (*k, SignatureMessage::hash(m))).collect();
    match BlindSignature::new(&request.commitment, &messages, &request.secretKey, &request.publicKey) {
        Ok(s) => JsValue::from_serde(&s).unwrap(),
        Err(e) => JsValue::from(&format!("{:?}", e))
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct UnblindSignatureRequest {
    signature: BlindSignature,
    blindingFactor: SignatureBlinding
}

#[wasm_bindgen]
pub fn bbs_get_unblinded_signature(request: UnblindSignatureRequest) -> JsValue {
    JsValue::from_serde(&request.signature.to_unblinded(&request.blindingFactor)).unwrap()
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct CreateProofRequest {
    signature: Signature,
    publicKey: PublicKey,
    messages: Vec<String>,
    revealed: Vec<usize>,
    nonce: String
}

#[wasm_bindgen]
pub fn bbs_create_proof(request: CreateProofRequest) -> JsValue {
    if request.revealed.iter().any(|r| *r > request.publicKey.message_count()) {
        return JsValue::from("revealed value is out of bounds");
    }
    let revealed = BTreeSet::from_iter(request.revealed.iter());
    let mut messages = Vec::new();
    for i in 0..request.messages.len() {
        if revealed.contains(&i) {
            messages.push(ProofMessage::Revealed(SignatureMessage::hash(&request.messages[i])));
        } else {
            messages.push(ProofMessage::Hidden(HiddenMessage::ProofSpecificBlinding(SignatureMessage::hash(&request.messages[i]))));
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
                Ok(proof) => JsValue::from_serde(&proof).unwrap(),
                Err(e) => JsValue::from(&format!("{:?}", e))
            }
        }
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub struct VerifyProofContext {
    proof: PoKOfSignatureProof,
    publicKey: PublicKey,
    messages: Vec<String>,
    revealed: Vec<usize>,
    nonce: String
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
        verification_key: request.publicKey
    };

    let mut revealed_messages = BTreeMap::new();
    for i in &request.revealed {
        revealed_messages.insert(*i, SignatureMessage::hash(&request.messages[*i]));
    }

    let signature_proof = SignatureProof {
        revealed_messages,
        proof: request.proof,
    };

    JsValue::from_bool(Verifier::verify_signature_pok(&proof_request, &signature_proof, &nonce).is_ok())
}