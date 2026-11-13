import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Button, TextArea, TextInput } from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { formatNumber, pointsLabel } from "@/lib/format";
import { awardAmounts, hasWorkBalance, PEER_THANKS_AMOUNT, useStore } from "@/lib/store";

export const Route = createFileRoute("/colleagues")({ component: ColleaguesPage });

function ColleaguesPage() {
  const people = useStore((state) => state.people);
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const send = useStore((state) => state.sendRecognition);
  const reward = useStore((state) => state.rewardBalance);
  const feed = useStore((state) => state.feed);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [asManager, setAsManager] = useState(false);
  const [pending, setPending] = useState(false);

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return people.filter((person) => {
      if (person.status !== "active") return false;
      if (!needle) return true;
      return `${person.name} ${person.position} ${person.department}`.toLowerCase().includes(needle);
    });
  }, [people, query]);
  const page = usePage(list, 8, query);

  if (!user) return null;
  const amounts = awardAmounts(user.role);
  const target = people.find((person) => person.id === selected);
  const canReward = hasWorkBalance(user.role);
  const thanked = Boolean(
    target &&
      feed.some(
        (item) =>
          item.fromId === user.id &&
          item.toId === target.id &&
          item.kind !== "manager" &&
          Date.parse(item.createdAt) >= Date.now() - 7 * 24 * 60 * 60 * 1000,
      ),
  );

  function submit() {
    if (!selected) {
      toast.error("Выберите коллегу");
      return;
    }
    if (asManager && amount == null) {
      toast.error("Выберите сумму поощрения");
      return;
    }
    setPending(true);
    void send({ toId: selected, amount: amount ?? 0, message, asManager: canReward && asManager }).then((result) => {
      setPending(false);
      if (!result.ok) toast.error(result.error);
      else {
        toast.success(asManager ? "Поощрение отправлено" : "Благодарность отправлена");
        setMessage("");
        setAmount(null);
      }
    });
  }

  return (
    <Shell mode="top">
      <h1 className="text-3xl font-bold tracking-tight">Коллеги</h1>
      <p className="mt-2 text-sm text-muted">
        Благодарность не списывает ваши апексы: коллега получает {PEER_THANKS_AMOUNT} {pointsLabel(PEER_THANKS_AMOUNT)}. Одному человеку — только раз в неделю.
        {canReward ? " Поощрение руководителя списывается с рабочего баланса." : ""}
      </p>
      <p className="mt-2 text-sm">
        Личный баланс: <span className="font-semibold text-brand">{formatNumber(user.balance)}</span>
        {canReward && asManager ? (
          <span className="text-muted"> · рабочий: {reward == null ? "нет доступа" : formatNumber(reward)}</span>
        ) : null}
      </p>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по коллегам"
              aria-label="Поиск по коллегам"
              className="pl-9"
            />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-wide text-muted">КОЛЛЕГИ</p>
          <ul className="mt-2 space-y-2">
            {page.items.map((person) => {
              const self = person.id === user.id;
              const on = person.id === selected;
              return (
                <li key={person.id} className={`rounded-lg px-3 py-3 ${on ? "bg-brand-wash" : "bg-card"}`}>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={person} className="size-11" />
                    <span className="min-w-0 flex-1">
                      <Link to="/people/$userId" params={{ userId: person.id }} className="block truncate font-semibold hover:text-brand">
                        {person.name}
                      </Link>
                      <span className="block truncate text-xs text-muted">{person.position}</span>
                    </span>
                    <button
                      type="button"
                      disabled={self}
                      onClick={() => setSelected(person.id)}
                      className="text-sm font-medium text-brand disabled:opacity-50"
                    >
                      {self ? "Это вы" : on ? "Выбран" : "Спасибо"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
        </div>

        <form
          className="rounded-xl bg-card p-4 lg:sticky lg:top-20"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <h2 className="text-lg font-bold">{asManager ? "Поощрение с рабочего баланса" : "Личная благодарность"}</h2>
          <p className="mt-2 text-sm text-muted">
            {target ? `Кому: ${target.name}` : "Сначала выберите коллегу слева"}
          </p>
          {canReward ? (
            <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={asManager} onChange={(event) => setAsManager(event.target.checked)} />
              Поощрение с рабочего баланса
            </label>
          ) : null}
          {asManager ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {amounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={`min-h-11 min-w-14 rounded-md px-3 text-sm font-bold ${
                    amount === value ? "bg-brand text-white" : "bg-surface text-ink"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">
              {thanked ? "Этому коллеге на этой неделе уже отправлена благодарность." : `Коллега получит ${PEER_THANKS_AMOUNT} ${pointsLabel(PEER_THANKS_AMOUNT)}.`}
            </p>
          )}
          <label className="mt-4 block text-sm font-medium">
            Сообщение (необязательно)
            <TextArea
              value={message}
              maxLength={120}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Напишите несколько слов благодарности"
              className="mt-2"
            />
          </label>
          <p className="text-right text-xs text-muted">{message.length}/120</p>
          <Button type="submit" className="mt-3 w-full" disabled={!target || pending || (asManager ? amount == null : thanked)}>
            Отправить
          </Button>
        </form>
      </div>
    </Shell>
  );
}
