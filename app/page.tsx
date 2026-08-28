'use client';

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import {
  isManualCategory,
  manualCategoryIds,
  manualEntries,
  type ManualCategory,
} from '@/lib/context-manual';
import {
  evaluateDecision,
  type DecisionDisposition,
  type DecisionReceipt,
} from '@/lib/uu-aap-decision-core';
import {
  buildEmployerFearDeclaration,
  buildNeedDeck,
  employerFearOptions,
  toggleEmployerFear,
  type EmployerFearId,
  type NeedInfluence,
} from '@/lib/need-card-core';
import {
  employerAuthorityStatusLabels,
  hypothesisStatusLabels,
  needCategoryLabels,
  needSourceLabels,
  protocolStackLabels,
  stageStatusLabels,
  successorStateLabels,
} from '@/lib/russian-terminology';
import {
  buildBusinessPeoplePlan,
  businessWorkOptions,
  type BusinessWorkId,
} from '@/lib/business-people-plan';
import {
  buildConnectionContours,
  buildConnectionPermit,
  deriveInteractionObservations,
  understandingModeOptions,
  type HypothesisDecision,
  type UnderstandingMode,
} from '@/lib/connection-contour';

const intentOptions = [
  { code: 'WORK', marker: 'РАБОТА', label: 'Работа' },
  { code: 'PROJECT', marker: 'ПРОЕКТ', label: 'Проект' },
  { code: 'COFOUNDER', marker: 'СООСНОВАТЕЛЬ', label: 'Соосновательство' },
  { code: 'MENTORSHIP', marker: 'НАСТАВНИК', label: 'Наставничество' },
];

const conditionOptions = [
  'Самостоятельность без одиночества',
  'Прямой разговор о деньгах',
  'Спокойный темп без героизма',
  'Сложная задача с правом спорить',
];

const decisionOptions: Array<{
  value: DecisionDisposition;
  label: string;
  description: string;
}> = [
  {
    value: 'explore',
    label: 'Исследовать',
    description: 'Подготовить вопросы, не отправляя их.',
  },
  {
    value: 'pause',
    label: 'Пауза',
    description: 'Оставить позицию частным черновиком.',
  },
  {
    value: 'decline',
    label: 'Отказаться',
    description: 'Закрыть наблюдение без негативной метки.',
  },
];

const actionLabels: Record<string, string> = {
  PREPARE_QUESTIONS: 'Подготовить вопросы',
  KEEP_PRIVATE_DRAFT: 'Сохранить частный черновик',
  CLOSE_OBSERVATION: 'Закрыть наблюдение',
  NO_ACTION: 'Ничего не делать',
};

const influenceOptions: Array<{
  value: NeedInfluence;
  label: string;
  short: string;
}> = [
  { value: 'observe', label: 'Только отражать', short: 'отражать' },
  { value: 'priority', label: 'Поднимать в моём порядке', short: 'учитывать' },
  { value: 'boundary', label: 'Считать моей границей', short: 'граница' },
];

const coherenceLabels = {
  not_formed: 'ещё не сформирован',
  emerging: 'намечается',
  coherent: 'связный',
  strong: 'устойчивый',
} as const;

const understandingModeLabels = Object.fromEntries(
  understandingModeOptions.map((option) => [option.id, option.label]),
) as Record<UnderstandingMode, string>;

