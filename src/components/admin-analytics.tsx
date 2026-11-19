import { useEffect, useState } from "react";
import { Panel } from "@/components/ui";
import { apex } from "@/lib/apex";
import { formatNumber } from "@/lib/format";

type Metric = { title: string; value: string; hint: string };
type Insight = { title: string; description: string; severity: string };
type Bar = { label: string; value: number };
type PersonRow = { name: string; department: string; score: string; change: string };

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
        value: value == null ? "—" : `${formatNumber(value)}${row.unit ? ` ${row.unit}` : ""}`,
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

  const maxTrend = Math.max(1, ...trend.map((item) => item.value));
  const maxDept = Math.max(1, ...departments.map((item) => item.value));

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => (
          <Panel key={item.title} className="p-3">
            <p className="text-xs text-muted">{item.title}</p>
            <p className="mt-1 text-xl font-bold tabular">{item.value}</p>
            {item.hint ? <p className="mt-1 text-xs text-muted">{item.hint}</p> : null}
          </Panel>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="font-bold">Вовлечённость по периодам</h2>
          {trend.length === 0 ? <p className="mt-3 text-sm text-muted">Нет ряда.</p> : null}
          <ul className="mt-3 space-y-2">
            {trend.map((item) => (
              <li key={item.label} className="grid grid-cols-[88px_minmax(0,1fr)_40px] items-center gap-2 text-sm">
                <span className="text-muted">{item.label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-card">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.max(4, (item.value / maxTrend) * 100)}%` }} />
                </span>
                <span className="tabular text-right font-semibold">{formatNumber(item.value)}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="font-bold">Отделы</h2>
          {departments.length === 0 ? <p className="mt-3 text-sm text-muted">Нет данных по отделам.</p> : null}
          <ul className="mt-3 space-y-2">
            {departments.map((item) => (
              <li key={item.label} className="grid grid-cols-[minmax(0,1fr)_minmax(80px,1fr)_40px] items-center gap-2 text-sm">
                <span className="truncate">{item.label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-card">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.max(4, (item.value / maxDept) * 100)}%` }} />
                </span>
                <span className="tabular text-right font-semibold">{formatNumber(item.value)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="font-bold">Наблюдения</h2>
          {insights.length === 0 ? <p className="mt-3 text-sm text-muted">Пока пусто.</p> : null}
          <ul className="mt-3 space-y-2">
            {insights.map((item) => (
              <li key={item.title} className="rounded-lg bg-card px-3 py-2">
                <p className="text-sm font-semibold">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm text-muted">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="font-bold">Снижается вовлечённость</h2>
          {declining.length === 0 ? <p className="mt-3 text-sm text-muted">Таких сотрудников нет.</p> : null}
          <ul className="mt-3 divide-y divide-line">
            {declining.map((item) => (
              <li key={`${item.name}-${item.department}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.name}</span>
                  <span className="text-xs text-muted">{item.department}</span>
                </span>
                <span className="shrink-0 tabular">
                  {item.score} <span className="text-danger">{item.change}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
