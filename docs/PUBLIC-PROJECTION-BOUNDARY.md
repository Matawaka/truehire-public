# TRUEHIRE Public Projection Boundary v0.1

## Purpose

TRUEHIRE is developed in a private repository while its reference implementation is authorized for public inspection. A direct visibility change would expose private Git history and operational/development artifacts that are not required to inspect the product.

Therefore public release is defined as a deterministic projection rather than a visibility mutation of the development repository.

```text
Private Development Repository
→ Explicit Public Projection Contract
→ Deterministic Projection Builder
→ Projection Receipt
→ Human License/Public Release Authorization
→ Public Reference Repository
```

## Core distinction

```text
Full Reference Disclosure != Full Private History Disclosure
Current Tree Sanitization != History Sanitization
Public Projection != Visibility Change
Projection Receipt != Deployment Authorization
```

The public projection contains the current source, tests and documents needed to inspect the TRUEHIRE reference implementation while excluding operational/private-development material that does not define the public product.

## Allowlist, not denylist

The projection uses an explicit path allowlist. A new file created later in the private repository is **not** exported automatically.

This prevents an unrelated future artifact, credential-adjacent file, internal audit record or deployment binding from becoming public merely because it was not added to a blacklist.

`Unreviewed New Private Path != Public Projection Member`

## Explicit exclusions

At v0.1 the public projection does not copy:

- private GitHub workflow history/configuration as a whole;
- the private `.openai/hosting.json` project binding;
- private disclosure-assessment process receipts;
- the historical opaque `public/og.png`;
- the internal `release/` implementation directory itself;
- private Git history.

These exclusions do not claim those artifacts are secret or unlawful to disclose. They mean they are not needed for the authorized public reference release or have a different operational/provenance boundary.

## Generated replacements

### Hosting descriptor

The projected repository receives a non-operational placeholder `.openai/hosting.json`. It exists only so the public reference source can preserve its build shape without inheriting a private deployment identity.

```text
Reference Build Shape != Production Hosting Identity
```

### OpenGraph asset

The private `public/og.png` is not copied. The projection receives `public/og.svg`, whose full source is text-reviewable and lives in `release/public-projection/v0.1/og.svg`.

The projected copy of `app/layout.tsx` references `/og.svg` instead of `/og.png`.

```text
Replacement Asset Provenance != Historical Asset Provenance
```

### Public authorization receipt

The projection generates `PUBLIC_RELEASE_AUTHORIZATION.json` from the private human-authorization receipt without exporting the private `release/` directory. The public receipt binds the source revision, deterministic projection root, license state, target public repository and preserved private-history boundary.

## Source frontier binding

The projection manifest binds the merged human-decision frontier. The builder emits `PUBLIC_PROJECTION.json` containing:

- source repository and revision;
- manifest version;
- license state and policy;
- publication boundary;
- target repository suggestion;
- sorted file hashes;
- deterministic projection root;
- non-effects.

Running the builder twice against the same source frontier must produce byte-identical projected trees and the same root.

## License boundary

The explicit human decision has advanced the previous proposal to:

```text
license_state = GRANTED_BY_HUMAN_AUTHORIZATION
software = Apache-2.0
non_software = CC-BY-4.0
```

The full license package is projected as `LICENSE.md`, `LICENSES/*` and `NOTICE.md`.

Third-party material remains under its own applicable licenses.

```text
License Grant != Canonical Status Transfer
Dependency Reference != Dependency Relicensing
```

## Publication boundary

The human decision also authorizes creation of `Matawaka/truehire-public` from the deterministic projection while requiring `Matawaka/truehire` to remain private.

Successful projection validation still does not itself:

- create the public repository before the canonical authorization change is merged;
- change `Matawaka/truehire` visibility;
- export private Git history;
- deploy software;
- process real candidate data;
- authorize an employment action;
- clear binary/bundled distribution obligations for every future artifact.

## Success criterion

Projection v0.1 succeeds when an independently generated projected tree:

1. is deterministic;
2. contains the explicitly selected current reference source;
3. carries the authorized split-license package;
4. builds/tests/lints without the private hosting identity;
5. contains no banned private-development paths;
6. excludes the historical opaque OG binary and private history;
7. carries projection and public-authorization receipts;
8. matches the root and file count bound by the canonical private authorization receipt;
9. preserves deployment, candidate-data and binary-distribution gates as separate events.
