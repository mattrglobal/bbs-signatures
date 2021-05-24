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

/**
 * Enumeration of possible values for setting the
 * BBS_SIGNATURES_MODE environment variable
 */
exports.BBS_SIGNATURES_MODES = {
  nodejs: "NODE_JS_MODULE",
  wasm: "WASM",
};

/**
 * Global errors
 */
exports.WEB_ASSEMBLY_NOT_FOUND_ERROR = "WebAssembly support not detected";
exports.FAILED_INITIALIZE_ERROR = "ERROR: Unable to initialize bbs signatures";
exports.FAILED_TO_LOAD_NODE_MODULE =
  "ERROR: Unable to initialize bbs signatures with node module that was requested with the `BBS_SIGNATURES_MODE` environment variable";

exports.nodejs = process && process.versions && process.versions.node;
