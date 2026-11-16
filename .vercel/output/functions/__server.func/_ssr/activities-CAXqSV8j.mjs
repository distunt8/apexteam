import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as TextInput, S as Chip, T as TextArea, f as useStore, g as formatDateTime, i as Route$13, v as formatPoints, x as Button } from "./router-Dr41VdEz.mjs";
import { t as AchievementMark } from "./achievement-mark-BYsHoESd.mjs";
import { a as Shell } from "./shell-1JLU4O9d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activities-CAXqSV8j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		id: "all",
		label: "Все"
	},
	{
		id: "quest",
		label: "Квесты"
	},
	{
		id: "survey",
		label: "Опросы"
	},
	{
		id: "event",
		label: "Мероприятия"
	},
	{
		id: "achievement",
		label: "Достижения"
	}
];
function ActivitiesPage() {
	const catalog = useStore((state) => state.activitiesCatalog);
	const load = useStore((state) => state.loadActivities);
	const search = Route$13.useSearch();
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)(search.kind ?? "all");
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (search.kind) setFilter(search.kind);
	}, [search.kind]);
	(0, import_react.useEffect)(() => {
		if (!search.focus) return;
		document.getElementById(search.focus)?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	}, [search.focus, catalog.status]);
	const needle = query.trim().toLowerCase();
	const quests = (0, import_react.useMemo)(() => catalog.quests.filter((item) => matches(needle, item.title, item.description)), [catalog.quests, needle]);
	const surveys = (0, import_react.useMemo)(() => catalog.surveys.filter((item) => matches(needle, item.title, item.description)), [catalog.surveys, needle]);
	const events = (0, import_react.useMemo)(() => catalog.events.filter((item) => matches(needle, item.title, item.description, item.location)), [catalog.events, needle]);
	const achievements = (0, import_react.useMemo)(() => catalog.achievements.filter((item) => matches(needle, item.name, item.description)), [catalog.achievements, needle]);
	const empty = (filter === "all" || filter === "quest" ? quests.length : 0) + (filter === "all" || filter === "survey" ? surveys.length : 0) + (filter === "all" || filter === "event" ? events.length : 0) + (filter === "all" || filter === "achievement" ? achievements.length : 0) === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Активности"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "Квесты, опросы и запись на мероприятия. Награды приходят с сервера на личный баланс."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5 max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Поиск",
					"aria-label": "Поиск по активностям",
					className: "pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: filter === item.id,
					onClick: () => setFilter(item.id),
					children: item.label
				}, item.id))
			}),
			catalog.warnings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-lg bg-card px-4 py-3 text-sm text-muted",
				children: catalog.warnings.join(" ")
			}) : null,
			catalog.status === "loading" && catalog.quests.length + catalog.events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "Загружаем активности."
			}) : null,
			catalog.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: catalog.error
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					onClick: () => void load(),
					children: "Повторить"
				})]
			}) : null,
			catalog.status !== "loading" && empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "В этой категории пока пусто."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [
					filter === "all" || filter === "quest" ? quests.map((quest) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestCard, { quest }, quest.id)) : null,
					filter === "all" || filter === "survey" ? surveys.map((survey) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurveyCard, { survey }, survey.id)) : null,
					filter === "all" || filter === "event" ? events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, { event }, event.id)) : null,
					filter === "all" || filter === "achievement" ? achievements.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementCard, { item }, item.id)) : null
				]
			})
		]
	});
}
function matches(needle, ...parts) {
	if (!needle) return true;
	return parts.join(" ").toLowerCase().includes(needle);
}
function tone(kind) {
	if (kind === "Квест") return "bg-sky-100 text-sky-900";
	if (kind === "Опрос") return "bg-amber-100 text-amber-950";
	if (kind === "Мероприятие") return "bg-emerald-100 text-emerald-900";
	return "bg-violet-100 text-violet-900";
}
function Card({ kind, title, done, id, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id,
		className: "rounded-xl border border-line bg-gradient-to-b from-surface to-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `rounded-full px-2.5 py-1 text-xs font-semibold ${tone(kind)}`,
					children: kind
				}), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-brand",
					children: "получено"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-lg font-bold",
				children: title
			}),
			children
		]
	});
}
function QuestCard({ quest }) {
	const join = useStore((state) => state.joinQuest);
	const completeStep = useStore((state) => state.completeQuestStep);
	const updateProof = useStore((state) => state.updateQuestProof);
	const finish = useStore((state) => state.finishQuest);
	const [busy, setBusy] = (0, import_react.useState)("");
	const joined = quest.status === "in_progress" || quest.status === "completed";
	const requiredLeft = quest.steps.filter((step) => step.required && !step.completed);
	const canFinish = joined && quest.status !== "completed" && requiredLeft.length === 0;
	async function run(key, task, success) {
		setBusy(key);
		const result = await task;
		setBusy("");
		if (!result.ok) toast.error(result.error ?? "Не получилось");
		else toast.success(success);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		id: `quest-${quest.id}`,
		kind: "Квест",
		title: quest.title,
		done: quest.status === "completed",
		children: [
			quest.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: quest.description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					questStatus(quest.status),
					quest.steps.length > 0 ? ` · шагов ${quest.steps.filter((step) => step.completed).length} из ${quest.steps.length}` : "",
					span(quest.startAt, quest.endAt)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-medium text-brand",
				children: formatPoints(quest.reward)
			}),
			!joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				disabled: busy !== "",
				onClick: () => void run("join", join(quest.id), "Вы в квесте"),
				children: "Участвовать"
			}) : null,
			joined && quest.steps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "У квеста на сервере пока нет шагов."
			}) : null,
			joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 space-y-3",
				children: quest.steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepRow, {
					index,
					step,
					busy: busy === step.id || busy === `${step.id}-edit`,
					onComplete: (proof) => void run(step.id, completeStep(quest.id, step.id, proof), "Подтверждение отправлено"),
					onUpdate: (proof) => void run(`${step.id}-edit`, updateProof(quest.id, step.id, proof), "Подтверждение обновлено")
				}, step.id))
			}) : null,
			canFinish ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				disabled: busy !== "",
				onClick: () => void run("finish", finish(quest.id), "Квест завершён"),
				children: "Завершить и получить награду"
			}) : null
		]
	});
}
function StepRow({ step, index, busy, onComplete, onUpdate }) {
	const [comment, setComment] = (0, import_react.useState)(step.proofComment);
	const [path, setPath] = (0, import_react.useState)(step.proofPath);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const upload = useStore((state) => state.uploadImage);
	const proof = step.completionType === "proof";
	const automatic = step.completionType === "automatic";
	const sent = proof && (step.proofStatus === "pending" || step.proofStatus === "approved" || step.proofStatus === "rejected");
	const showForm = proof && !step.completed && !automatic && (!sent || step.proofStatus === "rejected" || editing);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-md bg-surface px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm font-semibold",
				children: [
					index + 1,
					". ",
					step.title,
					step.required ? "" : " · необязательный"
				]
			}),
			step.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: step.description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted",
				children: [step.completed ? "Выполнено" : automatic ? "Засчитывается автоматически" : proof ? "Нужно подтверждение" : "Отмечается вручную", step.proofStatus ? ` · ${proofLabel(step.proofStatus)}` : ""]
			}),
			sent && step.proofPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 break-all text-sm",
				children: step.proofPath
			}) : null,
			sent && step.proofComment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: step.proofComment
			}) : null,
			showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/jpeg,image/png,image/webp,application/pdf",
						className: "block w-full text-sm",
						disabled: busy || uploading,
						onChange: (event) => {
							const file = event.target.files?.[0];
							event.target.value = "";
							if (!file) return;
							setUploading(true);
							upload(file, "proofs").then((result) => {
								setUploading(false);
								if (!result.ok || !result.url) toast.error(result.ok ? "Сервер не вернул ссылку" : result.error);
								else setPath(result.url);
							});
						}
					}),
					path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "break-all text-sm text-brand",
						href: path,
						children: uploading ? "Загружаем…" : "Файл прикреплён"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: uploading ? "Загружаем…" : "JPEG, PNG, WebP или PDF, до 2 МБ."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: comment,
						onChange: (event) => setComment(event.target.value),
						placeholder: "Комментарий",
						className: "min-h-16"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy || !path.trim(),
							onClick: () => {
								if (step.proofStatus === "pending") {
									setEditing(false);
									onUpdate({
										storagePath: path,
										comment
									});
								} else onComplete({
									storagePath: path,
									comment
								});
							},
							children: step.proofStatus === "pending" ? "Обновить подтверждение" : "Отправить подтверждение"
						}), editing && step.proofStatus === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "line",
							onClick: () => setEditing(false),
							children: "Отмена"
						}) : null]
					})
				]
			}) : sent && step.proofStatus === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				variant: "line",
				disabled: busy,
				onClick: () => setEditing(true),
				children: "Изменить подтверждение"
			}) : step.completed || automatic || proof ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				disabled: busy,
				onClick: () => onComplete(),
				children: "Отметить шаг"
			})
		]
	});
}
function SurveyCard({ survey }) {
	const locked = !survey.canRespond;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		id: `survey-${survey.id}`,
		kind: "Опрос",
		title: survey.title,
		done: survey.hasResponded && !survey.canRespond,
		children: [
			survey.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: survey.description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					survey.questionsCount,
					" ",
					questionsLabel(survey.questionsCount),
					survey.reward > 0 ? ` · ${formatPoints(survey.reward)}` : "",
					survey.hasResponded ? " · вы уже отвечали" : ""
				]
			}),
			survey.questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Вопросов пока нет."
			}) : null,
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Ответ уже отправлен."
			}) : null,
			!locked && survey.questions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/surveys/$surveyId",
				params: { surveyId: survey.id },
				className: "mt-4 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Пройти опрос" })
			}) : null
		]
	});
}
function EventCard({ event }) {
	const register = useStore((state) => state.registerForEvent);
	const cancel = useStore((state) => state.cancelEventRegistration);
	const claim = useStore((state) => state.claimEventReward);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const spots = event.maxParticipants == null ? `${event.registeredCount} записались` : `${event.registeredCount} из ${event.maxParticipants}`;
	async function run(task, success) {
		setBusy(true);
		const result = await task;
		setBusy(false);
		if (!result.ok) toast.error(result.error ?? "Не получилось");
		else toast.success(success);
	}
	const registered = event.status === "registered";
	const attended = event.status === "attended";
	const canRegister = event.open && (event.status === "" || event.status === "cancelled");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		id: `event-${event.id}`,
		kind: "Мероприятие",
		title: event.title,
		done: event.rewardClaimed,
		children: [
			event.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: event.description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					eventStatus(event.status),
					event.location ? ` · ${event.location}` : "",
					` · ${spots}`,
					span(event.startAt, event.endAt)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm font-medium text-brand",
				children: ["За посещение ", formatPoints(event.reward)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					canRegister ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void run(register(event.id), "Вы записаны"),
						children: "Записаться"
					}) : null,
					registered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						disabled: busy,
						onClick: () => void run(cancel(event.id), "Запись отменена"),
						children: "Отменить запись"
					}) : null,
					attended && !event.rewardClaimed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void run(claim(event.id), "Награда начислена"),
						children: "Получить награду"
					}) : null
				]
			})
		]
	});
}
function AchievementCard({ item }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		id: `achievement-${item.id}`,
		kind: "Достижение",
		title: item.name,
		done: item.earned,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementMark, {
				iconUrl: item.iconUrl,
				earned: item.earned,
				className: "mt-2 size-10"
			}),
			item.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: item.description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: item.earned ? `Открыто ${item.earnedAt ? formatDateTime(item.earnedAt) : ""}` : conditionHint(item)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-medium text-brand",
				children: formatPoints(item.reward)
			})
		]
	});
}
function conditionHint(item) {
	if (item.conditionType === "first_order") return "Откроется после первого заказа";
	if (item.conditionType === "first_thank") return "Откроется после первой благодарности";
	if (item.conditionType === "first_activity") return "Откроется после первой выполненной активности";
	return "Условие проверяет сервер";
}
function questStatus(status) {
	if (status === "in_progress") return "В процессе";
	if (status === "completed") return "Завершён";
	if (status === "cancelled") return "Отменён";
	return "Не начат";
}
function eventStatus(status) {
	if (status === "registered") return "Вы записаны";
	if (status === "attended") return "Посещение подтверждено";
	if (status === "cancelled") return "Запись отменена";
	if (status === "no_show") return "Неявка";
	return "Вы не записаны";
}
function proofLabel(status) {
	if (status === "pending") return "на проверке";
	if (status === "approved") return "подтверждено";
	if (status === "rejected") return "отклонено";
	return status;
}
function span(start, end) {
	if (!start && !end) return "";
	return ` · ${start ? formatDateTime(start) : "…"} — ${end ? formatDateTime(end) : "…"}`;
}
function questionsLabel(count) {
	const abs = Math.abs(count) % 100;
	const digit = abs % 10;
	if (abs > 10 && abs < 20) return "вопросов";
	if (digit === 1) return "вопрос";
	if (digit >= 2 && digit <= 4) return "вопроса";
	return "вопросов";
}
//#endregion
export { ActivitiesPage as component };
