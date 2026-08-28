# TRUEHIRE Public Release Authorization

**Decision date:** 2026-08-28  
**State:** `AUTHORIZED_FOR_DETERMINISTIC_PUBLIC_PROJECTION`

The human-controlled release boundary has been explicitly decided.

## Approved

- TRUEHIRE software / implementation material: `Apache-2.0`;
- TRUEHIRE narrative / non-software material: `CC-BY-4.0`;
- creation of the public reference repository `Matawaka/truehire-public`;
- publication only from the deterministic allowlisted public projection.

## Must remain private

The canonical development repository `Matawaka/truehire` remains private. Its private development history is **not** part of the public release authorization.

```text
Public Repository Creation != Private Repository Visibility Change
Public Projection != Private Development History
```

## Not authorized by this decision

This release authorization does not authorize:

- deployment of a managed TRUEHIRE service;
- processing of real candidate data;
- autonomous or hidden employment decisions;
- automatic candidate ranking or personality scoring;
- protected-attribute inference;
- binary/bundled distribution without release-specific third-party compliance review;
- representation of a fork or service as the canonical TRUEHIRE project.

```text
Publication Authorization != Deployment Authorization
Open Source != Candidate Processing Authority
Source Projection PASS != Binary Distribution Compliance PASS
```

## License package

The authoritative licensing map is `LICENSE.md` with full texts in:

- `LICENSES/Apache-2.0.txt`;
- `LICENSES/CC-BY-4.0.txt`.

`NOTICE.md` preserves canonical identity, provenance and anti-impersonation boundaries.

Third-party material remains governed by its own applicable licenses.

## Commercial boundary

Publishing the reference source does not turn managed operation into a free service.

Paid surfaces may remain available for bounded pilots, private evidence/workspace functions, managed integrations and hosting, audit/contestability workflows, enterprise policy/conformance support and privacy-preserving selective disclosure.

The intended monetization boundary excludes sale of private candidate profiles, hidden scoring and autonomous employment decisions.

## Release mechanics

The public repository must be populated from the deterministic projection produced by `tools/build-public-projection.mjs` and bound by the private authorization receipt.

The public projection contains release receipts, but it does not export the private repository's `.git` history, private deployment identity, private workflows or excluded private assessment artifacts.

The exact projection root is bound by CI in the private authorization receipt before public materialization.
