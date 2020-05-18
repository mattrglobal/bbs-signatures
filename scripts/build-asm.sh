#!/usr/bin/env bash

set -e

ASM=lib/wasm_asm.js
WASM=lib/wasm_bg.wasm

./binaryen/bin/wasm2js --output $ASM $WASM

# Update our JS shim to require the JS file instead
#sed -i 's/wasm_bg.wasm/wasm_asm.js/' lib/wasm.js

sed -i -e 's/import {/\/\/ import {/g' $ASM
sed -i -e 's/export var /module\.exports\./g' $ASM
