// TODO review attribution
// Copyright 2019-2020 @polkadot/wasm-crypto authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO do we need?
require('../build/crypto-polyfill');

const { beforeAll, tests, wasm } = require('./all');

describe('wasm-bbs-signatures', () => {
  beforeEach(async () => {
    await beforeAll();
  });

  Object.keys(tests).forEach((name) => {
    it(name, () => tests[name](wasm));
  });
});