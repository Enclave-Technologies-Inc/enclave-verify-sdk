# Enclave Verify SDK

Published npm packages for Enclave Verify integrators and apps.

| Package | Description |
|---------|-------------|
| `@enclave/verify-sdk` | Post-quantum credential core (SHAKE256, Merkle, ML-DSA-65) |
| `@enclave/verify-shared` | Shared Supabase, Stripe, and Verify app utilities |

Source of truth: [enclave-verify](https://github.com/Enclave-Verify/enclave-verify) monorepo (`packages/sdk`, `packages/shared`).

## Build

```bash
npm install
npm run build
```

## Publish

```bash
npm publish -w @enclave/verify-sdk --access public
npm publish -w @enclave/verify-shared --access public
```
