import { useState } from "react";

export function usePage<T>(items: T[], size = 8, resetKey = "") {
  const [page, setPage] = useState(1);
  const [seen, setSeen] = useState(resetKey);
  if (seen !== resetKey) {
    setSeen(resetKey);
    setPage(1);
  }
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pages);
  const start = (current - 1) * size;
  return {
    page: current,
    pages,
    total: items.length,
    items: items.slice(start, start + size),
    setPage,
  };
}

export function Pager({
  page,
  pages,
  total,
  onPage,
}: {
  page: number;
  pages: number;
  total: number;
  onPage: (page: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <nav className="mt-4 flex items-center justify-between gap-3 text-sm" aria-label={`Страница ${page} из ${pages}, записей ${total}`}>
      <button
        type="button"
        className="h-9 rounded-md border border-line bg-surface px-3 font-semibold disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Назад
      </button>
      <span className="tabular text-muted">
        {page} / {pages}
      </span>
      <button
        type="button"
        className="h-9 rounded-md border border-line bg-surface px-3 font-semibold disabled:opacity-40"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Дальше
      </button>
    </nav>
  );
}
