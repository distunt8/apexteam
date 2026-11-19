import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Gem, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { AchievementMark } from "@/components/achievement-mark";
import { ActivityLevelCard } from "@/components/activity-level";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { AvatarEditor } from "@/components/user-avatar";
import { apex, readThanks } from "@/lib/apex";
import { formatDateTime, formatNumber, formatPoints } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { hasWorkBalance, useStore, type FeedItem } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  validateSearch: (search: Record<string, unknown>): { tab?: ProfileTab } => {
    const tab = search.tab;
    return tab === "thanks" || tab === "activity" || tab === "badges" ? { tab } : {};
  },
  component: ProfilePage,
});

type ProfileTab = "thanks" | "activity" | "badges";

function ProfilePage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const reward = useStore((state) => state.rewardBalance);
  const people = useStore((state) => state.people);
  const feed = useStore((state) => state.feed);
  const achievements = useStore((state) => state.activitiesCatalog.achievements);
  const achievementsStatus = useStore((state) => state.activitiesCatalog.status);
  const catalog = useStore((state) => state.activitiesCatalog);
  const loadActivities = useStore((state) => state.loadActivities);
  const loadEngagement = useStore((state) => state.loadEngagement);
  const userId = useStore((state) => state.currentUserId);
  const search = Route.useSearch();
  const navigate = useNavigate();
  const tab = search.tab ?? "thanks";
  const [received, setReceived] = useState<FeedItem[]>([]);
  useEffect(() => {
    void loadActivities();
    void loadEngagement();
  }, [loadActivities, loadEngagement]);
  useEffect(() => {
    if (!userId) return;
    void apex(`/api/thanks/received/${userId}`)
      .then((data) => setReceived(readThanks(data)))
      .catch(() => setReceived([]));
  }, [userId]);
  if (!user) return null;

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
      <div className="mt-4">
        <div className="flex min-w-0 items-start gap-4">
          <AvatarEditor user={user} />
          <div className="min-w-0 pt-1">
            <p className="text-3xl font-bold">{user.name}</p>
            <p className="mt-1 text-base text-muted">{user.position}</p>
            <p className="text-sm text-muted">
              {user.department} · {user.roleTitle || ROLE_LABEL[user.role]}
            </p>
          </div>
        </div>
        <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2">
          <Panel className="h-full">
            <p className="text-xs text-muted">Баланс</p>
            <p className="text-xl font-bold text-brand">{formatPoints(user.balance)}</p>
            {hasWorkBalance(user.role) ? (
              <p className="mt-1 text-sm text-muted">Рабочий: {reward == null ? "нет доступа" : formatNumber(reward)}</p>
            ) : null}
          </Panel>
          <ActivityLevelCard link={false} />
        </div>
      </div>

      <div className="mt-5 min-w-0">
        <div className="flex flex-wrap gap-2" role="tablist">
        {(
          [
            ["thanks", "Благодарности"],
            ["activity", "Активность"],
            ["badges", "Достижения"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => void navigate({ to: "/profile", search: { tab: id } })}
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

      {tab === "activity" ? <Participation catalog={catalog} status={achievementsStatus} /> : null}

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
      </div>
    </Shell>
  );
}

function Participation({
  catalog,
  status,
}: {
  catalog: {
    quests: { id: string; title: string; status: string; reward: number }[];
    surveys: { id: string; title: string; hasResponded: boolean; reward: number }[];
    events: { id: string; title: string; status: string }[];
  };
  status: string;
}) {
  const quests = catalog.quests.filter((item) => item.status === "in_progress" || item.status === "completed");
  const surveys = catalog.surveys.filter((item) => item.hasResponded);
  const events = catalog.events.filter((item) => item.status === "registered" || item.status === "attended");
  if (status === "loading" && quests.length + surveys.length + events.length === 0) {
    return <p className="mt-4 text-sm text-muted">Загружаем активность.</p>;
  }
  return (
    <div className="mt-4 space-y-5">
      <ParticipationBlock
        title="Квесты"
        empty="Вы ещё не вступали в квесты"
        items={quests.map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.status === "completed" ? "Завершён" : "В процессе",
          extra: item.reward > 0 ? formatPoints(item.reward) : "",
          search: { kind: "quest" as const, focus: `quest-${item.id}` },
        }))}
      />
      <ParticipationBlock
        title="Опросы"
        empty="Ответов пока нет"
        items={surveys.map((item) => ({
          id: item.id,
          title: item.title,
          meta: "Ответ отправлен",
          extra: item.reward > 0 ? formatPoints(item.reward) : "",
          search: { kind: "survey" as const, focus: `survey-${item.id}` },
        }))}
      />
      <ParticipationBlock
        title="Мероприятия"
        empty="Записей пока нет"
        items={events.map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.status === "attended" ? "Посещение подтверждено" : "Вы записаны",
          extra: "",
          search: { kind: "event" as const, focus: `event-${item.id}` },
        }))}
      />
    </div>
  );
}

function ParticipationBlock({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { id: string; title: string; meta: string; extra: string; search: { kind: "quest" | "survey" | "event"; focus: string } }[];
}) {
  const page = usePage(items, 5, title);
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      {items.length === 0 ? <p className="mt-3 text-sm text-muted">{empty}</p> : (
        <ul className="mt-3 space-y-2">
          {page.items.map((item) => (
            <li key={item.id}>
              <Link
                to="/activities"
                search={item.search}
                className="block rounded-xl bg-card px-4 py-3 shadow-sm transition hover:bg-brand-wash"
              >
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {item.meta}
                  {item.extra ? ` · ${item.extra}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
    </section>
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
          const name = person?.name || (side === "from" ? item.fromName : item.toName) || "Сотрудник";
          const shown = /^[0-9a-f-]{36}$/i.test(name) ? "Сотрудник" : name;
          return (
            <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 shadow-sm transition hover:bg-brand-wash">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{shown}</p>
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
