# TRUEHIRE Third-Party Source Publication Boundary v0.1

## Purpose

TRUEHIRE references third-party packages through `package.json` / `package-lock.json`. The repository does not vendor `node_modules/` into source control.

The public-release decision therefore distinguishes two different events:

```text
Public Source Publication != Bundled/Binary Distribution
Dependency Reference != Dependency Relicensing
Metadata Inventory != Legal Compatibility Determination
```

## Current evidence

The current remediated lockfile inventory contains:

```text
packages = 648
missing_license_metadata = 0
```

The dependency-security gate also records zero npm audit findings in the private full graph, production-only graph and deterministic public projection.

Observed license expressions include permissive, weak-copyleft and compound expressions. This metadata is evidence for review; it is not a conclusion that every possible binary distribution mode has been cleared.

## Public source projection

The public projection contains:

- TRUEHIRE-owned source selected by the projection allowlist;
- `package.json` and `package-lock.json` describing external dependencies;
- the deterministic third-party license metadata inventory;
- the TRUEHIRE outbound license package for material TRUEHIRE is authorized to license;
- no tracked `node_modules/` directory;
- no claim that dependency source code has been relicensed by TRUEHIRE.

At this boundary, publishing the source projection means publishing TRUEHIRE source and dependency references, not copying every dependency into the public repository under the TRUEHIRE outbound license.

## Bundled distribution remains a separate gate

A future event that distributes a compiled/bundled application, container image, offline package or other artifact containing third-party code may create additional notice/source/attribution obligations depending on the actual included packages and distribution form.

That event requires a release-specific compliance receipt based on the exact produced artifact.

```text
Source Projection PASS != Binary Distribution Compliance PASS
```

## Fail-closed rules

- `LICENSE.md` applies only to material TRUEHIRE is authorized to license.
- A dependency with its own license remains governed by that license.
- A public projection must not contain vendored dependency trees unless a later gate explicitly inventories and clears them.
- A binary release must not reuse this source-publication receipt as proof of binary distribution compliance.

## Current disposition

For **public source projection only**:

```text
third_party_source_publication_boundary = REVIEWED_WITH_SEPARATE_BINARY_GATE
binary_distribution_compliance = PENDING_PER_RELEASE
```

This is an architectural release boundary, not a legal opinion about a specific jurisdiction or distribution transaction.
