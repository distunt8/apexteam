import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { AchievementMark } from "@/components/achievement-mark";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { AvatarEditor } from "@/components/user-avatar";
import { formatDateTime, formatNumber, formatPoints } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { hasWorkBalance, useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const reward = useStore((state) => state.rewardBalance);
  const people = useStore((state) => state.people);
  const feed = useStore((state) => state.feed);
  const achievements = useStore((state) => state.activitiesCatalog.achievements);
  const achievementsStatus = useStore((state) => state.activitiesCatalog.status);
  const loadActivities = useStore((state) => state.loadActivities);
  const kind = useStore((state) => state.leaderboardKind);
  const [tab, setTab] = useState<"thanks" | "badges">("thanks");
  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);
  if (!user) return null;

  const received = feed.filter((item) => item.toId === user.id);
  const sent = feed.filter((item) => item.fromId === user.id);

  return (
    <Shell mode="shop">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
        <Link to="/settings" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-brand hover:bg-brand-wash">
          <Settings className="size-4" />
          Настройки
        </Link>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <AvatarEditor user={user} />
        <div className="min-w-0">
          <p className="text-xl font-bold">{user.name}</p>
          <p className="text-sm text-muted">{user.position}</p>
          <p className="text-sm text-muted">
            {user.department} · {user.roleTitle || ROLE_LABEL[user.role]}
          </p>
        </div>
      </div>

      <Panel className="mt-5 bg-gradient-to-br from-brand-wash via-surface to-card">
        <p className="text-sm text-muted">Текущий баланс</p>
        <p className="mt-1 text-4xl font-bold text-brand">{formatPoints(user.balance)}</p>
        {hasWorkBalance(user.role) ? (
          <p className="mt-3 text-sm">
            Рабочий баланс (поощрения):{" "}
            <span className="font-semibold">{reward == null ? "нет доступа" : formatNumber(reward)}</span>
          </p>
        ) : null}
        <p className="mt-1 text-sm text-muted">
          {kind === "activity" ? "Апексы за активности" : "В рейтинге благодарностей"}: {formatNumber(user.score)}
        </p>
      </Panel>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist">
        {(
          [
            ["thanks", "Благодарности"],
            ["badges", "Достижения"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
              tab === id ? "bg-brand text-white" : "bg-card text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "thanks" ? (
        <div className="mt-4 space-y-5">
          <ThanksBlock title="Полученные" empty="Вас пока никто не благодарил" items={received} people={people} side="from" />
          <ThanksBlock title="Отправленные" empty="Вы ещё никого не благодарили" items={sent} people={people} side="to" />
        </div>
      ) : null}

      {tab === "badges" ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {achievementsStatus === "loading" && achievements.length === 0 ? (
            <li className="text-sm text-muted">Загружаем достижения.</li>
          ) : null}
          {achievementsStatus !== "loading" && achievements.length === 0 ? (
            <li className="text-sm text-muted">Достижений пока нет.</li>
          ) : null}
          {achievements.map((badge) => (
            <li key={badge.id} className="rounded-xl bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <AchievementMark iconUrl={badge.iconUrl} earned={badge.earned} />
              <p className="mt-3 font-semibold">{badge.name}</p>
              <p className="mt-1 text-xs text-muted">{badge.earned ? "Открыто" : badge.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </Shell>
  );
}

function ThanksBlock({
  title,
  empty,
  items,
  people,
  side,
}: {
  title: string;
  empty: string;
  items: { id: string; fromId: string; toId: string; fromName?: string; toName?: string; amount: number; message: string; kind: string; createdAt: string }[];
  people: { id: string; name: string }[];
  side: "from" | "to";
}) {
  const page = usePage(items, 5, title);
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      {items.length === 0 ? <p className="mt-3 text-sm text-muted">{empty}</p> : null}
      <ul className="mt-3 space-y-2">
        {page.items.map((item) => {
          const personId = side === "from" ? item.fromId : item.toId;
          const person = people.find((entry) => entry.id === personId);
          const name = person?.name || (side === "from" ? item.fromName : item.toName) || "Коллега";
          return (
            <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 shadow-sm transition hover:bg-brand-wash">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name}</p>
                {item.message ? <p className="mt-1 text-sm">{item.message}</p> : null}
                <p className="mt-1 text-xs text-muted">
                  {item.createdAt ? formatDateTime(item.createdAt) : ""}
                  {item.kind === "manager" ? " · поощрение" : ""}
                </p>
              </div>
              {item.amount > 0 ? (
                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand">
                  <Gem className="size-4" />
                  {formatNumber(item.amount)}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
    </section>
  );
}
