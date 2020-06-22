const asm = require("./wasm_asm");
const bytes = require("./wasm_wasm");
const imports = require("./wasm");

module.exports = async function createExportPromise() {
  try {
    const { instance } = await WebAssembly.instantiate(bytes, {
      __wbindgen_placeholder__: imports,
    });

    return instance.exports;
  } catch (error) {
    console.log("WebAssembly not found. Attempting to use ASM fallback.");
    // if we have a valid supplied asm.js, return that
    if (asm && asm.generateBls12381KeyPair) {
      return asm;
    }

    console.error(`ERROR: Unable to initialize bbs signatures`);
    console.error(error);

    return null;
  }
};
