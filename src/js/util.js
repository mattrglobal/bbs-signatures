let decoder;

function polyfilledDecode(value) {
  return value.reduce((str, code) => {
    return str + String.fromCharCode(code);
  }, "");
}

try {
  decoder = new TextDecoder("utf-8");
} catch (error) {
  decoder = {
    decode: polyfilledDecode,
  };
}

/**
 * @name u8aToString
 * @summary Creates a utf-8 string from a Uint8Array object.
 * @description
 * `UInt8Array` input values return the actual decoded utf-8 string. `null` or `undefined` values returns an empty string.
 * @example
 * <BR>
 *
 * ```javascript
 * const { u8aToString } = require('./util');
 *
 * u8aToString(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f])); // hello
 * ```
 */
function u8aToString(value) {
  if (!value || !value.length) {
    return "";
  }
  return decoder.decode(value);
}

exports.u8aToString = u8aToString;

/**
 * Enumeration of possible values for setting the
 * BBS_SIGNATURES_MODE environment variable
 */
exports.BBS_SIGNATURES_MODES = {
  nodejs: "NODE_JS_MODULE",
  wasm: "WASM",
  asmjs: "ASM_JS",
};

/**
 * Global errors
 */
exports.WEB_ASSEMBLY_NOT_FOUND_ERROR = "WebAssembly support not detected";
exports.FAILED_INITIALIZE_ERROR = "ERROR: Unable to initialize bbs signatures";
exports.FAILED_TO_LOAD_NODE_MODULE =
  "ERROR: Unable to initialize bbs signatures with node module that was requested with the `BBS_SIGNATURES_MODE` environment variable";
