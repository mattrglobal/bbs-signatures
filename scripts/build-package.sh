#!/usr/bin/env bash

set -e

WASM_OPT=./binaryen/bin/wasm-opt
WASM=lib/wasm_bg.wasm
OPT_WASM=lib/wasm_opt.wasm
WASM_2_JS=./binaryen/bin/wasm2js
ASM=lib/wasm_asm.js
SRC_WASM=lib/wasm.js

# TODO deal with when rustup not installed?

# Run wasm-pack building for release and nodejs target
rustup run stable wasm-pack build --release --out-dir lib --target nodejs

# Optimize WASM - using the additional `-Oz` flag provides further optimizations
$WASM_OPT -O4 -o $OPT_WASM $WASM

rm $WASM
cp $OPT_WASM $WASM

# Build asm.js version
echo "Building asm.js version"
$WASM_2_JS --output $ASM $WASM

# cleanup generated output
sed -i -e 's/import {/\/\/ import {/g' $ASM
sed -i -e 's/function asmFunc/var bbs = require('\''\.\/wasm'\''); function asmFunc/g' $ASM
sed -i -e 's/{abort.*},memasmFunc/bbs, memasmFunc/g' $ASM
sed -i -e 's/export var /module\.exports\./g' $ASM

# Polyfill TextDecoder as it causes issues in RN
sed -i -e 's/const { TextDecoder } = require(String.raw`util`);/const { u8aToString } = require('\''\.\/util'\'');/g' $SRC_WASM
sed -i -e 's/let cachedTextDecoder = new /\/\/ let cachedTextDecoder = new /g' $SRC_WASM
sed -i -e 's/cachedTextDecoder\.decode/u8aToString/g' $SRC_WASM

# Delete the gitignore and readme automatically created by wasm-pack
rm lib/package.json lib/.gitignore lib/README.md

# Copy over package sources
cp -r src/js/* lib/