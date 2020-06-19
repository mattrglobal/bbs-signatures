function isFunction(value) {
  return typeof value === "function";
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(isFunction(message) ? message() : message);
  }
}

const INIT_ERROR = "bbs signatures has not been initialized";

module.exports = function (stubbed) {
  const wrapReady = (fn) => (...params) => {
    assert(stubbed.isReady(), INIT_ERROR);

    return fn(...params);
  };

  return {
    DEFAULT_BLS12381_PRIVATE_KEY_LENGTH: 32,
    DEFAULT_BLS12381_PUBLIC_KEY_LENGTH: 96,
    BBS_SIGNATURE_LENGTH: 112,

    generateBls12381KeyPair: wrapReady(stubbed.generateBls12381KeyPair),
    bls12381toBbs: wrapReady(stubbed.bls12381toBbs),
    Bls12381ToBbsRequest: wrapReady(stubbed.Bls12381ToBbsRequest),
    sign: wrapReady(stubbed.sign),
    blsSign: wrapReady(stubbed.blsSign),
    verify: wrapReady(stubbed.verify),
    blsVerify: wrapReady(stubbed.blsVerify),
    createProof: wrapReady(stubbed.createProof),
    blsCreateProof: wrapReady(stubbed.blsCreateProof),
    verifyProof: wrapReady(stubbed.verifyProof),
    blsVerifyProof: wrapReady(stubbed.blsVerifyProof),

    isReady: stubbed.isReady,
    waitReady: stubbed.waitReady,
  };
};
