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
    bls12381::BbsKeyPair
};
use bbs::prelude::*;
use serde::{
    de::{Error as DError, Visitor},
    Deserialize, Deserializer, Serialize, Serializer,
};
use std::convert::TryFrom;
use std::{
    collections::{BTreeMap, BTreeSet},
    convert::TryInto,
    iter::FromIterator,
};
use wasm_bindgen::prelude::*;

wasm_impl!(BbsSignRequest, keyPair: BbsKeyPair, messages: Vec<String>);

wasm_impl!(
    BbsVerifyRequest,
    publicKey: PublicKey,
    signature: Signature,
    messages: Vec<String>
);

wasm_impl!(
    BlindSignatureContextRequest,
    publicKey: PublicKey,
    messages: Vec<String>,
    blinded: Vec<usize>,
    nonce: String
);

wasm_impl!(
    BlindSignatureContextResponse,
    commitment: Commitment,
    proofOfHiddenMessages: ProofG1,
    challengeHash: ProofChallenge,
    blindingFactor: SignatureBlinding
);

wasm_impl!(
    BlindSignatureVerifyContextRequest,
    commitment: Commitment,
    proofOfHiddenMessages: ProofG1,
    challengeHash: ProofChallenge,
    publicKey: PublicKey,
    blinded: BTreeSet<usize>,
    nonce: String
);

wasm_impl!(
    BlindSignContextRequest,
    commitment: Commitment,
    publicKey: PublicKey,
    secretKey: SecretKey,
    messages: Vec<String>,
    known: Vec<usize>
);

wasm_impl!(
    UnblindSignatureRequest,
    signature: BlindSignature,
    blindingFactor: SignatureBlinding
);

wasm_impl!(
    CreateProofRequest,
    signature: Signature,
    publicKey: PublicKey,
    messages: Vec<String>,
    revealed: Vec<usize>,
    nonce: String
);

wasm_impl!(
    VerifyProofContext,
    proof: PoKOfSignatureProofWrapper,
    publicKey: PublicKey,
    messages: Vec<String>,
    nonce: String
);

#[derive(Debug)]
pub struct PoKOfSignatureProofWrapper {
    pub bit_vector: Vec<u8>,
    pub proof: PoKOfSignatureProof,
}

impl PoKOfSignatureProofWrapper {
    pub fn new(
        message_count: usize,
        revealed: &BTreeSet<usize>,
        proof: PoKOfSignatureProof,
    ) -> Self {
        let mut bit_vector = (message_count as u16).to_be_bytes().to_vec();
        bit_vector.append(&mut revealed_to_bitvector(message_count, revealed));
        Self { bit_vector, proof }
    }

    pub fn unwrap(self) -> (BTreeSet<usize>, PoKOfSignatureProof) {
        (bitvector_to_revealed(&self.bit_vector[2..]), self.proof)
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        let mut data = self.bit_vector.to_vec();
        data.append(&mut self.proof.to_bytes_compressed_form());
        data
    }
}

impl TryFrom<&[u8]> for PoKOfSignatureProofWrapper {
    type Error = JsValue;

    fn try_from(value: &[u8]) -> Result<Self, Self::Error> {
        let message_count = u16::from_be_bytes(*array_ref![value, 0, 2]) as usize;
        let bitvector_length = (message_count / 8) + 1;
        let offset = bitvector_length + 2;
        let proof = map_err!(PoKOfSignatureProof::try_from(&value[offset..]))?;
        Ok(Self {
            bit_vector: value[..offset].to_vec(),
            proof,
        })
    }
}

impl Serialize for PoKOfSignatureProofWrapper {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_bytes(&self.to_bytes().as_slice())
    }
}

impl<'a> Deserialize<'a> for PoKOfSignatureProofWrapper {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'a>,
    {
        struct DeserializeVisitor;

        impl<'a> Visitor<'a> for DeserializeVisitor {
            type Value = PoKOfSignatureProofWrapper;

            fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
                formatter.write_str("expected byte array")
            }

            fn visit_bytes<E>(self, value: &[u8]) -> Result<PoKOfSignatureProofWrapper, E>
            where
                E: DError,
            {
                PoKOfSignatureProofWrapper::try_from(value)
                    .map_err(|_| DError::invalid_value(serde::de::Unexpected::Bytes(value), &self))
            }
        }

        deserializer.deserialize_bytes(DeserializeVisitor)
    }
}

#[wasm_bindgen(js_name = sign)]
pub fn bbs_sign(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BbsSignRequest = request.try_into()?;
    let sk = request
        .keyPair
        .secretKey
        .ok_or_else(|| JsValue::from("Secret Key must be set"))?;
    let messages: Vec<SignatureMessage> = request
        .messages
        .iter()
        .map(|m| SignatureMessage::hash(m))
        .collect();
    match Signature::new(messages.as_slice(), &sk, &request.keyPair.publicKey) {
        Ok(sig) => Ok(serde_wasm_bindgen::to_value(&sig).unwrap()),
        Err(e) => Err(JsValue::from(&format!("{:?}", e))),
    }
}

