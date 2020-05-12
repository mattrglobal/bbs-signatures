const pkg = require('./package.json');
const asm = require('./wasm_asm_stub');
const bytes = require('./wasm_wasm');
const imports = require('./wasm');

//TODO review if this is required???

module.exports = async function createExportPromise () {
  try {
    const { instance } = await WebAssembly.instantiate(bytes, { './wasm': imports });

    return instance.exports;
  } catch (error) {
    // if we have a valid supplied asm.js, return that
    if (asm && asm.ext_blake2b) {
      return asm;
    }

    console.error(`ERROR: Unable to initialize ${pkg.name} ${pkg.version}`);
    console.error(error);

    return null;
  }
};