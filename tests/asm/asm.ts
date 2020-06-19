// @ts-ignore
global.WebAssembly = null;

require("override-require")(
  (request: string) => request === "./wasm_asm_stub",
  () => require("../../lib/wasm_asm")
);

import { run } from "./all";
run();
