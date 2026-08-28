import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isManualCategory,
  manualCategoryIds,
  manualEntries,
} from './context-manual.ts';

test('every manual category is explicit and forbids automatic inference', () => {
  for (const category of manualCategoryIds) {
    const entry = manualEntries[category];

    assert.ok(entry.title.length > 0);
    assert.ok(entry.concept.length > 0);
    assert.ok(entry.purpose.length > 0);
    assert.ok(entry.notMeaning.length > 0);
    assert.equal(entry.automaticInferenceAllowed, false);
  }
});

test('manual categories are resolved only from the fixed catalogue', () => {
  assert.equal(isManualCategory('boundary'), true);
  assert.equal(isManualCategory('predicted-interest'), false);
  assert.equal(isManualCategory(undefined), false);
});
