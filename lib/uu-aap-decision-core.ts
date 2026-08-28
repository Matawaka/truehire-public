export const UU_AAP_FRONTIER =
  'd8500cdcbf9355cce71ce52beaea01c70e1a1c54' as const;

export type DecisionDisposition = 'explore' | 'pause' | 'decline';
export type HypothesisInputStatus = 'pending' | 'accepted' | 'rejected';
export type NextAction =
  | 'PREPARE_QUESTIONS'
  | 'KEEP_PRIVATE_DRAFT'
  | 'CLOSE_OBSERVATION'
  | 'NO_ACTION';

export type DecisionStage = {
  key:
    | 'state'
    | 'possibility'
    | 'intent'
    | 'authority'
    | 'coordination'
    | 'gate'
    | 'outcome';
  label: string;
  status:
    | 'asserted'
    | 'available'
    | 'provisional'
    | 'not_verified'
    | 'bounded'
    | 'local_only'
    | 'unknown'
    | 'closed';
  note: string;
};

export type DecisionInput = {
  intent: string;
  outcome: string;
  condition: string;
  boundary: string;
  hypothesis: HypothesisInputStatus;
  decision: DecisionDisposition;
  now?: string;
};

export type DecisionReceipt = {
  receiptId: string;
  protocolStack: 'UU-AAP-INFORMED';
  frontier: typeof UU_AAP_FRONTIER;
  decision: DecisionDisposition;
  nextAction: NextAction;
  reason: string;
  localActionAllowed: boolean;
  externalActionAllowed: false;
  stages: DecisionStage[];
  hypothesis: {
    input: HypothesisInputStatus;
    status: 'provisional' | 'rejected' | 'not_recognized';
    used: boolean;
  };
  trace: {
    problem: string;
    alternatives: DecisionDisposition[];
    selected: DecisionDisposition;
    rejected: DecisionDisposition[];
    reasons: string[];
  };
  unresolved: string[];
  successorState: string;
  createdAt: string;
};

const rules: Record<
  DecisionDisposition,
  { nextAction: Exclude<NextAction, 'NO_ACTION'>; reason: string; successorState: string }
> = {
  explore: {
    nextAction: 'PREPARE_QUESTIONS',
    reason: 'Можно подготовить вопросы внутри приложения; отправка или контакт не разрешены.',
    successorState: 'PRIVATE_QUESTIONS_DRAFT',
  },
  pause: {
    nextAction: 'KEEP_PRIVATE_DRAFT',
    reason: 'Можно сохранить позицию в текущей вкладке и ничего не отправлять.',
    successorState: 'PRIVATE_INTENT_PAUSED',
  },
  decline: {
    nextAction: 'CLOSE_OBSERVATION',
    reason: 'Можно закрыть это наблюдение без негативной метки и без вывода о человеке.',
    successorState: 'OBSERVATION_CLOSED_BY_USER',
  },
};

function receiptToken(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

export function evaluateDecision(input: DecisionInput): DecisionReceipt {
  const hasIntent = input.intent.trim().length > 0 && input.outcome.trim().length > 0;
  const rule = rules[input.decision];
  const createdAt = input.now ?? new Date().toISOString();

  const hypothesis =
    input.hypothesis === 'accepted'
      ? { input: input.hypothesis, status: 'provisional' as const, used: true }
      : input.hypothesis === 'rejected'
        ? { input: input.hypothesis, status: 'rejected' as const, used: false }
        : { input: input.hypothesis, status: 'not_recognized' as const, used: false };

  const nextAction = hasIntent ? rule.nextAction : 'NO_ACTION';
  const reason = hasIntent
    ? rule.reason
    : 'Явное намерение и ожидаемый результат не зафиксированы; рубеж допуска закрыт.';

  const stages: DecisionStage[] = [
    {
      key: 'state',
      label: 'Состояние и опорные свидетельства',
      status: hasIntent ? 'asserted' : 'unknown',
      note: hasIntent
        ? 'Есть прямой редактируемый ввод пользователя.'
        : 'Недостаточно прямого ввода пользователя.',
    },
    {
      key: 'possibility',
      label: 'Возможность и доступность',
      status: hasIntent ? 'available' : 'unknown',
      note: hasIntent
        ? 'Доступно только продолжение размышления внутри приложения.'
        : 'Возможность следующего шага не установлена.',
    },
    {
      key: 'intent',
      label: 'Намерение',
      status: hasIntent ? 'asserted' : 'unknown',
      note: hasIntent
        ? `${input.intent}: ожидаемый результат сформулирован самим человеком.`
        : 'Намерение не может быть выведено системой.',
    },
    {
      key: 'authority',
      label: 'Полномочия и ответственность',
      status: 'not_verified',
      note: 'Полномочия работодателя и право на внешний контакт не доказаны.',
    },
    {
      key: 'coordination',
      label: 'Согласование сторон',
      status: 'not_verified',
      note: 'Вторая сторона и её взаимное согласие отсутствуют.',
    },
    {
      key: 'gate',
      label: 'Рубеж допуска',
      status: hasIntent ? 'bounded' : 'closed',
      note: hasIntent
        ? 'Разрешён один выбранный внутренний обратимый шаг.'
        : 'Даже внутреннее действие не разрешено.',
    },
    {
      key: 'outcome',
      label: 'Результат и последующее состояние',
      status: hasIntent ? 'local_only' : 'closed',
      note: hasIntent
        ? `Будет создана квитанция выбранного последующего состояния.`
        : 'Последующее состояние не создаётся.',
    },
  ];

  const alternatives: DecisionDisposition[] = ['explore', 'pause', 'decline'];
  const receiptSeed = [
    input.intent,
    input.outcome,
    input.condition,
    input.boundary,
    input.hypothesis,
    input.decision,
    createdAt,
  ].join('|');

  return {
    receiptId: `TH-DECISION-${receiptToken(receiptSeed)}`,
    protocolStack: 'UU-AAP-INFORMED',
    frontier: UU_AAP_FRONTIER,
    decision: input.decision,
    nextAction,
    reason,
    localActionAllowed: hasIntent,
    externalActionAllowed: false,
    stages,
    hypothesis,
    trace: {
      problem: 'Как поступить с этим намерением сейчас?',
      alternatives,
      selected: input.decision,
      rejected: alternatives.filter((item) => item !== input.decision),
      reasons: [
        reason,
        'Решение выбрано пользователем, а не выведено из скрытого порядка оценок.',
        'Отсутствующее полномочие не заменяется догадкой ИИ.',
      ],
    },
    unresolved: [
      'Полномочия работодателя не проверены.',
      'Условия второй стороны не подтверждены.',
      'Взаимное согласие на контакт или передачу данных отсутствует.',
    ],
    successorState: hasIntent ? rule.successorState : 'UNCHANGED',
    createdAt,
  };
}
