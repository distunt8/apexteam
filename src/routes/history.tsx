import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { Chip } from "@/components/ui";
import { formatDateTime, formatNumber } from "@/lib/format";
import { ENTRY_LABEL } from "@/lib/labels";
import { useStore, type EntryType } from "@/lib/store";

export const Route = createFileRoute("/history")({ component: HistoryPage });

const FILTERS: { id: "all" | EntryType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "activity_reward", label: "Активности" },
  { id: "recognition_received", label: "Благодарности" },
  { id: "manager_award", label: "Поощрения" },
  { id: "purchase", label: "Покупки" },
  { id: "admin_adjustment", label: "Корректировки" },
];

function HistoryPage() {
  const userId = useStore((state) => state.currentUserId);
  const people = useStore((state) => state.people);
  const allLedger = useStore((state) => state.ledger);
  const ledger = allLedger.filter((entry) => entry.userId === userId);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const rows = ledger.filter((entry) => {
    if (filter === "all") return true;
    if (filter === "recognition_received") {
      return entry.type === "recognition_received" || entry.type === "recognition_sent";
    }
    return entry.type === filter;
  });

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">История</h1>
      <p className="mt-2 text-sm text-muted">
        Покупки и начисления меняют баланс. Отправленная благодарность списывается из бюджета, не из баллов на награды.
      </p>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => (
          <Chip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Операций с таким фильтром нет.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
          {rows.map((entry) => {
            const other = people.find((person) => person.id === entry.counterpartyId);
            const budget = entry.type === "recognition_sent";
            const positive = entry.amount > 0;
            return (
              <li key={entry.id} className="flex flex-wrap items-start justify-between gap-3 bg-surface px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{ENTRY_LABEL[entry.type]}</p>
                  <p className="mt-1 text-sm text-muted">{entry.reason}</p>
                  {other ? <p className="mt-1 text-xs text-muted">{positive ? "От" : "Кому"}: {other.name}</p> : null}
                  <p className="mt-1 text-xs text-muted">{formatDateTime(entry.createdAt)}</p>
                </div>
                <p className={`tabular text-sm font-bold ${positive ? "text-brand" : "text-ink"}`}>
                  {positive ? "+" : ""}
                  {formatNumber(entry.amount)}
                  <span className="ml-1 font-medium text-muted">{budget ? "бюджет" : "баллы"}</span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Shell>
  );
}
