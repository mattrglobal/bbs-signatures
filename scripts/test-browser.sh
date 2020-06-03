#!/usr/bin/env bash

set -e

echo "*** Testing WASM on chrome"
rustup run stable wasm-pack test --headless --chrome