#[wasm_bindgen(js_name = verify)]
pub fn bbs_verify(request: JsValue) -> Result<JsValue, JsValue> {
    let res  = request.try_into();

    let request: BbsVerifyRequest;
    match res {
        Ok(r) => request = r,
        Err(e) => return Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse {
            verified: false,
            error: Some(format!("{:?}", e))
        }).unwrap())
    };

    let messages: Vec<SignatureMessage> = request
        .messages
        .iter()
        .map(|m| SignatureMessage::hash(m))
        .collect();
    match request
        .signature
        .verify(messages.as_slice(), &request.publicKey)
    {
        Ok(b) => Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse {
            verified: b,
            error: None,
        })
        .unwrap()),
        Err(e) => Ok(serde_wasm_bindgen::to_value(&BbsVerifyResponse {
            verified: false,
            error: Some(format!("{:?}", e)),
        })
        .unwrap()),
    }
}

#[wasm_bindgen(js_name = blindSignCommitment)]
pub fn bbs_blind_signature_commitment(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BlindSignatureContextRequest = serde_wasm_bindgen::from_value(request)?;
    if request.messages.len() != request.blinded.len() {
        return Err(JsValue::from("messages.len() != blinded.len()"));
    }
    if request
        .blinded
        .iter()
        .any(|b| *b > request.publicKey.message_count())
    {
        return Err(JsValue::from("blinded value is out of bounds"));
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
        Err(e) => Err(JsValue::from(&format!("{:?}", e))),
        Ok((cx, bf)) => {
            let response = BlindSignatureContextResponse {
                commitment: cx.commitment,
                proofOfHiddenMessages: cx.proof_of_hidden_messages,
                challengeHash: cx.challenge_hash,
                blindingFactor: bf,
            };
            Ok(serde_wasm_bindgen::to_value(&response).unwrap())
        }
    }
}

#[wasm_bindgen(js_name = verifyBlind)]
pub fn bbs_verify_blind_signature_proof(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BlindSignatureVerifyContextRequest = request.try_into()?;
    let total = request.publicKey.message_count();
    if request.blinded.iter().any(|b| *b > total) {
        return Err(JsValue::from("blinded value is out of bounds"));
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
        Err(e) => Err(JsValue::from(&format!("{:?}", e))),
        Ok(b) => Ok(JsValue::from_bool(b)),
    }
}

#[wasm_bindgen(js_name = blindSign)]
pub fn bbs_blind_sign(request: JsValue) -> Result<JsValue, JsValue> {
    let request: BlindSignContextRequest = request.try_into()?;
    if request.messages.len() != request.known.len() {
        return Err(JsValue::from("messages.len() != known.len()"));
    }
    if request
        .known
        .iter()
        .any(|k| *k > request.publicKey.message_count())
    {
        return Err(JsValue::from("known value is out of bounds"));
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
        Ok(s) => Ok(serde_wasm_bindgen::to_value(&s).unwrap()),
        Err(e) => Err(JsValue::from(&format!("{:?}", e))),
    }
}

#[wasm_bindgen(js_name = unBlind)]
pub fn bbs_get_unblinded_signature(request: JsValue) -> Result<JsValue, JsValue> {
    let request: UnblindSignatureRequest = request.try_into()?;
    Ok(
        serde_wasm_bindgen::to_value(&request.signature.to_unblinded(&request.blindingFactor))
            .unwrap(),
    )
}

#[wasm_bindgen(js_name = createProof)]
pub fn bbs_create_proof(request: JsValue) -> Result<JsValue, JsValue> {
    let request: CreateProofRequest = request.try_into()?;
    if request
        .revealed
        .iter()
        .any(|r| *r > request.publicKey.message_count())
    {
        return Err(JsValue::from("revealed value is out of bounds"));
    }
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
    match PoKOfSignature::init(&request.signature, &request.publicKey, messages.as_slice()) {
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
                    let out = PoKOfSignatureProofWrapper::new(request.publicKey.message_count(), &revealed, proof);
                    Ok(serde_wasm_bindgen::to_value(&out).unwrap())
                }
                Err(e) => Err(JsValue::from(&format!("{:?}", e))),
            }
        }
    }
}

#[wasm_bindgen(js_name = verifyProof)]
pub fn bbs_verify_proof(request: JsValue) -> Result<JsValue, JsValue> {
    let res = serde_wasm_bindgen::from_value::<VerifyProofContext>(request);
    let request: VerifyProofContext;
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
    let messages = request.messages.clone();
    let (revealed, proof) = request.proof.unwrap();
    let proof_request = ProofRequest {
        revealed_messages: revealed,
        verification_key: request.publicKey,
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

/// Expects `revealed` to be sorted
fn revealed_to_bitvector(total: usize, revealed: &BTreeSet<usize>) -> Vec<u8> {
    let mut bytes = vec![0u8; (total / 8) + 1];

    for r in revealed {
        let idx = *r / 8;
        let bit = (*r % 8) as u8;
        bytes[idx] |= 1u8 << bit;
    }

    // Convert to big endian
    bytes.reverse();
    bytes
}

/// Convert big-endian vector to u32
fn bitvector_to_revealed(data: &[u8]) -> BTreeSet<usize> {
    let mut revealed_messages = BTreeSet::new();
    let mut scalar = 0;

    for b in data.iter().rev() {
        let mut v = *b;
        let mut remaining = 8;
        while v > 0 {
            let revealed = v & 1u8;
            if revealed == 1 {
                revealed_messages.insert(scalar);
            }
            v >>= 1;
            scalar += 1;
            remaining -= 1;
        }
        scalar += remaining;
    }
    revealed_messages
}
