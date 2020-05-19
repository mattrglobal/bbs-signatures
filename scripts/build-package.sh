#!/usr/bin/env bash

set -e

WASM_OPT=./binaryen/bin/wasm-opt
WASM=lib/wasm_bg.wasm
OPT_WASM=lib/wasm_opt.wasm

# TODO deal with when rustup not installed?

# Run wasm-pack building for release and nodejs target
rustup run nightly wasm-pack build --release --out-dir lib --target nodejs

# Optimize WASM
$WASM_OPT -O4 -Oz -o $OPT_WASM $WASM

rm $WASM
mv $OPT_WASM $WASM

# Delete the package.json, gitignore and readme automatically created by wasm-pack
rm lib/package.json lib/.gitignore lib/README.md

# Copy over package sources
cp src/js/* lib/