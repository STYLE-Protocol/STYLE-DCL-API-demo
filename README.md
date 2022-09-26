## STYLE-Protocol-DCL-API-demo

This is Example for connecting NFT Style-Protocol derivatives with DCL registry.

### Endpoints
- `@GET /registry/:registry-id/address/:address/assets` - Retrieves a list of assets associated with a given address.
  - `:registry-id` - it is `styleProtocolDerivatives`.
  - `:address` - wallet address, whose tokens we need to fetch.
 
- `@GET /registry/:registry-id/address/:address/assets/:id` - Validates if a DCL asset is owned by a user.
  - `:registry-id` - it is `styleProtocolDerivatives`.
  - `:address` - wallet address, whose tokens we need to fetch.
  - `:id` - it is `tokenAddress:tokenId` - where `tokenAddress` is an address of NFT collection and `tokenId` is an id of the NFT at that collection. 

### Example requests
- https://style-protocol-decentraland-api-test.vercel.app/api/registry/styleProtocolDerivatives/address/0x67701e71F9412Af1BcB2D77897F40139B6Ccc073/assets/0x943449ff0ac328c9a74b159e8df53ff03e410310:2
- https://style-protocol-decentraland-api-test.vercel.app/api/registry/styleProtocolDerivatives/address/0x67701e71F9412Af1BcB2D77897F40139B6Ccc073/assets
