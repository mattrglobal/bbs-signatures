import {
  BbsKeyPair,
  BbsSignRequest,
  BBS_SIGNATURE_LENGTH,
  BlsBbsSignRequest,
  BlsKeyPair,
} from "../../../../lib";
import { assert } from "../util";

let blsKeyPair: BlsKeyPair;
let bbsKeyPair: BbsKeyPair;

function initializeSign(wasm: any) {
  blsKeyPair = wasm.generateBls12381KeyPair();
  bbsKeyPair = wasm.bls12381toBbs({ keyPair: blsKeyPair, messageCount: 3 });
}

function signSingleMessage(wasm: any) {
  const bbsKeyPair = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 1,
  });
  const request: BbsSignRequest = {
    keyPair: bbsKeyPair,
    messages: ["ExampleMessage"],
  };
  const signature = wasm.sign(request);
  assert(signature.length === BBS_SIGNATURE_LENGTH, "Invalid signature length");
}

function signMultipleMessages(wasm: any) {
  const request: BbsSignRequest = {
    keyPair: bbsKeyPair,
    messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
  };
  const signature = wasm.sign(request);
  assert(signature.length === BBS_SIGNATURE_LENGTH, "Invalid signature length");
}

function signMultipleMessagesWhenSupportedByPublicKey(wasm: any) {
  const request: BbsSignRequest = {
    keyPair: bbsKeyPair,
    messages: ["ExampleMessage", "ExampleMessage"],
  };
  const signature = wasm.sign(request);
  assert(signature.length === BBS_SIGNATURE_LENGTH, "Invalid signature length");
}

function failSignWhenMissingSecretKey(wasm: any) {
  const bbsKey = {
    publicKey: bbsKeyPair.publicKey,
    messageCount: bbsKeyPair.messageCount,
  };
  const request: BbsSignRequest = {
    keyPair: bbsKey,
    messages: ["ExampleMessage"],
  };

  // Expect it to fail
  try {
    wasm.sign(request);
  } catch (e) {
    assert(e !== undefined, "Invalid sign request didn't fail");
  }
}

function failSignWhenUnsupportedMessageCount(wasm: any) {
  const bbsKeyPair = wasm.bls12381toBbs({
    keyPair: blsKeyPair,
    messageCount: 1,
  });
  const request: BbsSignRequest = {
    keyPair: bbsKeyPair,
    messages: ["ExampleMessage", "ExampleMessage", "ExampleMessage"],
  };

  // Expect it to fail
  try {
    wasm.sign(request);
  } catch (e) {
    assert(e !== undefined, "Invalid sign request didn't fail");
  }
}

function blsSignSingleMessage(wasm: any) {
  const request: BlsBbsSignRequest = {
    keyPair: blsKeyPair,
    messages: ["ExampleMessage"],
  };
  const signature = wasm.blsSign(request);
  assert(signature.length === BBS_SIGNATURE_LENGTH, "Invalid signature length");
}

function blsSignMultipleMessages(wasm: any) {
  const request: BlsBbsSignRequest = {
    keyPair: blsKeyPair,
    messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
  };
  const signature = wasm.blsSign(request);
  assert(signature.length === BBS_SIGNATURE_LENGTH, "Invalid signature length");
}

function failBlsSignWhenMissingSecretKey(wasm: any) {
  const blsKey = {
    publicKey: blsKeyPair.publicKey,
  };
  const request: BlsBbsSignRequest = {
    keyPair: blsKey,
    messages: ["ExampleMessage", "ExampleMessage2", "ExampleMessage3"],
  };

  // Expect it to fail
  try {
    wasm.blsSign(request);
  } catch (e) {
    assert(e !== undefined, "Invalid sign request didn't fail");
  }
}

function failBlsSignWhenMissingMessages(wasm: any) {
  const request: BlsBbsSignRequest = {
    keyPair: blsKeyPair,
    messages: [],
  };

  // Expect it to fail
  try {
    wasm.blsSign(request);
  } catch (e) {
    assert(e !== undefined, "Invalid sign request didn't fail");
  }
}

export default {
  initializeSign,
  signSingleMessage,
  signMultipleMessages,
  signMultipleMessagesWhenSupportedByPublicKey,
  failSignWhenMissingSecretKey,
  failSignWhenUnsupportedMessageCount,
  blsSignSingleMessage,
  blsSignMultipleMessages,
  failBlsSignWhenMissingSecretKey,
  failBlsSignWhenMissingMessages,
};
