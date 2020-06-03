#!/usr/bin/env bash

set -e

cp src/js/index.web.js index.web.js

# Run webpack build
webpack

# Remove the temporary generated directory
rm -rf pkg index.web.js