#!/usr/bin/env bash

set -e

WASM2JS=./binaryen/bin/wasm2js
ASM=lib/wasm_asm.js
WASM=lib/wasm_bg.wasm

$WASM2JS --output $ASM $WASM

# Update our JS shim to require the JS file instead
#sed -i 's/wasm_bg.wasm/wasm_asm.js/' lib/wasm.js

sed -i -e 's/import {/\/\/ import {/g' $ASM
sed -i -e 's/export var /module\.exports\./g' $ASM
