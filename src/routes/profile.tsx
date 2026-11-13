import { createFileRoute } from "@tanstack/react-router";
import { AvatarEditor } from "@/components/user-avatar";
import { Gem, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Field, Panel, TextInput } from "@/components/ui";
import { formatDateTime, formatNumber, formatPoints } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { hasWorkBalance, useStore } from "@/lib/store";
import { useTheme, type ThemeChoice } from "@/lib/theme";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const reward = useStore((state) => state.rewardBalance);
  const people = useStore((state) => state.people);
  const feed = useStore((state) => state.feed);
  const achievements = useStore((state) => state.activitiesCatalog.achievements);
  const achievementsStatus = useStore((state) => state.activitiesCatalog.status);
  const loadActivities = useStore((state) => state.loadActivities);
  const [tab, setTab] = useState<"thanks" | "badges">("thanks");
  const [passwordOpen, setPasswordOpen] = useState(false);
  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);
  if (!user) return null;

  const received = feed.filter((item) => item.toId === user.id);
  const sent = feed.filter((item) => item.fromId === user.id);

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
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

      <ThemeSwitch />

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

      <Button variant="line" className="mt-4" onClick={() => setPasswordOpen((value) => !value)}>
        {passwordOpen ? "Скрыть смену пароля" : "Сменить пароль"}
      </Button>
      {passwordOpen ? <PasswordCard /> : null}

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
            className={`min-h-11 rounded-md px-3 text-sm font-semibold ${
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
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      {items.length === 0 ? <p className="mt-3 text-sm text-muted">{empty}</p> : null}
      <ul className="mt-3 space-y-2">
        {items.map((item) => {
          const personId = side === "from" ? item.fromId : item.toId;
          const person = people.find((entry) => entry.id === personId);
          const name = person?.name || (side === "from" ? item.fromName : item.toName) || "Коллега";
          return (
            <li key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-card px-4 py-3">
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
    </section>
  );
}

function ThemeSwitch() {
  const { choice, setChoice } = useTheme();
  const options: { id: ThemeChoice; label: string }[] = [
    { id: "system", label: "Как в системе" },
    { id: "light", label: "Светлая" },
    { id: "dark", label: "Тёмная" },
  ];
  return (
    <div className="mt-5">
      <p className="text-sm font-medium">Тема</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setChoice(option.id)}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold ${
              choice === option.id ? "bg-brand text-white" : "bg-card text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PasswordCard() {
  const changePassword = useStore((state) => state.changePassword);
  const [current, setCurrent] = useState("");
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
          if (password.length < 6) {
            toast.error("Пароль должен быть не короче 6 символов");
            return;
          }
          if (password === current) {
            toast.error("Новый пароль совпадает с текущим");
            return;
          }
          if (password !== again) {
            toast.error("Пароли не совпадают");
            return;
          }
          setPending(true);
          void changePassword(password, current).then((result) => {
            setPending(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Пароль изменён");
              setCurrent("");
              setPassword("");
              setAgain("");
            }
          });
        }}
      >
        <Field label="Текущий пароль">
          <TextInput type="password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} required />
        </Field>
        <Field label="Новый пароль">
          <TextInput type="password" autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
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
