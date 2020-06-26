const asm = require("./wasm_asm");
const bytes = require("./wasm_wasm");
const imports = require("./wasm");

const WEB_ASSEMBLY_NOT_FOUND_ERROR = "WebAssembly support not detected";

const FAILED_INITIALIZE_ERROR = "ERROR: Unable to initialize bbs signatures";

module.exports = function getWasmInstance() {
  try {
    if (!WebAssembly) {
      throw new Error(WEB_ASSEMBLY_NOT_FOUND_ERROR);
    }
    const wasmModule = new WebAssembly.Module(bytes);
    return new WebAssembly.Instance(wasmModule, {
      __wbindgen_placeholder__: imports,
    }).exports;
  } catch (error) {
    if (error.message == WEB_ASSEMBLY_NOT_FOUND_ERROR) {
      console.log("WebAssembly not found. Attempting to use ASM fallback.");
    } else {
      console.log(
        "The following error occurred in attempting to load the WASM. Attempting to use ASM fallback."
      );
      console.log(error);
    }

    // if we have a valid supplied asm.js, return that
    if (asm) {
      return asm;
    }

    console.error(FAILED_INITIALIZE_ERROR);
    console.error(error);

    return null;
  }
};
