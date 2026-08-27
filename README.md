# @enclave/verify-sdk

Post-quantum verifiable credentials for **Enclave Verify**. Open-source (AGPL-3.0-or-later) cryptography: SHAKE256 claim hashing, Merkle selective disclosure, and ML-DSA-65 (FIPS 204) signatures.

## Enclave Verify repos

| Repo | Org | Role |
|------|-----|------|
| **enclave-verify** | Enclave-Technologies-Inc-Private | App (web + native) |
| **enclave-verify-sdk** | Enclave-Technologies-Inc | This package — AGPL crypto |
| **enclave-verify-api** | Enclave-Technologies-Inc-Private | Supabase edge functions + REST API |
| **enclave-verify-landing** | Enclave-Technologies-Inc-Private | Marketing site |

App and API both depend on this SDK so crypto can be audited in one place.

## Install

```bash
npm install @enclave/verify-sdk
```

Monorepo sibling (local dev):

```json
"@enclave/verify-sdk": "file:../enclave-verify-sdk"
```

## Usage

```ts
import { issueCredential } from "@enclave/verify-sdk/credential/issue";
import { verifyCredential } from "@enclave/verify-sdk/verify/verify";
```

## Development

```bash
npm install
npm run build
npm run keygen
npm test
```

## License

AGPL-3.0-or-later — see [LICENSE](./LICENSE). Contact Enclave for commercial licensing.
