export type NeedInfluence = 'observe' | 'priority' | 'boundary';
export type NeedCategory = 'MEANING' | 'ENVIRONMENT' | 'BOUNDARY';

export type NeedCard = {
  id: string;
  category: NeedCategory;
  statement: string;
  source: 'DIRECT_USER_INPUT';
  influence: NeedInfluence;
  rankPosition: number;
  effect: 'REFLECT_ONLY' | 'PERSONAL_RANKING' | 'USER_SIDE_GATE';
  effectLabel: string;
  storage: 'TAB_MEMORY';
  disclosure: 'PRIVATE';
};

export type EmployerFearId =
  | 'PROOF_OF_AUTHORITY'
  | 'REFUSAL_OF_HEROISM'
  | 'PAY_TRANSPARENCY'
  | 'EVIDENCE_BASED_DISAGREEMENT';

export const employerFearOptions: ReadonlyArray<{
  id: EmployerFearId;
  label: string;
}> = [
  {
    id: 'PROOF_OF_AUTHORITY',
    label: 'Человек будет спрашивать доказательства полномочий.',
  },
  {
    id: 'REFUSAL_OF_HEROISM',
    label: 'Человек не согласится на постоянный героизм и переработки.',
  },
  {
    id: 'PAY_TRANSPARENCY',
    label: 'Человек потребует заранее раскрыть правила оплаты.',
  },
  {
    id: 'EVIDENCE_BASED_DISAGREEMENT',
    label: 'Человек будет спорить с решениями и просить доказательства.',
  },
];

const influenceOrder: Record<NeedInfluence, number> = {
  observe: 1,
  priority: 2,
  boundary: 3,
};

const influenceEffect: Record<
  NeedInfluence,
  Pick<NeedCard, 'effect' | 'effectLabel'>
> = {
  observe: {
    effect: 'REFLECT_ONLY',
    effectLabel: 'Только объяснять совпадение; порядок вариантов не менять.',
  },
  priority: {
    effect: 'PERSONAL_RANKING',
    effectLabel: 'Может поднимать варианты только в личном порядке пользователя.',
  },
  boundary: {
    effect: 'USER_SIDE_GATE',
    effectLabel: 'Может закрыть предлагаемый вариант только со стороны пользователя.',
  },
};

export function buildNeedDeck(
  input: { outcome: string; condition: string; boundary: string },
  influenceById: Record<string, NeedInfluence>,
): NeedCard[] {
  const candidates: Array<Omit<NeedCard, 'rankPosition' | 'influence' | 'effect' | 'effectLabel'>> = [
    {
      id: 'need-outcome',
      category: 'MEANING',
      statement: input.outcome.trim(),
      source: 'DIRECT_USER_INPUT',
      storage: 'TAB_MEMORY',
      disclosure: 'PRIVATE',
    },
    {
      id: 'need-condition',
      category: 'ENVIRONMENT',
      statement: input.condition.trim(),
      source: 'DIRECT_USER_INPUT',
      storage: 'TAB_MEMORY',
      disclosure: 'PRIVATE',
    },
    {
      id: 'need-boundary',
      category: 'BOUNDARY',
      statement: input.boundary.trim(),
      source: 'DIRECT_USER_INPUT',
      storage: 'TAB_MEMORY',
      disclosure: 'PRIVATE',
    },
  ];

  return candidates
    .filter((candidate) => candidate.statement.length > 0)
    .map((candidate, sourcePosition) => {
      const influence = influenceById[candidate.id] ?? 'observe';

      return {
        ...candidate,
        influence,
        ...influenceEffect[influence],
        rankPosition: sourcePosition + 1,
      };
    })
    .sort((left, right) => {
      const byInfluence = influenceOrder[right.influence] - influenceOrder[left.influence];
      return byInfluence || left.rankPosition - right.rankPosition;
    })
    .map((card, index) => ({ ...card, rankPosition: index + 1 }));
}

export function toggleEmployerFear(
  selected: EmployerFearId[],
  fear: EmployerFearId,
): EmployerFearId[] {
  if (selected.includes(fear)) {
    return selected.filter((item) => item !== fear);
  }

  if (selected.length >= 2) {
    return selected;
  }

  return [...selected, fear];
}

export function buildEmployerFearDeclaration(
  selected: EmployerFearId[],
  authorityVerified: boolean,
) {
  const allowed = new Set(employerFearOptions.map((option) => option.id));
  const unique = [...new Set(selected)].filter((item) => allowed.has(item)).slice(0, 2);

  return {
    selected: employerFearOptions.filter((option) => unique.includes(option.id)),
    authorityStatus: authorityVerified
      ? ('VERIFIED_FOR_DRAFTING' as const)
      : ('NOT_VERIFIED' as const),
    candidateVisibility: 'REQUIRED' as const,
    hiddenExclusionAllowed: false as const,
    matchingEffectAllowed: false as const,
    status: 'DRAFT_ONLY' as const,
  };
}
