import type { DecisionReceipt, DecisionStage } from './uu-aap-decision-core.ts';
import type { NeedCard, NeedCategory } from './need-card-core.ts';

export const stageStatusLabels: Record<DecisionStage['status'], string> = {
  asserted: 'ЗАЯВЛЕНО',
  available: 'ДОСТУПНО',
  provisional: 'ПРЕДВАРИТЕЛЬНО',
  not_verified: 'НЕ ПРОВЕРЕНО',
  bounded: 'ОГРАНИЧЕННО РАЗРЕШЕНО',
  local_only: 'ТОЛЬКО ВНУТРИ',
  unknown: 'НЕИЗВЕСТНО',
  closed: 'ЗАКРЫТО',
};

export const needCategoryLabels: Record<NeedCategory, string> = {
  MEANING: 'СМЫСЛ',
  ENVIRONMENT: 'СРЕДА',
  BOUNDARY: 'ГРАНИЦА',
};

export const needSourceLabels: Record<NeedCard['source'], string> = {
  DIRECT_USER_INPUT: 'ПРЯМОЙ ВВОД ЧЕЛОВЕКА',
};

export const hypothesisStatusLabels: Record<DecisionReceipt['hypothesis']['status'], string> = {
  provisional: 'ПРЕДВАРИТЕЛЬНО',
  rejected: 'ОТКЛОНЕНО',
  not_recognized: 'НЕ ПРИЗНАНО',
};

export const successorStateLabels: Record<string, string> = {
  PRIVATE_QUESTIONS_DRAFT: 'ЧАСТНЫЙ ЧЕРНОВИК ВОПРОСОВ',
  PRIVATE_INTENT_PAUSED: 'ЧАСТНОЕ НАМЕРЕНИЕ ПРИОСТАНОВЛЕНО',
  OBSERVATION_CLOSED_BY_USER: 'НАБЛЮДЕНИЕ ЗАКРЫТО ПОЛЬЗОВАТЕЛЕМ',
  UNCHANGED: 'БЕЗ ИЗМЕНЕНИЙ',
};

export const protocolStackLabels: Record<DecisionReceipt['protocolStack'], string> = {
  'UU-AAP-INFORMED': 'НА ОСНОВЕ UU-AAP',
};

export const employerAuthorityStatusLabels: Record<'VERIFIED_FOR_DRAFTING' | 'NOT_VERIFIED', string> = {
  VERIFIED_FOR_DRAFTING: 'ПРОВЕРЕНЫ ДЛЯ ЧЕРНОВИКА',
  NOT_VERIFIED: 'НЕ ПРОВЕРЕНЫ',
};
