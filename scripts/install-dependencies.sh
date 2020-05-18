set -e

echo ">>>> Installing Dependencies"


if [ -d "binaryen/bin" ] 
then
    echo ">>>> Binaryen already installed, skipping" 
else
    echo ">>>> Binaryen not installed, starting install"
    ./scripts/install-binaryen.sh
fi
