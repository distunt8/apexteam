import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Field, NumericInput, TextArea, TextInput } from "@/components/ui";
import { apex, listOf } from "@/lib/apex";
import { formatNumber } from "@/lib/format";
import { automaticActionBody } from "@/lib/quest-action";
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
  actionType: string;
  targetId: string;
  achievementCode: string;
  productId: string;
  minAmount: string;
  count: string;
  requireAvatar: boolean;
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

const EMPTY_STEP: StepItem = {
  id: "",
  title: "",
  description: "",
  completionType: "manual",
  sortOrder: 0,
  required: true,
  actionType: "",
  targetId: "",
  achievementCode: "",
  productId: "",
  minAmount: "",
  count: "1",
  requireAvatar: true,
};
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
  const action = readAction(record);
  return {
    id: text(record.id),
    title: text(record.title),
    description: text(record.description),
    completionType: text(record.completionType || "manual"),
    sortOrder: Number(record.sortOrder ?? 0) || 0,
    required: record.isRequired !== false,
    actionType: text(action.type),
    targetId: action.targetId == null ? "" : text(action.targetId),
    achievementCode: text(action.achievementCode),
    productId: action.productId == null ? "" : text(action.productId),
    minAmount: action.minAmount == null ? "" : text(action.minAmount),
    count: action.count == null ? "1" : text(action.count),
    requireAvatar: action.requireAvatar !== false,
  };
}

