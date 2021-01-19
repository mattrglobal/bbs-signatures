#!/usr/bin/env bash

set -e

echo ">>> Deleting old version of binaryen"

rm -rf binaryen

echo ">>> Creating output directory"

mkdir -p binaryen
echo ">>> Downloading binaryen"

# wasm2js for wasm -> asm.js
BINARYEN=( "wasm-opt" "wasm2js" )

if ! [ -x "$(command -V wget)" ]; then
    echo "Installing wget"
    curl -O https://ftp.gnu.org/gnu/wget/wget-latest.tar.gz
    tar -xvzf wget-latest.tar.gz
    rm -r wget*
fi

unamestr=`uname`

if [ "$unamestr" == 'Darwin' ]
then
    echo ">>>> Downloading MacOS version"
    curl -L https://api.github.com/repos/WebAssembly/binaryen/releases \
        | grep "browser_download_url.*macos.tar.gz\"" \
        | cut -d : -f 2,3 \
        | tr -d '"' \
        | wget -O binaryen-download.tar.gz -qi -
elif [ "$unamestr" == 'Linux' ]
then
    echo ">>>> Downloading Linux version"
    curl -L https://api.github.com/repos/WebAssembly/binaryen/releases \
        | grep "browser_download_url.*linux.tar.gz\"" \
        | cut -d : -f 2,3 \
        | tr -d '"' \
        | wget -O binaryen-download.tar.gz -qi -
else
    echo ">>> Unable to identfy OS to download binaryen"
    exit 1
fi



echo ">>> Extracting result"

tar xvzf binaryen-download.tar.gz -C binaryen

rm binaryen-download.tar.gz

mv `find ./binaryen/* -maxdepth 1 -mindepth 1 -type d` binaryen