![Mattr logo](./docs/assets/mattr-black.svg)

# bbs-signatures

![npm-version](https://badgen.net/npm/v/@mattrglobal/bbs-signatures)
![npm-unstable-version](https://badgen.net/npm/v/@mattrglobal/bbs-signatures/unstable)
![Master](https://github.com/mattrglobal/bbs-signatures/workflows/push-master/badge.svg)
![Release](https://github.com/mattrglobal/bbs-signatures/workflows/push-release/badge.svg)
![codecov](https://codecov.io/gh/mattrglobal/bbs-signatures/branch/master/graph/badge.svg)

This repository is the home to a performant multi-message digital signature algorithm implementation which supports
deriving zero knowledge proofs that enable selective disclosure from the originally signed message set.

BBS+ Signatures are a digital signature algorithm originally born from the work on
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

For more details on the signature algorithm please refer to [here](https://github.com/mattrglobal/node-bbs-signatures/blob/master/docs/ALGORITHM.md)

**Note** the performance of this library in node environments is significantly different than with a native node module, for those requiring the highest level of performance we recommend using [node-bbs-signatures](https://github.com/mattrglobal/node-bbs-signatures).

## Getting started

To use this package within your project simply run

```
npm install @mattrglobal/bbs-signatures
```

Or with [Yarn](https://yarnpkg.com/)

```
yarn add @mattrglobal/bbs-signatures
```

### Using via CDN in browser

To use this library in browser via the [unpkg](https://unpkg.com) CDN, include the following script element in your HTML

```HTML
<script type="text/javascript" src="https://unpkg.com/@mattrglobal/bbs-signatures/dist/bbs-signatures.min.js"></script></body>
```

### React Native Support

**Support is still in-progress**

Currently WASM support in react native is [not official](https://react-native.canny.io/feature-requests/p/support-wasmwebassembly) although there are experimentations underway.

There are several different ways in which support can be accomplished

1. Injecting a polyfill of the Web Assembly tool chain such as [WebAssemblyJS](https://github.com/xtuc/webassemblyjs), however experimentation with this library yielded the same issue as seen in [here](https://github.com/xtuc/webassemblyjs/issues/606).
2. A shim that trees down on to the native WebAssembly implementation provided by the OS, an example of the approach is captured [here](https://github.com/ExodusMovement/react-native-wasm)
3. Compiling the wasm back into [asm.js](http://asmjs.org/) using the [wasm2js](https://github.com/WebAssembly/binaryen/blob/master/src/wasm2js.h) from [binaryen](https://github.com/WebAssembly/binaryen), note this is currently the preferred option and will be pursued for this library in the short term.

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

To build the project run:

```
yarn build
```

#### Test

To run the all test in the project run:

```
yarn test
```

To run just the tests for a node environment run:

```
yarn test:node
```

To run just the tests for a browser environment run:

```
yarn test:browser
```

#### Benchmark

To benchmark the implementation locally in a node environment run:

```
yarn benchmark:node
```

## Dependencies

This library uses the [bbs](https://crates.io/crates/bbs) rust crate for the implementation of BBS+ signatures and
BLS12-381 which is then wrapped and exposed in javascript/typescript using [Web Assembly](https://webassembly.org/).

## Relevant References

For those interested in more details, you might find the following resources helpful

- [Details on the algorithm](docs/ALGORITHM.md)
- [BLS12-381 For The Rest Of Us](https://hackmd.io/@benjaminion/bls12-381)
- [Pairing-based cryptography](https://en.wikipedia.org/wiki/Pairing-based_cryptography)
- [Exploring Elliptic Curve Pairings](https://vitalik.ca/general/2017/01/14/exploring_ecp.html)
- [Anonymous Attestation Using the Strong Diffie Hellman Assumption Revisited](https://www.researchgate.net/publication/306347781_Anonymous_Attestation_Using_the_Strong_Diffie_Hellman_Assumption_Revisited)
- [Pairing Friendly Curves](https://tools.ietf.org/html/draft-irtf-cfrg-pairing-friendly-curves-01)
- [BLS Signatures](https://tools.ietf.org/html/draft-irtf-cfrg-bls-signature-02)
