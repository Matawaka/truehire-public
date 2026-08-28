import assert from 'node:assert/strict';
import test from 'node:test';

import { buildBusinessPeoplePlan } from './business-people-plan.ts';

test('диапазон людей объяснимо следует из объёма и безопасной нагрузки', () => {
  const plan = buildBusinessPeoplePlan({
    selectedWorkIds: ['UNDERSTAND_PEOPLE', 'MAKE_PRODUCT'],
    weeklyWorkMinimum: 60,
    weeklyWorkMaximum: 100,
    safeLoadMinimum: 20,
    safeLoadMaximum: 30,
  });

  assert.deepEqual(plan.peopleRange, { minimum: 2, maximum: 5 });
  assert.ok(plan.abilities.includes('слушать и задавать точные вопросы'));
});

test('перепутанные границы диапазона приводятся в понятный порядок', () => {
  const plan = buildBusinessPeoplePlan({
    selectedWorkIds: ['KEEP_PROMISES'],
    weeklyWorkMinimum: 100,
    weeklyWorkMaximum: 60,
    safeLoadMinimum: 30,
    safeLoadMaximum: 20,
  });

  assert.deepEqual(plan.weeklyWorkload, { minimum: 60, maximum: 100 });
  assert.deepEqual(plan.safeLoadPerPerson, { minimum: 20, maximum: 30 });
});

test('при отсутствии нагрузки система не выдумывает количество людей', () => {
  const plan = buildBusinessPeoplePlan({
    selectedWorkIds: ['SUPPORT_USE'],
    weeklyWorkMinimum: 0,
    weeklyWorkMaximum: 0,
    safeLoadMinimum: 20,
    safeLoadMaximum: 30,
  });

  assert.equal(plan.peopleRange, null);
  assert.equal(plan.externalActionAllowed, false);
});
