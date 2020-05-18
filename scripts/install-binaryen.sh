set -e

echo "*** Downloading binaryen"

# wasm2js for wasm -> asm.js
BINARYEN=( "wasm-opt" "wasm2js" )

mkdir -p binaryen/bin

curl -L https://api.github.com/repos/WebAssembly/binaryen/releases/latest \
    | grep "browser_download_url.*macos.tar.gz\"" \
    | cut -d : -f 2,3 \
    | tr -d '"' \
    | wget -O binaryen-download.tar.gz -qi - \
    | tar -xz
#  
# mkdir -p binaryen/bin