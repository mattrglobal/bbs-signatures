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

# cleanup generated output
sed -i -e 's/import {/\/\/ import {/g' $ASM
sed -i -e 's/function asmFunc/var bbs = require('\''\.\/wasm'\''); function asmFunc/g' $ASM
sed -i -e 's/{abort.*},memasmFunc/bbs, memasmFunc/g' $ASM
sed -i -e 's/export var /module\.exports\./g' $ASM

# Copy over package sources
cp -r src/js/* lib/

# swap to async interface for webpack support
sed -i -e 's/wasm = require/\/\/ wasm = require/g' $SRC_WASM

# We don't want inline requires
sed -i -e 's/var wasm;/const crypto = require('\''crypto'\''); let wasm; const requires = { crypto };/g' $SRC_WASM
sed -i -e 's/return addHeapObject(require(varg0));/return addHeapObject(requires[varg0]);/g' $SRC_WASM

# Polyfill TextDecoder as it causes issues in RN
sed -i -e 's/const { TextDecoder } = require(String.raw`util`);/const { u8aToString } = require('\''\.\/util'\'');/g' $SRC_WASM
sed -i -e 's/let cachedTextDecoder = new /\/\/ let cachedTextDecoder = new /g' $SRC_WASM
sed -i -e 's/cachedTextDecoder\.decode/u8aToString/g' $SRC_WASM

# this is where we get the actual bg file
sed -i -e 's/const path = require/\/\/ const path = require/g' $SRC_WASM
sed -i -e 's/const bytes = require/\/\/ const bytes = require/g' $SRC_WASM
sed -i -e 's/const wasmModule =/\/\/ const wasmModule =/g' $SRC_WASM
sed -i -e 's/const wasmInstance =/\/\/ const wasmInstance =/g' $SRC_WASM
sed -i -e 's/wasm = wasmInstance/\/\/ wasm = wasmInstance/g' $SRC_WASM

# construct our promise and add ready helpers (WASM)
echo "
module.exports.abort = function () { throw new Error('abort'); };

const createPromise = require('./wasm_promise');
const wasmPromise = createPromise().catch(() => null);

module.exports.isReady = function () { return !!wasm; }
module.exports.waitReady = function () { return wasmPromise.then(() => !!wasm); }

wasmPromise.then((_wasm) => { wasm = _wasm });
" >> $SRC_WASM

# add extra methods to type definitions
echo "
export function isReady(): boolean;
export function waitReady(): Promise<boolean>;
" >> $DEF

# Delete the gitignore and readme automatically created by wasm-pack
rm lib/package.json lib/.gitignore lib/README.md
