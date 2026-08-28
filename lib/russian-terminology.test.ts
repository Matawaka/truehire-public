import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  employerAuthorityStatusLabels,
  hypothesisStatusLabels,
  needCategoryLabels,
  needSourceLabels,
  protocolStackLabels,
  stageStatusLabels,
  successorStateLabels,
} from './russian-terminology.ts';

test('все отображаемые машинные состояния имеют русские названия', () => {
  const dictionaries = [stageStatusLabels, needCategoryLabels, needSourceLabels, hypothesisStatusLabels, successorStateLabels, protocolStackLabels, employerAuthorityStatusLabels];
  for (const dictionary of dictionaries) {
    for (const label of Object.values(dictionary)) assert.match(label, /[А-ЯЁ]/);
  }
});

test('согласованные иностранные подписи не возвращаются в видимую страницу', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const forbidden = ['>READ-ONLY<','>RANK<','>DRAFT<','Context manual','Personal Need Deck','Personal Vault','Employer mirror','Decision Core','Action Gate','Authority proof','TAB MEMORY','AUTOMATIC_ACTION_ALLOWED','AUTOMATIC_INFERENCE_ALLOWED','EXTERNAL_ACTION_ALLOWED','FEAR DECLARATION','Влияние на matching'];
  for (const fragment of forbidden) assert.equal(page.includes(fragment), false, fragment);
});
