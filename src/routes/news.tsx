import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { apex } from "@/lib/apex";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/news")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: NewsPage,
});

type Item = { id: string; title: string; summary: string; content: string; imageUrl: string; createdAt: string };

const COVERS = ["/news/cover-1.jpg", "/news/cover-2.jpg", "/news/cover-3.jpg"];

function coverFor(id: string, imageUrl: string) {
  if (imageUrl.trim()) return imageUrl;
  let hash = 0;
  for (const char of id) hash = (hash + char.charCodeAt(0)) % COVERS.length;
  return COVERS[hash] ?? COVERS[0];
}

function NewsPage() {
  const focus = Route.useSearch().id ?? "";
  const [items, setItems] = useState<Item[]>([]);
  const [openId, setOpenId] = useState(focus);
  const [error, setError] = useState("");

  useEffect(() => {
    setOpenId(focus);
  }, [focus]);

  useEffect(() => {
    void apex("/api/company-news?page=1&pageSize=30")
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items;
        if (!Array.isArray(list)) return;
        setItems(
          list.flatMap((item) => {
            if (!item || typeof item !== "object") return [];
            const row = item as Record<string, unknown>;
            const id = String(row.id ?? "");
            const title = String(row.title ?? "");
            if (!id || !title) return [];
            const image = typeof row.imageUrl === "string" ? row.imageUrl : "";
            return [
              {
                id,
                title,
                summary: String(row.summary ?? ""),
                content: String(row.content ?? ""),
                imageUrl: coverFor(id, image),
                createdAt: String(row.createdAt ?? row.publishedAt ?? ""),
              },
            ];
          }),
        );
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Не удалось загрузить новости"));
  }, []);

  const opened = items.find((item) => item.id === openId) ?? null;

  return (
    <Shell>
      <h1 className="text-3xl font-bold tracking-tight">Новости</h1>
      <p className="mt-2 text-sm text-muted">Объявления компании.</p>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 && !error ? <li className="text-sm text-muted">Пока нет новостей.</li> : null}
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => setOpenId(item.id)} className="w-full text-left">
              <Panel className="h-full overflow-hidden p-0 transition hover:-translate-y-0.5 hover:border-brand-mid">
                <img src={item.imageUrl} alt="" className="h-28 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-bold leading-5">{item.title}</p>
                  {item.createdAt ? <p className="mt-1 text-xs text-muted">{formatDateTime(item.createdAt)}</p> : null}
                  {item.summary ? <p className="mt-1 line-clamp-2 text-xs text-muted">{item.summary}</p> : null}
                </div>
              </Panel>
            </button>
          </li>
        ))}
      </ul>
      {opened ? <NewsDialog item={opened} onClose={() => setOpenId("")} /> : null}
    </Shell>
  );
}

function NewsDialog({ item, onClose }: { item: Item; onClose: () => void }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-surface shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={item.imageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
        <div className="relative p-5 sm:p-6">
          <button type="button" className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-card" aria-label="Закрыть" onClick={onClose}>
            <X className="size-4" />
          </button>
          <h2 id="news-title" className="pr-12 text-2xl font-bold">{item.title}</h2>
          {item.createdAt ? <p className="mt-2 text-xs text-muted">{formatDateTime(item.createdAt)}</p> : null}
          {item.summary ? <p className="mt-3 text-sm text-muted">{item.summary}</p> : null}
          <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{item.content || item.summary || "Текста пока нет."}</p>
        </div>
      </article>
    </div>
  );
}
