import { createFileRoute } from "@tanstack/react-router";
import { Award, Gift, Heart, ShoppingBag, SlidersHorizontal, Undo2, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Chip } from "@/components/ui";
import { formatDateTime, formatNumber, pointsLabel } from "@/lib/format";
import { ENTRY_LABEL } from "@/lib/labels";
import { useStore, type EntryType } from "@/lib/store";

export const Route = createFileRoute("/history")({ component: HistoryPage });

const FILTERS: { id: "all" | EntryType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "activity_reward", label: "Активности" },
  { id: "recognition_received", label: "Благодарности" },
  { id: "manager_award", label: "Поощрения" },
  { id: "purchase", label: "Покупки" },
  { id: "refund", label: "Возвраты" },
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
  const page = usePage(rows, 8, filter);

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">История</h1>
      <p className="mt-2 text-sm text-muted">
        Покупки списывают личные апексы. Поощрение руководителя списывается с его рабочего баланса. Личная благодарность баланс отправителя не меняет.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Chip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Операций с таким фильтром нет.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line shadow-[0_10px_30px_-18px_rgba(20,40,70,0.45)]">
          {page.items.map((entry) => {
            const other = people.find((person) => person.id === entry.counterpartyId);
            const positive = entry.amount > 0;
            return (
              <li key={entry.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-surface px-4 py-3 transition hover:bg-brand-wash/60">
                <span className="grid size-10 place-items-center rounded-full bg-brand-wash text-brand">
                  <EntryIcon type={entry.type} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{ENTRY_LABEL[entry.type]}</p>
                  <p className="mt-1 text-sm break-words text-muted">{entry.reason}</p>
                  {other ? <p className="mt-1 text-xs text-muted">{positive ? "От" : "Кому"}: {other.name}</p> : null}
                  <p className="mt-1 text-xs text-muted">{formatDateTime(entry.createdAt)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-lg font-bold tabular ${positive ? "text-brand" : "text-ink"}`}>
                    {positive ? "+" : ""}
                    {formatNumber(entry.amount)} {pointsLabel(Math.abs(entry.amount))}
                  </p>
                  {entry.type === "manager_award" && entry.amount < 0 ? (
                    <p className="text-xs font-medium text-muted">рабочий</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
    </Shell>
  );
}

function EntryIcon({ type }: { type: EntryType }) {
  const Icon: LucideIcon =
    type === "recognition_received" || type === "recognition_sent"
      ? Heart
      : type === "manager_award"
        ? Award
        : type === "purchase"
          ? ShoppingBag
          : type === "refund"
            ? Undo2
            : type === "admin_adjustment"
              ? SlidersHorizontal
              : Gift;
  return <Icon className="size-4" />;
}
