#!/usr/bin/env node

import fs from 'node:fs';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const summaryOnly = args.includes('--summary');
const positional = args.filter((arg) => !arg.startsWith('--'));
const lockPath = positional[0] ?? 'package-lock.json';

const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const packages = Object.entries(lock.packages ?? {})
  .filter(([path]) => path !== '')
  .map(([path, meta]) => ({
    path,
    name: packageNameFromPath(path),
    version: meta.version ?? null,
    license: meta.license ?? null,
    dev: meta.dev === true,
    optional: meta.optional === true,
  }))
  .sort((a, b) => a.path.localeCompare(b.path));

const licenseExpressions = {};
for (const item of packages) {
  const expression = item.license ?? 'MISSING';
  licenseExpressions[expression] = (licenseExpressions[expression] ?? 0) + 1;
}

const inventory = {
  artifact: 'TRUEHIREThirdPartyLicenseInventory',
  version: '0.1',
  source: {
    lockfile: lockPath,
    lockfileVersion: lock.lockfileVersion ?? null,
    sha256: sha256(fs.readFileSync(lockPath)),
  },
  packageCount: packages.length,
  missingLicenseMetadata: packages.filter((item) => item.license === null).length,
  licenseExpressions: Object.fromEntries(
    Object.entries(licenseExpressions).sort(([a], [b]) => a.localeCompare(b)),
  ),
  packages,
  nonClaims: [
    'metadata_inventory_is_not_legal_compatibility_review',
    'dependency_license_inventory_is_not_repository_license_grant',
  ],
};

if (summaryOnly) {
  const summary = {
    artifact: inventory.artifact,
    version: inventory.version,
    source: inventory.source,
    packageCount: inventory.packageCount,
    missingLicenseMetadata: inventory.missingLicenseMetadata,
    licenseExpressions: inventory.licenseExpressions,
    nonClaims: inventory.nonClaims,
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
} else {
  process.stdout.write(`${JSON.stringify(inventory, null, 2)}\n`);
}

function packageNameFromPath(path) {
  const marker = 'node_modules/';
  const index = path.lastIndexOf(marker);
  return index === -1 ? path : path.slice(index + marker.length);
}

function sha256(buffer) {
  return `sha256:${crypto.createHash('sha256').update(buffer).digest('hex')}`;
}
