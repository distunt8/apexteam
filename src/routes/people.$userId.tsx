import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AchievementMark } from "@/components/achievement-mark";
import { ActivityLevelCard } from "@/components/activity-level";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { achievementIconUrl, apex, mapEngagement, readThanks } from "@/lib/apex";
import { formatDateTime } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { useStore, type FeedItem } from "@/lib/store";

export const Route = createFileRoute("/people/$userId")({ component: PersonPage });

function PersonPage() {
  const { userId } = Route.useParams();
  const person = useStore((state) => state.people.find((item) => item.id === userId));
  const me = useStore((state) => state.currentUserId);
  const feed = useStore((state) => state.feed);
  const people = useStore((state) => state.people);
  const myEngagement = useStore((state) => state.engagement);
  const [otherLevel, setOtherLevel] = useState("");
  const [badges, setBadges] = useState<{ id: string; name: string; iconUrl: string }[]>([]);
  const [thanks, setThanks] = useState<FeedItem[]>([]);
  useEffect(() => {
    void apex(`/api/thanks/received/${userId}`)
      .then((data) => setThanks(readThanks(data)))
      .catch(() => setThanks(feed.filter((item) => item.toId === userId)));
  }, [userId, feed]);
  useEffect(() => {
    void apex(`/api/achievements/users/${userId}`)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items;
        if (!Array.isArray(list)) return;
        setBadges(
          list.map((item) => {
            const record = item as { achievement?: { id?: unknown; code?: unknown; name?: unknown; iconUrl?: unknown }; id?: unknown; code?: unknown };
            const achievement = record.achievement ?? record;
            const code = String((achievement as { code?: unknown }).code ?? "");
            return {
              id: String((achievement as { id?: unknown }).id ?? record.id ?? ""),
              name: String((achievement as { name?: unknown }).name ?? "Достижение"),
              iconUrl: achievementIconUrl(code, String((achievement as { iconUrl?: unknown }).iconUrl ?? "")),
            };
          }),
        );
      })
      .catch(() => setBadges([]));
  }, [userId]);
  useEffect(() => {
    if (userId === me) return;
    let ignore = false;
    void apex(`/api/users/${userId}/engagement`)
      .then((data) => {
        if (!ignore) setOtherLevel(mapEngagement(data)?.title ?? "");
      })
      .catch(() => {
        if (!ignore) setOtherLevel("");
      });
    return () => {
      ignore = true;
    };
  }, [userId, me]);
  const levelTitle = userId === me ? myEngagement?.title ?? "" : otherLevel;

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
            {userId === me ? (
              <div className="mt-4">
                <ActivityLevelCard link={false} className="h-auto" />
              </div>
            ) : levelTitle ? (
              <p className="mt-4 text-sm">
                Уровень активности: <span className="font-semibold">{levelTitle}</span>
              </p>
            ) : null}
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
            {thanks.length === 0 ? <p className="mt-2 text-sm text-muted">Полученных благодарностей пока нет.</p> : null}
            <ul className="mt-3 space-y-2">
              {thanks.slice(0, 8).map((item) => (
                <li key={item.id} className="text-sm">
                  <span className="font-medium">{thanksFrom(item, people)}</span>
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

function thanksFrom(item: FeedItem, people: { id: string; name: string }[]) {
  const person = people.find((entry) => entry.id === item.fromId);
  if (person?.name) return person.name;
  if (item.fromName && !/^[0-9a-f-]{36}$/i.test(item.fromName)) return item.fromName;
  return "Сотрудник";
}
