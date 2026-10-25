import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Button, Panel } from "@/components/ui";
import { firstName, formatNumber, formatPoints } from "@/lib/format";
import { hasWorkBalance, useStore, type FeedItem, type Person, type Product } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const people = useStore((state) => state.people);
  const feed = useStore((state) => state.feed);
  const products = useStore((state) => state.products);
  const leaderboard = useStore((state) => state.leaderboard);
  const catalog = useStore((state) => state.activitiesCatalog);
  const loadActivities = useStore((state) => state.loadActivities);
  const [helloPart, setHelloPart] = useState("Добрый день");

  useEffect(() => {
    const hour = new Date().getHours();
    setHelloPart(hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер");
  }, []);

  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);

  if (!user) return null;

  const board =
    leaderboard.length > 0
      ? leaderboard
      : [...people]
          .filter((person) => person.status === "active")
          .sort((a, b) => b.score - a.score)
          .map((person) => ({ id: person.id, name: person.name, score: person.score }));
  const popular = products.filter((product) => product.active && product.popular);
  const activities = [
    ...catalog.quests.map((item) => ({
      id: `quest-${item.id}`,
      title: item.title,
      prize: item.reward > 0 ? formatPoints(item.reward) : "Квест",
    })),
    ...catalog.surveys.map((item) => ({
      id: `survey-${item.id}`,
      title: item.title,
      prize: "Опрос",
    })),
    ...catalog.events.map((item) => ({
      id: `event-${item.id}`,
      title: item.title,
      prize: item.reward > 0 ? formatPoints(item.reward) : "Мероприятие",
    })),
  ];

  return (
    <Shell mode="top">
      <h1 className="text-[1.75rem] font-bold tracking-tight" suppressHydrationWarning>
        {helloPart}, {firstName(user.name)}!
      </h1>
      <p className="mt-2 text-sm text-muted">Спасибо, что делаете нашу компанию лучше каждый день.</p>

      <div className="mt-6 hidden items-start gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <Leaderboard board={board} />
        <BalanceCard user={user} />
        <div className="min-w-0 space-y-4">
          <ActivitiesPreview items={activities} loading={catalog.status === "loading" || catalog.status === "idle"} />
          <Feed people={people} feed={feed} />
        </div>
        <Popular products={popular} />
      </div>

      <div className="mt-6 space-y-4 lg:hidden">
        <BalanceCard user={user} />
        <ActivitiesPreview items={activities} loading={catalog.status === "loading" || catalog.status === "idle"} scroll />
        <Achievements items={catalog.achievements} />
        <Leaderboard board={board} />
        <Feed people={people} feed={feed} />
        <Popular products={popular} />
      </div>
    </Shell>
  );
}

function Leaderboard({ board }: { board: { id: string; name: string; score: number }[] }) {
  return (
    <Panel>
      <h2 className="text-xl font-bold">Лидерборд</h2>
      <p className="mt-1 text-sm text-muted">Топ по числу благодарностей</p>
      {board.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Пока пусто.</p>
      ) : (
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {board.map((person, index) => (
            <li key={person.id} className="flex min-w-0 items-center gap-3 rounded-lg bg-surface px-3 py-2.5">
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                  index < 3 ? "bg-brand text-white" : "bg-brand-wash text-brand-deep"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">{person.name}</span>
              <span className="tabular shrink-0 text-sm font-semibold">{formatNumber(person.score)}</span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

function BalanceCard({ user }: { user: Person }) {
  const reward = useStore((state) => state.rewardBalance);
  const showWork = hasWorkBalance(user.role);
  return (
    <Panel>
      <h2 className="text-lg font-bold">{showWork ? "Балансы" : "Ваш баланс"}</h2>
      {showWork ? <p className="mt-3 text-xs text-muted">Личный</p> : null}
      <p className={`${showWork ? "" : "mt-3"} text-3xl font-bold text-brand`}>{formatPoints(user.balance)}</p>
      {showWork ? (
        <>
          <p className="mt-3 text-xs text-muted">Рабочий · поощрения</p>
          <p className="text-xl font-bold">{reward == null ? "нет доступа" : formatPoints(reward)}</p>
        </>
      ) : null}
      <Link to="/catalog" className="mt-5 block">
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
  items: { id: string; title: string; prize: string }[];
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
            <Link key={item.id} to="/activities" className={`rounded-lg bg-card p-4 ${scroll ? "w-56 shrink-0" : ""}`}>
              <p className="font-bold">{item.title}</p>
              <p className="mt-8 text-sm text-brand">{item.prize}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Achievements({ items }: { items: { id: string; name: string; earned: boolean }[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold">Достижения</h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {items.map((item) => (
          <Link key={item.id} to="/activities" className="rounded-lg bg-card px-2 py-4 text-center">
            <Star className={`mx-auto size-6 ${item.earned ? "fill-brand text-brand" : "text-brand-soft"}`} />
            <p className="mt-2 text-xs leading-tight">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Feed({ people, feed }: { people: Person[]; feed: FeedItem[] }) {
  return (
    <section className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold">Лента благодарностей</h2>
        <Link to="/colleagues" className="shrink-0 text-sm font-semibold text-brand">
          Поблагодарить
        </Link>
      </div>
      <ul className="mt-3 space-y-2">
        {feed.length === 0 ? <li className="text-sm text-muted">Пока нет благодарностей с вашим участием.</li> : null}
        {feed.slice(0, 5).map((item) => {
          const from = people.find((person) => person.id === item.fromId);
          const to = people.find((person) => person.id === item.toId);
          return (
            <li key={item.id} className="rounded-lg bg-card px-4 py-3 text-sm">
              <span className="font-semibold">{from?.name || item.fromName || "Сотрудник"}</span>
              <span className="text-muted"> → {to?.name || item.toName || "Сотрудник"}</span>
              <span> — {item.message}</span>
              {item.kind === "manager" ? (
                <span className="ml-2 text-xs font-semibold text-brand">поощрение</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
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

