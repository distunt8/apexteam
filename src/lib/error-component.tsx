import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

const FALLBACK_MESSAGE = "Не удалось открыть страницу. Обновите её.";
const RELOAD_KEY = "apex-chunk-reload";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

function staleChunk(error: unknown) {
  const message = errorMessage(error);
  return /dynamically imported module|imported module|chunk|preload/i.test(message);
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  useEffect(() => {
    if (!staleChunk(error)) return;
    try {
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
    } catch {
      return;
    }
    window.location.reload();
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface px-6 text-center text-ink">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">Страница не открылась</h1>
      <p className="max-w-md text-sm text-muted">Сайт обновился. Обновите страницу, чтобы загрузить новую версию.</p>
      <button
        type="button"
        className="mt-2 min-h-11 rounded-md bg-brand px-4 text-sm font-semibold text-white"
        onClick={() => window.location.reload()}
      >
        Обновить
      </button>
    </main>
  );
}