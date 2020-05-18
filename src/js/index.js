const wasm = require('./wasm');

module.exports.generateBls12381KeyPair = wasm.bls_generate_key;
