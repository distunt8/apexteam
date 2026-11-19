import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Field, Panel, TextArea, TextInput } from "@/components/ui";
import { apex } from "@/lib/apex";

const MODES = [
  ["improve", "Улучшить текст"],
  ["quest", "Квест"],
  ["survey", "Опрос"],
  ["event", "Анонс"],
  ["engagement", "Вовлечённость"],
  ["products", "Каталог"],
] as const;

type Mode = (typeof MODES)[number][0];

export function AdminAi() {
  const [mode, setMode] = useState<Mode>("improve");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  useEffect(() => {
    void apex("/api/ai/status")
      .then((data) => {
        const record = data as { configured?: boolean; model?: string };
        setStatus(record.configured ? `Модель: ${record.model || "подключена"}` : "Модуль на сервере не настроен");
      })
      .catch(() => setStatus("Не удалось узнать состояние модуля"));
  }, []);

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      const body =
        mode === "improve"
          ? { text, textKind: "описание", instruction: topic, tone: "деловой" }
          : mode === "quest"
            ? { topic: topic || text, variants: 2, tone: "деловой" }
            : mode === "survey"
              ? { topic: topic || text, questionsCount: 5, variants: 2, tone: "деловой" }
              : mode === "event"
                ? { title: topic || text, audience: "сотрудники", variants: 2, tone: "деловой" }
                : mode === "engagement"
                  ? { focus: topic, notes: text, top: 5 }
                  : { notes: text || topic, top: 5 };
      const path =
        mode === "improve"
          ? "/api/ai/content/improve"
          : mode === "quest"
            ? "/api/ai/content/quest-drafts"
            : mode === "survey"
              ? "/api/ai/content/survey-draft"
              : mode === "event"
                ? "/api/ai/content/event-announcement"
                : mode === "engagement"
                  ? "/api/ai/recommendations/engagement"
                  : "/api/ai/recommendations/products";
      setResult(await apex(path, { method: "POST", body: JSON.stringify(body) }));
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Нейросеть не ответила");
    } finally {
      setBusy(false);
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
              onClick={() => setMode(id)}
              className={`min-h-10 rounded-md px-3 text-sm font-semibold ${mode === id ? "bg-brand text-white" : "bg-card"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <Field label={mode === "improve" ? "Что поправить" : "Тема"}>
          <TextInput value={topic} onChange={(event) => setTopic(event.target.value)} />
        </Field>
        <Field label={mode === "improve" ? "Текст" : "Заметки"}>
          <TextArea value={text} onChange={(event) => setText(event.target.value)} className="min-h-28" />
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Думает…" : "Спросить"}
        </Button>
      </form>
      <Panel>
        <h2 className="font-bold">Ответ</h2>
        {!result ? <p className="mt-3 text-sm text-muted">Запрос уходит только по кнопке и не тратится при открытии вкладки.</p> : <Answer data={result} />}
      </Panel>
    </div>
  );
}

function Answer({ data }: { data: unknown }) {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const content = record.content ?? data;
  if (Array.isArray(content)) {
    return (
      <ul className="mt-3 space-y-3">
        {content.map((item, index) => (
          <li key={index} className="rounded-lg bg-card px-3 py-3 text-sm">
            <Block value={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="mt-3 text-sm">
      <Block value={content} />
    </div>
  );
}

function Block({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (depth > 4) return null;
  if (!value || typeof value !== "object") return <p>{String(value ?? "")}</p>;
  const row = value as Record<string, unknown>;
  const title = String(row.title || row.name || row.label || "");
  const body = String(row.description || row.text || row.summary || row.analysis || row.shortPitch || row.body || "");
  const lists = Object.entries(row).filter(([, item]) => Array.isArray(item));
  return (
    <div className="space-y-2">
      {title ? <p className="font-semibold">{title}</p> : null}
      {body ? <p className="whitespace-pre-wrap text-muted">{body}</p> : null}
      {lists.map(([key, item]) => (
        <div key={key}>
          <p className="text-xs font-semibold text-muted">{key}</p>
          <ul className="mt-1 space-y-1">
            {(item as unknown[]).map((entry, index) => (
              <li key={index}>
                <Block value={entry} depth={depth + 1} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
