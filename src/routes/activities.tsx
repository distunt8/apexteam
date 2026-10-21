import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Chip, TextInput } from "@/components/ui";
import { formatPoints, todayKey } from "@/lib/format";
import { useStore, type Activity, type ActivityCategory } from "@/lib/store";

export const Route = createFileRoute("/activities")({ component: ActivitiesPage });

const FILTERS: { id: "all" | ActivityCategory; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "survey", label: "Опросы" },
  { id: "challenge", label: "Челленджи" },
  { id: "event", label: "Мероприятия" },
];

const QUIZ = [
  {
    q: "Что платформа считает важнее всего в команде?",
    options: ["Взаимная поддержка", "Работать только на себя", "Не замечать чужой вклад"],
    answer: 0,
  },
  {
    q: "Какие суммы благодарности доступны сотруднику?",
    options: ["Любые", "10, 20, 30 или 50", "Только 1 балл"],
    answer: 1,
  },
  {
    q: "Можно ли отправить баллы самому себе?",
    options: ["Да, без ограничений", "Нет", "Только по пятницам"],
    answer: 1,
  },
];

function ActivitiesPage() {
  const activities = useStore((state) => state.activities);
  const userId = useStore((state) => state.currentUserId);
  const progress = useStore((state) => state.progress);
  const completeSteps = useStore((state) => state.completeSteps);
  const checkIn = useStore((state) => state.checkIn);
  const completeOnce = useStore((state) => state.completeOnce);
  const submitQuiz = useStore((state) => state.submitQuiz);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return activities.filter((activity) => {
      if (!activity.active) return false;
      if (filter !== "all" && activity.category !== filter) return false;
      if (!needle) return true;
      return `${activity.title} ${activity.description}`.toLowerCase().includes(needle);
    });
  }, [activities, query, filter]);

  function run(result: { ok: boolean; error?: string }, success: string) {
    if (!result.ok) toast.error(result.error ?? "Не получилось");
    else toast.success(success);
  }

  return (
    <Shell mode="top">
      <h1 className="text-3xl font-bold tracking-tight">Активности</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Одна отметка за задание. Шаги здесь демонстрационные. Эти активности живут только в браузере: сервер их пока не принимает, баллы на балансе не меняются.
      </p>
      <div className="relative mt-5 max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <TextInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по активностям"
          aria-label="Поиск по активностям"
          className="pl-9"
        />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {FILTERS.map((item) => (
          <Chip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {list.map((activity) => (
          <li key={activity.id} className="rounded-lg bg-card p-4">
            <ActivityBody
              activity={activity}
              userId={userId}
              progress={progress}
              answers={answers}
              setAnswers={setAnswers}
              onSteps={() => run(completeSteps(), `+${activity.reward} баллов за шаги`)}
              onCheckIn={() => run(checkIn(), "День отмечен")}
              onOnce={() => run(completeOnce(activity.id), `+${activity.reward} баллов`)}
              onQuiz={() => {
                const correct = QUIZ.filter((item, index) => answers[index] === item.answer).length;
                run(submitQuiz(correct), `Опрос пройден, +${activity.reward}`);
              }}
            />
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function ActivityBody({
  activity,
  userId,
  progress,
  answers,
  setAnswers,
  onSteps,
  onCheckIn,
  onOnce,
  onQuiz,
}: {
  activity: Activity;
  userId: string;
  progress: { userId: string; activityId: string; period: string; value: number; rewarded: boolean; meta?: string }[];
  answers: number[];
  setAnswers: (next: number[]) => void;
  onSteps: () => void;
  onCheckIn: () => void;
  onOnce: () => void;
  onQuiz: () => void;
}) {
  const mine = progress.filter((item) => item.userId === userId && item.activityId === activity.id);
  if (activity.kind === "steps") {
    const row = mine.find((item) => item.period === todayKey());
    const value = row?.value ?? 0;
    const done = Boolean(row?.rewarded);
    return (
      <Body
        activity={activity}
        extra={`${value.toLocaleString("ru-RU")} / ${activity.target.toLocaleString("ru-RU")}`}
        done={done}
        action={
          <Button onClick={onSteps} disabled={done}>
            {done ? "Уже начислено" : "Засчитать дневную цель"}
          </Button>
        }
      />
    );
  }
  if (activity.kind === "streak") {
    const row = mine.find((item) => item.period === "streak");
    const value = row?.value ?? 0;
    const done = Boolean(row?.rewarded);
    const checked = row?.meta === todayKey();
    return (
      <Body
        activity={activity}
        extra={`${Math.min(value, activity.target)} из ${activity.target} дней`}
        done={done}
        action={
          <Button onClick={onCheckIn} disabled={done || checked}>
            {done ? "Серия закрыта" : checked ? "Сегодня отмечено" : "Отметить день"}
          </Button>
        }
      />
    );
  }
  if (activity.kind === "quiz") {
    const done = mine.some((item) => item.rewarded);
    return (
      <Body
        activity={activity}
        extra="12 вопросов в описании, здесь короткая версия из 3"
        done={done}
        action={
          done ? (
            <Button disabled>Пройдено</Button>
          ) : (
            <div className="space-y-3">
              {QUIZ.map((item, index) => (
                <fieldset key={item.q}>
                  <legend className="text-sm font-medium">{item.q}</legend>
                  <div className="mt-2 flex flex-col gap-1">
                    {item.options.map((option, optionIndex) => (
                      <label key={option} className="flex min-h-10 items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={`q-${index}`}
                          checked={answers[index] === optionIndex}
                          onChange={() => {
                            const next = [...answers];
                            next[index] = optionIndex;
                            setAnswers(next);
                          }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <Button onClick={onQuiz} disabled={answers.some((value) => value < 0)}>
                Отправить ответы
              </Button>
            </div>
          )
        }
      />
    );
  }
  const done = mine.some((item) => item.rewarded);
  const label = activity.id === "act-team" ? "Я в деле" : activity.id === "act-meetup" ? "Подтвердить участие" : "Выполнить";
  return (
    <Body
      activity={activity}
      extra={activity.id === "act-team" ? "Сейчас в челлендже 18 из 30 человек" : formatPoints(activity.reward)}
      done={done}
      action={
        <Button onClick={onOnce} disabled={done}>
          {done ? "Участвую" : label}
        </Button>
      }
    />
  );
}

function Body({
  activity,
  extra,
  done,
  action,
}: {
  activity: Activity;
  extra: string;
  done: boolean;
  action: ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold">{activity.title}</h2>
          {done ? <span className="text-xs font-semibold text-brand">получено</span> : null}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted">{activity.description}</p>
        <p className="mt-2 text-sm font-medium text-brand">
          {extra.includes("балл") ? extra : `${extra} · ${formatPoints(activity.reward)}`}
        </p>
      </div>
      <div className="lg:min-w-56">{action}</div>
    </div>
  );
}
