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

const asm = require("./wasm_asm");
const bytes = require("./wasm_wasm");
const imports = require("./wasm");

const {
  WEB_ASSEMBLY_NOT_FOUND_ERROR,
  FAILED_INITIALIZE_ERROR,
  BBS_SIGNATURES_MODES,
} = require("./util");

module.exports = function getWasmInstance() {
  if (
    !process.env.BBS_SIGNATURES_MODE ||
    process.env.BBS_SIGNATURES_MODE !== BBS_SIGNATURES_MODES.asmjs
  ) {
    try {
      if (!WebAssembly) {
        throw new Error(WEB_ASSEMBLY_NOT_FOUND_ERROR);
      }
      const wasmModule = new WebAssembly.Module(bytes);
      return new WebAssembly.Instance(wasmModule, {
        __wbindgen_placeholder__: imports,
      }).exports;
    } catch (error) {
      console.log(
        "The following error occurred in attempting to load the WASM. Attempting to use ASM fallback."
      );
      console.log(error);
    }
  }

  // if we have a valid supplied asm.js, return that
  if (asm()) {
    return asm();
  }

  console.error(FAILED_INITIALIZE_ERROR);
  console.error(error);

  return null;
};
