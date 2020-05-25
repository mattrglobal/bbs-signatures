const wasm = require('./wasm');

module.exports.DEFAULT_BLS12381_PRIVATE_KEY_LENGTH = 32;

module.exports.DEFAULT_BLS12381_PUBLIC_KEY_LENGTH = 96;

module.exports.BBS_SIGNATURE_LENGTH = 112;

module.exports.generateBls12381KeyPair = wasm.bls_generate_key;

module.exports.bls12381toBbs = wasm.bls_public_key_to_bbs_key;

module.exports.Bls12381ToBbsRequest = wasm.Bls12381ToBbsRequest;

module.exports.sign = wasm.sign;

module.exports.blsSign = wasm.blsSign;

module.exports.verify = wasm.verify;

module.exports.blsVerify = wasm.blsVerify;

module.exports.createProof = wasm.createProof;

module.exports.blsCreateProof = wasm.blsCreateProof;

module.exports.verifyProof = wasm.verifyProof;

module.exports.blsVerifyProof = wasm.blsVerifyProof;