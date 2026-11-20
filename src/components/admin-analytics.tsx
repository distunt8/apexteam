import { useEffect, useState } from "react";
import { Panel } from "@/components/ui";
import { apex } from "@/lib/apex";
import { formatNumber } from "@/lib/format";

type Metric = { title: string; value: string; hint: string };
type Insight = { title: string; description: string; severity: string };
type Bar = { label: string; value: number };
type PersonRow = { name: string; department: string; score: string; change: string };

function metricValue(value: number, unit: unknown) {
  if (unit === "rate") return `${formatNumber(Math.round(value * 1000) / 10)}%`;
  return formatNumber(value);
}

function num(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function metricsOf(data: unknown, key: string): Metric[] {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>)[key] : null;
  if (!Array.isArray(record)) return [];
  return record.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const value = num(row.value);
    return [
      {
        title: String(row.title || row.code || "Показатель"),
        value: value == null ? "—" : metricValue(value, row.unit),
        hint: row.isReliable === false ? String(row.unavailableReason || "Мало данных") : "",
      },
    ];
  });
}

export function AdminAnalytics() {
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Metric[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [trend, setTrend] = useState<Bar[]>([]);
  const [declining, setDeclining] = useState<PersonRow[]>([]);
  const [departments, setDepartments] = useState<Bar[]>([]);

  useEffect(() => {
    let ignore = false;
    void Promise.all([
      apex("/api/analytics/overview").catch(() => null),
      apex("/api/analytics/insights").catch(() => null),
      apex("/api/analytics/engagement/trend").catch(() => null),
      apex("/api/analytics/engagement/declining").catch(() => null),
      apex("/api/analytics/departments").catch(() => null),
    ])
      .then(([overview, insightReport, trendReport, decliningReport, departmentReport]) => {
        if (ignore) return;
        const groups = ["headcount", "participation", "volume", "economy"].flatMap((key) => metricsOf(overview, key));
        setCards(groups);
        const insightList =
          insightReport && typeof insightReport === "object" ? (insightReport as { insights?: unknown[] }).insights : [];
        setInsights(
          Array.isArray(insightList)
            ? insightList.flatMap((item) => {
                if (!item || typeof item !== "object") return [];
                const row = item as Record<string, unknown>;
                return [{ title: String(row.title || "Наблюдение"), description: String(row.description || ""), severity: String(row.severity || "") }];
              })
            : [],
        );
        const points = trendReport && typeof trendReport === "object" ? (trendReport as { points?: unknown[] }).points : [];
        setTrend(
          Array.isArray(points)
            ? points.flatMap((item) => {
                if (!item || typeof item !== "object") return [];
                const row = item as Record<string, unknown>;
                const value = num(row.averageScore);
                if (value == null) return [];
                return [{ label: String(row.periodStart || "").slice(0, 10), value }];
              })
            : [],
        );
        const employees =
          decliningReport && typeof decliningReport === "object" ? (decliningReport as { employees?: unknown[] }).employees : [];
        setDeclining(
          Array.isArray(employees)
            ? employees.flatMap((item) => {
                if (!item || typeof item !== "object") return [];
                const row = item as Record<string, unknown>;
                return [
                  {
                    name: String(row.name || "Сотрудник"),
                    department: String(row.department || ""),
                    score: formatNumber(num(row.currentScore) ?? 0),
                    change: formatNumber(num(row.change) ?? 0),
                  },
                ];
              })
            : [],
        );
        const rows = Array.isArray(departmentReport)
          ? departmentReport
          : departmentReport && typeof departmentReport === "object"
            ? ((departmentReport as { items?: unknown[] }).items ?? [])
            : [];
        setDepartments(
          rows.flatMap((item) => {
            if (!item || typeof item !== "object") return [];
            const row = item as Record<string, unknown>;
            const value = num(row.engagementScore);
            if (value == null) return [];
            return [{ label: String(row.department || row.name || "Отдел"), value }];
          }),
        );
        if (!overview && !insightReport) setError("Аналитика недоступна для этой роли или сервер не ответил.");
      })
      .catch((reason: unknown) => {
        if (!ignore) setError(reason instanceof Error ? reason.message : "Не удалось загрузить аналитику");
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Обзор платформы</h2>
        <p className="mt-1 text-sm text-muted">Сотрудники, вовлечённость и экономика</p>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.slice(0, 4).map((item) => (
          <Panel key={item.title}>
            <p className="text-xs text-muted">{item.title}</p>
            <p className="mt-2 text-2xl font-bold tabular">{item.value}</p>
            {item.hint ? <p className="mt-1 text-xs text-muted">{item.hint}</p> : null}
          </Panel>
        ))}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
        <Panel>
          <h2 className="font-bold">Вовлечённость по периодам</h2>
          {trend.length === 0 ? <p className="mt-3 text-sm text-muted">Нет ряда.</p> : <TrendChart points={trend} />}
        </Panel>
        <Panel className="space-y-4">
          <h2 className="font-bold">Состояние платформы</h2>
          <div>
            <p className="text-sm font-semibold">Отделы</p>
            {departments.length === 0 ? <p className="mt-2 text-sm text-muted">Нет данных по отделам.</p> : null}
            <ul className="mt-2 space-y-2">
              {departments.slice(0, 4).map((item) => (
                <li key={item.label} className="text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="truncate">{item.label}</span>
                    <span className="tabular font-semibold">{formatNumber(item.value)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Снижается вовлечённость</p>
            {declining.length === 0 ? <p className="mt-2 text-sm text-muted">Таких сотрудников нет.</p> : null}
            <ul className="mt-2 space-y-1">
              {declining.slice(0, 4).map((item) => (
                <li key={`${item.name}-${item.department}`} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">{item.name}</span>
                  <span className="shrink-0 tabular text-danger">{item.change}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Наблюдения</p>
            {insights.length === 0 ? <p className="mt-2 text-sm text-muted">Пока пусто.</p> : null}
            <ul className="mt-2 space-y-2">
              {insights.slice(0, 3).map((item) => (
                <li key={item.title}>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.description ? <p className="mt-1 text-xs text-muted">{item.description}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
      {cards.length > 4 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {cards.slice(4).map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              <span className="min-w-0">{item.title}</span>
              <span className="tabular shrink-0 font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TrendChart({ points }: { points: Bar[] }) {
  const max = Math.max(1, ...points.map((item) => item.value));
  const width = 640;
  const height = 180;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const coords = points.map((item, index) => {
    const x = points.length > 1 ? index * step : width / 2;
    const y = height - (item.value / max) * (height - 16) - 8;
    return { x, y, ...item };
  });
  const line = coords.map((item) => `${item.x},${item.y}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  return (
    <div className="mt-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label="График вовлечённости">
        <polygon points={area} className="fill-brand/15" />
        <polyline points={line} fill="none" className="stroke-brand" strokeWidth="3" />
        {coords.map((item) => (
          <circle key={item.label} cx={item.x} cy={item.y} r="4" className="fill-brand" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between gap-2 text-xs text-muted">
        <span>{points[0]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}
