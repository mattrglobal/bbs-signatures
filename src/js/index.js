"use strict";
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

const {
  BBS_SIGNATURES_MODES,
  FAILED_TO_LOAD_NODE_MODULE,
  nodejs,
} = require("./util");

let useWasm = !(
  nodejs &&
  (!process.env.BBS_SIGNATURES_MODE ||
    process.env.BBS_SIGNATURES_MODE === BBS_SIGNATURES_MODES.nodejs)
);

try {
  if (!useWasm) {
    module.exports = require("@mattrglobal/node-bbs-signatures");
  }
} catch {
  if (process.env.BBS_SIGNATURES_MODE === BBS_SIGNATURES_MODES.nodejs) {
    throw new Error(FAILED_TO_LOAD_NODE_MODULE);
  }
  useWasm = true;
}

if (useWasm) {
  module.exports = require("./wasm_module");
}
