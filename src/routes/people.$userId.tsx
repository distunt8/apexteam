import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { UserAvatar } from "@/components/user-avatar";
import { formatNumber } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/people/$userId")({ component: PersonPage });

function PersonPage() {
  const { userId } = Route.useParams();
  const person = useStore((state) => state.people.find((item) => item.id === userId));
  const me = useStore((state) => state.currentUserId);
  const board = useStore((state) => state.leaderboard);
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
              В рейтинге благодарностей: <span className="font-semibold">{formatNumber(score)}</span>
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
        </>
      )}
    </Shell>
  );
}
