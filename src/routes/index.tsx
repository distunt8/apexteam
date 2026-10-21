import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, LifeBuoy, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Button, Panel } from "@/components/ui";
import { firstName, formatNumber, formatPoints } from "@/lib/format";
import { useStore, type FeedItem, type Person, type Product } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const people = useStore((state) => state.people);
  const feed = useStore((state) => state.feed);
  const products = useStore((state) => state.products);
  const progress = useStore((state) => state.progress);
  const orders = useStore((state) => state.orders);
  const leaderboard = useStore((state) => state.leaderboard);
  const warnings = useStore((state) => state.apiWarnings);
  const [helloPart, setHelloPart] = useState("Добрый день");

  useEffect(() => {
    const hour = new Date().getHours();
    setHelloPart(hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер");
  }, []);

  if (!user) return null;

  const board =
    leaderboard.length > 0
      ? leaderboard
      : [...people]
          .filter((person) => person.status === "active")
          .sort((a, b) => b.score - a.score)
          .map((person) => ({ id: person.id, name: person.name, score: person.score }));
  const popular = products.filter((product) => product.active && product.popular);
  const challenges = [
    { title: "7 дней активности", prize: "Приз: 300 баллов", to: "/activities" as const },
    { title: "Команда в движении", prize: "Приз: 500 баллов", to: "/activities" as const },
    { title: "Неделя благодарностей", prize: "Приз: 200 баллов", to: "/colleagues" as const },
  ];
  const unlocked = new Set<string>();
  if (orders.some((order) => order.userId === user.id && order.status !== "cancelled")) unlocked.add("Покупка");
  if (feed.some((item) => item.fromId === user.id)) unlocked.add("Благодарность");
  const streak = progress.find((item) => item.userId === user.id && item.activityId === "act-streak");
  if ((streak?.value ?? 0) >= 7) unlocked.add("Серия");
  const badges = [
    { id: "Серия", title: "7 дней" },
    { id: "Благодарность", title: "Благодарность" },
    { id: "Покупка", title: "Первая награда" },
  ];

  return (
    <Shell mode="top">
      <h1 className="text-[1.75rem] font-bold tracking-tight" suppressHydrationWarning>
        {helloPart}, {firstName(user.name)}!
      </h1>
      <p className="mt-2 text-sm text-muted">Спасибо, что делаете нашу компанию лучше каждый день.</p>
      {warnings.length > 0 ? (
        <details className="mt-4 rounded-lg bg-card px-4 py-3 text-sm">
          <summary className="cursor-pointer font-semibold">Сервер отдал часть данных не так, как ждёт экран</summary>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-muted">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </details>
      ) : null}
      <Link
        to="/support"
        className="mt-4 flex min-h-12 items-center gap-3 rounded-xl bg-card px-4 py-3 lg:hidden"
      >
        <LifeBuoy className="size-5 shrink-0 text-brand" />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">Поддержка</span>
          <span className="block text-xs text-muted">Вопрос по заказу, баллам или доступу</span>
        </span>
      </Link>

      <div className="mt-6 hidden items-start gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <Leaderboard board={board} />
        <BalanceCard user={user} />
        <div className="min-w-0 space-y-4">
          <Challenges items={challenges} />
          <Feed people={people} feed={feed} />
        </div>
        <Popular products={popular} />
      </div>

      <div className="mt-6 space-y-4 lg:hidden">
        <BalanceCard user={user} />
        <Challenges items={challenges} scroll />
        <Badges badges={badges} unlocked={unlocked} />
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
      <p className="mt-1 text-sm text-muted">По данным сервера</p>
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
  return (
    <Panel>
      <h2 className="text-lg font-bold">Балансы</h2>
      <p className="mt-3 text-xs text-muted">Личный</p>
      <p className="text-3xl font-bold text-brand">{formatPoints(user.balance)}</p>
      <p className="mt-3 text-xs text-muted">Рабочий · поощрения</p>
      <p className="text-xl font-bold">{reward == null ? "нет доступа" : formatPoints(reward)}</p>
      <Link to="/catalog" className="mt-5 block">
        <Button className="w-full">В магазин за призами</Button>
      </Link>
    </Panel>
  );
}

function Challenges({
  items,
  scroll = false,
}: {
  items: { title: string; prize: string; to: "/activities" | "/colleagues" }[];
  scroll?: boolean;
}) {
  return (
    <section className="min-w-0">
      <h2 className="text-xl font-bold">Активные вызовы</h2>
      <div className={scroll ? "mt-3 flex gap-3 overflow-x-auto pb-1" : "mt-3 grid grid-cols-3 gap-3"}>
        {items.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className={`rounded-lg bg-card p-4 ${scroll ? "w-56 shrink-0" : ""}`}
          >
            <p className="font-bold">{item.title}</p>
            <p className="mt-8 text-sm text-brand">{item.prize}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Badges({
  badges,
  unlocked,
}: {
  badges: { id: string; title: string }[];
  unlocked: Set<string>;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold">Достижения</h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {badges.map((badge) => {
          const on = unlocked.has(badge.id);
          return (
            <div key={badge.id} className="rounded-lg bg-card px-2 py-4 text-center">
              <Star className={`mx-auto size-6 ${on ? "fill-brand text-brand" : "text-brand-soft"}`} />
              <p className="mt-2 text-xs leading-tight">{badge.title}</p>
            </div>
          );
        })}
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

