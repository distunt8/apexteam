import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { apex, listOf } from "@/lib/apex";
import { formatNumber } from "@/lib/format";
import { useStore } from "@/lib/store";

type Kind = "quests" | "surveys" | "events" | "achievements" | "proofs";

type Row = {
  id: string;
  title: string;
  description: string;
  reward: number;
  active: boolean;
  startAt: string;
  endAt: string;
  location: string;
  maxParticipants: string;
  extra: string;
  code: string;
};

const EMPTY: Row = {
  id: "",
  title: "",
  description: "",
  reward: 0,
  active: true,
  startAt: "",
  endAt: "",
  location: "",
  maxParticipants: "",
  extra: "",
  code: "",
};

type StepItem = {
  id: string;
  title: string;
  description: string;
  completionType: string;
  sortOrder: number;
  required: boolean;
};

type QuestionItem = {
  id: string;
  text: string;
  type: string;
  options: string;
  required: boolean;
  sortOrder: number;
};

type Participant = { id: string; name: string; status: string };

const EMPTY_STEP: StepItem = { id: "", title: "", description: "", completionType: "manual", sortOrder: 0, required: true };
const EMPTY_QUESTION: QuestionItem = { id: "", text: "", type: "text", options: "", required: true, sortOrder: 0 };

const QUESTION_TYPES = [
  ["text", "Свободный текст"],
  ["single_choice", "Один вариант"],
  ["multiple_choice", "Несколько вариантов"],
  ["number", "Число"],
  ["boolean", "Да или нет"],
  ["rating", "Оценка 1–5"],
] as const;

function mapStep(raw: unknown): StepItem | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (record.id == null) return null;
  return {
    id: text(record.id),
    title: text(record.title),
    description: text(record.description),
    completionType: text(record.completionType || "manual"),
    sortOrder: Number(record.sortOrder ?? 0) || 0,
    required: record.isRequired !== false,
  };
}

function mapQuestion(raw: unknown): QuestionItem | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (record.id == null) return null;
  const options = Array.isArray(record.options) ? record.options.map(text).filter(Boolean) : [];
  return {
    id: text(record.id),
    text: text(record.questionText),
    type: text(record.questionType || "text"),
    options: options.join("\n"),
    required: record.isRequired !== false,
    sortOrder: Number(record.sortOrder ?? 0) || 0,
  };
}

function proofStatusLabel(status: string) {
  const key = status.trim().toLowerCase();
  if (key === "pending") return "на проверке";
  if (key === "approved") return "принято";
  if (key === "rejected") return "отклонено";
  return "на проверке";
}

function attendanceLabel(status: string) {
  const key = status.trim().toLowerCase();
  if (key === "attended") return "был";
  if (key === "no_show" || key === "noshow") return "неявка";
  if (key === "cancelled" || key === "canceled") return "отменил запись";
  if (key === "registered" || !key) return "зарегистрирован";
  return "зарегистрирован";
}

function mapParticipant(raw: unknown): Participant | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (record.id == null) return null;
  const name = [record.lastName, record.firstName].map(text).filter(Boolean).join(" ");
  return { id: text(record.id), name: name || "Участник", status: text(record.status) };
}

