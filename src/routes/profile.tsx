import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Field, Panel, TextInput } from "@/components/ui";
import { formatDateTime, formatNumber, formatPoints, initials } from "@/lib/format";
import { ENTRY_LABEL, orderStatusLabel, ROLE_LABEL } from "@/lib/labels";
import { hasWorkBalance, useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const reward = useStore((state) => state.rewardBalance);
  const people = useStore((state) => state.people);
  const ledger = useStore((state) => state.ledger);
  const orders = useStore((state) => state.orders);
  const achievements = useStore((state) => state.activitiesCatalog.achievements);
  const achievementsStatus = useStore((state) => state.activitiesCatalog.status);
  const loadActivities = useStore((state) => state.loadActivities);
  const [tab, setTab] = useState<"history" | "orders" | "badges">("history");
  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);
  if (!user) return null;

  const mine = ledger.filter((entry) => entry.userId === user.id);
  const myOrders = orders.filter((order) => order.userId === user.id);

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
        {hasWorkBalance(user.role) ? (
          <p className="mt-3 text-sm">
            Рабочий баланс (поощрения):{" "}
            <span className="font-semibold">{reward == null ? "нет доступа" : formatNumber(reward)}</span>
          </p>
        ) : null}
        <p className="mt-1 text-sm text-muted">В рейтинге: {formatNumber(user.score)} благодарностей</p>
      </Panel>

      <PasswordCard />

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
          {achievementsStatus === "loading" && achievements.length === 0 ? (
            <li className="text-sm text-muted">Загружаем достижения.</li>
          ) : null}
          {achievementsStatus !== "loading" && achievements.length === 0 ? (
            <li className="text-sm text-muted">Достижений пока нет.</li>
          ) : null}
          {achievements.map((badge) => (
            <li key={badge.id} className="rounded-lg bg-card p-4">
              <Star className={`size-6 ${badge.earned ? "fill-brand text-brand" : "text-brand-soft"}`} />
              <p className="mt-3 font-semibold">{badge.name}</p>
              <p className="mt-1 text-xs text-muted">
                {badge.earned ? "Открыто" : badge.description}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </Shell>
  );
}

function PasswordCard() {
  const changePassword = useStore((state) => state.changePassword);
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <Panel className="mt-4">
      <h2 className="text-lg font-bold">Пароль</h2>
      <form
        className="mt-3 grid gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (password !== again) {
            toast.error("Пароли не совпадают");
            return;
          }
          setPending(true);
          void changePassword(password).then((result) => {
            setPending(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Пароль изменён");
              setPassword("");
              setAgain("");
            }
          });
        }}
      >
        <Field label="Новый пароль">
          <TextInput type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <Field label="Ещё раз">
          <TextInput type="password" autoComplete="new-password" value={again} onChange={(event) => setAgain(event.target.value)} />
        </Field>
        <Button type="submit" disabled={pending} className="sm:col-span-2 sm:w-auto">
          Сменить пароль
        </Button>
      </form>
    </Panel>
  );
}
