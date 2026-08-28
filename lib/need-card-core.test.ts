import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildEmployerFearDeclaration,
  buildNeedDeck,
  toggleEmployerFear,
  type EmployerFearId,
} from './need-card-core.ts';

const input = {
  outcome: 'Делать полезный продукт.',
  condition: 'Прямой разговор о деньгах.',
  boundary: 'Не жертвовать здоровьем.',
};

test('need ranking follows explicit user influence, not a candidate score', () => {
  const deck = buildNeedDeck(input, {
    'need-outcome': 'observe',
    'need-condition': 'priority',
    'need-boundary': 'boundary',
  });

  assert.deepEqual(deck.map((card) => card.id), [
    'need-boundary',
    'need-condition',
    'need-outcome',
  ]);
  assert.equal(deck[0].effect, 'USER_SIDE_GATE');
  assert.equal('score' in deck[0], false);
});

test('cards remain private in tab memory in the current slice', () => {
  const [card] = buildNeedDeck(input, {});

  assert.equal(card.storage, 'TAB_MEMORY');
  assert.equal(card.disclosure, 'PRIVATE');
  assert.equal(card.source, 'DIRECT_USER_INPUT');
});

test('an employer can select no more than two disclosed fears', () => {
  let selected: EmployerFearId[] = [];
  selected = toggleEmployerFear(selected, 'PROOF_OF_AUTHORITY');
  selected = toggleEmployerFear(selected, 'PAY_TRANSPARENCY');
  selected = toggleEmployerFear(selected, 'REFUSAL_OF_HEROISM');

  assert.deepEqual(selected, ['PROOF_OF_AUTHORITY', 'PAY_TRANSPARENCY']);
});

test('employer fears cannot silently exclude or affect matching', () => {
  const declaration = buildEmployerFearDeclaration(['PROOF_OF_AUTHORITY'], false);

  assert.equal(declaration.authorityStatus, 'NOT_VERIFIED');
  assert.equal(declaration.candidateVisibility, 'REQUIRED');
  assert.equal(declaration.hiddenExclusionAllowed, false);
  assert.equal(declaration.matchingEffectAllowed, false);
  assert.equal(declaration.status, 'DRAFT_ONLY');
});
