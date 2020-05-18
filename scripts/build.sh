#!/usr/bin/env bash

set -e

echo ">>>> Cleaning previous builds"

rm -rf -f dist lib pkg

echo ">>>> Building package"

./scripts/build-package.sh

echo ">>>> Building webpack version"

./scripts/build-webpack.sh
