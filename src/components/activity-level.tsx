import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ActivityLevelCard({ link = true, className }: { link?: boolean; className?: string }) {
  const engagement = useStore((state) => state.engagement);
  const error = useStore((state) => state.engagementError);
  const status = useStore((state) => state.engagementStatus);

  return (
    <Panel className={cn("h-full", className)}>
      <p className="text-xs font-semibold tracking-wide text-muted">УРОВЕНЬ АКТИВНОСТИ</p>
      {!engagement && status === "loading" ? <p className="mt-3 text-sm text-muted">Загружаем уровень с сервера…</p> : null}
      {!engagement && status !== "loading" && error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      {engagement ? (
        <>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <p className="text-xl font-bold">{engagement.title}</p>
            <p className="tabular text-sm text-muted">
              {formatNumber(engagement.score)}/{formatNumber(engagement.maxScore)}
            </p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
            <div className="h-full rounded-full bg-brand" style={{ width: `${Math.round(engagement.progress * 100)}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">
            {engagement.nextTitle ? `До «${engagement.nextTitle}» ещё ${formatNumber(engagement.pointsToNext ?? 0)}` : "Высший уровень"}
          </p>
        </>
      ) : null}
      {link ? (
        <Link to="/profile" search={{ tab: "activity" }} className="mt-3 inline-block text-sm font-semibold text-brand">
          Моя активность
        </Link>
      ) : null}
    </Panel>
  );
}