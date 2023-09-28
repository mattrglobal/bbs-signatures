set -e

echo ">>>> Installing Dependencies"

echo ">>> Installing rust version 1.72"
rustup install 1.72

if ! [ -x "$(command -v wasm-pack)" ]; then
    echo ">>> Installing wasm-pack"
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi
