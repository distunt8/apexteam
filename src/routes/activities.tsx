import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Chip, TextArea, TextInput } from "@/components/ui";
import type { AchievementView, EventView, QuestStepView, QuestView, SurveyQuestionView, SurveyView } from "@/lib/apex";
import { formatDateTime, formatPoints } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/activities")({ component: ActivitiesPage });

type Filter = "all" | "quest" | "survey" | "event" | "achievement";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "quest", label: "Квесты" },
  { id: "survey", label: "Опросы" },
  { id: "event", label: "Мероприятия" },
  { id: "achievement", label: "Достижения" },
];

function ActivitiesPage() {
  const catalog = useStore((state) => state.activitiesCatalog);
  const load = useStore((state) => state.loadActivities);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    void load();
  }, [load]);

  const needle = query.trim().toLowerCase();
  const quests = useMemo(
    () => catalog.quests.filter((item) => matches(needle, item.title, item.description)),
    [catalog.quests, needle],
  );
  const surveys = useMemo(
    () => catalog.surveys.filter((item) => matches(needle, item.title, item.description)),
    [catalog.surveys, needle],
  );
  const events = useMemo(
    () => catalog.events.filter((item) => matches(needle, item.title, item.description, item.location)),
    [catalog.events, needle],
  );
  const achievements = useMemo(
    () => catalog.achievements.filter((item) => matches(needle, item.name, item.description)),
    [catalog.achievements, needle],
  );
  const empty =
    (filter === "all" || filter === "quest" ? quests.length : 0) +
      (filter === "all" || filter === "survey" ? surveys.length : 0) +
      (filter === "all" || filter === "event" ? events.length : 0) +
      (filter === "all" || filter === "achievement" ? achievements.length : 0) ===
    0;

  return (
    <Shell mode="top">
      <h1 className="text-3xl font-bold tracking-tight">Активности</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Квесты, опросы и запись на мероприятия. Награды приходят с сервера на личный баланс.
      </p>
      <div className="relative mt-5 max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <TextInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск"
          aria-label="Поиск по активностям"
          className="pl-9"
        />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {FILTERS.map((item) => (
          <Chip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      {catalog.warnings.length > 0 ? (
        <p className="mt-4 rounded-lg bg-card px-4 py-3 text-sm text-muted">{catalog.warnings.join(" ")}</p>
      ) : null}
      {catalog.status === "loading" && catalog.quests.length + catalog.events.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Загружаем активности.</p>
      ) : null}
      {catalog.status === "error" ? (
        <div className="mt-6">
          <p className="text-sm text-muted">{catalog.error}</p>
          <Button className="mt-3" onClick={() => void load()}>
            Повторить
          </Button>
        </div>
      ) : null}
      {catalog.status !== "loading" && empty ? (
        <p className="mt-6 text-sm text-muted">В этой категории пока пусто.</p>
      ) : null}
      <div className="mt-5 space-y-3">
        {filter === "all" || filter === "quest" ? quests.map((quest) => <QuestCard key={quest.id} quest={quest} />) : null}
        {filter === "all" || filter === "survey"
          ? surveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)
          : null}
        {filter === "all" || filter === "event" ? events.map((event) => <EventCard key={event.id} event={event} />) : null}
        {filter === "all" || filter === "achievement"
          ? achievements.map((item) => <AchievementCard key={item.id} item={item} />)
          : null}
      </div>
    </Shell>
  );
}

function matches(needle: string, ...parts: string[]) {
  if (!needle) return true;
  return parts.join(" ").toLowerCase().includes(needle);
}

function Card({
  kind,
  title,
  done,
  children,
}: {
  kind: string;
  title: string;
  done?: boolean;
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-wash px-2 py-0.5 text-xs font-semibold text-brand-deep">{kind}</span>
        {done ? <span className="text-xs font-semibold text-brand">получено</span> : null}
      </div>
      <h2 className="mt-2 text-lg font-bold">{title}</h2>
      {children}
    </article>
  );
}

function QuestCard({ quest }: { quest: QuestView }) {
  const join = useStore((state) => state.joinQuest);
  const completeStep = useStore((state) => state.completeQuestStep);
  const finish = useStore((state) => state.finishQuest);
  const [busy, setBusy] = useState("");
  const joined = quest.status === "in_progress" || quest.status === "completed";
  const requiredLeft = quest.steps.filter((step) => step.required && !step.completed);
  const canFinish = joined && quest.status !== "completed" && requiredLeft.length === 0;

  async function run(key: string, task: Promise<{ ok: boolean; error?: string }>, success: string) {
    setBusy(key);
    const result = await task;
    setBusy("");
    if (!result.ok) toast.error(result.error ?? "Не получилось");
    else toast.success(success);
  }

  return (
    <Card kind="Квест" title={quest.title} done={quest.status === "completed"}>
      {quest.description ? <p className="mt-1 max-w-2xl text-sm text-muted">{quest.description}</p> : null}
      <p className="mt-2 text-sm text-muted">
        {questStatus(quest.status)}
        {quest.steps.length > 0 ? ` · шагов ${quest.steps.filter((step) => step.completed).length} из ${quest.steps.length}` : ""}
        {span(quest.startAt, quest.endAt)}
      </p>
      <p className="mt-1 text-sm font-medium text-brand">{formatPoints(quest.reward)}</p>
      {!joined ? (
        <Button className="mt-4" disabled={busy !== ""} onClick={() => void run("join", join(quest.id), "Вы в квесте")}>
          Участвовать
        </Button>
      ) : null}
      {joined && quest.steps.length === 0 ? (
        <p className="mt-4 text-sm text-muted">У квеста на сервере пока нет шагов.</p>
      ) : null}
      {joined ? (
        <ol className="mt-4 space-y-3">
          {quest.steps.map((step, index) => (
            <StepRow
              key={step.id}
              index={index}
              step={step}
              busy={busy === step.id}
              onComplete={(proof) =>
                void run(step.id, completeStep(quest.id, step.id, proof), step.completed ? "Уже отмечено" : "Шаг отмечен")
              }
            />
          ))}
        </ol>
      ) : null}
      {canFinish ? (
        <Button className="mt-4" disabled={busy !== ""} onClick={() => void run("finish", finish(quest.id), "Квест завершён")}>
          Завершить и получить награду
        </Button>
      ) : null}
    </Card>
  );
}

function StepRow({
  step,
  index,
  busy,
  onComplete,
}: {
  step: QuestStepView;
  index: number;
  busy: boolean;
  onComplete: (proof?: { storagePath?: string; comment?: string }) => void;
}) {
  const [comment, setComment] = useState("");
  const [path, setPath] = useState("");
  const proof = step.completionType === "proof";
  const automatic = step.completionType === "automatic";
  return (
    <li className="rounded-md bg-surface px-3 py-3">
      <p className="text-sm font-semibold">
        {index + 1}. {step.title}
        {step.required ? "" : " · необязательный"}
      </p>
      {step.description ? <p className="mt-1 text-sm text-muted">{step.description}</p> : null}
      <p className="mt-1 text-xs text-muted">
        {step.completed ? "Выполнено" : automatic ? "Засчитывается автоматически" : proof ? "Нужно подтверждение" : "Отмечается вручную"}
        {step.proofStatus ? ` · ${proofLabel(step.proofStatus)}` : ""}
      </p>
      {step.completed || automatic ? null : proof ? (
        <div className="mt-3 grid gap-2">
          <TextInput value={path} onChange={(event) => setPath(event.target.value)} placeholder="Ссылка или путь к подтверждению" />
          <TextArea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Комментарий" className="min-h-16" />
          <Button disabled={busy || !path.trim()} onClick={() => onComplete({ storagePath: path, comment })}>
            Отправить подтверждение
          </Button>
        </div>
      ) : (
        <Button className="mt-3" disabled={busy} onClick={() => onComplete()}>
          Отметить шаг
        </Button>
      )}
    </li>
  );
}

