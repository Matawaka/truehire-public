import type { NeedCard, NeedCategory } from './need-card-core';

export type UnderstandingMode =
  | 'WHOLE'
  | 'STEPS'
  | 'ESSENCE'
  | 'CONTRADICTIONS';

export type HypothesisDecision = 'pending' | 'accepted' | 'rejected';

export type InteractionObservation = {
  id: string;
  fact: string;
  possibleMeaning: string;
  source: 'VISIBLE_INTERFACE_EVENT';
};

export type ConnectionCandidate = {
  id: string;
  name: string;
  role: string;
  intent: string;
  declaredModes: UnderstandingMode[];
  canSupport: NeedCategory[];
  canDo: string[];
  needs: string[];
  contactScope: 'INTRODUCTION_REQUEST';
};

export type ConnectionThread = {
  kind: 'SHARED_MODE' | 'SUPPORTED_NEED' | 'BUSINESS_ABILITY' | 'CONFIRMED_REFLECTION';
  label: string;
  evidence: string;
};

export type CandidateContour = ConnectionCandidate & {
  threads: ConnectionThread[];
  coherence: 'not_formed' | 'emerging' | 'coherent' | 'strong';
  comparisonAllowed: boolean;
};

export const understandingModeOptions: ReadonlyArray<{
  id: UnderstandingMode;
  label: string;
  description: string;
}> = [
  {
    id: 'WHOLE',
    label: 'Сначала увидеть целое',
    description: 'Понять общий смысл, связи и пределы до подробностей.',
  },
  {
    id: 'STEPS',
    label: 'Разложить на шаги',
    description: 'Превратить сложность в проверяемую последовательность.',
  },
  {
    id: 'ESSENCE',
    label: 'Свести к сути',
    description: 'Отделить необходимое от лишнего и назвать простыми словами.',
  },
  {
    id: 'CONTRADICTIONS',
    label: 'Удерживать противоречия',
    description: 'Не упрощать раньше времени, когда верны разные стороны.',
  },
];

export const connectionCandidates: ReadonlyArray<ConnectionCandidate> = [
  {
    id: 'elena',
    name: 'Елена',
    role: 'Исследователь продукта',
    intent: 'Собрать команду для честного исследования сложных услуг.',
    declaredModes: ['WHOLE', 'CONTRADICTIONS'],
    canSupport: ['MEANING', 'ENVIRONMENT'],
    canDo: [
      'слушать и задавать точные вопросы',
      'отделять наблюдение от догадки',
      'объяснять вывод простыми словами',
    ],
    needs: ['Собеседник, который превращает наблюдения в ясные решения.'],
    contactScope: 'INTRODUCTION_REQUEST',
  },
  {
    id: 'anton',
    name: 'Антон',
    role: 'Архитектор взаимодействия',
    intent: 'Искать людей для спокойного построения проверяемых систем.',
    declaredModes: ['STEPS', 'ESSENCE'],
    canSupport: ['ENVIRONMENT', 'BOUNDARY'],
    canDo: [
      'собирать целое из понятных частей',
      'проверять работу до передачи людям',
      'исправлять причины, а не только последствия',
    ],
    needs: ['Партнёр, который видит смысл за последовательностью шагов.'],
    contactScope: 'INTRODUCTION_REQUEST',
  },
  {
    id: 'maria',
    name: 'Мария',
    role: 'Руководитель образовательных программ',
    intent: 'Создавать проекты, где сложное становится доступным без потери смысла.',
    declaredModes: ['WHOLE', 'ESSENCE'],
    canSupport: ['MEANING', 'BOUNDARY'],
    canDo: [
      'говорить о сложном простыми словами',
      'слышать возражение без давления',
      'отличать предложение от рекламы',
    ],
    needs: ['Человек, способный бережно спорить и ясно объяснять.'],
    contactScope: 'INTRODUCTION_REQUEST',
  },
];

const modeLabels = Object.fromEntries(
  understandingModeOptions.map((option) => [option.id, option.label]),
) as Record<UnderstandingMode, string>;

const needLabels: Record<NeedCategory, string> = {
  MEANING: 'смысл результата',
  ENVIRONMENT: 'условия среды',
  BOUNDARY: 'личная граница',
};

