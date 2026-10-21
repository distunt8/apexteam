import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Star } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { formatDateTime, formatNumber, formatPoints, initials } from "@/lib/format";
import { ENTRY_LABEL, orderStatusLabel, ROLE_LABEL } from "@/lib/labels";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const reward = useStore((state) => state.rewardBalance);
  const people = useStore((state) => state.people);
  const ledger = useStore((state) => state.ledger);
  const orders = useStore((state) => state.orders);
  const progress = useStore((state) => state.progress);
  const feed = useStore((state) => state.feed);
  const [tab, setTab] = useState<"history" | "orders" | "badges">("history");
  if (!user) return null;

  const mine = ledger.filter((entry) => entry.userId === user.id);
  const myOrders = orders.filter((order) => order.userId === user.id);
  const streak = progress.find((item) => item.userId === user.id && item.activityId === "act-streak")?.value ?? 0;
  const steps = progress
    .filter((item) => item.userId === user.id && item.activityId === "act-steps")
    .reduce((max, item) => Math.max(max, item.value), 0);
  const badges = [
    { title: "10К шагов", on: steps >= 10000, hint: "Наберите 10 000 шагов за день" },
    { title: "Активность", on: progress.some((item) => item.userId === user.id && item.rewarded), hint: "Получите любую награду" },
    { title: "Целеустремлённость", on: streak >= 7, hint: `${streak} из 7 дней серии` },
    { title: "Первая награда", on: myOrders.some((order) => order.status !== "cancelled"), hint: "Оформите заказ" },
    { title: "Благодарность", on: feed.some((item) => item.fromId === user.id), hint: "Поблагодарите коллегу" },
  ];

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
      <div className="mt-5 flex items-center gap-4">
        <span className="grid size-20 place-items-center rounded-2xl bg-brand text-xl font-bold text-white">
          {initials(user.name)}
        </span>
        <div>
          <p className="text-xl font-bold">{user.name}</p>
          <p className="text-sm text-muted">{user.position}</p>
          <p className="text-sm text-muted">
            {user.department} · {user.roleTitle || ROLE_LABEL[user.role]}
          </p>
        </div>
      </div>

      <Panel className="mt-5">
        <p className="text-sm text-muted">Текущий баланс</p>
        <p className="mt-1 text-4xl font-bold text-brand">{formatPoints(user.balance)}</p>
        <p className="mt-3 text-sm">
          Рабочий баланс (поощрения):{" "}
          <span className="font-semibold">{reward == null ? "нет доступа" : formatNumber(reward)}</span>
        </p>
        <p className="mt-1 text-sm text-muted">В рейтинге: {formatNumber(user.score)} накопленных баллов</p>
      </Panel>

      <Link
        to="/support"
        className="mt-4 flex min-h-12 items-center gap-3 rounded-xl bg-card px-4 py-3 lg:hidden"
      >
        <LifeBuoy className="size-5 shrink-0 text-brand" />
        <span>
          <span className="block text-sm font-semibold">Поддержка</span>
          <span className="block text-xs text-muted">Написать, если не пришёл заказ или баллы</span>
        </span>
      </Link>

      <div className="mt-5 flex gap-2">
        {(
          [
            ["history", "История"],
            ["orders", "Покупки"],
            ["badges", "Достижения"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold ${
              tab === id ? "bg-brand text-white" : "bg-card text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "history" ? (
        <ul className="mt-4 space-y-2">
          {mine.slice(0, 8).map((entry) => {
            const other = people.find((person) => person.id === entry.counterpartyId);
            return (
              <li key={entry.id} className="flex items-center justify-between gap-3 rounded-lg bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{entry.reason}</p>
                  <p className="text-xs text-muted">
                    {ENTRY_LABEL[entry.type]}
                    {other ? ` · ${other.name}` : ""} · {formatDateTime(entry.createdAt)}
                  </p>
                </div>
                <span className={`tabular text-sm font-bold ${entry.amount > 0 ? "text-brand" : "text-ink"}`}>
                  {entry.amount > 0 ? "+" : ""}
                  {formatNumber(entry.amount)}
                </span>
              </li>
            );
          })}
          <li>
            <Link to="/history" className="inline-block py-2 text-sm font-semibold text-brand">
              Вся история
            </Link>
          </li>
        </ul>
      ) : null}

      {tab === "orders" ? (
        <ul className="mt-4 space-y-2">
          {myOrders.length === 0 ? <li className="text-sm text-muted">Покупок пока нет.</li> : null}
          {myOrders.map((order) => (
            <li key={order.id} className="rounded-lg bg-card px-4 py-3 text-sm">
              <span className="font-semibold">{order.items.map((item) => item.title).join(", ")}</span>
              <span className="mt-1 block text-xs text-muted">
                {orderStatusLabel(order.status)} · {formatPoints(order.total)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "badges" ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map((badge) => (
            <li key={badge.title} className="rounded-lg bg-card p-4">
              <Star className={`size-6 ${badge.on ? "fill-brand text-brand" : "text-brand-soft"}`} />
              <p className="mt-3 font-semibold">{badge.title}</p>
              <p className="mt-1 text-xs text-muted">{badge.on ? "Открыто" : badge.hint}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </Shell>
  );
}
