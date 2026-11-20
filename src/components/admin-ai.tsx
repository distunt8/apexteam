import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Field, NumericInput, Panel, TextArea, TextInput } from "@/components/ui";
import { apex } from "@/lib/apex";
import { automaticActionBody } from "@/lib/quest-action";

const MODES = [
  ["improve", "Улучшить текст"],
  ["quest", "Квест"],
  ["survey", "Опрос"],
  ["event", "Мероприятие"],
  ["product", "Товар"],
  ["engagement", "Вовлечённость"],
  ["catalog", "Каталог"],
  ["alternatives", "Альтернативы"],
] as const;

type Mode = (typeof MODES)[number][0];

type Draft = {
  kind: "quest" | "survey" | "event" | "product";
  title: string;
  description: string;
  reward: number;
  startAt: string;
  endAt: string;
  location: string;
  maxParticipants: string;
  price: number;
  stock: number;
  categoryId: string;
  steps: { title: string; description: string; completionType: string; sortOrder: number; isRequired: boolean; action: Record<string, unknown> | null }[];
  questions: { text: string; type: string; options: string[] }[];
};

export function AdminAi() {
  const [mode, setMode] = useState<Mode>("improve");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [reward, setReward] = useState(50);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [fromAt, setFromAt] = useState(() => localStamp(daysAgo(30)));
  const [toAt, setToAt] = useState(() => localStamp(new Date()));
  const [granularity, setGranularity] = useState("day");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [top, setTop] = useState(10);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    void apex("/api/ai/status")
      .then((data) => {
        const record = data as { configured?: boolean };
        setStatus(record.configured ? "Модуль подключён" : "Модуль на сервере не настроен");
      })
      .catch(() => setStatus("Не удалось узнать состояние модуля"));
    void apex("/api/departments")
      .then((data) => {
        const rows = Array.isArray(data) ? data : [];
        setDepartments(
          rows.flatMap((item) => {
            if (!item || typeof item !== "object") return [];
            const row = item as { id?: unknown; name?: unknown; isActive?: unknown };
            if (row.isActive === false || row.id == null) return [];
            const id = Number(row.id);
            return Number.isInteger(id) ? [{ id, name: String(row.name || "Отдел") }] : [];
          }),
        );
      })
      .catch(() => undefined);
  }, []);

  async function run() {
    setBusy(true);
    setResult(null);
    setDraft(null);
    try {
      const prompt = topic.trim() || text.trim();
      const analytics = mode === "engagement" || mode === "catalog";
      if (mode === "improve" && !text.trim()) {
        toast.error("Вставьте текст, который нужно улучшить");
        return;
      }
      if (mode === "alternatives" && !text.trim() && !topic.trim()) {
        toast.error("Вставьте текст, для которого нужны варианты");
        return;
      }
      if (!analytics && mode !== "engagement" && mode !== "improve" && !prompt) {
        toast.error("Напишите, что нужно придумать");
        return;
      }
      const path =
        mode === "improve"
          ? "/api/ai/content/improve"
          : mode === "quest"
            ? "/api/ai/content/activity-draft/quest"
            : mode === "survey"
              ? "/api/ai/content/activity-draft/survey"
              : mode === "event"
                ? "/api/ai/content/activity-draft/event"
                : mode === "product"
                  ? "/api/ai/content/product-draft"
                  : mode === "engagement"
                    ? "/api/ai/recommendations/engagement"
                    : mode === "catalog"
                      ? "/api/ai/recommendations/products"
                      : "/api/ai/content/alternatives";
      const period = {
        from: toIso(fromAt),
        to: toIso(toAt),
        granularity,
        top,
        notes: text.trim() || null,
      };
      const body =
        mode === "improve"
          ? { text: text.trim(), textKind: "описание", instruction: topic.trim() || null, tone: "деловой" }
          : mode === "quest" || mode === "survey"
            ? { prompt, rewardAmount: reward, questionsCount: 5 }
            : mode === "event"
              ? { prompt, startAt: toIso(startAt), endAt: toIso(endAt), rewardAmount: reward }
              : mode === "product"
                ? { prompt }
                : mode === "engagement"
                  ? { ...period, departmentId: departmentId ? Number(departmentId) : null, focus: "all" }
                  : mode === "catalog"
                    ? period
                    : { text: text.trim() || topic.trim(), textKind: "описание", tone: "деловой", variants: 3 };
      const data = await apex(path, { method: "POST", body: JSON.stringify(body) });
      setResult(data);
      if (mode === "quest" || mode === "survey" || mode === "event" || mode === "product") {
        setDraft(readDraft(mode, data));
      }
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Нейросеть не ответила");
    } finally {
      setBusy(false);
    }
  }

  async function createDraft() {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast.error("Нужно название");
      return;
    }
    setCreating(true);
    try {
      if (draft.kind === "product") {
        await apex("/api/products", {
          method: "POST",
          body: JSON.stringify({
            categoryId: draft.categoryId ? Number(draft.categoryId) : null,
            name: draft.title.trim(),
            description: draft.description.trim(),
            price: draft.price,
            stock: draft.stock,
            isActive: true,
            isDigital: false,
          }),
        });
      } else if (draft.kind === "event") {
        await apex("/api/events", {
          method: "POST",
          body: JSON.stringify({
            title: draft.title.trim(),
            description: draft.description.trim(),
            startAt: toIso(draft.startAt),
            endAt: toIso(draft.endAt),
            location: draft.location.trim(),
            maxParticipants: draft.maxParticipants.trim() ? Number(draft.maxParticipants) : null,
            rewardAmount: draft.reward,
            isActive: true,
          }),
        });
      } else if (draft.kind === "survey") {
        const created = (await apex("/api/surveys", {
          method: "POST",
          body: JSON.stringify({
            title: draft.title.trim(),
            description: draft.description.trim(),
            rewardAmount: draft.reward,
            startAt: draft.startAt ? toIso(draft.startAt) : null,
            endAt: draft.endAt ? toIso(draft.endAt) : null,
            allowMultipleResponses: false,
            isActive: true,
          }),
        })) as { id?: unknown };
        if (created?.id != null) {
          for (const question of draft.questions) {
            await apex(`/api/surveys/${created.id}/questions`, {
              method: "POST",
              body: JSON.stringify({
                questionText: question.text,
                questionType: question.type || "text",
                options: question.options,
                isRequired: true,
                sortOrder: draft.questions.indexOf(question),
              }),
            });
          }
        }
      } else {
        const created = (await apex("/api/quests", {
          method: "POST",
          body: JSON.stringify({
            title: draft.title.trim(),
            description: draft.description.trim(),
            rewardAmount: draft.reward,
            startAt: draft.startAt ? toIso(draft.startAt) : null,
            endAt: draft.endAt ? toIso(draft.endAt) : null,
            isActive: true,
          }),
        })) as { id?: unknown };
        if (created?.id != null) {
          for (const step of draft.steps) {
            const action = step.completionType === "automatic" ? automaticActionBody({
              actionType: String(step.action?.type || ""),
              targetId: step.action?.targetId as string | number | null,
              achievementCode: step.action?.achievementCode as string | null,
              productId: step.action?.productId as string | number | null,
              minAmount: step.action?.minAmount as string | number | null,
              count: step.action?.count as string | number | null,
              requireAvatar: step.action?.requireAvatar as boolean | null,
            }) : null;
            await apex(`/api/quests/${created.id}/steps`, {
              method: "POST",
              body: JSON.stringify({
                title: step.title,
                description: step.description,
                completionType: step.completionType || "manual",
                sortOrder: step.sortOrder,
                isRequired: step.isRequired,
                ...(action ? { completionData: JSON.stringify(action) } : {}),
              }),
            });
          }
        }
      }
      toast.success("Создано");
      setDraft(null);
      setResult(null);
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Не удалось создать");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <form
        className="space-y-3 rounded-xl border border-line bg-surface p-4 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <h2 className="font-bold">Нейросеть</h2>
        <p className="text-sm text-muted">{status || "Проверяем модуль…"}</p>
        <div className="flex flex-wrap gap-1">
          {MODES.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMode(id);
                setDraft(null);
                setResult(null);
              }}
              className={`min-h-10 rounded-md px-3 text-sm font-semibold ${mode === id ? "bg-brand text-white" : "bg-card"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "engagement" || mode === "catalog" ? (
          <div className="grid gap-2">
            <Field label="С">
              <TextInput type="datetime-local" value={fromAt} onChange={(event) => setFromAt(event.target.value)} />
            </Field>
            <Field label="По">
              <TextInput type="datetime-local" value={toAt} onChange={(event) => setToAt(event.target.value)} />
            </Field>
            <Field label="Шаг">
              <select className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm" value={granularity} onChange={(event) => setGranularity(event.target.value)}>
                <option value="day">День</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
              </select>
            </Field>
            {mode === "engagement" ? (
              <Field label="Отдел">
                <select className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm" value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
                  <option value="">Все отделы</option>
                  {departments.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </Field>
            ) : null}
            <Field label="Топ">
              <NumericInput value={top} onChange={setTop} />
            </Field>
          </div>
        ) : (
          <Field label={mode === "improve" ? "Что поправить" : mode === "alternatives" ? "Пожелание" : "Тема"}>
            <TextInput value={topic} onChange={(event) => setTopic(event.target.value)} />
          </Field>
        )}
        <Field label={mode === "improve" || mode === "alternatives" ? "Текст" : "Заметки"}>
          <TextArea value={text} onChange={(event) => setText(event.target.value)} className="min-h-28" />
        </Field>
        {mode === "quest" || mode === "survey" || mode === "event" ? (
          <Field label="Награда, апексы">
            <NumericInput value={reward} onChange={setReward} />
          </Field>
        ) : null}
        {mode === "event" ? (
          <div className="grid gap-2">
            <Field label="Начало">
              <TextInput type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
            </Field>
            <Field label="Конец">
              <TextInput type="datetime-local" value={endAt} onChange={(event) => setEndAt(event.target.value)} />
            </Field>
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Думает…" : "Спросить"}
        </Button>
      </form>
      <Panel>
        <h2 className="font-bold">Ответ</h2>
        {draft ? (
          <DraftEditor draft={draft} busy={creating} onChange={setDraft} onCreate={() => void createDraft()} />
        ) : !result ? (
          <p className="mt-3 text-sm text-muted">Запрос уходит только по кнопке и не тратится при открытии вкладки.</p>
        ) : mode === "improve" || mode === "alternatives" ? (
          <TextResult mode={mode} data={result} />
        ) : mode === "engagement" || mode === "catalog" ? (
          <Recommendation data={result} kind={mode} />
        ) : (
          <Answer data={result} />
        )}
      </Panel>
    </div>
  );
}

function DraftEditor({
  draft,
  busy,
  onChange,
  onCreate,
}: {
  draft: Draft;
  busy: boolean;
  onChange: (draft: Draft) => void;
  onCreate: () => void;
}) {
  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm text-muted">Черновик можно поправить здесь и затем создать.</p>
      <Field label={draft.kind === "product" ? "Название товара" : "Название"}>
        <TextInput value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} />
      </Field>
      <Field label="Описание">
        <TextArea value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} />
      </Field>
      {draft.kind === "product" ? (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Цена">
            <NumericInput value={draft.price} onChange={(price) => onChange({ ...draft, price })} />
          </Field>
          <Field label="Остаток">
            <NumericInput value={draft.stock} onChange={(stock) => onChange({ ...draft, stock })} />
          </Field>
        </div>
      ) : (
        <Field label="Награда">
          <NumericInput value={draft.reward} onChange={(reward) => onChange({ ...draft, reward })} />
        </Field>
      )}
      {draft.kind === "event" ? (
        <>
          <Field label="Место">
            <TextInput value={draft.location} onChange={(event) => onChange({ ...draft, location: event.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Начало">
              <TextInput type="datetime-local" value={draft.startAt} onChange={(event) => onChange({ ...draft, startAt: event.target.value })} />
            </Field>
            <Field label="Конец">
              <TextInput type="datetime-local" value={draft.endAt} onChange={(event) => onChange({ ...draft, endAt: event.target.value })} />
            </Field>
          </div>
        </>
      ) : null}
      {draft.questions.length > 0 ? (
        <ol className="space-y-2">
          {draft.questions.map((question, index) => (
            <li key={index} className="rounded-lg bg-card px-3 py-2 text-sm">
              <p className="text-xs font-semibold text-muted">{index + 1}</p>
              <TextInput
                value={question.text}
                onChange={(event) => {
                  const questions = draft.questions.slice();
                  questions[index] = { ...question, text: event.target.value };
                  onChange({ ...draft, questions });
                }}
              />
              {question.options.length > 0 ? <p className="mt-1 text-xs text-muted">{question.options.join(" · ")}</p> : null}
            </li>
          ))}
        </ol>
      ) : null}
      {draft.steps.length > 0 ? (
        <ul className="space-y-2">
          {draft.steps.map((step, index) => (
            <li key={index} className="rounded-lg bg-card px-3 py-2 text-sm">
              <TextInput
                value={step.title}
                onChange={(event) => {
                  const steps = draft.steps.slice();
                  steps[index] = { ...step, title: event.target.value };
                  onChange({ ...draft, steps });
                }}
              />
              <p className="mt-1 text-xs text-muted">{step.completionType === "automatic" ? "автоматически" : step.completionType === "proof" ? "с подтверждением" : "вручную"}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <Button type="button" disabled={busy} onClick={onCreate}>
        {busy ? "Создаём…" : "Создать"}
      </Button>
    </div>
  );
}

function readDraft(kind: Draft["kind"], data: unknown): Draft {
  const root = data && typeof data === "object" ? (data as { content?: unknown }).content ?? data : {};
  const record = root && typeof root === "object" ? (root as Record<string, unknown>) : {};
  const steps = Array.isArray(record.steps) ? record.steps : [];
  const questions = Array.isArray(record.questions) ? record.questions : [];
  return {
    kind,
    title: String(record.title || record.name || ""),
    description: String(record.description || ""),
    reward: Number(record.rewardAmount ?? 0) || 0,
    startAt: toLocal(String(record.startAt || "")),
    endAt: toLocal(String(record.endAt || "")),
    location: String(record.location || ""),
    maxParticipants: record.maxParticipants == null ? "" : String(record.maxParticipants),
    price: Number(record.price ?? 0) || 0,
    stock: Number(record.stock ?? 1) || 0,
    categoryId: record.categoryId == null ? "" : String(record.categoryId),
    steps: steps.map((item, index) => {
      const row = item as Record<string, unknown>;
      const action = row.action && typeof row.action === "object" ? (row.action as Record<string, unknown>) : null;
      return {
        title: String(row.title || ""),
        description: String(row.description || ""),
        completionType: String(row.completionType || "manual"),
        sortOrder: Number(row.sortOrder ?? index) || index,
        isRequired: row.isRequired !== false,
        action,
      };
    }),
    questions: questions.map((item) => {
      const row = item as Record<string, unknown>;
      const options = Array.isArray(row.options) ? row.options.map((option) => String(option)) : [];
      return { text: String(row.questionText || row.text || ""), type: String(row.questionType || row.type || "text"), options };
    }),
  };
}

function TextResult({ mode, data }: { mode: "improve" | "alternatives"; data: unknown }) {
  const content = unwrap(data);
  if (mode === "alternatives" && Array.isArray(content)) {
    if (content.length === 0) return <p className="mt-3 text-sm text-muted">Варианты не пришли.</p>;
    return (
      <ul className="mt-3 space-y-3">
        {content.map((item, index) => {
          const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return (
            <li key={index} className="rounded-lg border border-line bg-card p-3 text-sm">
              <p className="font-semibold">{String(row.label || `Вариант ${index + 1}`)}</p>
              <p className="mt-2 whitespace-pre-wrap">{String(row.text || "Пустой вариант")}</p>
            </li>
          );
        })}
      </ul>
    );
  }
  const row = content && typeof content === "object" && !Array.isArray(content) ? (content as Record<string, unknown>) : {};
  const text = typeof row.text === "string" ? row.text : typeof content === "string" ? content : "";
  const changes = Array.isArray(row.changes) ? row.changes.map((item) => String(item)) : [];
  if (!text && changes.length === 0) return <Answer data={data} />;
  return (
    <div className="mt-3 space-y-3 text-sm">
      <p className="whitespace-pre-wrap rounded-lg border border-line bg-card p-3">{text || "Текст не пришёл."}</p>
      {changes.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-muted">Что изменено</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {changes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Recommendation({ data, kind }: { data: unknown; kind: "engagement" | "catalog" }) {
  const content = unwrap(data);
  const row = content && typeof content === "object" && !Array.isArray(content) ? (content as Record<string, unknown>) : {};
  const analysis = typeof row.analysis === "string" ? row.analysis : "";
  const findings = Array.isArray(row.findings) ? row.findings : [];
  const recommendations = Array.isArray(row.recommendedActivities)
    ? row.recommendedActivities
    : Array.isArray(row.recommendedProducts)
      ? row.recommendedProducts
      : [];
  const limitations = Array.isArray(row.limitations) ? row.limitations.map(String) : [];
  if (!analysis && findings.length === 0 && recommendations.length === 0) return <Answer data={data} />;
  return (
    <div className="mt-3 space-y-4 text-sm">
      {analysis ? <p className="whitespace-pre-wrap">{analysis}</p> : null}
      {recommendations.length > 0 ? (
        <div>
          <p className="font-semibold">{kind === "catalog" ? "Товары" : "Активности"}</p>
          <ul className="mt-2 space-y-2">
            {recommendations.map((item, index) => {
              const card = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
              return (
                <li key={index} className="rounded-lg border border-line bg-card p-3">
                  <p className="font-semibold">{String(card.name || card.title || "Без названия")}</p>
                  {card.action ? <p className="mt-1">{String(card.action)}</p> : null}
                  {card.rationale ? <p className="mt-1 text-muted">{String(card.rationale)}</p> : null}
                  {card.expectedImpact ? <p className="mt-1 text-muted">Эффект: {String(card.expectedImpact)}</p> : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {findings.length > 0 ? (
        <div>
          <p className="font-semibold">Наблюдения</p>
          <ul className="mt-2 space-y-1">
            {findings.map((item, index) => {
              const finding = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
              return (
                <li key={index}>
                  <span className="font-medium">{String(finding.title || "Наблюдение")}</span>
                  {finding.description ? <span className="text-muted"> — {String(finding.description)}</span> : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {limitations.length > 0 ? <p className="text-xs text-muted">{limitations.join(" ")}</p> : null}
    </div>
  );
}

function unwrap(data: unknown) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;
  const record = data as Record<string, unknown>;
  return record.content ?? data;
}

function Answer({ data }: { data: unknown }) {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const content = record.content ?? data;
  return (
    <div className="mt-3 text-sm">
      <Block value={content} />
    </div>
  );
}

function Block({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (depth > 4) return null;
  if (value == null || typeof value !== "object") return <p>{String(value ?? "")}</p>;
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li key={index}>
            <Block value={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    );
  }
  const row = value as Record<string, unknown>;
  const title = String(row.title || row.name || row.label || "");
  const body = String(row.description || row.text || row.summary || row.analysis || row.shortPitch || row.body || "");
  const skip = new Set(["title", "name", "label", "description", "text", "summary", "analysis", "shortPitch", "body", "model", "promptTokens", "completionTokens"]);
  return (
    <div className="space-y-2">
      {title ? <p className="font-semibold">{title}</p> : null}
      {body ? <p className="whitespace-pre-wrap text-muted">{body}</p> : null}
      {Object.entries(row)
        .filter(([key, item]) => !skip.has(key) && item != null && item !== "")
        .map(([key, item]) => (
          <div key={key}>
            <p className="text-xs font-semibold text-muted">{key}</p>
            <Block value={item} depth={depth + 1} />
          </div>
        ))}
    </div>
  );
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000);
}

function localStamp(date: Date) {
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIso(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function toLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
