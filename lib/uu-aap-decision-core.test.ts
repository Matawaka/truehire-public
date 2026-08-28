import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluateDecision,
  type DecisionInput,
} from './uu-aap-decision-core.ts';

const baseInput: DecisionInput = {
  intent: 'Работа',
  outcome: 'Создать полезный продукт.',
  condition: 'Прямой разговор о деньгах',
  boundary: 'Не жертвовать здоровьем.',
  hypothesis: 'pending',
  decision: 'explore',
  now: '2026-08-26T00:00:00.000Z',
};

test('explore permits only a local reversible action', () => {
  const receipt = evaluateDecision(baseInput);

  assert.equal(receipt.nextAction, 'PREPARE_QUESTIONS');
  assert.equal(receipt.localActionAllowed, true);
  assert.equal(receipt.externalActionAllowed, false);
  assert.equal('score' in receipt, false);
});

test('a pending hypothesis is not used and pause keeps a private draft', () => {
  const receipt = evaluateDecision({ ...baseInput, decision: 'pause' });

  assert.equal(receipt.nextAction, 'KEEP_PRIVATE_DRAFT');
  assert.equal(receipt.hypothesis.used, false);
  assert.equal(receipt.hypothesis.status, 'not_recognized');
});

test('an accepted hypothesis remains provisional', () => {
  const receipt = evaluateDecision({ ...baseInput, hypothesis: 'accepted' });

  assert.equal(receipt.hypothesis.used, true);
  assert.equal(receipt.hypothesis.status, 'provisional');
});

test('decline closes the local observation without a negative label', () => {
  const receipt = evaluateDecision({ ...baseInput, decision: 'decline' });

  assert.equal(receipt.nextAction, 'CLOSE_OBSERVATION');
  assert.equal(receipt.successorState, 'OBSERVATION_CLOSED_BY_USER');
  assert.equal(receipt.externalActionAllowed, false);
});

test('missing explicit intent fails closed', () => {
  const receipt = evaluateDecision({ ...baseInput, outcome: ' ' });

  assert.equal(receipt.nextAction, 'NO_ACTION');
  assert.equal(receipt.localActionAllowed, false);
  assert.equal(receipt.externalActionAllowed, false);
  assert.equal(receipt.successorState, 'UNCHANGED');
});
