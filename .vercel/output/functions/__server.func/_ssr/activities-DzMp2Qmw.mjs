import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatPoints, d as Button, f as Chip, g as TextInput, i as useStore, u as todayKey } from "./router-CTHYymUA.mjs";
import { i as Shell } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activities-DzMp2Qmw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		id: "all",
		label: "Все"
	},
	{
		id: "survey",
		label: "Опросы"
	},
	{
		id: "challenge",
		label: "Челленджи"
	},
	{
		id: "event",
		label: "Мероприятия"
	}
];
var QUIZ = [
	{
		q: "Что платформа считает важнее всего в команде?",
		options: [
			"Взаимная поддержка",
			"Работать только на себя",
			"Не замечать чужой вклад"
		],
		answer: 0
	},
	{
		q: "Какие суммы благодарности доступны сотруднику?",
		options: [
			"Любые",
			"10, 20, 30 или 50",
			"Только 1 балл"
		],
		answer: 1
	},
	{
		q: "Можно ли отправить баллы самому себе?",
		options: [
			"Да, без ограничений",
			"Нет",
			"Только по пятницам"
		],
		answer: 1
	}
];
function ActivitiesPage() {
	const activities = useStore((state) => state.activities);
	const userId = useStore((state) => state.currentUserId);
	const progress = useStore((state) => state.progress);
	const completeSteps = useStore((state) => state.completeSteps);
	const checkIn = useStore((state) => state.checkIn);
	const completeOnce = useStore((state) => state.completeOnce);
	const submitQuiz = useStore((state) => state.submitQuiz);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [answers, setAnswers] = (0, import_react.useState)([
		-1,
		-1,
		-1
	]);
	const list = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return activities.filter((activity) => {
			if (!activity.active) return false;
			if (filter !== "all" && activity.category !== filter) return false;
			if (!needle) return true;
			return `${activity.title} ${activity.description}`.toLowerCase().includes(needle);
		});
	}, [
		activities,
		query,
		filter
	]);
	function run(result, success) {
		if (!result.ok) toast.error(result.error ?? "Не получилось");
		else toast.success(success);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Активности"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "Одна отметка за задание. Шаги здесь демонстрационные. Эти активности живут только в браузере: сервер их пока не принимает, баллы на балансе не меняются."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5 max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Поиск по активностям",
					"aria-label": "Поиск по активностям",
					className: "pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto",
				children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: filter === item.id,
					onClick: () => setFilter(item.id),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: list.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg bg-card p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityBody, {
						activity,
						userId,
						progress,
						answers,
						setAnswers,
						onSteps: () => run(completeSteps(), `+${activity.reward} баллов за шаги`),
						onCheckIn: () => run(checkIn(), "День отмечен"),
						onOnce: () => run(completeOnce(activity.id), `+${activity.reward} баллов`),
						onQuiz: () => {
							const correct = QUIZ.filter((item, index) => answers[index] === item.answer).length;
							run(submitQuiz(correct), `Опрос пройден, +${activity.reward}`);
						}
					})
				}, activity.id))
			})
		]
	});
}
function ActivityBody({ activity, userId, progress, answers, setAnswers, onSteps, onCheckIn, onOnce, onQuiz }) {
	const mine = progress.filter((item) => item.userId === userId && item.activityId === activity.id);
	if (activity.kind === "steps") {
		const row = mine.find((item) => item.period === todayKey());
		const value = row?.value ?? 0;
		const done = Boolean(row?.rewarded);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			activity,
			extra: `${value.toLocaleString("ru-RU")} / ${activity.target.toLocaleString("ru-RU")}`,
			done,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onSteps,
				disabled: done,
				children: done ? "Уже начислено" : "Засчитать дневную цель"
			})
		});
	}
	if (activity.kind === "streak") {
		const row = mine.find((item) => item.period === "streak");
		const value = row?.value ?? 0;
		const done = Boolean(row?.rewarded);
		const checked = row?.meta === todayKey();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			activity,
			extra: `${Math.min(value, activity.target)} из ${activity.target} дней`,
			done,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onCheckIn,
				disabled: done || checked,
				children: done ? "Серия закрыта" : checked ? "Сегодня отмечено" : "Отметить день"
			})
		});
	}
	if (activity.kind === "quiz") {
		const done = mine.some((item) => item.rewarded);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			activity,
			extra: "12 вопросов в описании, здесь короткая версия из 3",
			done,
			action: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: true,
				children: "Пройдено"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [QUIZ.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-sm font-medium",
					children: item.q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-1",
					children: item.options.map((option, optionIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-10 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: `q-${index}`,
							checked: answers[index] === optionIndex,
							onChange: () => {
								const next = [...answers];
								next[index] = optionIndex;
								setAnswers(next);
							}
						}), option]
					}, option))
				})] }, item.q)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onQuiz,
					disabled: answers.some((value) => value < 0),
					children: "Отправить ответы"
				})]
			})
		});
	}
	const done = mine.some((item) => item.rewarded);
	const label = activity.id === "act-team" ? "Я в деле" : activity.id === "act-meetup" ? "Подтвердить участие" : "Выполнить";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
		activity,
		extra: activity.id === "act-team" ? "Сейчас в челлендже 18 из 30 человек" : formatPoints(activity.reward),
		done,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: onOnce,
			disabled: done,
			children: done ? "Участвую" : label
		})
	});
}
function Body({ activity, extra, done, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: activity.title
				}), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-brand",
					children: "получено"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: activity.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm font-medium text-brand",
				children: extra.includes("балл") ? extra : `${extra} · ${formatPoints(activity.reward)}`
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:min-w-56",
			children: action
		})]
	});
}
//#endregion
export { ActivitiesPage as component };
