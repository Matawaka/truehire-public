import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildConnectionContours,
  buildConnectionPermit,
  deriveInteractionObservations,
} from './connection-contour.ts';
import { buildNeedDeck } from './need-card-core.ts';

const needs = buildNeedDeck(
  {
    outcome: 'Создавать понятные системы',
    condition: 'Спокойный темп',
    boundary: 'Не жертвовать здоровьем',
  },
  {},
);

test('наблюдение об интерфейсе остаётся явным предположением', () => {
  const observations = deriveInteractionObservations({
    manualOpenCount: 2,
    wordingRevisionCount: 1,
    influenceChangeCount: 0,
  });

  assert.equal(observations.length, 2);
  assert.equal(observations[0].source, 'VISIBLE_INTERFACE_EVENT');
  assert.match(observations[0].possibleMeaning, /^Возможно,/u);
});

test('без разрешения связи не вычисляются', () => {
  const contours = buildConnectionContours({
    selectedModes: ['WHOLE'],
    acceptedObservationIds: ['manual-attention'],
    observations: deriveInteractionObservations({
      manualOpenCount: 1,
      wordingRevisionCount: 0,
      influenceChangeCount: 0,
    }),
    needCards: needs,
    comparisonPermission: false,
  });

  assert.ok(contours.every((candidate) => candidate.threads.length === 0));
  assert.ok(contours.every((candidate) => candidate.comparisonAllowed === false));
});

test('признанные наблюдения участвуют только после явного разрешения', () => {
  const observations = deriveInteractionObservations({
    manualOpenCount: 1,
    wordingRevisionCount: 0,
    influenceChangeCount: 0,
  });
  const contours = buildConnectionContours({
    selectedModes: ['WHOLE'],
    acceptedObservationIds: ['manual-attention'],
    observations,
    needCards: needs,
    comparisonPermission: true,
  });

  assert.ok(contours.some((candidate) => candidate.threads.length > 0));
  assert.ok(
    contours.some((candidate) =>
      candidate.threads.some((thread) => thread.kind === 'CONFIRMED_REFLECTION'),
    ),
  );
});

test('способность из плана бизнеса создаёт объяснимую нить связи', () => {
  const contours = buildConnectionContours({
    selectedModes: [],
    acceptedObservationIds: [],
    observations: [],
    needCards: needs,
    businessAbilities: ['собирать целое из понятных частей'],
    comparisonPermission: true,
  });
  const anton = contours.find((candidate) => candidate.id === 'anton');

  assert.ok(anton);
  assert.ok(
    anton.threads.some(
      (thread) =>
        thread.kind === 'BUSINESS_ABILITY' &&
        thread.label.includes('собирать целое из понятных частей'),
    ),
  );
});

test('подготовка связи не разрешает внешнюю отправку', () => {
  const contours = buildConnectionContours({
    selectedModes: ['STEPS'],
    acceptedObservationIds: [],
    observations: [],
    needCards: needs,
    comparisonPermission: true,
  });
  const permit = buildConnectionPermit({
    comparisonPermission: true,
    selectedCandidateId: 'anton',
    availableCandidates: contours,
  });

  assert.equal(permit.internallyAllowed, true);
  assert.equal(permit.externalActionAllowed, false);
  assert.equal(permit.action, 'PREPARE_INTRODUCTION_DRAFT');
});
