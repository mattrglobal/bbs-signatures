[![MATTR](./docs/assets/mattr-logo-square.svg)](https://github.com/mattrglobal)

# bbs-signatures

![npm-version](https://badgen.net/npm/v/@mattrglobal/bbs-signatures)
![npm-unstable-version](https://badgen.net/npm/v/@mattrglobal/bbs-signatures/unstable)
![Master](https://github.com/mattrglobal/bbs-signatures/workflows/push-master/badge.svg)
![Release](https://github.com/mattrglobal/bbs-signatures/workflows/push-release/badge.svg)
![codecov](https://codecov.io/gh/mattrglobal/bbs-signatures/branch/master/graph/badge.svg)

This repository is the home to a performant multi-message digital signature algorithm implementation which supports
deriving zero knowledge proofs that enable selective disclosure from the originally signed message set.

[BBS+ Signatures](https://github.com/mattrglobal/bbs-signatures-spec) are a digital signature algorithm originally born from the work on
[Short group signatures](https://crypto.stanford.edu/~xb/crypto04a/groupsigs.pdf) by Boneh, Boyen, and Shachum which was
later improved on in [Constant-Size Dynamic k-TAA](http://web.cs.iastate.edu/~wzhang/teach-552/ReadingList/552-14.pdf)
as BBS+ and touched on again in section 4.3 in
[Anonymous Attestation Using the Strong Diffie Hellman Assumption Revisited ](https://www.researchgate.net/publication/306347781_Anonymous_Attestation_Using_the_Strong_Diffie_Hellman_Assumption_Revisited).

BBS+ signatures require a
[pairing-friendly curve](https://tools.ietf.org/html/draft-irtf-cfrg-pairing-friendly-curves-03), this library includes
support for [BLS12-381](https://tools.ietf.org/html/draft-irtf-cfrg-pairing-friendly-curves-03#section-2.4).

BBS+ Signatures allow for multi-message signing whilst producing a single output signature. With a BBS signature, a
[proof of knowledge](https://en.wikipedia.org/wiki/Proof_of_knowledge) based proof can be produced where only some of
the originally signed messages are revealed at the discretion of the prover.

For more details on the signature algorithm please refer to [here](https://github.com/mattrglobal/bbs-signatures-spec).

## Getting started

To use this package within your project simply run

```
npm install @mattrglobal/bbs-signatures
```

Or with [Yarn](https://yarnpkg.com/)

```
yarn add @mattrglobal/bbs-signatures
```

### Environment Support

This library includes a couple of features to ensure the most performant implementation of BBS is running in a execution environment. The order of selection is the following.

1. If in a node js based environment and the optional dependency of [@mattrglobal/node-bbs-signatures](https://github.com/mattrglobal/node-bbs-signatures) is installed use this.
2. If in an environment that supports [Web Assembly](https://webassembly.org/) use this.
3. Else use a version compiled to [asm.js](http://asmjs.org/).

**Note** Please refer to running the benchmarks below where you can compare these different implementations, the differences are very notable.

**Note** To force the usage of a particular environment set the `BBS_SIGNATURES_MODE` environment variable to one of the following values

- `NODE_JS_MODULE` - Use native node module, ensure [@mattrglobal/node-bbs-signatures](https://github.com/mattrglobal/node-bbs-signatures) is installed
- `WASM` - Use the wasm module

## Usage

See the [sample](./sample) directory for a runnable demo's.

The following is a short sample on how to use the API

```typescript
import {
  generateBls12381G2KeyPair,
  blsSign,
  blsVerify,
  blsCreateProof,
  blsVerifyProof,
} from "@mattrglobal/bbs-signatures";

//Generate a new key pair
const keyPair = await generateBls12381G2KeyPair();

//Set of messages we wish to sign
const messages = [
  Uint8Array.from(Buffer.from("message1", "utf-8")),
  Uint8Array.from(Buffer.from("message2", "utf-8")),
];

//Create the signature
const signature = await blsSign({
  keyPair,
  messages: messages,
});

//Verify the signature
const isVerified = await blsVerify({
  publicKey: keyPair.publicKey,
  messages: messages,
  signature,
});

//Derive a proof from the signature revealing the first message
const proof = await blsCreateProof({
  signature,
  publicKey: keyPair.publicKey,
  messages,
  nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
  revealed: [0],
});

//Verify the created proof
const isProofVerified = await blsVerifyProof({
  proof,
  publicKey: keyPair.publicKey,
  messages: messages.slice(0, 1),
  nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
});
```

## Element Size

Within a digital signature there are several elements for which it is useful to know the size, the following table
outlines the general equation for calculating element sizes in relation to BBS+ signatures as it is dependent on the
pairing friendly curve used.

| Element     | Size Equation                        |
| ----------- | ------------------------------------ |
| Private Key | F                                    |
| Public Key  | G2                                   |
| Signature   | G1 + 2\*F                            |
| Proof       | 5*G1 + (4 + no_of_hidden_messages)*F |

- `F` A field element
- `G1` A point in the field of G1
- `G2` A point in the field of G2
- `no_of_hidden_messages` The number of the hidden messages

This library includes specific support for BLS12-381 keys with BBS+ signatures and hence gives rise to the following
concrete sizes

| Element     | Size with BLS12-381                     |
| ----------- | --------------------------------------- |
| Private Key | 32 Bytes                                |
| Public Key  | 96 Bytes                                |
| Signature   | 112 Bytes                               |
| Proof       | 368 + (no_of_hidden_messages)\*32 Bytes |

## Getting started as a contributor

The following describes how to get started as a contributor to this project

### Prerequisites

The following is a list of dependencies you must install to build and contribute to this project

- [Yarn](https://yarnpkg.com/)
- [Rust](https://www.rust-lang.org/)

For more details see our [contribution guidelines](./docs/CONTRIBUTING.md)

#### Install

To install the package dependencies run:

```
yarn install --frozen-lockfile
```

#### Build

To build the project for debug run:

```
yarn build
```

#### Test

To run the all test in the project run:

```
yarn test
```

To run just the tests for a node environment using the native node module of [@mattrglobal-node-bbs-signatures](https://github.com/mattrglobal/node-bbs-signatures) run:

```
yarn test:node
```

To run just the tests for a node environment using the wasm module run:

```
yarn test:wasm
```

To run just the tests for a browser environment run:

```
yarn test:browser
```

#### Benchmark

To benchmark the implementation locally in a node environment using the native node module of [@mattrglobal-node-bbs-signatures](https://github.com/mattrglobal/node-bbs-signatures) run:

```
yarn benchmark:node
```

To benchmark the implementation locally in a node environment using the wasm module run:

```
yarn benchmark:wasm
```

## Dependencies

This library uses the [bbs](https://crates.io/crates/bbs) rust crate for the implementation of BBS+ signatures and
BLS12-381 which is then wrapped and exposed in javascript/typescript using [Web Assembly](https://webassembly.org/).

## Security Policy

Please see our [security policy](./SECURITY.md) for additional details about responsible disclosure of security related issues.

## Relevant References

For those interested in more details, you might find the following resources helpful

- [Details on the algorithm](docs/ALGORITHM.md)
- [BLS12-381 For The Rest Of Us](https://hackmd.io/@benjaminion/bls12-381)
- [Pairing-based cryptography](https://en.wikipedia.org/wiki/Pairing-based_cryptography)
- [Exploring Elliptic Curve Pairings](https://vitalik.ca/general/2017/01/14/exploring_ecp.html)
- [Anonymous Attestation Using the Strong Diffie Hellman Assumption Revisited](https://www.researchgate.net/publication/306347781_Anonymous_Attestation_Using_the_Strong_Diffie_Hellman_Assumption_Revisited)
- [Pairing Friendly Curves](https://tools.ietf.org/html/draft-irtf-cfrg-pairing-friendly-curves-01)
- [BLS Signatures](https://tools.ietf.org/html/draft-irtf-cfrg-bls-signature-02)

---

<p align="center"><a href="https://mattr.global" target="_blank"><img height="40px" src ="./docs/assets/mattr-logo-tm.svg"></a></p><p align="center">Copyright © MATTR Limited. <a href="./LICENSE">Some rights reserved.</a><br/>“MATTR” is a trademark of MATTR Limited, registered in New Zealand and other countries.</p>
