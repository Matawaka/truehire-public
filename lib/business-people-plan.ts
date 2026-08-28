export type BusinessWorkId =
  | 'UNDERSTAND_PEOPLE'
  | 'MAKE_PRODUCT'
  | 'EXPLAIN_VALUE'
  | 'KEEP_PROMISES'
  | 'SUPPORT_USE';

export type BusinessWork = {
  id: BusinessWorkId;
  label: string;
  question: string;
  abilities: string[];
};

export const businessWorkOptions: ReadonlyArray<BusinessWork> = [
  {
    id: 'UNDERSTAND_PEOPLE',
    label: 'Понять, что людям действительно нужно',
    question: 'Кто будет разговаривать с людьми, проверять догадки и замечать настоящую трудность?',
    abilities: [
      'слушать и задавать точные вопросы',
      'отделять наблюдение от догадки',
      'объяснять вывод простыми словами',
    ],
  },
  {
    id: 'MAKE_PRODUCT',
    label: 'Сделать работающий продукт',
    question: 'Кто превратит замысел в вещь или услугу, которой можно пользоваться?',
    abilities: [
      'собирать целое из понятных частей',
      'проверять работу до передачи людям',
      'исправлять причины, а не только последствия',
    ],
  },
  {
    id: 'EXPLAIN_VALUE',
    label: 'Понятно рассказать о пользе',
    question: 'Кто поможет человеку понять пользу без давления и скрытых обещаний?',
    abilities: [
      'говорить о сложном простыми словами',
      'слышать возражение без давления',
      'отличать предложение от рекламы',
    ],
  },
  {
    id: 'KEEP_PROMISES',
    label: 'Держать договорённости и ход работы',
    question: 'Кто увидит зависимости, сроки и перегрузку раньше, чем возникнет срыв?',
    abilities: [
      'делать ход работы видимым',
      'согласовывать людей без лишней власти',
      'останавливать перегрузку до ущерба',
    ],
  },
  {
    id: 'SUPPORT_USE',
    label: 'Помогать после начала использования',
    question: 'Кто ответит, когда человеку трудно, что-то сломалось или условия изменились?',
    abilities: [
      'спокойно разбирать сбои',
      'сохранять уважение в сложном разговоре',
      'возвращать повторяющиеся причины в продукт',
    ],
  },
];

export type BusinessPeoplePlan = {
  selectedWork: BusinessWork[];
  weeklyWorkload: { minimum: number; maximum: number };
  safeLoadPerPerson: { minimum: number; maximum: number };
  peopleRange: { minimum: number; maximum: number } | null;
  abilities: string[];
  uncertainties: string[];
  source: 'DIRECT_AUTHOR_INPUT';
  storage: 'TAB_MEMORY';
  externalActionAllowed: false;
};

function normalizeRange(first: number, second: number) {
  const safeFirst = Math.max(0, Number.isFinite(first) ? first : 0);
  const safeSecond = Math.max(0, Number.isFinite(second) ? second : 0);

  return {
    minimum: Math.min(safeFirst, safeSecond),
    maximum: Math.max(safeFirst, safeSecond),
  };
}

export function buildBusinessPeoplePlan(input: {
  selectedWorkIds: BusinessWorkId[];
  weeklyWorkMinimum: number;
  weeklyWorkMaximum: number;
  safeLoadMinimum: number;
  safeLoadMaximum: number;
}): BusinessPeoplePlan {
  const allowed = new Set(businessWorkOptions.map((option) => option.id));
  const selectedIds = [...new Set(input.selectedWorkIds)].filter((id) => allowed.has(id));
  const selectedWork = businessWorkOptions.filter((option) => selectedIds.includes(option.id));
  const weeklyWorkload = normalizeRange(input.weeklyWorkMinimum, input.weeklyWorkMaximum);
  const safeLoadPerPerson = normalizeRange(input.safeLoadMinimum, input.safeLoadMaximum);
  const canCalculate =
    weeklyWorkload.maximum > 0 &&
    safeLoadPerPerson.minimum > 0 &&
    safeLoadPerPerson.maximum > 0;
  const peopleRange = canCalculate
    ? {
        minimum: Math.max(1, Math.ceil(weeklyWorkload.minimum / safeLoadPerPerson.maximum)),
        maximum: Math.max(1, Math.ceil(weeklyWorkload.maximum / safeLoadPerPerson.minimum)),
      }
    : null;
  const abilities = [...new Set(selectedWork.flatMap((work) => work.abilities))];
  const uncertainties: string[] = [];

  if (selectedWork.length === 0) {
    uncertainties.push('Не выбрана работа, которую бизнес должен выполнять.');
  }
  if (!peopleRange) {
    uncertainties.push('Недостаточно данных о количестве работы или безопасной нагрузке.');
  }
  uncertainties.push('Расчёт не учитывает время на обучение, отпуск, болезни и резкие изменения спроса.');
  uncertainties.push('Один человек может совмещать виды работы только после явной проверки нагрузки.');

  return {
    selectedWork,
    weeklyWorkload,
    safeLoadPerPerson,
    peopleRange,
    abilities,
    uncertainties,
    source: 'DIRECT_AUTHOR_INPUT',
    storage: 'TAB_MEMORY',
    externalActionAllowed: false,
  };
}
