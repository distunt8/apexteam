import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui";
import { apex } from "@/lib/apex";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

type Note = { id: string; title: string; body: string; createdAt: string; read: boolean };

function NotificationsPage() {
  const [items, setItems] = useState<Note[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const data = await apex("/api/notifications?page=1&pageSize=30");
    const list = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items;
    if (!Array.isArray(list)) {
      setItems([]);
      return;
    }
    setItems(
      list.map((item) => {
        const record = item as Record<string, unknown>;
        return {
          id: String(record.id ?? ""),
          title: String(record.title || record.subject || "Уведомление"),
          body: String(record.body || record.message || record.text || ""),
          createdAt: String(record.createdAt || ""),
          read: Boolean(record.isRead || record.read),
        };
      }),
    );
  }

  useEffect(() => {
    void load().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Не удалось загрузить уведомления"));
  }, []);

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Уведомления</h1>
        <Button
          variant="line"
          onClick={() => {
            void apex("/api/notifications/read-all", { method: "POST" })
              .then(() => load())
              .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Не получилось"));
          }}
        >
          Прочитать все
        </Button>
      </div>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <ul className="mt-5 space-y-2">
        {items.length === 0 ? <li className="text-sm text-muted">Пока пусто.</li> : null}
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`w-full rounded-xl border border-line px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.read ? "bg-surface" : "bg-gradient-to-r from-brand-wash to-surface"}`}
              onClick={() => {
                void apex(`/api/notifications/${item.id}/read`, { method: "PATCH" }).then(() => load());
              }}
            >
              <p className="font-semibold">{item.title}</p>
              {item.body ? <p className="mt-1 text-sm text-muted">{item.body}</p> : null}
              {item.createdAt ? <p className="mt-1 text-xs text-muted">{formatDateTime(item.createdAt)}</p> : null}
            </button>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