function readAction(record: Record<string, unknown>) {
  const direct = record.action;
  if (direct && typeof direct === "object") return direct as Record<string, unknown>;
  if (typeof record.completionData === "string" && record.completionData.trim()) {
    try {
      const parsed = JSON.parse(record.completionData) as unknown;
      if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
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
  const [actions, setActions] = useState<StepAction[]>([]);
  const [actionOptions, setActionOptions] = useState<Record<string, { id: string; label: string }[]>>({});
  const [questionDraft, setQuestionDraft] = useState<QuestionItem>(EMPTY_QUESTION);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [onlyActive, setOnlyActive] = useState<"all" | "yes" | "no">("all");

  useEffect(() => {
    void apex("/api/quests/step-actions")
      .then((data) => {
        const rows = (Array.isArray(data) ? data : []) as StepAction[];
        setActions(rows.filter((item) => item && item.code));
      })
      .catch(() => setActions([]));
  }, []);

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
    const action = stepDraft.completionType === "automatic" ? automaticActionBody(stepDraft) : null;
    if (stepDraft.completionType === "automatic" && !stepDraft.actionType) {
      toast.error("Выберите шаблон автоматического шага");
      return;
    }
    const body = {
      title: stepDraft.title.trim(),
      description: stepDraft.description.trim(),
      completionType: stepDraft.completionType,
      sortOrder: stepDraft.sortOrder,
      isRequired: stepDraft.required,
      ...(action ? { completionData: JSON.stringify(action) } : {}),
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

  function activityEditor() {
    if (!draft) return null;
    return (
      <form
        className="grid gap-3 lg:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <Field label="Название">
          <TextInput value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </Field>
        <Field label="Награда, апексы">
          <NumericInput value={draft.reward} onChange={(reward) => setDraft({ ...draft, reward })} />
        </Field>
        <div className="lg:col-span-2">
          <Field label="Описание">
            <TextArea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          </Field>
        </div>
        {kind === "events" ? (
          <>
            <Field label="Место">
              <TextInput value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
            </Field>
            <Field label="Мест, пусто — без лимита">
              <TextInput value={draft.maxParticipants} onChange={(event) => setDraft({ ...draft, maxParticipants: event.target.value })} />
            </Field>
          </>
        ) : null}
        {kind !== "achievements" ? (
          <>
            <Field label="Начало">
              <TextInput type="datetime-local" value={draft.startAt} onChange={(event) => setDraft({ ...draft, startAt: event.target.value })} />
            </Field>
            <Field label="Конец">
              <TextInput type="datetime-local" value={draft.endAt} onChange={(event) => setDraft({ ...draft, endAt: event.target.value })} />
            </Field>
          </>
        ) : null}
        <label className="flex min-h-11 items-center gap-2 text-sm lg:col-span-2">
          <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
          Показывать сотрудникам
        </label>
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          <Button type="submit">Сохранить</Button>
          <Button type="button" variant="line" onClick={() => setDraft(null)}>Отмена</Button>
        </div>
      </form>
    );
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
        <div>
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск проверки" aria-label="Поиск проверки" className="mb-3 max-w-xs" />
          <ul className="space-y-2">
          {proofs.filter((item) => `${item.quest} ${item.step} ${people.find((person) => person.id === item.userId)?.name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())).length === 0 ? <li className="text-sm text-muted">Проверок нет.</li> : null}
          {proofs.filter((item) => `${item.quest} ${item.step} ${people.find((person) => person.id === item.userId)?.name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())).map((item) => {
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
        </div>
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск" aria-label="Поиск активности" className="max-w-xs" />
            <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={onlyActive} onChange={(event) => setOnlyActive(event.target.value as "all" | "yes" | "no")} aria-label="Статус активности">
              <option value="all">Все</option>
              <option value="yes">Активные</option>
              <option value="no">Скрытые</option>
            </select>
            {kind !== "achievements" ? <Button variant="line" onClick={() => setDraft({ ...EMPTY })}>Новая</Button> : null}
          </div>
          {draft && !draft.id ? <div className="mb-3 rounded-xl border-2 border-brand bg-brand-wash p-4 shadow-md">{activityEditor()}</div> : null}
          <ul className="grid gap-3 sm:grid-cols-2">
            {rows
              .filter((row) => {
                if (onlyActive === "yes" && !row.active) return false;
                if (onlyActive === "no" && row.active) return false;
                const needle = query.trim().toLowerCase();
                return !needle || `${row.title} ${row.description} ${row.extra}`.toLowerCase().includes(needle);
              })
              .map((row) => {
                const open = draft?.id === row.id;
                return (
                  <li key={row.id} className={open ? "sm:col-span-2" : ""}>
                    <div className={open ? "rounded-xl border-2 border-brand bg-brand-wash p-3 shadow-md" : "rounded-xl border border-line bg-surface p-3 shadow-sm"}>
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{row.title}</p>
                          {row.extra ? <p className="mt-1 text-xs text-muted">{row.extra}</p> : null}
                          <p className="mt-1 text-sm">{formatNumber(row.reward)} апексов</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${row.active ? "bg-emerald-100 text-emerald-800" : "bg-card text-muted"}`}>{row.active ? "Активно" : "Скрыто"}</span>
                        <button type="button" className="grid size-10 shrink-0 place-items-center rounded-full border border-line hover:border-brand hover:text-brand" aria-label={`Редактировать ${row.title}`} onClick={() => setDraft(open ? null : row)}>
                          <Pencil className="size-4" />
                        </button>
                      </div>
                      {open ? <div className="mt-3 border-t border-line pt-3">{activityEditor()}</div> : null}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      {draft?.id && kind === "quests" ? (
        <section className="mt-6 rounded-xl border-2 border-brand bg-brand-wash p-4 shadow-md">
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
            {stepDraft.completionType === "automatic" ? (
              <AutomaticAction
                actions={actions}
                step={stepDraft}
                options={actionOptions}
                onChange={setStepDraft}
                onNeedOptions={(source) => {
                  if (actionOptions[source]) return;
                  const path =
                    source === "quests"
                      ? "/api/quests?page=1&pageSize=50"
                      : source === "surveys"
                        ? "/api/surveys?page=1&pageSize=50"
                        : source === "events"
                          ? "/api/events?page=1&pageSize=50"
                          : source === "products"
                            ? "/api/products?page=1&pageSize=50"
                            : source === "achievements"
                              ? "/api/achievements"
                              : "/api/company-news?page=1&pageSize=30";
                  void apex(path)
                    .then((data) => {
                      const list = Array.isArray(data) ? data : ((data as { items?: unknown[] })?.items ?? []);
                      setActionOptions((current) => ({
                        ...current,
                        [source]: list
                          .map((item) => {
                            const row = item as { id?: unknown; title?: unknown; name?: unknown; code?: unknown };
                            const id = source === "achievements" ? String(row.code ?? "") : String(row.id ?? "");
                            const label = String(row.title || row.name || row.code || "");
                            return id && label ? { id, label } : null;
                          })
                          .filter((item): item is { id: string; label: string } => Boolean(item)),
                      }));
                    })
                    .catch(() => undefined);
                }}
              />
            ) : null}
            <Field label="Описание">
              <TextArea value={stepDraft.description} onChange={(event) => setStepDraft({ ...stepDraft, description: event.target.value })} />
            </Field>
            <Field label="Порядок">
              <NumericInput value={stepDraft.sortOrder} onChange={(sortOrder) => setStepDraft({ ...stepDraft, sortOrder })} />
            </Field>
          </div>
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={stepDraft.required} onChange={(event) => setStepDraft({ ...stepDraft, required: event.target.checked })} />
            Обязательный шаг
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" onClick={() => void saveStep()}>{stepDraft.id ? "Сохранить шаг" : "Добавить шаг"}</Button>
            <Button type="button" variant="line" onClick={() => setStepDraft(EMPTY_STEP)}>Отмена</Button>
          </div>
        </section>
      ) : null}
      {draft?.id && kind === "surveys" ? (
        <section className="mt-6 rounded-xl border-2 border-brand bg-brand-wash p-4 shadow-md">
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
              <NumericInput value={questionDraft.sortOrder} onChange={(sortOrder) => setQuestionDraft({ ...questionDraft, sortOrder })} />
            </Field>
          </div>
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={questionDraft.required} onChange={(event) => setQuestionDraft({ ...questionDraft, required: event.target.checked })} />
            Обязательный вопрос
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" onClick={() => void saveQuestion()}>{questionDraft.id ? "Сохранить вопрос" : "Добавить вопрос"}</Button>
            <Button type="button" variant="line" onClick={() => setQuestionDraft(EMPTY_QUESTION)}>Отмена</Button>
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

type StepAction = {
  code: string;
  name: string;
  description?: string;
  isAvailable?: boolean;
  unavailableReason?: string | null;
  parameters?: { name: string; label: string; kind: string; optionsSource?: string | null; required?: boolean; helpText?: string | null }[];
};

function AutomaticAction({
  actions,
  step,
  options,
  onChange,
  onNeedOptions,
}: {
  actions: StepAction[];
  step: StepItem;
  options: Record<string, { id: string; label: string }[]>;
  onChange: (step: StepItem) => void;
  onNeedOptions: (source: string) => void;
}) {
  const current = actions.find((item) => item.code === step.actionType);
  useEffect(() => {
    for (const param of current?.parameters ?? []) {
      if (param.optionsSource && !options[param.optionsSource]) onNeedOptions(param.optionsSource);
    }
  }, [step.actionType]);
  return (
    <div className="sm:col-span-2 space-y-3 rounded-lg border border-line bg-surface p-3">
      <Field label="Шаблон автоматического шага">
        <select
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
          value={step.actionType}
          onChange={(event) => {
            const next = actions.find((item) => item.code === event.target.value);
            onChange({ ...step, actionType: event.target.value });
            for (const param of next?.parameters ?? []) {
              if (param.optionsSource) onNeedOptions(param.optionsSource);
            }
          }}
        >
          <option value="">Выберите действие</option>
          {actions.map((item) => (
            <option key={item.code} value={item.code} disabled={item.isAvailable === false}>
              {item.name}
              {item.isAvailable === false ? " — пока недоступно" : ""}
            </option>
          ))}
        </select>
      </Field>
      {current?.description ? <p className="text-xs text-muted">{current.description}</p> : null}
      {current?.unavailableReason ? <p className="text-xs text-danger">{current.unavailableReason}</p> : null}
      {(current?.parameters ?? []).map((param) => {
        if (param.kind === "entity" && param.optionsSource) {
          const list = options[param.optionsSource] ?? [];
          const value = param.name === "achievementCode" ? step.achievementCode : param.name === "productId" ? step.productId : step.targetId;
          return (
            <Field key={param.name} label={param.label}>
              <select
                className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
                value={value}
                onChange={(event) => {
                  const picked = event.target.value;
                  if (param.name === "achievementCode") onChange({ ...step, achievementCode: picked });
                  else if (param.name === "productId") onChange({ ...step, productId: picked });
                  else onChange({ ...step, targetId: picked });
                }}
              >
                <option value="">Не выбрано</option>
                {list.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>
          );
        }
        if (param.kind === "boolean") {
          return (
            <label key={param.name} className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={step.requireAvatar} onChange={(event) => onChange({ ...step, requireAvatar: event.target.checked })} />
              {param.label}
            </label>
          );
        }
        const value = param.name === "minAmount" ? step.minAmount : step.count;
        return (
          <Field key={param.name} label={param.label}>
            <TextInput
              value={value}
              inputMode="numeric"
              onChange={(event) =>
                param.name === "minAmount"
                  ? onChange({ ...step, minAmount: event.target.value })
                  : onChange({ ...step, count: event.target.value })
              }
            />
          </Field>
        );
      })}
    </div>
  );
}
