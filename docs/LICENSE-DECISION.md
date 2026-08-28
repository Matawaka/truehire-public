# TRUEHIRE Repository License Decision — approved

**Decision date:** 2026-08-28  
**Status:** `APPROVED_AND_GRANTED`

The human licensing decision has been made for the authorized TRUEHIRE public reference release.

```text
Software / implementation → Apache-2.0
Narrative / non-software  → CC-BY-4.0
Third-party material      → its own applicable license
Canonical status          → not transferred by reuse or fork
```

The actual license map is `../LICENSE.md`; full canonical texts are stored in `../LICENSES/`.

## Decision

The approved policy is:

1. `Apache-2.0` for TRUEHIRE software and implementation material;
2. `CC-BY-4.0` for TRUEHIRE narrative and non-software material;
3. third-party material remains under its own applicable terms;
4. `NOTICE.md` preserves canonical TRUEHIRE identity, provenance and anti-impersonation/non-endorsement boundaries;
5. full license texts are included under `LICENSES/`.

The decision follows the split-license precedent already used by UU-AAP and the MarketCloser public reference, while remaining a distinct TRUEHIRE authorization.

## Scope

This grant applies only to rights the TRUEHIRE project is authorized to license. Dependency references, package metadata and third-party code are not relicensed by the TRUEHIRE outbound policy.

Source-publication and bundled/binary-distribution obligations remain separate. See `THIRD-PARTY-SOURCE-PUBLICATION-BOUNDARY.md`.

## Canonical identity

```text
Permission to Reuse != Canonical TRUEHIRE Status
Fork != Official Successor
Open License != Endorsement
```

The canonical product identity remains `TRUEHIRE / truehire`. The historical `honest-hiring / «Честный найм»` materialization remains a provenance alias rather than a separate canonical product.

## Public/private boundary

The license decision is paired with explicit authorization to create `Matawaka/truehire-public` from the deterministic public projection.

The private development repository `Matawaka/truehire` remains private and its private history is not authorized for export.

```text
License Grant != Private History Publication
Public Repository Creation != Private Repository Visibility Change
```

## Contribution boundary

The license grant does not require the project to accept public contributions. If a contribution is intentionally accepted into the canonical project, the applicable file-class outbound license is the default contribution license unless a file-specific notice or separate written agreement applies.

## Non-authorized effects

This licensing decision does not itself authorize deployment, real candidate-data processing, autonomous employment decisions, candidate ranking, hidden personality scoring or binary distribution without release-specific compliance review.

## Human decision

```text
HUMAN_LICENSE_DECISION = APPROVED
SOFTWARE_LICENSE = Apache-2.0
NON_SOFTWARE_LICENSE = CC-BY-4.0
```
