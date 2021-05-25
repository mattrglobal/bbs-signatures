#!/usr/bin/env bash

set -e

BUILD_MODE=$1

SRC_WASM=lib/wasm.js
SRC_WASM_CJS=lib/wasm_cjs.js

# Add dev dependencies to current path
export PATH="$PATH:node_modules/.bin"

if [ -z "$BUILD_MODE" ]
then
  echo "BUILD_MODE not specified defaulting to RELEASE"
  BUILD_MODE="RELEASE"
fi

# Build based on input parameter
if [ "$BUILD_MODE" = "RELEASE" ]; 
then
    echo "Building WASM Output in RELEASE MODE"
    rustup run stable wasm-pack build --release --out-dir lib --target web
elif [ "$BUILD_MODE" = "DEBUG" ]; 
then
    echo "Building WASM Output in DEBUG MODE"
    rustup run stable wasm-pack build --out-dir lib --target web -- --features="console"
else
    echo "Unrecognized value for parameter BUILD_MODE value must be either RELEASE or DEBUG"
    exit 1
fi

# Copy over package sources
cp -r src/js/* lib/

# Some of the auto-generated JS wrapping the WASM from wasm-pack
# appears to be invalid and not used
sed -i -e 's/getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));//g' $SRC_WASM
sed -i -e 's/var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));/var ret = {};/g' $SRC_WASM

# Convert the wasm.js to a cjs version for node compatibility
yarn rollup $SRC_WASM --file $SRC_WASM_CJS --format cjs

# Convert wasm output to base64 bytes
echo "Packing WASM into b64"
node ./scripts/pack-wasm-base64.js

# Convert how the WASM is loaded in the CJS version to use the base64 packed version
sed -i -e 's/input = new URL(.*/input = require(\".\/wasm_bs64.js\");/' $SRC_WASM_CJS

# Delete the un-necessary files automatically created by wasm-pack
rm lib/package.json lib/.gitignore lib/LICENSE lib/README.md

# Delete the files not needed because using the CJS approach
rm lib/wasm_bg.wasm lib/wasm_bg.wasm.d.ts lib/wasm.js

# Rename the CJS version over the old file
mv lib/wasm_cjs.js lib/wasm.js