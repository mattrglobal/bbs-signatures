const { generateBls12381KeyPair, bls12381toBbs, Bls12381ToBbsRequest } = require("./lib");

function main() {
    const keyPair = generateBls12381KeyPair();

    const request = new Bls12381ToBbsRequest(keyPair, 1);

    const result = bls12381toBbs(request);
}

main();