export function deriveInteractionObservations(input: {
  manualOpenCount: number;
  wordingRevisionCount: number;
  influenceChangeCount: number;
  meaningfulTextLength?: number;
}): InteractionObservation[] {
  const observations: InteractionObservation[] = [];

  if ((input.meaningfulTextLength ?? 0) >= 80) {
    observations.push({
      id: 'detailed-wording',
      fact: `Развёрнутая формулировка: ${input.meaningfulTextLength} знаков.`,
      possibleMeaning: 'Возможно, вам важно сохранять смысловые подробности до упрощения.',
      source: 'VISIBLE_INTERFACE_EVENT',
    });
  }

  if (input.manualOpenCount > 0) {
    observations.push({
      id: 'manual-attention',
      fact: `Справка открыта: ${input.manualOpenCount}.`,
      possibleMeaning: 'Возможно, вам важно раскрывать понятия до решения.',
      source: 'VISIBLE_INTERFACE_EVENT',
    });
  }

  if (input.wordingRevisionCount > 0) {
    observations.push({
      id: 'wording-attention',
      fact: `Формулировки изменены: ${input.wordingRevisionCount}.`,
      possibleMeaning: 'Возможно, точность формулировки для вас важнее скорости ответа.',
      source: 'VISIBLE_INTERFACE_EVENT',
    });
  }

  if (input.influenceChangeCount > 0) {
    observations.push({
      id: 'priority-attention',
      fact: `Сила потребностей пересмотрена: ${input.influenceChangeCount}.`,
      possibleMeaning: 'Возможно, вы предпочитаете явно управлять силой влияния условий.',
      source: 'VISIBLE_INTERFACE_EVENT',
    });
  }

  return observations;
}

export function buildConnectionContours(input: {
  selectedModes: UnderstandingMode[];
  acceptedObservationIds: string[];
  observations: InteractionObservation[];
  needCards: NeedCard[];
  businessAbilities?: string[];
  comparisonPermission: boolean;
}): CandidateContour[] {
  const accepted = new Set(input.acceptedObservationIds);
  const userNeedCategories = new Set(input.needCards.map((card) => card.category));

  return connectionCandidates.map((candidate) => {
    if (!input.comparisonPermission) {
      return {
        ...candidate,
        threads: [],
        coherence: 'not_formed' as const,
        comparisonAllowed: false,
      };
    }

    const sharedModes = candidate.declaredModes.filter((mode) =>
      input.selectedModes.includes(mode),
    );
    const supportedNeeds = candidate.canSupport.filter((category) =>
      userNeedCategories.has(category),
    );
    const sharedBusinessAbilities = candidate.canDo.filter((ability) =>
      (input.businessAbilities ?? []).includes(ability),
    );
    const confirmedObservations = sharedModes.length > 0
      ? input.observations.filter((observation) => accepted.has(observation.id))
      : [];

    const threads: ConnectionThread[] = [
      ...sharedModes.map((mode) => ({
        kind: 'SHARED_MODE' as const,
        label: modeLabels[mode],
        evidence: 'Явно выбрано вами и прямо заявлено второй стороной.',
      })),
      ...supportedNeeds.map((category) => ({
        kind: 'SUPPORTED_NEED' as const,
        label: `Может поддержать: ${needLabels[category]}`,
        evidence: 'Связь построена по категории вашей карточки, без чтения скрытого смысла.',
      })),
      ...sharedBusinessAbilities.map((ability) => ({
        kind: 'BUSINESS_ABILITY' as const,
        label: `Для работы бизнеса: ${ability}`,
        evidence: 'Способность прямо указана в плане работы и учебном заявлении человека.',
      })),
      ...confirmedObservations.slice(0, 1).map((observation) => ({
        kind: 'CONFIRMED_REFLECTION' as const,
        label: observation.possibleMeaning.replace(/^Возможно,\s*/u, ''),
        evidence: 'Наблюдение включено только после вашего признания.',
      })),
    ];

    const coherence =
      threads.length >= 5
        ? ('strong' as const)
        : threads.length >= 3
          ? ('coherent' as const)
          : threads.length > 0
            ? ('emerging' as const)
            : ('not_formed' as const);

    return {
      ...candidate,
      threads,
      coherence,
      comparisonAllowed: true,
    };
  });
}

export function buildConnectionPermit(input: {
  comparisonPermission: boolean;
  selectedCandidateId: string | null;
  availableCandidates: CandidateContour[];
}) {
  const candidate = input.availableCandidates.find(
    (item) => item.id === input.selectedCandidateId,
  );
  const internallyAllowed = Boolean(
    input.comparisonPermission && candidate && candidate.threads.length > 0,
  );

  return {
    internallyAllowed,
    action: internallyAllowed ? ('PREPARE_INTRODUCTION_DRAFT' as const) : ('NO_ACTION' as const),
    externalActionAllowed: false as const,
    reason: internallyAllowed
      ? 'Можно подготовить частный черновик знакомства; отправка требует отдельного взаимного разрешения.'
      : 'Сначала разрешите сопоставление и выберите человека с видимыми основаниями связи.',
    successorState: internallyAllowed ? ('PRIVATE_DRAFT' as const) : ('PRIVATE_OBSERVATION' as const),
  };
}
