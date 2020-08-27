# [0.4.0](https://github.com/mattrglobal/bbs-signatures/compare/v0.3.0...v0.4.0) (2020-08-27)

### Bug Fixes

- uint8array return type casting ([#32](https://github.com/mattrglobal/bbs-signatures/issues/32)) ([28ed2fa](https://github.com/mattrglobal/bbs-signatures/commit/28ed2fa998562b253b1e793ff35d773602a88027))

### Features

- add asm.js roll back support ([#30](https://github.com/mattrglobal/bbs-signatures/issues/30)) ([4d28ad3](https://github.com/mattrglobal/bbs-signatures/commit/4d28ad3bce39e207a04ef660d478983212abde6c))
- add node bbs roll back support ([#33](https://github.com/mattrglobal/bbs-signatures/issues/33)) ([49aee81](https://github.com/mattrglobal/bbs-signatures/commit/49aee811ca73854456e9404b384a4935063f8e0a))
- change to use byte arrays for messages and support generating g1 keys ([#40](https://github.com/mattrglobal/bbs-signatures/issues/40)) ([92238cf](https://github.com/mattrglobal/bbs-signatures/commit/92238cf0895cde7a88c2ce6a830bf07bf2a7d28d))

### BREAKING CHANGES

- generateBls12381KeyPair has been changed to generateBls12381G2KeyPair
- All operations involving messages and nonces are now in terms of Uint8Array's rather than strings

# [0.3.0](https://github.com/mattrglobal/bbs-signatures/compare/v0.2.0...v0.3.0) (2020-07-20)

### Bug Fixes

- uint8array return type casting ([#32](https://github.com/mattrglobal/bbs-signatures/issues/32)) ([28ed2fa](https://github.com/mattrglobal/bbs-signatures/commit/28ed2fa998562b253b1e793ff35d773602a88027))

### Features

- add asm.js roll back support ([#30](https://github.com/mattrglobal/bbs-signatures/issues/30)) ([4d28ad3](https://github.com/mattrglobal/bbs-signatures/commit/4d28ad3bce39e207a04ef660d478983212abde6c))
- add node bbs roll back support ([#33](https://github.com/mattrglobal/bbs-signatures/issues/33)) ([49aee81](https://github.com/mattrglobal/bbs-signatures/commit/49aee811ca73854456e9404b384a4935063f8e0a))

# [0.2.0](https://github.com/mattrglobal/bbs-signatures/compare/v0.1.0...v0.2.0) (2020-06-04)

### Features

- add browser sample ([#27](https://github.com/mattrglobal/bbs-signatures/issues/27)) ([fdec4fc](https://github.com/mattrglobal/bbs-signatures/commit/fdec4fcf6645b7b94a704fc5fab1fa5d74c19d01))
- add node.js sample ([#25](https://github.com/mattrglobal/bbs-signatures/issues/25)) ([04042c2](https://github.com/mattrglobal/bbs-signatures/commit/04042c247689ebf5ba78ebd970c2c666fda34fa6))

# 0.1.0 (2020-06-04)

Initial release
