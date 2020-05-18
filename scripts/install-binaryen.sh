#!/usr/bin/env bash

set -e

echo ">>> Deleting old version of binaryen"

rm -rf binaryen

echo ">>> Creating output directory"

mkdir -p binaryen/bin

echo ">>> Downloading binaryen"

# wasm2js for wasm -> asm.js
BINARYEN=( "wasm-opt" "wasm2js" )


unamestr=`uname`

if [ "$unamestr" == 'Darwin' ]
then
    echo ">>>> Downloading MacOS version"
    curl -L https://api.github.com/repos/WebAssembly/binaryen/releases/latest \
        | grep "browser_download_url.*macos.tar.gz\"" \
        | cut -d : -f 2,3 \
        | tr -d '"' \
        | wget -O binaryen-download.tar.gz -qi -
elif [ "$unamestr" == 'Linux' ]
then
    echo ">>>> Downloading Linux version"
    curl -L https://api.github.com/repos/WebAssembly/binaryen/releases/latest \
        | grep "browser_download_url.*linux.tar.gz\"" \
        | cut -d : -f 2,3 \
        | tr -d '"' \
        | wget -O binaryen-download.tar.gz -qi -
else
    echo ">>> Unable to identfy OS to download binaryen"
    exit 1
fi



echo ">>> Extracting result"

tar xvzf binaryen-download.tar.gz -C binaryen/bin

rm binaryen-download.tar.gz

cp -a `find ./binaryen/bin/* -maxdepth 1 -type d`/* binaryen/bin

rm -rf `find ./binaryen/bin/* -maxdepth 1 -type d`