import { assert } from "./util";

function convertBls12381KeyPairToBbs(wasm: any) {
  const blsKeyPair = wasm.generateBls12381KeyPair();
  assert(blsKeyPair !== undefined, "Generated BLS keypair is undefined");

  const bbsKeyPair = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 10,
  });

  assert(bbsKeyPair !== undefined, "BLS to BBS resulted in undefined keypair");
  assert(
    bbsKeyPair.messageCount === 10,
    "BBS keypair has incorrect messageCount"
  );
  assert(
    bbsKeyPair.secretKey !== undefined,
    "BBS keypair has undefined secretKey"
  );
  assert(
    bbsKeyPair.publicKey !== undefined,
    "BBS keypair has undefined publickey"
  );
}

function convertBls12381PublicKeyToBbsKey(wasm: any) {
  const blsKeyPair = wasm.generateBls12381KeyPair();
  assert(blsKeyPair !== undefined, "Generated BLS keypair is undefined");

  const blsPublicKey = {
    publicKey: blsKeyPair.publicKey,
  };

  const bbsKeyPair = wasm.bls12381toBbs({
    keyPair: blsPublicKey,
    messageCount: 10,
  });

  assert(bbsKeyPair !== undefined, "BLS to BBS resulted in undefined keypair");
  assert(
    bbsKeyPair.messageCount === 10,
    "BBS keypair has incorrect messageCount"
  );
  assert(
    bbsKeyPair.secretKey === undefined,
    "BBS keypair has defined secretKey"
  );
  assert(
    bbsKeyPair.publicKey !== undefined,
    "BBS keypair has undefined publickey"
  );
}

function failConvertBls12381KeyPairToBbsWithZeroMessageCount(wasm: any) {
  const blsKeyPair = wasm.generateBls12381KeyPair();
  assert(blsKeyPair !== undefined, "Generated BLS keypair is undefined");

  // Expect it to fail
  try {
    wasm.bls12381toBbs({
      keyPair: blsKeyPair,
      messageCount: 0,
    });
  } catch (e) {
    assert(
      e !== undefined,
      "Invalid BLS to BBS keypair conversion didn't fail"
    );
  }
}

export default {
  convertBls12381KeyPairToBbs,
  convertBls12381PublicKeyToBbsKey,
  failConvertBls12381KeyPairToBbsWithZeroMessageCount,
};
