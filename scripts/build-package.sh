#!/usr/bin/env bash

set -e

SRC_WASM=lib/wasm.js

# TODO deal with when rustup not installed?

# Run wasm-pack
echo "Building WASM Output"
rustup run stable wasm-pack build --release --out-dir lib --target web

# Copy over package sources
cp -r src/js/* lib/

# Some of the auto-generated JS wrapping the WASM from wasm-pack
# appears to be invalid and not used
sed -i -e 's/getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));//g' $SRC_WASM
sed -i -e 's/var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));/var ret = {};/g' $SRC_WASM

# Delete the gitignore and readme automatically created by wasm-pack
rm lib/package.json lib/.gitignore