function SurveyCard({ survey }: { survey: SurveyView }) {
  const submit = useStore((state) => state.submitSurvey);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const locked = !survey.canRespond;

  async function send() {
    const missing = survey.questions.find((question) => question.required && emptyAnswer(values[question.id]));
    if (missing) {
      toast.error("Заполните обязательные вопросы");
      return;
    }
    setBusy(true);
    const result = await submit(
      survey.id,
      survey.questions
        .filter((question) => !emptyAnswer(values[question.id]))
        .map((question) => ({ questionId: question.id, value: values[question.id] })),
    );
    setBusy(false);
    if (!result.ok) toast.error(result.error);
    else toast.success("Ответы отправлены");
  }

  return (
    <Card kind="Опрос" title={survey.title} done={survey.hasResponded && !survey.canRespond}>
      {survey.description ? <p className="mt-1 max-w-2xl text-sm text-muted">{survey.description}</p> : null}
      <p className="mt-2 text-sm text-muted">
        {survey.questionsCount} {questionsLabel(survey.questionsCount)}
        {survey.hasResponded ? " · вы уже отвечали" : ""}
      </p>
      {survey.questions.length === 0 ? <p className="mt-3 text-sm text-muted">Вопросов пока нет.</p> : null}
      {locked && survey.questions.length > 0 ? <p className="mt-3 text-sm text-muted">Ответ уже отправлен.</p> : null}
      {!locked && survey.questions.length > 0 ? (
        <div className="mt-4 space-y-4">
          {survey.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={values[question.id]}
              onChange={(value) => setValues((current) => ({ ...current, [question.id]: value }))}
            />
          ))}
          <Button disabled={busy} onClick={() => void send()}>
            Отправить ответы
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: SurveyQuestionView;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const selected = Array.isArray(value) ? value.map(String) : [];
  return (
    <fieldset>
      <legend className="text-sm font-medium">
        {question.text}
        {question.required ? "" : " · необязательно"}
      </legend>
      {question.type === "text" ? (
        <TextArea className="mt-2 min-h-16" value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)} />
      ) : null}
      {question.type === "number" ? (
        <TextInput
          className="mt-2 max-w-40"
          inputMode="numeric"
          value={typeof value === "number" || typeof value === "string" ? String(value) : ""}
          onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
        />
      ) : null}
      {question.type === "boolean" ? (
        <div className="mt-2 flex gap-4 text-sm">
          {[true, false].map((option) => (
            <label key={String(option)} className="flex min-h-10 items-center gap-2">
              <input type="radio" checked={value === option} onChange={() => onChange(option)} />
              {option ? "Да" : "Нет"}
            </label>
          ))}
        </div>
      ) : null}
      {question.type === "rating" ? (
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`grid size-11 place-items-center rounded-md text-sm font-bold ${
                value === score ? "bg-brand text-white" : "bg-surface"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      ) : null}
      {question.type === "single_choice" ? (
        <div className="mt-2 flex flex-col gap-1">
          {question.options.map((option) => (
            <label key={option} className="flex min-h-10 items-center gap-2 text-sm">
              <input type="radio" checked={value === option} onChange={() => onChange(option)} />
              {option}
            </label>
          ))}
        </div>
      ) : null}
      {question.type === "multiple_choice" ? (
        <div className="mt-2 flex flex-col gap-1">
          {question.options.map((option) => (
            <label key={option} className="flex min-h-10 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() =>
                  onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])
                }
              />
              {option}
            </label>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}

function EventCard({ event }: { event: EventView }) {
  const register = useStore((state) => state.registerForEvent);
  const cancel = useStore((state) => state.cancelEventRegistration);
  const claim = useStore((state) => state.claimEventReward);
  const [busy, setBusy] = useState(false);
  const spots =
    event.maxParticipants == null
      ? `${event.registeredCount} записались`
      : `${event.registeredCount} из ${event.maxParticipants}`;

  async function run(task: Promise<{ ok: boolean; error?: string }>, success: string) {
    setBusy(true);
    const result = await task;
    setBusy(false);
    if (!result.ok) toast.error(result.error ?? "Не получилось");
    else toast.success(success);
  }

  const registered = event.status === "registered";
  const attended = event.status === "attended";
  const canRegister = event.open && (event.status === "" || event.status === "cancelled");

  return (
    <Card kind="Мероприятие" title={event.title} done={event.rewardClaimed}>
      {event.description ? <p className="mt-1 max-w-2xl text-sm text-muted">{event.description}</p> : null}
      <p className="mt-2 text-sm text-muted">
        {eventStatus(event.status)}
        {event.location ? ` · ${event.location}` : ""}
        {` · ${spots}`}
        {span(event.startAt, event.endAt)}
      </p>
      <p className="mt-1 text-sm font-medium text-brand">За посещение {formatPoints(event.reward)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {canRegister ? (
          <Button disabled={busy} onClick={() => void run(register(event.id), "Вы записаны")}>
            Записаться
          </Button>
        ) : null}
        {registered ? (
          <Button variant="line" disabled={busy} onClick={() => void run(cancel(event.id), "Запись отменена")}>
            Отменить запись
          </Button>
        ) : null}
        {attended && !event.rewardClaimed ? (
          <Button disabled={busy} onClick={() => void run(claim(event.id), "Награда начислена")}>
            Получить награду
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function AchievementCard({ item }: { item: AchievementView }) {
  return (
    <Card kind="Достижение" title={item.name} done={item.earned}>
      {item.description ? <p className="mt-1 max-w-2xl text-sm text-muted">{item.description}</p> : null}
      <p className="mt-2 text-sm text-muted">
        {item.earned ? `Открыто ${item.earnedAt ? formatDateTime(item.earnedAt) : ""}` : conditionHint(item)}
      </p>
      <p className="mt-1 text-sm font-medium text-brand">{formatPoints(item.reward)}</p>
    </Card>
  );
}

function conditionHint(item: AchievementView) {
  if (item.conditionType === "first_order") return "Откроется после первого заказа";
  if (item.conditionType === "first_thank") return "Откроется после первой благодарности";
  if (item.conditionType === "first_activity") return "Откроется после первой выполненной активности";
  return "Условие проверяет сервер";
}

function questStatus(status: string) {
  if (status === "in_progress") return "В процессе";
  if (status === "completed") return "Завершён";
  if (status === "cancelled") return "Отменён";
  return "Не начат";
}

function eventStatus(status: string) {
  if (status === "registered") return "Вы записаны";
  if (status === "attended") return "Посещение подтверждено";
  if (status === "cancelled") return "Запись отменена";
  if (status === "no_show") return "Неявка";
  return "Вы не записаны";
}

function proofLabel(status: string) {
  if (status === "pending") return "на проверке";
  if (status === "approved") return "подтверждено";
  if (status === "rejected") return "отклонено";
  return status;
}

function span(start: string, end: string) {
  if (!start && !end) return "";
  const from = start ? formatDateTime(start) : "…";
  const to = end ? formatDateTime(end) : "…";
  return ` · ${from} — ${to}`;
}

function questionsLabel(count: number) {
  const abs = Math.abs(count) % 100;
  const digit = abs % 10;
  if (abs > 10 && abs < 20) return "вопросов";
  if (digit === 1) return "вопрос";
  if (digit >= 2 && digit <= 4) return "вопроса";
  return "вопросов";
}

function emptyAnswer(value: unknown) {
  if (value == null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}
