#!/usr/bin/env bash

set -e

WASM_OPT=./binaryen/bin/wasm-opt
WASM_2_JS=./binaryen/bin/wasm2js

SRC_WASM=lib/wasm.js
DEF=lib/wasm.d.ts
WASM=lib/wasm_bg.wasm
OPT=lib/wasm_opt.wasm
ASM=lib/wasm_asm.js

# TODO deal with when rustup not installed?

# Run wasm-pack building for release and nodejs target
echo "Building WASM Output"
rustup run stable wasm-pack build --release --out-dir lib --target nodejs

# Optimize WASM - using the additional `-Oz` flag provides further optimizations
echo "Optimizing WASM Output"
$WASM_OPT $WASM -O4 -o $OPT

# Convert wasm output to base64 bytes
echo "Packing WASM into b64"
node ./scripts/pack-wasm-base64.js

# Build asm.js version from optimized wasm output
echo "Building asm.js version"
$WASM_2_JS $OPT --output $ASM 

# WASM2JS only supports generation of es6
# Whereas node environments require es5 or cjs
# Hence the folloing converts the import and export syntax
sed -i -e '/import {/d' $ASM
sed -i -e '/export var /d' $ASM
sed -i -e 's/{abort.*},memasmFunc/wbg, memasmFunc/g' $ASM
sed -i -e 's/var retasmFunc = /module.exports = (wbg) => /' $ASM

# Copy over package sources
cp -r src/js/* lib/

# Polyfill TextDecoder as it causes issues in environments like react native
sed -i -e 's/const { TextDecoder } = require(String.raw`util`);/const { u8aToString } = require('\''\.\/util'\'');/g' $SRC_WASM
sed -i -e 's/let cachedTextDecoder = new /\/\/ let cachedTextDecoder = new /g' $SRC_WASM
sed -i -e 's/cachedTextDecoder\.decode/u8aToString/g' $SRC_WASM

# Remove generated statements that handling the loading of the WASM module
sed -i -e 's/const path = require/\/\/ const path = require/g' $SRC_WASM
sed -i -e 's/const bytes = require/\/\/ const bytes = require/g' $SRC_WASM
sed -i -e 's/const wasmModule =/\/\/ const wasmModule =/g' $SRC_WASM
sed -i -e 's/const wasmInstance =/\/\/ const wasmInstance =/g' $SRC_WASM
sed -i -e 's/wasm = wasmInstance/\/\/ wasm = wasmInstance/g' $SRC_WASM

# Replace with a helper function that support loading the asm.js
# version as a fall back
echo "
wasm = require('./wasm_helper')();
" >> $SRC_WASM

# Delete the gitignore and readme automatically created by wasm-pack
rm lib/package.json lib/.gitignore lib/README.md
