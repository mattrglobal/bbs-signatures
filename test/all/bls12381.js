//TODO review attribution
// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// @ts-check

function bls12381_generate(wasm) {
  console.log('Testing BLS 12-381 key generation');
  console.log(wasm);
  console.log(wasm.isReady());

  const RESULT = wasm.generateBls12381KeyPair();

  console.log('\tPHR', RESULT);
}

module.exports = {
    bls12381_generate,
};