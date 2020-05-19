set -e

echo ">>>> Installing Dependencies"

if [ -d "binaryen/bin" ] 
then
    echo ">>>> Binaryen already installed, skipping" 
else
    echo ">>>> Binaryen not installed, installing binaryen"
    ./scripts/install-binaryen.sh
fi

if ! [ -x "$(command -v wasm-pack)" ]; then
    echo ">>> Installing wasm-pack"
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

echo ">>> Installing nightly toolchain"

rustup toolchain install nightly