export default function Home() {
  const [intent, setIntent] = useState('WORK');
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [outcome, setOutcome] = useState(
    'Сделать продукт понятнее людям и видеть, что моя работа действительно помогла.',
  );
  const [boundary, setBoundary] = useState(
    'Не готов обменивать здоровье и честность на красивую должность.',
  );
  const [hypothesis, setHypothesis] = useState<'pending' | 'accepted' | 'rejected'>(
    'pending',
  );
  const [decisionMode, setDecisionMode] = useState<DecisionDisposition>('explore');
  const [decisionReceipt, setDecisionReceipt] = useState<DecisionReceipt | null>(null);
  const [needInfluence, setNeedInfluence] = useState<Record<string, NeedInfluence>>({
    'need-outcome': 'priority',
    'need-condition': 'priority',
    'need-boundary': 'boundary',
  });
  const [employerFears, setEmployerFears] = useState<EmployerFearId[]>([]);
  const [businessWorkIds, setBusinessWorkIds] = useState<BusinessWorkId[]>([
    'UNDERSTAND_PEOPLE',
    'MAKE_PRODUCT',
    'EXPLAIN_VALUE',
  ]);
  const [weeklyWorkMinimum, setWeeklyWorkMinimum] = useState(60);
  const [weeklyWorkMaximum, setWeeklyWorkMaximum] = useState(100);
  const [safeLoadMinimum, setSafeLoadMinimum] = useState(20);
  const [safeLoadMaximum, setSafeLoadMaximum] = useState(30);
  const [understandingModes, setUnderstandingModes] = useState<UnderstandingMode[]>([
    'WHOLE',
    'STEPS',
  ]);
  const [manualOpenCount, setManualOpenCount] = useState(0);
  const [wordingRevisionCount, setWordingRevisionCount] = useState(0);
  const [influenceChangeCount, setInfluenceChangeCount] = useState(0);
  const [observationDecisions, setObservationDecisions] = useState<
    Record<string, HypothesisDecision>
  >({});
  const [comparisonPermission, setComparisonPermission] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [manualCategory, setManualCategory] = useState<ManualCategory>('overview');
  const [manualOpen, setManualOpen] = useState(false);

  const intentLabel = useMemo(
    () => intentOptions.find((option) => option.code === intent)?.label ?? 'Работа',
    [intent],
  );

  const needDeck = useMemo(
    () =>
      buildNeedDeck(
        { outcome, condition, boundary },
        needInfluence,
      ),
    [boundary, condition, needInfluence, outcome],
  );

  const employerDeclaration = useMemo(
    () => buildEmployerFearDeclaration(employerFears, false),
    [employerFears],
  );

  const businessPeoplePlan = useMemo(
    () =>
      buildBusinessPeoplePlan({
        selectedWorkIds: businessWorkIds,
        weeklyWorkMinimum,
        weeklyWorkMaximum,
        safeLoadMinimum,
        safeLoadMaximum,
      }),
    [
      businessWorkIds,
      safeLoadMaximum,
      safeLoadMinimum,
      weeklyWorkMaximum,
      weeklyWorkMinimum,
    ],
  );

  const interactionObservations = useMemo(
    () =>
      deriveInteractionObservations({
        manualOpenCount,
        wordingRevisionCount,
        influenceChangeCount,
        meaningfulTextLength: outcome.length + boundary.length,
      }),
    [
      boundary.length,
      influenceChangeCount,
      manualOpenCount,
      outcome.length,
      wordingRevisionCount,
    ],
  );

  const acceptedObservationIds = useMemo(
    () =>
      interactionObservations
        .filter((observation) => observationDecisions[observation.id] === 'accepted')
        .map((observation) => observation.id),
    [interactionObservations, observationDecisions],
  );

  const connectionContours = useMemo(
    () =>
      buildConnectionContours({
        selectedModes: understandingModes,
        acceptedObservationIds,
        observations: interactionObservations,
        needCards: needDeck,
        businessAbilities: businessPeoplePlan.abilities,
        comparisonPermission,
      }),
    [
      acceptedObservationIds,
      businessPeoplePlan.abilities,
      comparisonPermission,
      interactionObservations,
      needDeck,
      understandingModes,
    ],
  );

  const connectionPermit = useMemo(
    () =>
      buildConnectionPermit({
        comparisonPermission,
        selectedCandidateId,
        availableCandidates: connectionContours,
      }),
    [comparisonPermission, connectionContours, selectedCandidateId],
  );

  const decisionProjection = useMemo(
    () =>
      evaluateDecision({
        intent: intentLabel,
        outcome,
        condition,
        boundary,
        hypothesis,
        decision: decisionMode,
        now: 'PREVIEW',
      }),
    [boundary, condition, decisionMode, hypothesis, intentLabel, outcome],
  );

  const manualEntry = manualEntries[manualCategory];

  useEffect(() => {
    if (!manualOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setManualOpen(false);
      }
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [manualOpen]);

  function openManual(category: ManualCategory) {
    setManualOpenCount((current) => current + 1);
    setManualCategory(category);
    setManualOpen(true);
  }

  function toggleBusinessWork(id: BusinessWorkId) {
    setBusinessWorkIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleUnderstandingMode(id: UnderstandingMode) {
    setUnderstandingModes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function handleManualContext(event: ReactMouseEvent<HTMLElement>) {
    const origin = event.target;

    if (!(origin instanceof Element)) {
      return;
    }

    const annotatedArea = origin.closest<HTMLElement>('[data-manual-category]');
    const category = annotatedArea?.dataset.manualCategory;

    if (!isManualCategory(category)) {
      return;
    }

    event.preventDefault();
    openManual(category);
  }

  function runDecisionCore() {
    setDecisionReceipt(
      evaluateDecision({
        intent: intentLabel,
        outcome,
        condition,
        boundary,
        hypothesis,
        decision: decisionMode,
      }),
    );
  }

  return (
    <main className="truehire-shell" onContextMenu={handleManualContext}>
      <aside className="side-rail" aria-label="Навигация TRUEHIRE">
        <a className="brand" href="#start" aria-label="TRUEHIRE — начало">
          <span className="brand-mark">TH</span>
          <span>
            <b>TRUEHIRE</b>
            <small>ЧЕСТНЫЙ НАЙМ / 0.5</small>
          </span>
        </a>

        <nav aria-label="Этапы">
          <a className="nav-item active" href="#intent"><span>01</span>Намерение</a>
          <a className="nav-item" href="#business"><span>02</span>Бизнес</a>
          <a className="nav-item" href="#reflection"><span>03</span>Отражение</a>
          <a className="nav-item" href="#needs"><span>04</span>Потребности</a>
          <a className="nav-item" href="#connections"><span>05</span>Связи</a>
          <a className="nav-item" href="#decision"><span>06</span>Решение</a>
          <a className="nav-item" href="#receipt"><span>07</span>Карточка</a>
          <a className="nav-item" href="#gate"><span>08</span>Граница</a>
        </nav>

        <section className="mode-card" aria-label="Режим приложения">
          <span className="status-dot" aria-hidden="true" />
          <small>Режим системы</small>
          <strong>Внутреннее решение</strong>
          <p>Без учётной записи · без отправки работодателю · с квитанцией</p>
        </section>
      </aside>

      <div className="workspace">
        <header className="topbar" id="start">
          <div>
            <span className="eyebrow">Независимый программный объект</span>
            <p className="topline">КУЗНЕЦОВ ДМИТРИЙ ОЛЕГОВИЧ / MATAWAKA</p>
          </div>
          <div className="top-actions">
            <button
              className="manual-open"
              data-manual-category="overview"
              onClick={() => openManual('overview')}
              type="button"
            >
              ? Справка
            </button>
            <div className="top-status">
              <span>UU-AAP</span>
              <b>ТОЛЬКО ЧТЕНИЕ</b>
            </div>
          </div>
        </header>

        <section className="hero" data-manual-category="intent" id="intent">
          <div className="hero-copy">
            <span className="eyebrow">Неудобный вопрос / 01</span>
            <h1>Вам нужна работа —<br />или жизнь, в которой она имеет смысл?</h1>
            <p>
              TRUEHIRE не решает, кем вам быть. Сначала фиксируем ваше намерение,
              условия и границы — без скрытой оценки пригодности.
            </p>
          </div>

          <aside className="boundary-note">
            <span>Сейчас запрещено</span>
            <strong>решать, подходите ли вы работодателю</strong>
            <p>ДАННЫЕ ПРОФИЛЯ ≠ НАМЕРЕНИЕ ЧЕЛОВЕКА</p>
          </aside>
        </section>

        <section className="builder-grid">
          <form
            className="intent-panel panel"
            data-manual-category="intent"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Ваше явное намерение</span>
                <h2>Что вы ищете на самом деле?</h2>
              </div>
              <span className="scope-chip">можно изменить</span>
            </div>

            <fieldset className="intent-switcher" data-manual-category="intent">
              <legend className="sr-only">Тип намерения</legend>
              {intentOptions.map((option) => (
                <button
                  aria-pressed={intent === option.code}
                  className={intent === option.code ? 'intent-button active' : 'intent-button'}
                  key={option.code}
                  onClick={() => setIntent(option.code)}
                  type="button"
                >
                  <span>{option.marker}</span>
                  {option.label}
                </button>
              ))}
            </fieldset>

            <div className="form-stack">
              <label data-manual-category="outcome">
                <span>Какой результат даст ощущение «это было не зря»?</span>
                <textarea
                  value={outcome}
                  onBlur={() => setWordingRevisionCount((current) => current + 1)}
                  onChange={(event) => setOutcome(event.target.value)}
                />
              </label>

              <label data-manual-category="condition">
                <span>Условие, без которого совпадение бессмысленно</span>
                <select
                  value={condition}
                  onChange={(event) => {
                    setCondition(event.target.value);
                    setWordingRevisionCount((current) => current + 1);
                  }}
                >
                  {conditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>

              <label data-manual-category="boundary">
                <span>Что нельзя принести в жертву?</span>
                <textarea
                  value={boundary}
                  onBlur={() => setWordingRevisionCount((current) => current + 1)}
                  onChange={(event) => setBoundary(event.target.value)}
                />
              </label>
            </div>

            <p className="privacy-line"><i /> Эти ответы пока существуют только в этой вкладке.</p>
            <button
              className="context-help"
              data-manual-category="overview"
              onClick={() => openManual('overview')}
              type="button"
            >
              <span>?</span>
              Правая кнопка в любой точке формы объяснит понятие под курсором.
            </button>
          </form>

          <div className="right-stack">
            <section
              className="reflection-card panel"
              data-manual-category="hypothesis"
              id="reflection"
            >
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">Предположение, не медицинский вывод</span>
                  <h2>Возможно, вам важна автономия без изоляции.</h2>
                </div>
                <span className={`hypothesis-state ${hypothesis}`}>?</span>
              </div>
              <p>
                Это отражение ваших формулировок. Оно не становится частью
                намерения, пока вы сами его не признаете.
              </p>
              <div className="reflection-actions">
                <button
                  className={hypothesis === 'accepted' ? 'button primary selected' : 'button primary'}
                  onClick={() => setHypothesis('accepted')}
                  type="button"
                >
                  Похоже на меня
                </button>
                <button
                  className={hypothesis === 'rejected' ? 'button secondary selected' : 'button secondary'}
                  onClick={() => setHypothesis('rejected')}
                  type="button"
                >
                  Нет, это не моё
                </button>
              </div>
              <small className="reflection-result" aria-live="polite">
                {hypothesis === 'pending' && 'Ожидается ваше решение.'}
                {hypothesis === 'accepted' && 'Признано вами · остаётся предварительным в этих пределах.'}
                {hypothesis === 'rejected' && 'Отклонено вами · предположение не используется.'}
              </small>
            </section>

            <section className="authority-card panel" data-manual-category="authority">
              <div className="authority-row">
                <span className="authority-icon">!</span>
                <div>
                  <span className="eyebrow">Сторона работодателя</span>
                  <h2>Полномочия не предъявлены</h2>
                </div>
              </div>
              <dl>
                <div><dt>Компания</dt><dd>не выбрана</dd></div>
                <div><dt>Доказательство полномочий</dt><dd>отсутствует</dd></div>
                <div><dt>Допустимое действие</dt><dd>никакое внешнее</dd></div>
              </dl>
              <p>УЧЁТНАЯ ЗАПИСЬ КОМПАНИИ ≠ ПОЛНОМОЧИЯ РУКОВОДИТЕЛЯ</p>
            </section>
          </div>
        </section>

        <section
          className="business-section"
          data-manual-category="business-plan"
          id="business"
        >
          <div className="section-heading business-heading">
            <div>
              <span className="eyebrow">Потребность будущего бизнеса / 02</span>
              <h2>Сначала понять работу. Потом искать людей.</h2>
            </div>
            <p>
              Здесь нет названий должностей. Вы выбираете понятную работу, оцениваете её объём
              и сами видите, откуда появляется диапазон людей.
            </p>
          </div>

          <div className="business-grid">
            <section className="work-map panel" data-manual-category="business-plan">
              <header>
                <div>
                  <span className="eyebrow">Что бизнес обязан уметь делать</span>
                  <h3>Выберите реальную работу, а не должности</h3>
                </div>
                <span className="scope-chip">{businessWorkIds.length} выбрано</span>
              </header>
              <div className="work-options">
                {businessWorkOptions.map((work) => {
                  const selected = businessWorkIds.includes(work.id);
                  return (
                    <button
                      aria-pressed={selected}
                      className={selected ? 'work-option selected' : 'work-option'}
                      key={work.id}
                      onClick={() => toggleBusinessWork(work.id)}
                      type="button"
                    >
                      <span>{selected ? '✓' : '+'}</span>
                      <strong>{work.label}</strong>
                      <small>{work.question}</small>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="people-calculator panel" data-manual-category="business-plan">
              <span className="eyebrow">Понятный расчёт</span>
              <h3>Сколько работы предстоит?</h3>
              <div className="range-fields">
                <fieldset>
                  <legend>Всего часов работы в неделю</legend>
                  <label>
                    <span>от</span>
                    <input
                      min="0"
                      onChange={(event) => setWeeklyWorkMinimum(Number(event.target.value))}
                      type="number"
                      value={weeklyWorkMinimum}
                    />
                  </label>
                  <label>
                    <span>до</span>
                    <input
                      min="0"
                      onChange={(event) => setWeeklyWorkMaximum(Number(event.target.value))}
                      type="number"
                      value={weeklyWorkMaximum}
                    />
                  </label>
                </fieldset>
                <fieldset>
                  <legend>Безопасная нагрузка одного человека</legend>
                  <label>
                    <span>от</span>
                    <input
                      min="1"
                      onChange={(event) => setSafeLoadMinimum(Number(event.target.value))}
                      type="number"
                      value={safeLoadMinimum}
                    />
                  </label>
                  <label>
                    <span>до</span>
                    <input
                      min="1"
                      onChange={(event) => setSafeLoadMaximum(Number(event.target.value))}
                      type="number"
                      value={safeLoadMaximum}
                    />
                  </label>
                </fieldset>
              </div>

              <div className="people-result" aria-live="polite">
                <small>Предварительная потребность</small>
                {businessPeoplePlan.peopleRange ? (
                  <strong>
                    {businessPeoplePlan.peopleRange.minimum}–{businessPeoplePlan.peopleRange.maximum}
                    <span> человек</span>
                  </strong>
                ) : (
                  <strong className="unknown">ещё неизвестно</strong>
                )}
                <p>
                  {businessPeoplePlan.weeklyWorkload.minimum}–{businessPeoplePlan.weeklyWorkload.maximum}
                  {' '}часов ÷ {businessPeoplePlan.safeLoadPerPerson.minimum}–
                  {businessPeoplePlan.safeLoadPerPerson.maximum} часов на человека.
                </p>
              </div>

              <small className="calculation-boundary">
                ДИАПАЗОН ЛЮДЕЙ ≠ РЕШЕНИЕ О НАЙМЕ
              </small>
            </section>
          </div>

          <div className="ability-panel panel" data-manual-category="business-abilities">
            <div>
              <span className="eyebrow">Какие способности понадобятся</span>
              <h3>Простыми словами — что человек должен уметь делать</h3>
            </div>
            <ul>
              {businessPeoplePlan.abilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>
            <aside>
              <small>Пока не учтено</small>
              {businessPeoplePlan.uncertainties.map((uncertainty) => (
                <p key={uncertainty}>{uncertainty}</p>
              ))}
            </aside>
          </div>
        </section>

        <section className="need-section" data-manual-category="need-card" id="needs">
          <div className="section-heading need-heading">
            <div>
              <span className="eyebrow">Личная картотека потребностей / 03</span>
              <h2>Потребность хранится у человека.</h2>
            </div>
            <p>
              Ранг показывает не «какой вы кандидат», а насколько сильно ваша
              собственная потребность должна влиять на вашу выдачу.
            </p>
          </div>

          <div className="need-grid">
            <section className="need-vault panel" data-manual-category="need-card">
              <header>
                <div>
                  <span className="eyebrow">Личная картотека</span>
                  <h3>{needDeck.length} карточки · только эта вкладка</h3>
                </div>
                <span className="vault-state"><i /> ПАМЯТЬ ВКЛАДКИ</span>
              </header>

              <div className="need-card-list">
                {needDeck.map((need) => (
                  <article className="need-card" data-manual-category="need-card" key={need.id}>
                    <div className="need-rank">
                      <small>ПОРЯДОК</small>
                      <strong>{String(need.rankPosition).padStart(2, '0')}</strong>
                    </div>
                    <div className="need-copy">
                      <span>{needCategoryLabels[need.category]} · {needSourceLabels[need.source]}</span>
                      <p>{need.statement}</p>
                      <small>{need.effectLabel}</small>
                    </div>
                    <fieldset className="need-influence">
                      <legend>Сила влияния</legend>
                      {influenceOptions.map((option) => (
                        <button
                          aria-label={option.label}
                          aria-pressed={need.influence === option.value}
                          className={need.influence === option.value ? 'active' : ''}
                          key={option.value}
                          onClick={() => {
                            setNeedInfluence((current) => ({
                              ...current,
                              [need.id]: option.value,
                            }));
                            setInfluenceChangeCount((current) => current + 1);
                          }}
                          title={option.label}
                          type="button"
                        >
                          {option.short}
                        </button>
                      ))}
                    </fieldset>
                  </article>
                ))}
              </div>

              <footer className="vault-route">
                <div><small>Сейчас</small><strong>оперативная память вкладки</strong></div>
                <span>→</span>
                <div><small>Следующий слой</small><strong>личное защищённое хранилище</strong></div>
                <span>→</span>
                <div><small>Наружу</small><strong>только выборочное раскрытие</strong></div>
              </footer>
            </section>

            <aside className="employer-fear panel" data-manual-category="employer-fear">
              <span className="eyebrow">Зеркало работодателя · макет</span>
              <h3>Чего компания боится в сильном человеке?</h3>
              <p>
                Работодатель выбирает не «плохие качества кандидата», а максимум
                две собственные тревоги. Они видимы человеку и не работают как
                скрытый фильтр.
              </p>

              <div className="fear-options">
                {employerFearOptions.map((fear) => {
                  const selected = employerFears.includes(fear.id);
                  const locked = !selected && employerFears.length >= 2;

                  return (
                    <button
                      aria-pressed={selected}
                      className={selected ? 'fear-option selected' : 'fear-option'}
                      disabled={locked}
                      key={fear.id}
                      onClick={() => setEmployerFears((current) => toggleEmployerFear(current, fear.id))}
                      type="button"
                    >
                      <span>{selected ? '×' : '+'}</span>
                      <strong>{fear.label}</strong>
                    </button>
                  );
                })}
              </div>

              <dl className="fear-receipt">
                <div><dt>Выбрано</dt><dd>{employerDeclaration.selected.length} / 2</dd></div>
                <div><dt>Полномочия</dt><dd>{employerAuthorityStatusLabels[employerDeclaration.authorityStatus]}</dd></div>
                <div><dt>Скрытое исключение</dt><dd>ЗАПРЕЩЕНО</dd></div>
                <div><dt>Влияние на сопоставление</dt><dd>НЕ РАЗРЕШЕНО</dd></div>
              </dl>

              <small className="fear-boundary">
                ТРЕВОГА РАБОТОДАТЕЛЯ ≠ ФАКТ О ЧЕЛОВЕКЕ
              </small>
            </aside>
          </div>
        </section>

        <section
          className="connection-section"
          data-manual-category="connection-contour"
          id="connections"
        >
          <div className="section-heading connection-heading">
            <div>
              <span className="eyebrow">Соединительный контур / 05</span>
              <h2>Не оценивать людей. Находить основания для связи.</h2>
            </div>
            <p>
              Контур соединяет прямые заявления, карточки потребностей и только те
              наблюдения интерфейса, которые вы сами признали и разрешили использовать.
            </p>
          </div>

          <div className="connection-builder-grid">
            <section className="understanding-panel panel" data-manual-category="understanding">
              <span className="eyebrow">Как вы обращаетесь со сложностью</span>
              <h3>Выберите способы, которые узнаёте в себе</h3>
              <div className="understanding-options">
                {understandingModeOptions.map((option) => {
                  const selected = understandingModes.includes(option.id);
                  return (
                    <button
                      aria-pressed={selected}
                      className={selected ? 'understanding-option selected' : 'understanding-option'}
                      key={option.id}
                      onClick={() => toggleUnderstandingMode(option.id)}
                      type="button"
                    >
                      <span>{selected ? '✓' : '+'}</span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="observation-panel panel" data-manual-category="understanding">
              <span className="eyebrow">Видимый след работы с формой</span>
              <h3>Наблюдение ещё ничего не решает</h3>
              <div className="observation-list">
                {interactionObservations.map((observation) => {
                  const decision = observationDecisions[observation.id] ?? 'pending';
                  return (
                    <article key={observation.id}>
                      <small>{observation.fact}</small>
                      <p>{observation.possibleMeaning}</p>
                      <div>
                        <button
                          aria-pressed={decision === 'accepted'}
                          className={decision === 'accepted' ? 'accepted' : ''}
                          onClick={() =>
                            setObservationDecisions((current) => ({
                              ...current,
                              [observation.id]: 'accepted',
                            }))
                          }
                          type="button"
                        >
                          Признать
                        </button>
                        <button
                          aria-pressed={decision === 'rejected'}
                          className={decision === 'rejected' ? 'rejected' : ''}
                          onClick={() =>
                            setObservationDecisions((current) => ({
                              ...current,
                              [observation.id]: 'rejected',
                            }))
                          }
                          type="button"
                        >
                          Не моё
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <label className="comparison-permission">
                <input
                  checked={comparisonPermission}
                  onChange={(event) => {
                    setComparisonPermission(event.target.checked);
                    if (!event.target.checked) {
                      setSelectedCandidateId(null);
                    }
                  }}
                  type="checkbox"
                />
                <span>
                  <strong>Разрешаю сопоставить это в пределах текущей вкладки</strong>
                  <small>Ничего не отправлять и не строить скрытый профиль.</small>
                </span>
              </label>
            </section>
          </div>

          <div className="candidate-grid" aria-label="Возможные основания связи">
            {connectionContours.map((candidate) => (
              <article
                className={selectedCandidateId === candidate.id ? 'candidate-card panel selected' : 'candidate-card panel'}
                key={candidate.id}
              >
                <header>
                  <div>
                    <span className="eyebrow">Учебное прямое заявление</span>
                    <h3>{candidate.name}</h3>
                    <p>{candidate.role}</p>
                  </div>
                  <span className={`coherence ${candidate.coherence}`}>
                    {coherenceLabels[candidate.coherence]}
                  </span>
                </header>
                <blockquote>«{candidate.intent}»</blockquote>
                <div className="declared-modes">
                  {candidate.declaredModes.map((mode) => (
                    <span key={mode}>{understandingModeLabels[mode]}</span>
                  ))}
                </div>
                {candidate.comparisonAllowed ? (
                  <ul className="connection-threads">
                    {candidate.threads.map((thread) => (
                      <li key={`${thread.kind}-${thread.label}`} title={thread.evidence}>
                        {thread.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="comparison-closed">Сравнение закрыто до вашего разрешения.</p>
                )}
                <button
                  disabled={!candidate.comparisonAllowed || candidate.threads.length === 0}
                  onClick={() => setSelectedCandidateId(candidate.id)}
                  type="button"
                >
                  {selectedCandidateId === candidate.id ? 'Связь выбрана' : 'Рассмотреть связь'}
                </button>
              </article>
            ))}
          </div>

          <div className="connection-permit panel" data-manual-category="connection-contour">
            <div>
              <small>РУБЕЖ СОЕДИНЕНИЯ</small>
              <strong>
                {connectionPermit.internallyAllowed
                  ? 'Можно подготовить частный черновик знакомства'
                  : 'Действие ожидает вашего основания'}
              </strong>
            </div>
            <p>{connectionPermit.reason}</p>
            <code>ВНЕШНЯЯ ОТПРАВКА: ЗАПРЕЩЕНА</code>
          </div>
        </section>

        <section className="decision-section" data-manual-category="decision" id="decision">
          <div className="section-heading decision-heading">
            <div>
              <span className="eyebrow">Ядро решения UU-AAP / 06</span>
              <h2>Магия без фокусов.</h2>
            </div>
            <p>
              Семь видимых переходов вместо скрытого «умного» ответа. Ядро не ищет
              правильное решение — оно проверяет границу допустимого действия.
            </p>
          </div>

          <div className="decision-grid">
            <section className="decision-flow panel" aria-label="Этапы UU-AAP">
              <ol>
                {decisionProjection.stages.map((stage, index) => (
                  <li key={stage.key}>
                    <span className="stage-index">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <small>{stage.label}</small>
                      <strong>{stage.note}</strong>
                    </div>
                    <code>{stageStatusLabels[stage.status]}</code>
                  </li>
                ))}
              </ol>

              <fieldset className="decision-choices">
                <legend>Ваше решение для этого черновика</legend>
                {decisionOptions.map((option) => (
                  <button
                    aria-pressed={decisionMode === option.value}
                    className={decisionMode === option.value ? 'decision-choice active' : 'decision-choice'}
                    key={option.value}
                    onClick={() => {
                      setDecisionMode(option.value);
                      setDecisionReceipt(null);
                    }}
                    type="button"
                  >
                    <span>{option.label}</span>
                    <small>{option.description}</small>
                  </button>
                ))}
              </fieldset>

              <button className="decision-run" onClick={runDecisionCore} type="button">
                Провести решение через ядро
                <span aria-hidden="true">→</span>
              </button>
            </section>

            <aside
              className={decisionReceipt ? 'decision-output panel has-receipt' : 'decision-output panel'}
              aria-live="polite"
            >
              <div className="decision-orbit" aria-hidden="true">
                <span>СОСТОЯНИЕ</span>
                <i />
                <b>ДОПУСК</b>
              </div>

              {!decisionReceipt && (
                <div className="decision-placeholder">
                  <span className="eyebrow">До подтверждения</span>
                  <h3>Нет «правильного» варианта.</h3>
                  <p>
                    Вы выбираете следующий внутренний шаг. Ядро отдельно фиксирует,
                    что это не разрешение действовать вовне.
                  </p>
                  <code>ДЕЙСТВИЕ ВОВНЕ: ЗАПРЕЩЕНО</code>
                </div>
              )}

              {decisionReceipt && (
                <div className="decision-receipt">
                  <span className="eyebrow">Квитанция решения</span>
                  <small>№ {decisionReceipt.receiptId.split('-').at(-1)}</small>
                  <h3>{actionLabels[decisionReceipt.nextAction]}</h3>
                  <p>{decisionReceipt.reason}</p>

                  <dl className="permit-grid">
                    <div>
                      <dt>Внутреннее действие</dt>
                      <dd className={decisionReceipt.localActionAllowed ? 'allow' : 'deny'}>
                        {decisionReceipt.localActionAllowed ? 'РАЗРЕШЕНО' : 'ЗАПРЕЩЕНО'}
                      </dd>
                    </div>
                    <div>
                      <dt>Внешнее действие</dt>
                      <dd className="deny">ЗАПРЕЩЕНО</dd>
                    </div>
                    <div>
                      <dt>Состояние предположения</dt>
                      <dd>{hypothesisStatusLabels[decisionReceipt.hypothesis.status]}</dd>
                    </div>
                    <div>
                      <dt>Последующее состояние</dt>
                      <dd>{successorStateLabels[decisionReceipt.successorState] ?? 'БЕЗ ИЗМЕНЕНИЙ'}</dd>
                    </div>
                  </dl>

                  <div className="unknown-list">
                    <small>Неразрешённая неопределённость</small>
                    <ul>
                      {decisionReceipt.unresolved.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>

                  <footer>
                    <span>{protocolStackLabels[decisionReceipt.protocolStack]}</span>
                    <b>ДЕЙСТВИЕ ≠ ПОЛНОМОЧИЕ</b>
                  </footer>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="receipt-section" data-manual-category="receipt" id="receipt">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Проверяемая карточка / 07</span>
              <h2>Не резюме. Позиция.</h2>
            </div>
            <p>Каждое утверждение остаётся редактируемым и имеет понятный источник.</p>
          </div>

          <article className="intent-receipt panel">
            <div className="receipt-code">НАМЕРЕНИЕ / {intentLabel.toUpperCase()}</div>
            <div className="receipt-main">
              <small>Я ищу</small>
              <h3>{intentLabel}</h3>
              <blockquote>«{outcome || 'Результат пока не сформулирован.'}»</blockquote>
            </div>
            <div className="receipt-conditions">
              <div><small>Необходимое условие</small><strong>{condition}</strong></div>
              <div><small>Моя граница</small><strong>{boundary || 'Не указана'}</strong></div>
            </div>
            <footer>
              <span>Источник: прямой ввод пользователя</span>
              <span>Согласие на передачу: не дано</span>
              <b>ЧЕРНОВИК</b>
            </footer>
          </article>
        </section>

        <section className="action-gate" data-manual-category="action-gate" id="gate">
          <div>
            <span className="gate-light" />
            <span>
              <small>РУБЕЖ ДОПУСКА UU-AAP / 08</small>
              <strong>Самостоятельное действие системы закрыто</strong>
            </span>
          </div>
          <p>Намерение сформулировано, но нет второй стороны, её полномочий и взаимного разрешения.</p>
          <code>САМОСТОЯТЕЛЬНОЕ ДЕЙСТВИЕ СИСТЕМЫ: ЗАПРЕЩЕНО</code>
        </section>

        <footer className="site-footer">
          <p>TRUEHIRE / «Честный найм» · новый независимый программный объект</p>
          <p>Контрольная версия UU-AAP: d8500cdcbf9355cce71ce52beaea01c70e1a1c54 · использование ≠ изменение</p>
        </footer>
      </div>

      {manualOpen && (
        <div
          className="manual-layer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setManualOpen(false);
            }
          }}
          role="presentation"
        >
          <aside
            aria-labelledby="manual-title"
            aria-modal="true"
            className="manual-drawer"
            role="dialog"
          >
            <header>
              <div>
                <span className="eyebrow">Справка по месту · без догадок</span>
                <small>РАЗДЕЛ / {manualEntry.title.toUpperCase()}</small>
              </div>
              <button
                aria-label="Закрыть справку"
                autoFocus
                className="manual-close"
                onClick={() => setManualOpen(false)}
                type="button"
              >
                ×
              </button>
            </header>

            <nav aria-label="Разделы справки" className="manual-index">
              {manualCategoryIds.map((category) => (
                <button
                  aria-pressed={manualCategory === category}
                  className={manualCategory === category ? 'active' : ''}
                  key={category}
                  onClick={() => setManualCategory(category)}
                  type="button"
                >
                  {manualEntries[category].title}
                </button>
              ))}
            </nav>

            <article className="manual-content">
              <span className="eyebrow">Понятие</span>
              <h2 id="manual-title">{manualEntry.title}</h2>
              <p>{manualEntry.concept}</p>

              <dl>
                <div>
                  <dt>Замысел</dt>
                  <dd>{manualEntry.purpose}</dd>
                </div>
                <div>
                  <dt>Не означает</dt>
                  <dd>{manualEntry.notMeaning}</dd>
                </div>
              </dl>
            </article>

            <footer>
              <span>Раздел взят из области формы под курсором.</span>
              <code>САМОСТОЯТЕЛЬНЫЕ ДОГАДКИ СИСТЕМЫ: ЗАПРЕЩЕНЫ</code>
            </footer>
          </aside>
        </div>
      )}
    </main>
  );
}
