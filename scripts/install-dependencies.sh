set -e

echo ">>>> Installing Dependencies"

if ! [ -x "$(command -v wasm-pack)" ]; then
    echo ">>> Installing wasm-pack"
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi
