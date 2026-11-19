import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem } from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityLevelCard } from "@/components/activity-level";
import { AchievementMark } from "@/components/achievement-mark";
import { UserAvatar } from "@/components/user-avatar";
import { Shell } from "@/components/shell";
import { Button, Panel } from "@/components/ui";
import { firstName, formatNumber, formatPoints } from "@/lib/format";
import { hasWorkBalance, useStore, type FeedItem, type Person, type Product } from "@/lib/store";
import { apex } from "@/lib/apex";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const people = useStore((state) => state.people);
  const feed = useStore((state) => state.feed);
  const products = useStore((state) => state.products);
  const leaderboard = useStore((state) => state.leaderboard);
  const leaderboardKind = useStore((state) => state.leaderboardKind);
  const myLevel = useStore((state) => state.engagement?.title ?? "");
  const catalog = useStore((state) => state.activitiesCatalog);
  const loadActivities = useStore((state) => state.loadActivities);
  const loadEngagement = useStore((state) => state.loadEngagement);
  const [news, setNews] = useState<{ id: string; title: string; summary: string; imageUrl: string }[]>([]);

  useEffect(() => {
    void loadActivities();
    void loadEngagement();
    void apex("/api/company-news?page=1&pageSize=4")
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items;
        if (!Array.isArray(list)) return;
        setNews(
          list
            .map((item) => {
              const record = item as { id?: unknown; title?: unknown; summary?: unknown; imageUrl?: unknown };
              return {
                id: String(record.id ?? ""),
                title: String(record.title ?? ""),
                summary: String(record.summary ?? ""),
                imageUrl: coverFor(String(record.id ?? ""), typeof record.imageUrl === "string" ? record.imageUrl : ""),
              };
            })
            .filter((item) => item.id && item.title),
        );
      })
      .catch(() => undefined);
  }, [loadActivities, loadEngagement]);

  if (!user) return null;

  const board =
    leaderboard.length > 0
      ? leaderboard
      : [...people]
          .filter((person) => person.status === "active")
          .sort((a, b) => b.score - a.score)
          .map((person) => ({ id: person.id, name: person.name, score: person.score }));
  const top = board.slice(0, 5);
  const greet = user.firstName?.trim() || firstName(user.name);
  const popular = products.filter((product) => product.active && product.popular);
  const activities = [
    ...catalog.quests.map((item) => ({
      id: `quest-${item.id}`,
      kind: "quest" as const,
      title: item.title,
      prize: item.reward > 0 ? formatPoints(item.reward) : "Квест",
    })),
    ...catalog.surveys.map((item) => ({
      id: `survey-${item.id}`,
      kind: "survey" as const,
      title: item.title,
      prize: item.reward > 0 ? formatPoints(item.reward) : "Опрос",
    })),
    ...catalog.events.map((item) => ({
      id: `event-${item.id}`,
      kind: "event" as const,
      title: item.title,
      prize: item.reward > 0 ? formatPoints(item.reward) : "Мероприятие",
    })),
  ];

  return (
    <Shell mode="top">
      <h1 className="text-4xl font-bold">Здравствуйте, {greet}</h1>
      <p className="mt-3 max-w-xl text-base text-muted">Спасибо, что делаете нашу компанию лучше каждый день.</p>

      <div className="mt-10 hidden items-start gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-10">
          <Leaderboard board={top} full={board} people={people} currentId={user.id} mineLevel={myLevel} caption={leaderboardKind === "level" ? "Топ по уровню активности за 30 дней" : "Топ по благодарностям"} />
          {news.length > 0 ? <News items={news} /> : null}
          <Achievements items={catalog.achievements} />
          <ActivitiesPreview items={activities} loading={catalog.status === "loading" || catalog.status === "idle"} />
          <Feed people={people} feed={feed} />
        </div>
        <div className="min-w-0 space-y-6">
          <ActivityLevelCard />
          <BalanceCard user={user} />
          <Popular products={popular} />
        </div>
      </div>

      <div className="mt-8 space-y-8 lg:hidden">
        <ActivityLevelCard />
        <BalanceCard user={user} />
        <ActivitiesPreview items={activities} loading={catalog.status === "loading" || catalog.status === "idle"} scroll />
        <Leaderboard board={top} full={board} people={people} currentId={user.id} mineLevel={myLevel} caption={leaderboardKind === "level" ? "Топ по уровню активности за 30 дней" : "Топ по благодарностям"} />
        {news.length > 0 ? <News items={news} /> : null}
        <Achievements items={catalog.achievements} />
        <Feed people={people} feed={feed} />
        <Popular products={popular} />
      </div>
    </Shell>
  );
}

function Leaderboard({
  board,
  full,
  people,
  currentId,
  caption,
  mineLevel,
}: {
  board: { id: string; name: string; score: number }[];
  full: { id: string; name: string; score: number }[];
  people: Person[];
  currentId: string;
  caption: string;
  mineLevel?: string;
}) {
  const mineAt = full.findIndex((person) => person.id === currentId);
  const shown = mineAt >= 0 && mineAt < board.length;
  const me = people.find((person) => person.id === currentId);
  return (
    <Panel>
      <h2 className="text-xl font-bold">Лидерборд</h2>
      <p className="mt-1 text-sm text-muted">{caption}</p>
      {board.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Пока пусто.</p>
      ) : (
        <ol className="mt-5 space-y-1">
          {board.map((person, index) => (
            <LeaderRow
              key={person.id}
              person={person}
              place={index + 1}
              people={people}
              mine={person.id === currentId}
              level={person.id === currentId ? mineLevel : ""}
            />
          ))}
        </ol>
      )}
      {!shown && me ? (
        <div className="mt-3 border-t border-dashed border-line pt-3">
          <LeaderRow
            person={{ id: me.id, name: me.name, score: full[mineAt]?.score ?? me.score }}
            place={mineAt >= 0 ? mineAt + 1 : full.length + 1}
            people={people}
            mine
            level={mineLevel}
          />
        </div>
      ) : null}
    </Panel>
  );
}

function LeaderRow({
  person,
  place,
  people,
  mine,
  level,
}: {
  person: { id: string; name: string; score: number };
  place: number;
  people: Person[];
  mine: boolean;
  level?: string;
}) {
  const profile = people.find((item) => item.id === person.id);
  return (
    <Link
      to="/people/$userId"
      params={{ userId: person.id }}
      className={`flex min-w-0 items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-brand-wash ${mine ? "bg-brand-wash ring-1 ring-brand" : ""}`}
    >
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
          place <= 3 ? "bg-brand text-white" : "bg-brand-wash text-brand-deep"
        }`}
      >
        {place}
      </span>
      <UserAvatar user={{ name: person.name, avatarUrl: profile?.avatarUrl }} className="size-9" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{person.name}</span>
        {level ? <span className="mt-0.5 block text-xs font-medium text-brand">{level}</span> : null}
      </span>
      <span className="tabular shrink-0 text-sm font-semibold">{formatNumber(person.score)}</span>
    </Link>
  );
}

function BalanceCard({ user }: { user: Person }) {
  const reward = useStore((state) => state.rewardBalance);
  const showWork = hasWorkBalance(user.role);
  return (
    <Panel className="border-brand-soft bg-gradient-to-br from-brand-wash via-surface to-surface text-ink">
      <h2 className="text-lg font-bold">{showWork ? "Балансы" : "Ваш баланс"}</h2>
      {showWork ? <p className="mt-4 text-xs text-muted">Личный</p> : null}
      <p className={`${showWork ? "" : "mt-3"} text-3xl font-bold text-brand`}>{formatPoints(user.balance)}</p>
      {showWork ? (
        <>
          <p className="mt-4 text-xs text-muted">Рабочий · поощрения</p>
          <p className="text-xl font-bold">{reward == null ? "нет доступа" : formatPoints(reward)}</p>
        </>
      ) : null}
      <Link to="/catalog" className="mt-6 block">
        <Button className="w-full">В магазин за призами</Button>
      </Link>
    </Panel>
  );
}

function ActivitiesPreview({
  items,
  loading,
  scroll = false,
}: {
  items: { id: string; kind: "quest" | "survey" | "event"; title: string; prize: string }[];
  loading: boolean;
  scroll?: boolean;
}) {
  return (
    <section className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold">Активности</h2>
        <Link to="/activities" className="shrink-0 text-sm font-semibold text-brand">
          Все
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{loading ? "Загружаем." : "Пока нет активных заданий."}</p>
      ) : (
        <div className={scroll ? "mt-3 flex gap-3 overflow-x-auto pb-1" : "mt-3 grid grid-cols-3 gap-3"}>
          {items.map((item) => (
            <Link
              key={item.id}
              to="/activities"
              search={{ kind: item.kind, focus: item.id }}
              className={`rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-mid hover:shadow-md ${scroll ? "w-56 shrink-0" : ""}`}
            >
              <p className="font-bold">{item.title}</p>
              <p className="mt-8 text-sm text-brand">{item.prize}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Achievements({ items }: { items: { id: string; name: string; earned: boolean; iconUrl?: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold">Достижения</h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {items.map((item) => (
          <Link key={item.id} to="/activities" search={{ kind: "achievement", focus: `achievement-${item.id}` }} className="rounded-xl border border-line bg-surface px-2 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-mid hover:shadow-md">
            <AchievementMark iconUrl={item.iconUrl} earned={item.earned} className="mx-auto size-8" />
            <p className="mt-2 text-xs leading-tight">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function News({ items }: { items: { id: string; title: string; summary: string; imageUrl: string }[] }) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold">Новости</h2>
        <Link to="/news" className="shrink-0 text-sm font-semibold text-brand">
          Все
        </Link>
      </div>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link to="/news" search={{ id: item.id }} className="block overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-brand-mid hover:shadow-md">
              <img src={item.imageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold">{item.title}</p>
                {item.summary ? <p className="mt-1 text-sm text-muted">{item.summary}</p> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Feed({ people, feed }: { people: Person[]; feed: FeedItem[] }) {
  return (
    <section className="min-w-0 rounded-xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold">Лента благодарностей</h2>
        <Link to="/colleagues" className="shrink-0 text-sm font-semibold text-brand">
          Поблагодарить
        </Link>
      </div>
      <ul className="mt-4 divide-y divide-line">
        {feed.length === 0 ? <li className="text-sm text-muted">Пока нет благодарностей с вашим участием.</li> : null}
        {feed.slice(0, 5).map((item) => {
          const from = people.find((person) => person.id === item.fromId);
          const to = people.find((person) => person.id === item.toId);
          return (
            <li key={item.id} className="flex items-start gap-3 py-3 text-sm">
              <UserAvatar
                user={{ name: from?.name || item.fromName || "Сотрудник", avatarUrl: from?.avatarUrl }}
                className="size-8"
              />
              <p className="min-w-0">
              <span className="font-semibold">{from?.name || item.fromName || "Сотрудник"}</span>
              <span className="text-muted"> → {to?.name || item.toName || "Сотрудник"}</span>
              <span> — {item.message || "без сообщения"}</span>
              {item.amount > 0 ? <span className="font-semibold text-brand"> +{formatNumber(item.amount)}</span> : null}
              {item.kind === "manager" ? (
                <span className="ml-2 text-xs font-semibold text-brand">поощрение</span>
              ) : null}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function coverFor(id: string, imageUrl: string) {
  if (imageUrl.trim()) return imageUrl;
  const covers = ["/news/cover-1.jpg", "/news/cover-2.jpg", "/news/cover-3.jpg"];
  let hash = 0;
  for (const char of id) hash = (hash + char.charCodeAt(0)) % covers.length;
  return covers[hash] ?? covers[0];
}

function Popular({ products }: { products: Product[] }) {
  return (
    <Panel>
      <h2 className="text-lg font-bold">Магазин — популярное</h2>
      <ul className="mt-4 space-y-4">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-3">
            <img src={product.image} alt="" className="size-14 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.title}</p>
              <p className="text-sm text-muted">{formatPoints(product.price)}</p>
            </div>
            <Gem className="size-4 shrink-0 text-brand" />
          </li>
        ))}
      </ul>
      <Link to="/catalog" className="mt-5 inline-block text-sm font-semibold text-brand">
        Весь каталог
      </Link>
    </Panel>
  );
}

