import assert from 'node:assert/strict';
import test from 'node:test';

import { connectionCandidates } from './connection-contour.ts';
import { demoDataPolicy, syntheticDemoCandidateIds } from './demo-data-policy.ts';

test('встроенные люди являются только synthetic/fictional demo data', () => {
  assert.equal(demoDataPolicy.classification, 'SYNTHETIC_FICTIONAL_DEMO');
  assert.equal(demoDataPolicy.representsRealPeople, false);
  assert.equal(demoDataPolicy.representsRealApplicants, false);
  assert.equal(demoDataPolicy.representsRealEmployees, false);
  assert.equal(demoDataPolicy.representsRealEmployers, false);
  assert.equal(demoDataPolicy.productionPersonalData, false);
  assert.equal(demoDataPolicy.externalIdentityBindingAllowed, false);

  assert.deepEqual(
    connectionCandidates.map((candidate) => candidate.id),
    [...syntheticDemoCandidateIds],
  );
});
