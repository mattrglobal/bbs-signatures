//TODO attribute approach to polkadot/wasm-crypto

//TODO this is where we declare the wasm module

const INIT_ERRROR = '@mattrglobal/wasm-bbs-signatures has not been initialized';

module.exports = function (stubbed) {
    const wrapReady = (fn) =>
        (...params) => {
        if(!stubbed.isReady()){
            throw new Error(INIT_ERRROR);
        }

        return fn(...params);
    };

    return {
        stubbed: stubbed,
        generateBls12381KeyPair: wrapReady(stubbed.bls12381_generate_key_pair),
        isReady: stubbed.isReady,
        waitReady: stubbed.waitReady
    };
};