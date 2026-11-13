import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ActivityLevelCard } from "@/components/activity-level";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { formatPoints } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/my-activity")({ component: MyActivityPage });

function MyActivityPage() {
  const catalog = useStore((state) => state.activitiesCatalog);
  const load = useStore((state) => state.loadActivities);
  const loadEngagement = useStore((state) => state.loadEngagement);
  useEffect(() => {
    void load();
    void loadEngagement();
  }, [load, loadEngagement]);

  const quests = catalog.quests.filter((item) => item.status === "in_progress" || item.status === "completed");
  const surveys = catalog.surveys.filter((item) => item.hasResponded);
  const events = catalog.events.filter((item) => item.status === "registered" || item.status === "attended");
  const badges = catalog.achievements.filter((item) => item.earned);

  return (
    <Shell>
      <h1 className="text-3xl font-bold tracking-tight">Моя активность</h1>
      <p className="mt-2 text-sm text-muted">Квесты, опросы, мероприятия и достижения, в которых вы уже участвуете.</p>
      <div className="mt-5 max-w-xl">
        <ActivityLevelCard detailed />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Block title="Квесты" empty="Вы ещё не вступали в квесты">
          {quests.map((item) => (
            <Row key={item.id} title={item.title} meta={item.status === "completed" ? "Завершён" : "В процессе"} extra={formatPoints(item.reward)} />
          ))}
        </Block>
        <Block title="Опросы" empty="Ответов пока нет">
          {surveys.map((item) => (
            <Row key={item.id} title={item.title} meta="Ответ отправлен" extra={item.reward > 0 ? formatPoints(item.reward) : ""} />
          ))}
        </Block>
        <Block title="Мероприятия" empty="Записей пока нет">
          {events.map((item) => (
            <Row key={item.id} title={item.title} meta={item.status === "attended" ? "Посещение подтверждено" : "Вы записаны"} />
          ))}
        </Block>
        <Block title="Достижения" empty="Открытых достижений пока нет">
          {badges.map((item) => (
            <Row key={item.id} title={item.name} meta={item.description} />
          ))}
        </Block>
      </div>
      {quests.length + surveys.length + events.length + badges.length === 0 ? (
        <p className="mt-4 text-sm">
          <Link to="/activities" className="font-semibold text-brand">
            Перейти ко всем активностям
          </Link>
        </p>
      ) : null}
    </Shell>
  );
}

function Block({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const list = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
  return (
    <Panel>
      <h2 className="font-bold">{title}</h2>
      {list.length === 0 ? <p className="mt-3 text-sm text-muted">{empty}</p> : <ul className="mt-3 space-y-2">{children}</ul>}
    </Panel>
  );
}

function Row({ title, meta, extra }: { title: string; meta: string; extra?: string }) {
  return (
    <li className="rounded-md bg-surface px-3 py-2">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-muted">
        {meta}
        {extra ? ` · ${extra}` : ""}
      </p>
    </li>
  );
}