function text(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function toLocal(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIso(local: string) {
  if (!local.trim()) return null;
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function mapRow(raw: unknown, kind: Kind): Row | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (record.id == null) return null;
  return {
    id: text(record.id),
    title: text(record.title || record.name),
    description: text(record.description),
    reward: Number(record.rewardAmount ?? 0) || 0,
    active: record.isActive !== false,
    startAt: toLocal(text(record.startAt)),
    endAt: toLocal(text(record.endAt)),
    location: text(record.location),
    maxParticipants: record.maxParticipants == null ? "" : text(record.maxParticipants),
    extra: text(record.stepsCount ? `${record.stepsCount} шаг.` : record.registeredCount != null ? `${record.registeredCount} участ.` : ""),
    code: text(record.code),
  };
}

export function AdminActivities() {
  const people = useStore((state) => state.people);
  const [kind, setKind] = useState<Kind>("quests");
  const [rows, setRows] = useState<Row[]>([]);
  const [proofs, setProofs] = useState<
    { id: string; quest: string; step: string; userId: string; path: string; status: string; comment: string }[]
  >([]);
  const [draft, setDraft] = useState<Row | null>(null);
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stepDraft, setStepDraft] = useState<StepItem>(EMPTY_STEP);
  const [questionDraft, setQuestionDraft] = useState<QuestionItem>(EMPTY_QUESTION);
  const [error, setError] = useState("");

  async function reload(next = kind) {
    setError("");
    if (next === "proofs") {
      const data = await apex("/api/quests/proofs?page=1&pageSize=50");
      setProofs(
        listOf(data).map((item) => {
          const record = item as Record<string, unknown>;
          return {
            id: text(record.id),
            quest: text(record.questTitle),
            step: text(record.stepTitle),
            userId: text(record.userId),
            path: text(record.storagePath),
            status: text(record.status || "pending").toLowerCase(),
            comment: text(record.comment),
          };
        }),
      );
      setRows([]);
      return;
    }
    const path =
      next === "quests"
        ? "/api/quests/admin?page=1&pageSize=50"
        : next === "surveys"
          ? "/api/surveys/admin?page=1&pageSize=50"
          : next === "events"
            ? "/api/events/admin?page=1&pageSize=50"
            : "/api/achievements";
    const data = await apex(path);
    setRows(listOf(data).map((item) => mapRow(item, next)).filter((item): item is Row => Boolean(item)));
    setProofs([]);
  }

  useEffect(() => {
    void reload(kind).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Не удалось загрузить активности");
    });
  }, [kind]);

  useEffect(() => {
    const id = draft?.id;
    if (!id || (kind !== "quests" && kind !== "surveys" && kind !== "events")) {
      setSteps([]);
      setQuestions([]);
      setParticipants([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      if (kind === "quests") {
        const data = await apex(`/api/quests/${id}`);
        if (cancelled) return;
        const record = data as { steps?: unknown[] };
        setSteps((record.steps ?? []).map(mapStep).filter((item): item is StepItem => Boolean(item)));
      } else if (kind === "surveys") {
        const data = await apex(`/api/surveys/${id}`);
        if (cancelled) return;
        const record = data as { questions?: unknown[] };
        setQuestions((record.questions ?? []).map(mapQuestion).filter((item): item is QuestionItem => Boolean(item)));
      } else {
        const data = await apex(`/api/events/${id}/participants?page=1&pageSize=50`);
        if (cancelled) return;
        setParticipants(listOf(data).map(mapParticipant).filter((item): item is Participant => Boolean(item)));
      }
    })().catch((reason: unknown) => {
      if (!cancelled) setError(reason instanceof Error ? reason.message : "Не удалось загрузить состав");
    });
    return () => {
      cancelled = true;
    };
  }, [draft?.id, kind]);

  async function save() {
    if (!draft) return;
    if (kind !== "achievements" && !draft.title.trim()) {
      toast.error("Укажите название");
      return;
    }
    const body =
      kind === "achievements"
        ? {
            code: draft.code,
            name: draft.title.trim(),
            description: draft.description.trim(),
            rewardAmount: draft.reward,
            isActive: draft.active,
          }
        : kind === "events"
          ? {
              title: draft.title.trim(),
              description: draft.description.trim(),
              startAt: toIso(draft.startAt),
              endAt: toIso(draft.endAt),
              location: draft.location.trim(),
              maxParticipants: draft.maxParticipants.trim() ? Number(draft.maxParticipants) : null,
              rewardAmount: draft.reward,
              isActive: draft.active,
            }
          : kind === "surveys"
            ? {
                title: draft.title.trim(),
                description: draft.description.trim(),
                rewardAmount: draft.reward,
                startAt: toIso(draft.startAt),
                endAt: toIso(draft.endAt),
                allowMultipleResponses: false,
                isActive: draft.active,
              }
            : {
                title: draft.title.trim(),
                description: draft.description.trim(),
                rewardAmount: draft.reward,
                startAt: toIso(draft.startAt),
                endAt: toIso(draft.endAt),
                isActive: draft.active,
              };
    const path =
      kind === "quests" ? "/api/quests" : kind === "surveys" ? "/api/surveys" : kind === "events" ? "/api/events" : "/api/achievements";
    try {
      if (kind === "achievements") {
        await apex(`${path}/${draft.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else if (draft.id) {
        await apex(`${path}/${draft.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apex(path, { method: "POST", body: JSON.stringify(body) });
      }
      toast.success("Сохранено");
      setDraft(null);
      await reload();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось сохранить");
    }
  }

  async function remove(id: string) {
    const path = kind === "quests" ? "/api/quests" : kind === "surveys" ? "/api/surveys" : "/api/events";
    try {
      await apex(`${path}/${id}`, { method: "DELETE" });
      toast.success("Скрыто");
      await reload();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось скрыть");
    }
  }

  async function saveStep() {
    if (!draft?.id || !stepDraft.title.trim()) {
      toast.error("Укажите название шага");
      return;
    }
    const body = {
      title: stepDraft.title.trim(),
      description: stepDraft.description.trim(),
      completionType: stepDraft.completionType,
      sortOrder: stepDraft.sortOrder,
      isRequired: stepDraft.required,
    };
    try {
      await apex(stepDraft.id ? `/api/quests/${draft.id}/steps/${stepDraft.id}` : `/api/quests/${draft.id}/steps`, {
        method: stepDraft.id ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      toast.success(stepDraft.id ? "Шаг обновлён" : "Шаг добавлен");
      setStepDraft(EMPTY_STEP);
      const data = await apex(`/api/quests/${draft.id}`);
      const record = data as { steps?: unknown[] };
      setSteps((record.steps ?? []).map(mapStep).filter((item): item is StepItem => Boolean(item)));
      await reload();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось сохранить шаг");
    }
  }

  async function removeStep(stepId: string) {
    if (!draft?.id) return;
    try {
      await apex(`/api/quests/${draft.id}/steps/${stepId}`, { method: "DELETE" });
      setSteps((items) => items.filter((item) => item.id !== stepId));
      toast.success("Шаг удалён");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось удалить шаг");
    }
  }

  async function saveQuestion() {
    if (!draft?.id || !questionDraft.text.trim()) {
      toast.error("Напишите вопрос");
      return;
    }
    const options = questionDraft.options
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    if ((questionDraft.type === "single_choice" || questionDraft.type === "multiple_choice") && options.length < 2) {
      toast.error("Для выбора нужны хотя бы два варианта, каждый с новой строки");
      return;
    }
    const body = {
      questionText: questionDraft.text.trim(),
      questionType: questionDraft.type,
      options: questionDraft.type === "single_choice" || questionDraft.type === "multiple_choice" ? options : [],
      isRequired: questionDraft.required,
      sortOrder: questionDraft.sortOrder,
    };
    try {
      await apex(
        questionDraft.id ? `/api/surveys/${draft.id}/questions/${questionDraft.id}` : `/api/surveys/${draft.id}/questions`,
        { method: questionDraft.id ? "PUT" : "POST", body: JSON.stringify(body) },
      );
      toast.success(questionDraft.id ? "Вопрос обновлён" : "Вопрос добавлен");
      setQuestionDraft(EMPTY_QUESTION);
      const data = await apex(`/api/surveys/${draft.id}`);
      const record = data as { questions?: unknown[] };
      setQuestions((record.questions ?? []).map(mapQuestion).filter((item): item is QuestionItem => Boolean(item)));
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось сохранить вопрос");
    }
  }

  async function removeQuestion(questionId: string) {
    if (!draft?.id) return;
    try {
      await apex(`/api/surveys/${draft.id}/questions/${questionId}`, { method: "DELETE" });
      setQuestions((items) => items.filter((item) => item.id !== questionId));
      toast.success("Вопрос удалён");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось удалить вопрос");
    }
  }

  async function setAttendance(participantId: string, status: "attended" | "no_show") {
    if (!draft?.id) return;
    try {
      await apex(`/api/events/${draft.id}/participants/${participantId}/attendance`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setParticipants((items) => items.map((item) => (item.id === participantId ? { ...item, status } : item)));
      toast.success(status === "attended" ? "Явка подтверждена" : "Отмечена неявка");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось отметить явку");
    }
  }

  async function review(id: string, status: "approved" | "rejected") {
    try {
      await apex(`/api/quests/proofs/${id}/review`, { method: "POST", body: JSON.stringify({ status }) });
      toast.success(status === "approved" ? "Принято" : "Отклонено");
      await reload("proofs");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось проверить");
    }
  }

  const tabs: { id: Kind; label: string }[] = [
    { id: "quests", label: "Квесты" },
    { id: "surveys", label: "Опросы" },
    { id: "events", label: "Мероприятия" },
    { id: "achievements", label: "Достижения" },
    { id: "proofs", label: "Проверки" },
  ];

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setKind(item.id);
              setDraft(null);
            }}
            className={`min-h-10 shrink-0 rounded-md px-3 text-sm font-semibold ${kind === item.id ? "bg-brand text-white" : "bg-card"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      {kind === "proofs" ? (
        <ul className="space-y-2">
          {proofs.length === 0 ? <li className="text-sm text-muted">Проверок нет.</li> : null}
          {proofs.map((item) => {
            const author = people.find((person) => person.id === item.userId)?.name;
            const link = /^https?:\/\//i.test(item.path);
            return (
            <li key={item.id} className="rounded-lg bg-card px-3 py-3 text-sm">
              <p className="font-semibold">{item.quest || "Квест"}</p>
              <p className="mt-1 text-muted">Шаг: {item.step || "без названия"}</p>
              <p className="mt-1">От: {author || "Сотрудник"}</p>
              {item.path ? (
                <p className="mt-1 break-all">
                  Отправлено:{" "}
                  {link ? (
                    <a className="font-semibold text-brand" href={item.path} target="_blank" rel="noreferrer">
                      открыть файл
                    </a>
                  ) : (
                    item.path
                  )}
                </p>
              ) : (
                <p className="mt-1 text-muted">Файл не приложен</p>
              )}
              {item.comment ? <p className="mt-1 text-muted">Комментарий: {item.comment}</p> : null}
              <p className="mt-1 text-xs text-muted">{proofStatusLabel(item.status)}</p>
              {item.status === "pending" ? (
                <div className="mt-2 flex gap-2">
                  <Button onClick={() => void review(item.id, "approved")}>Принять</Button>
                  <Button variant="line" onClick={() => void review(item.id, "rejected")}>Отклонить</Button>
                </div>
              ) : null}
            </li>
            );
          })}
        </ul>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-card text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Название</th>
                  <th className="px-3 py-2 font-medium">Награда</th>
                  <th className="px-3 py-2 font-medium">Статус</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className="px-3 py-2">
                      <p className="font-medium">{row.title}</p>
                      {row.extra ? <p className="text-xs text-muted">{row.extra}</p> : null}
                    </td>
                    <td className="px-3 py-2 tabular">{formatNumber(row.reward)}</td>
                    <td className="px-3 py-2">{row.active ? "Активно" : "Скрыто"}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" className="font-semibold text-brand" onClick={() => setDraft(row)}>
                        Изменить
                      </button>
                      {kind !== "achievements" ? (
                        <button type="button" className="ml-3 font-semibold text-muted" onClick={() => void remove(row.id)}>
                          Скрыть
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form
            className="space-y-3 rounded-lg bg-card p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{draft?.id ? "Редактирование" : "Новая запись"}</h2>
              {kind !== "achievements" ? (
                <button type="button" className="text-sm font-semibold text-brand" onClick={() => setDraft({ ...EMPTY })}>
                  Новая
                </button>
              ) : null}
            </div>
            {draft ? (
              <>
                <Field label={kind === "achievements" ? "Название" : "Название"}>
                  <TextInput value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
                </Field>
                <Field label="Описание">
                  <TextArea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
                </Field>
                <Field label="Награда, апексы">
                  <TextInput
                    inputMode="numeric"
                    value={draft.reward}
                    onChange={(event) => setDraft({ ...draft, reward: Number(event.target.value) })}
                  />
                </Field>
                {kind === "events" ? (
                  <>
                    <Field label="Место">
                      <TextInput value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
                    </Field>
                    <Field label="Мест, пусто — без лимита">
                      <TextInput
                        inputMode="numeric"
                        value={draft.maxParticipants}
                        onChange={(event) => setDraft({ ...draft, maxParticipants: event.target.value })}
                      />
                    </Field>
                  </>
                ) : null}
                {kind !== "achievements" ? (
                  <div className="grid grid-cols-1 gap-3">
                    <Field label="Начало">
                      <TextInput type="datetime-local" value={draft.startAt} onChange={(event) => setDraft({ ...draft, startAt: event.target.value })} />
                    </Field>
                    <Field label="Конец">
                      <TextInput type="datetime-local" value={draft.endAt} onChange={(event) => setDraft({ ...draft, endAt: event.target.value })} />
                    </Field>
                  </div>
                ) : null}
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
                  Показывать сотрудникам
                </label>
                <Button type="submit" className="w-full">
                  Сохранить
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted">
                {kind === "achievements"
                  ? "Выберите достижение. Новые создаются на сервере, здесь можно изменить название и награду."
                  : "Выберите запись или создайте новую."}
              </p>
            )}
          </form>
        </div>
      )}
      {draft?.id && kind === "quests" ? (
        <section className="mt-6 rounded-lg bg-card p-4">
          <h2 className="font-bold">Шаги квеста</h2>
          <ul className="mt-3 space-y-2">
            {steps.length === 0 ? <li className="text-sm text-muted">Шагов пока нет.</li> : null}
            {steps.map((step, index) => (
              <li key={step.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm">
                <span>
                  {index + 1}. {step.title}
                  <span className="text-muted"> · {step.completionType === "proof" ? "с подтверждением" : step.completionType === "automatic" ? "автоматически" : "вручную"}</span>
                </span>
                <span className="flex gap-3">
                  <button type="button" className="font-semibold text-brand" onClick={() => setStepDraft(step)}>Изменить</button>
                  <button type="button" className="font-semibold text-muted" onClick={() => void removeStep(step.id)}>Удалить</button>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Название шага">
              <TextInput value={stepDraft.title} onChange={(event) => setStepDraft({ ...stepDraft, title: event.target.value })} />
            </Field>
            <Field label="Тип">
              <select
                className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
                value={stepDraft.completionType}
                onChange={(event) => setStepDraft({ ...stepDraft, completionType: event.target.value })}
              >
                <option value="manual">Отмечает сам сотрудник</option>
                <option value="proof">Нужно подтверждение</option>
                <option value="automatic">Засчитывается автоматически</option>
              </select>
            </Field>
            <Field label="Описание">
              <TextArea value={stepDraft.description} onChange={(event) => setStepDraft({ ...stepDraft, description: event.target.value })} />
            </Field>
            <Field label="Порядок">
              <TextInput inputMode="numeric" value={stepDraft.sortOrder} onChange={(event) => setStepDraft({ ...stepDraft, sortOrder: Number(event.target.value) })} />
            </Field>
          </div>
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={stepDraft.required} onChange={(event) => setStepDraft({ ...stepDraft, required: event.target.checked })} />
            Обязательный шаг
          </label>
          <div className="mt-3 flex gap-2">
            <Button type="button" onClick={() => void saveStep()}>{stepDraft.id ? "Сохранить шаг" : "Добавить шаг"}</Button>
            {stepDraft.id ? <Button type="button" variant="line" onClick={() => setStepDraft(EMPTY_STEP)}>Новый шаг</Button> : null}
          </div>
        </section>
      ) : null}
      {draft?.id && kind === "surveys" ? (
        <section className="mt-6 rounded-lg bg-card p-4">
          <h2 className="font-bold">Вопросы опроса</h2>
          <ul className="mt-3 space-y-2">
            {questions.length === 0 ? <li className="text-sm text-muted">Вопросов пока нет.</li> : null}
            {questions.map((question, index) => (
              <li key={question.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm">
                <span>
                  {index + 1}. {question.text}
                  <span className="text-muted"> · {QUESTION_TYPES.find((item) => item[0] === question.type)?.[1] ?? question.type}</span>
                </span>
                <span className="flex gap-3">
                  <button type="button" className="font-semibold text-brand" onClick={() => setQuestionDraft(question)}>Изменить</button>
                  <button type="button" className="font-semibold text-muted" onClick={() => void removeQuestion(question.id)}>Удалить</button>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Текст вопроса">
              <TextInput value={questionDraft.text} onChange={(event) => setQuestionDraft({ ...questionDraft, text: event.target.value })} />
            </Field>
            <Field label="Тип ответа">
              <select
                className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
                value={questionDraft.type}
                onChange={(event) => setQuestionDraft({ ...questionDraft, type: event.target.value })}
              >
                {QUESTION_TYPES.map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </Field>
            {questionDraft.type === "single_choice" || questionDraft.type === "multiple_choice" ? (
              <Field label="Варианты, каждый с новой строки">
                <TextArea value={questionDraft.options} onChange={(event) => setQuestionDraft({ ...questionDraft, options: event.target.value })} />
              </Field>
            ) : null}
            <Field label="Порядок">
              <TextInput inputMode="numeric" value={questionDraft.sortOrder} onChange={(event) => setQuestionDraft({ ...questionDraft, sortOrder: Number(event.target.value) })} />
            </Field>
          </div>
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={questionDraft.required} onChange={(event) => setQuestionDraft({ ...questionDraft, required: event.target.checked })} />
            Обязательный вопрос
          </label>
          <div className="mt-3 flex gap-2">
            <Button type="button" onClick={() => void saveQuestion()}>{questionDraft.id ? "Сохранить вопрос" : "Добавить вопрос"}</Button>
            {questionDraft.id ? <Button type="button" variant="line" onClick={() => setQuestionDraft(EMPTY_QUESTION)}>Новый вопрос</Button> : null}
          </div>
        </section>
      ) : null}
      {draft?.id && kind === "events" ? (
        <section className="mt-6 rounded-lg bg-card p-4">
          <h2 className="font-bold">Участники</h2>
          <ul className="mt-3 space-y-2">
            {participants.length === 0 ? <li className="text-sm text-muted">Пока никто не записался.</li> : null}
            {participants.map((person) => (
              <li key={person.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm">
                <span>
                  {person.name}
                  <span className="text-muted"> · {attendanceLabel(person.status)}</span>
                </span>
                <span className="flex gap-2">
                  <Button type="button" onClick={() => void setAttendance(person.id, "attended")}>Был</Button>
                  <Button type="button" variant="line" onClick={() => void setAttendance(person.id, "no_show")}>Неявка</Button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
