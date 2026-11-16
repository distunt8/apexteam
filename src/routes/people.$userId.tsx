import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AchievementMark } from "@/components/achievement-mark";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { apex } from "@/lib/apex";
import { formatDateTime, formatNumber } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/people/$userId")({ component: PersonPage });

function PersonPage() {
  const { userId } = Route.useParams();
  const person = useStore((state) => state.people.find((item) => item.id === userId));
  const me = useStore((state) => state.currentUserId);
  const board = useStore((state) => state.leaderboard);
  const kind = useStore((state) => state.leaderboardKind);
  const feed = useStore((state) => state.feed);
  const [badges, setBadges] = useState<{ id: string; name: string; iconUrl: string }[]>([]);
  useEffect(() => {
    void apex(`/api/achievements/users/${userId}`)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items;
        if (!Array.isArray(list)) return;
        setBadges(
          list.map((item) => {
            const record = item as { achievement?: { id?: unknown; name?: unknown; iconUrl?: unknown }; id?: unknown };
            const achievement = record.achievement ?? record;
            return {
              id: String((achievement as { id?: unknown }).id ?? record.id ?? ""),
              name: String((achievement as { name?: unknown }).name ?? "Достижение"),
              iconUrl: String((achievement as { iconUrl?: unknown }).iconUrl ?? ""),
            };
          }),
        );
      })
      .catch(() => setBadges([]));
  }, [userId]);
  const thanks = feed.filter((item) => item.toId === userId);
  const score = board.find((item) => item.id === userId)?.score ?? person?.score ?? 0;

  return (
    <Shell>
      {!person ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Сотрудник не найден</h1>
          <Link to="/colleagues" className="mt-4 inline-block text-sm font-semibold text-brand">
            К коллегам
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
          <Panel className="mt-5">
            <div className="flex items-center gap-4">
              <UserAvatar user={person} className="size-16 text-lg" />
              <div>
                <p className="text-xl font-bold">{person.name}</p>
                <p className="text-sm text-muted">{person.position || "Должность не указана"}</p>
                <p className="text-sm text-muted">
                  {person.department || "Отдел не указан"} · {person.roleTitle || ROLE_LABEL[person.role]}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              {kind === "activity" ? "Апексы за активности" : "Благодарности в рейтинге"}: <span className="font-semibold">{formatNumber(score)}</span>
            </p>
            {person.status !== "active" ? <p className="mt-2 text-sm text-muted">Аккаунт заблокирован</p> : null}
            {person.id === me ? (
              <Link to="/profile" className="mt-4 inline-block text-sm font-semibold text-brand">
                Открыть свой профиль
              </Link>
            ) : (
              <Link to="/colleagues" className="mt-4 inline-block text-sm font-semibold text-brand">
                Поблагодарить в списке коллег
              </Link>
            )}
          </Panel>
          <Panel className="mt-4">
            <h2 className="font-bold">Полученные благодарности</h2>
            {thanks.length === 0 ? <p className="mt-2 text-sm text-muted">В вашей ленте таких благодарностей нет.</p> : null}
            <ul className="mt-3 space-y-2">
              {thanks.slice(0, 8).map((item) => (
                <li key={item.id} className="text-sm">
                  <span className="font-medium">{item.fromName || "Коллега"}</span>
                  {item.message ? <span className="text-muted"> — {item.message}</span> : null}
                  <span className="mt-1 block text-xs text-muted">{item.createdAt ? formatDateTime(item.createdAt) : ""}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="mt-4">
            <h2 className="font-bold">Достижения</h2>
            {badges.length === 0 ? <p className="mt-2 text-sm text-muted">Пока нет открытых достижений.</p> : null}
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {badges.map((badge) => (
                <li key={badge.id} className="rounded-lg bg-card p-3 text-center">
                  <AchievementMark iconUrl={badge.iconUrl} className="mx-auto" />
                  <p className="mt-2 text-xs">{badge.name}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </Shell>
  );
}
