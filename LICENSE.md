# TRUEHIRE Licensing

**Effective decision date:** 2026-08-28  
**Status:** `GRANTED_BY_HUMAN_AUTHORIZATION`

TRUEHIRE uses a **split open-license model** for material the project is authorized to license.

This licensing map implements the explicit human decision recorded for the canonical TRUEHIRE lineage and is intended to make reuse rights clear while preserving provenance, canonical identity and the distinction between an open reference implementation and the canonical product lineage.

## 1. Non-software content — CC BY 4.0

Unless a file says otherwise, **non-software content** in the authorized TRUEHIRE public reference release is licensed under the **Creative Commons Attribution 4.0 International Public License (CC BY 4.0)**.

This includes, for example:

- narrative and explanatory Markdown;
- responsibility, provenance, terminology and review documents;
- diagrams and explanatory assets created for TRUEHIRE;
- non-executable example records and evidence documents where no more specific notice applies.

Full license text:

`LICENSES/CC-BY-4.0.txt`

SPDX identifier: `CC-BY-4.0`

## 2. Software and implementation content — Apache-2.0

Unless a file says otherwise, **software and implementation content** in the authorized TRUEHIRE public reference release is licensed under the **Apache License, Version 2.0**.

This includes, for example:

- source code and implementation modules;
- scripts and executable tooling;
- tests and test harnesses;
- build and validation tooling;
- machine-executable implementation definitions.

Full license text:

`LICENSES/Apache-2.0.txt`

SPDX identifier: `Apache-2.0`

Copyright 2026 Kuznetsov Dmitrii Olegovich (Кузнецов Дмитрий Олегович) / MATAWAKA.

## 3. File-specific and third-party material

A file carrying an explicit license notice, SPDX identifier or third-party notice is governed by that more specific notice for that file.

Third-party material is **not relicensed merely because TRUEHIRE references it or a dependency resolver downloads it**. `package.json`, `package-lock.json` and the committed third-party inventory describe dependency relationships; they do not transfer ownership or silently replace dependency licenses.

Where classification of TRUEHIRE-owned material is genuinely ambiguous and no file-specific notice exists, treat it as **non-software content under CC BY 4.0** until a more specific classification is recorded.

## 4. Attribution for CC BY material

When CC BY 4.0 material is shared, attribution should preserve, where reasonably practicable and consistent with the license:

- **Project:** `TRUEHIRE`;
- **Canonical product id:** `truehire`;
- **Authorial line:** `Kuznetsov Dmitrii Olegovich (Кузнецов Дмитрий Олегович) / MATAWAKA`;
- **Public reference repository:** `https://github.com/Matawaka/truehire-public`;
- a reference to **CC BY 4.0**;
- an indication of modifications when required by the license.

`NOTICE.md` records provenance and canonical-lineage boundaries.

## 5. Open reuse does not confer canonical status or endorsement

These licenses permit broad reuse within their terms, including commercial reuse where the applicable license permits it. They do **not** make a copy, fork, implementation, publication or derivative work the canonical TRUEHIRE product or an official successor.

`permission to copy != canonical succession`

`open license != endorsement`

`fork != canonical successor`

`commercial implementation != official implementation`

The TRUEHIRE name may be used in the ordinary descriptive manner needed to identify origin and satisfy attribution. Nothing in this licensing map grants additional trademark, sponsorship, endorsement or official-status rights.

## 6. Public reference source and private development history

The authorized public release is produced from a deterministic allowlisted projection.

```text
Public Reference Source != Private Development History
Public Repository Creation != Private Repository Visibility Change
```

The private development repository and its private history are not made public by this license grant. The public repository contains only the release projection and its public provenance receipts.

## 7. Responsibility and data boundary

Open licensing of source code does not grant authority to process real candidate data, infer protected attributes, make autonomous employment decisions, operate a managed service, or represent a deployment as approved by the canonical TRUEHIRE project.

Those are separate operational and legal events with their own authority and responsibility boundaries.

## 8. Contributions

This license grant does not by itself require the project to accept public contributions. If a contribution is intentionally accepted into the canonical project, the applicable file-class outbound license is the default contribution license unless the contribution is explicitly marked otherwise or a separate written agreement applies.

## 9. No additional warranty

The warranty and liability terms are those stated in the applicable CC BY 4.0 or Apache-2.0 license text. This file does not add warranties, certify factual correctness, authorize employment decisions or establish universal legal responsibility.
