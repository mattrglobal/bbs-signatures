import {
  BbsKeyPair,
  BbsSignRequest,
  BbsVerifyRequest,
  BBS_SIGNATURE_LENGTH,
  BlsBbsSignRequest,
  BlsKeyPair,
  BlsBbsVerifyRequest,
} from "../../../../lib";
import { assert, base64Decode } from "../util";
let blsKeyPair: BlsKeyPair;

function initializeVerify(wasm: any) {
  blsKeyPair = wasm.generateBls12381KeyPair();
}

function verifySingleMessageSignature(wasm: any) {
  const bbsPublicKey = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 1,
  });
  const request: BbsSignRequest = {
    keyPair: bbsPublicKey,
    messages: ["ExampleMessage"],
  };
  const signature = wasm.sign(request);
  const verifyRequest: BbsVerifyRequest = {
    publicKey: bbsPublicKey.publicKey,
    messages: ["ExampleMessage"],
    signature,
  };
  const result = wasm.verify(verifyRequest);
  assert(result.verified === true, "Signature verification failed");
}

function verifyMultiMessageSignature(wasm: any) {
  const bbsPublicKey = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 3,
  });
  const request: BbsSignRequest = {
    keyPair: bbsPublicKey,
    messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
  };
  const signature = wasm.sign(request);
  const verifyRequest: BbsVerifyRequest = {
    publicKey: bbsPublicKey.publicKey,
    messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
    signature,
  };
  const result = wasm.verify(verifyRequest);
  assert(result.verified === true, "Signature verification failed");
}

function failVerifySignatureWithOneWrongMessage(wasm: any) {
  const messages = ["BadMessage"];
  const bbsPublicKey = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 1,
  });
  const verifyRequest: BbsVerifyRequest = {
    publicKey: bbsPublicKey.publicKey,
    messages,
    signature: base64Decode(
      "kTV8dar9xLWQZ5EzaWYqTRmgA6dw6wcrUw5c///crRD2QQPXX9Di+lgCPCXAA5D8Pytuh6bNSx6k4NZTR9KfSNdaejKl2zTU9poRfzZ2SIskdgSHTZ2y7jLm/UEGKsAs3tticBVj1Pm2GNhQI/OlXQ=="
    ),
  };
  const result = wasm.verify(verifyRequest);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

function failVerifySignatureWithWrongMessages(wasm: any) {
  const messages = ["BadMessage", "BadMessage", "BadMessage"];
  const bbsPublicKey = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 3,
  });
  const verifyRequest: BbsVerifyRequest = {
    publicKey: bbsPublicKey.publicKey,
    messages,
    signature: base64Decode(
      "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
    ),
  };
  const result = wasm.verify(verifyRequest);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

function failVerifySignatureWithZeroMessages(wasm: any) {
  const bbsPublicKey = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 1,
  });
  const verifyRequest: BbsVerifyRequest = {
    publicKey: bbsPublicKey.publicKey,
    messages: [],
    signature: base64Decode(
      "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
    ),
  };
  const result = wasm.verify(verifyRequest);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

function failVerifySignatureWhenInvalidLengthPublicKey(wasm: any) {
  const request: BbsVerifyRequest = {
    publicKey: new Uint8Array(20),
    messages: [],
    signature: base64Decode(
      "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
    ),
  };
  const result = wasm.verify(request);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

function blsVerifySingleMessageSignature(wasm: any) {
  const request: BlsBbsSignRequest = {
    keyPair: blsKeyPair,
    messages: ["ExampleMessage"],
  };
  const signature = wasm.blsSign(request);
  const verifyRequest: BlsBbsVerifyRequest = {
    publicKey: blsKeyPair.publicKey,
    messages: ["ExampleMessage"],
    signature,
  };
  const result = wasm.blsVerify(verifyRequest);
  assert(result.verified === true, "Signature verification failed");
}

function blsVerifyMultiMessageSignature(wasm: any) {
  const request: BlsBbsSignRequest = {
    keyPair: blsKeyPair,
    messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
  };
  const signature = wasm.blsSign(request);
  const verifyRequest: BlsBbsVerifyRequest = {
    publicKey: blsKeyPair.publicKey,
    messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
    signature,
  };
  const result = wasm.blsVerify(verifyRequest);
  assert(result.verified === true, "Signature verification failed");
}

function failBlsVerifySignatureWithOneWrongMessage(wasm: any) {
  const messages = ["BadMessage"];
  const verifyRequest: BlsBbsVerifyRequest = {
    publicKey: blsKeyPair.publicKey,
    messages,
    signature: base64Decode(
      "kTV8dar9xLWQZ5EzaWYqTRmgA6dw6wcrUw5c///crRD2QQPXX9Di+lgCPCXAA5D8Pytuh6bNSx6k4NZTR9KfSNdaejKl2zTU9poRfzZ2SIskdgSHTZ2y7jLm/UEGKsAs3tticBVj1Pm2GNhQI/OlXQ=="
    ),
  };
  const result = wasm.blsVerify(verifyRequest);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

function failBlsVerifySignatureWithWrongMessages(wasm: any) {
  const messages = ["BadMessage", "BadMessage", "BadMessage"];
  const verifyRequest: BlsBbsVerifyRequest = {
    publicKey: blsKeyPair.publicKey,
    messages,
    signature: base64Decode(
      "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
    ),
  };
  const result = wasm.blsVerify(verifyRequest);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

function failBlsVerifySignatureWithZeroMessages(wasm: any) {
  const verifyRequest: BlsBbsVerifyRequest = {
    publicKey: blsKeyPair.publicKey,
    messages: [],
    signature: base64Decode(
      "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
    ),
  };
  const result = wasm.blsVerify(verifyRequest);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

function failBlsVerifySignatureWhenInvalidLengthPublicKey(wasm: any) {
  const verifyRequest: BlsBbsVerifyRequest = {
    publicKey: new Uint8Array(20),
    messages: [],
    signature: base64Decode(
      "jYidhsdqxvAyNXMV4/vNfGM/4AULfSyfvQiwh+dDd4JtnT5xHnwpzMYdLdHzBYwXaGE1k6ln/pwtI4RwQZpl03SCv/mT/3AdK8PB2y43MGdMSeGTyZGfZf+rUrEDEs3lTfmPK54E+JBzd96gnrF2iQ=="
    ),
  };
  const result = wasm.blsVerify(verifyRequest);
  assert(
    result.verified === false,
    "Invalid signature verification didn't fail"
  );
}

export default {
  initializeVerify,
  verifySingleMessageSignature,
  verifyMultiMessageSignature,
  failVerifySignatureWithOneWrongMessage,
  failVerifySignatureWithWrongMessages,
  failVerifySignatureWithZeroMessages,
  failVerifySignatureWhenInvalidLengthPublicKey,
  blsVerifySingleMessageSignature,
  blsVerifyMultiMessageSignature,
  failBlsVerifySignatureWithOneWrongMessage,
  failBlsVerifySignatureWithWrongMessages,
  failBlsVerifySignatureWithZeroMessages,
  failBlsVerifySignatureWhenInvalidLengthPublicKey,
};
