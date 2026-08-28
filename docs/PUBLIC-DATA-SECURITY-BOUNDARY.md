# TRUEHIRE — Public Data, Privacy & Security Boundary v0.1

**Status:** public-release hygiene / repository remains private  
**Origin frontier:** `1efa74508133b71f76c7071c6308551e325595de`

## 1. Scope

This document defines what the current TRUEHIRE reference slice does with data and what a future public release may claim.

It is not a privacy policy for a production service, a security certification, a legal opinion, or authorization to change repository visibility.

```text
Public Source Boundary != Production Data Processing Agreement
Local Demo != Production Hiring System
Security Hygiene != Security Certification
```

## 2. Current data classes

### User-entered local state

The current UI accepts user-entered intent, conditions, boundaries and local choices used to render the current tab state. The repository does not contain a production backend, account system, candidate database or ATS connector.

### Built-in demo people

The built-in records with ids `elena`, `anton` and `maria`, and every associated name, role, intent, ability, need and scenario attached to those ids, are **synthetic / fictional demonstration data**.

They do not represent real applicants, employees, employers or external identities.

The machine-readable source policy is `lib/demo-data-policy.ts` and is bound to the exact built-in candidate ids by `lib/demo-data-policy.test.ts`.

```text
Synthetic Demo Record != Real Person Evidence
Display Name != Identity Claim
Demo Scenario != Employment History
```

### Interface observations

Interaction-derived observations are limited to visible events already represented in the current code. They remain observations plus possible meanings, not hidden personality or health claims.

An observation can affect a connection contour only after explicit user recognition/acceptance and separate comparison permission.

## 3. Current storage boundary

The current reference slice is local/client-oriented. README and responsibility documentation explicitly state that current actions remain internal and reversible.

Current source does not implement:

- production user registration;
- production candidate or employer database persistence;
- ATS mutation;
- outbound email or messaging;
- autonomous shortlist/reject/offer;
- external identity resolution;
- sale or transfer of candidate profiles.

Future storage, connectors or accounts require a successor architecture and cannot inherit permission from this document.

## 4. External-action boundary

The current connection permit ends at a private introduction draft and preserves:

```text
externalActionAllowed = false
```

No public-release hygiene step changes this.

```text
Comparison Permission != Contact Permission
Private Draft != External Message
Evidence != Intent != Authority != Permission to Act
```

## 5. Sensitive and protected data

The current product contract and responsibility boundary prohibit using the reference implementation as a mechanism for:

- hidden personality or emotion scoring;
- health/disability inference;
- protected-attribute inference;
- cross-context background profiling;
- global employability or trust scoring;
- treating missing optional data as negative evidence.

A future feature that introduces sensitive data must establish a new purpose, evidence scope, authority, retention and deletion boundary before implementation.

## 6. Secrets and operational configuration

Generated and local operational paths are excluded through `.gitignore`, including `.env*` and `.wrangler/`.

The repository currently still tracks `.openai/hosting.json` with project-specific deployment metadata. The disclosure audit treats this as a **remaining public-release blocker**, even though the current assessment did not classify it as an authentication secret.

Public source hygiene must not confuse:

```text
Not an Authentication Secret != Necessary to Publish
Deployment Metadata != Product Semantics
```

## 7. Security reporting boundary

This repository does not yet claim an independent security assessment or production security SLA.

Before a public production-facing release, the project should define a security reporting channel and a supported-release policy. Until then, security findings belong to the private development/review process.

## 8. Release scans

A public-release candidate requires, at minimum:

1. current tracked-tree secret-bearing filename scan;
2. current tracked-text high-confidence secret-pattern scan;
3. reachable git-history scan for the same high-confidence classes;
4. review of tracked data-like files and binary assets;
5. explicit confirmation that no real candidate/employer records are present;
6. dependency-license inventory and compatibility review;
7. separate human visibility authorization.

A successful scan is evidence for a release decision, not the decision itself.

## 9. Non-effects

This boundary does not:

- change repository visibility;
- grant a software or documentation license;
- deploy the application;
- authorize external communication;
- process a real candidate;
- authorize employment decisions;
- authorize future data collection.
