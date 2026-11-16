import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Field, E as TextInput, T as TextArea, _ as formatNumber, c as canManageShop, f as useStore, m as listOf, p as apex, s as canManageActivities, u as canOpenAdmin, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell, c as categoryLabel, i as ROLE_LABEL, l as orderStatusLabel, n as ENTRY_LABEL, o as TICKET_STATUS, r as ORDER_FLOW, s as UserAvatar, u as roleCodeLabel } from "./shell-1JLU4O9d.mjs";
import { n as usePage, t as Pager } from "./pager-DvNdDOo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-qPejLQJP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	id: "",
	title: "",
	description: "",
	reward: 0,
	active: true,
	startAt: "",
	endAt: "",
	location: "",
	maxParticipants: "",
	extra: "",
	code: ""
};
var EMPTY_STEP = {
	id: "",
	title: "",
	description: "",
	completionType: "manual",
	sortOrder: 0,
	required: true
};
var EMPTY_QUESTION = {
	id: "",
	text: "",
	type: "text",
	options: "",
	required: true,
	sortOrder: 0
};
var QUESTION_TYPES = [
	["text", "Свободный текст"],
	["single_choice", "Один вариант"],
	["multiple_choice", "Несколько вариантов"],
	["number", "Число"],
	["boolean", "Да или нет"],
	["rating", "Оценка 1–5"]
];
function mapStep(raw) {
	if (!raw || typeof raw !== "object") return null;
	const record = raw;
	if (record.id == null) return null;
	return {
		id: text(record.id),
		title: text(record.title),
		description: text(record.description),
		completionType: text(record.completionType || "manual"),
		sortOrder: Number(record.sortOrder ?? 0) || 0,
		required: record.isRequired !== false
	};
}
function mapQuestion(raw) {
	if (!raw || typeof raw !== "object") return null;
	const record = raw;
	if (record.id == null) return null;
	const options = Array.isArray(record.options) ? record.options.map(text).filter(Boolean) : [];
	return {
		id: text(record.id),
		text: text(record.questionText),
		type: text(record.questionType || "text"),
		options: options.join("\n"),
		required: record.isRequired !== false,
		sortOrder: Number(record.sortOrder ?? 0) || 0
	};
}
function proofStatusLabel(status) {
	const key = status.trim().toLowerCase();
	if (key === "pending") return "на проверке";
	if (key === "approved") return "принято";
	if (key === "rejected") return "отклонено";
	return "на проверке";
}
function attendanceLabel(status) {
	const key = status.trim().toLowerCase();
	if (key === "attended") return "был";
	if (key === "no_show" || key === "noshow") return "неявка";
	if (key === "cancelled" || key === "canceled") return "отменил запись";
	if (key === "registered" || !key) return "зарегистрирован";
	return "зарегистрирован";
}
function mapParticipant(raw) {
	if (!raw || typeof raw !== "object") return null;
	const record = raw;
	if (record.id == null) return null;
	const name = [record.lastName, record.firstName].map(text).filter(Boolean).join(" ");
	return {
		id: text(record.id),
		name: name || "Участник",
		status: text(record.status)
	};
}
function text(value) {
	return typeof value === "string" ? value : value == null ? "" : String(value);
}
function toLocal(iso) {
	if (!iso) return "";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (value) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function toIso(local) {
	if (!local.trim()) return null;
	const date = new Date(local);
	return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
function mapRow(raw, kind) {
	if (!raw || typeof raw !== "object") return null;
	const record = raw;
	if (record.id == null) return null;
	return {
		id: text(record.id),
		title: text(record.title || record.name),
		description: text(record.description),
		reward: Number(record.rewardAmount ?? 0) || 0,
		active: record.isActive !== false,
		startAt: toLocal(text(record.startAt)),
		endAt: toLocal(text(record.endAt)),
		location: text(record.location),
		maxParticipants: record.maxParticipants == null ? "" : text(record.maxParticipants),
		extra: text(record.stepsCount ? `${record.stepsCount} шаг.` : record.registeredCount != null ? `${record.registeredCount} участ.` : ""),
		code: text(record.code)
	};
}
function AdminActivities() {
	const people = useStore((state) => state.people);
	const [kind, setKind] = (0, import_react.useState)("quests");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [proofs, setProofs] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [participants, setParticipants] = (0, import_react.useState)([]);
	const [stepDraft, setStepDraft] = (0, import_react.useState)(EMPTY_STEP);
	const [questionDraft, setQuestionDraft] = (0, import_react.useState)(EMPTY_QUESTION);
	const [error, setError] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [onlyActive, setOnlyActive] = (0, import_react.useState)("all");
	async function reload(next = kind) {
		setError("");
		if (next === "proofs") {
			const data = await apex("/api/quests/proofs?page=1&pageSize=50");
			setProofs(listOf(data).map((item) => {
				const record = item;
				return {
					id: text(record.id),
					quest: text(record.questTitle),
					step: text(record.stepTitle),
					userId: text(record.userId),
					path: text(record.storagePath),
					status: text(record.status || "pending").toLowerCase(),
					comment: text(record.comment)
				};
			}));
			setRows([]);
			return;
		}
		const data = await apex(next === "quests" ? "/api/quests/admin?page=1&pageSize=50" : next === "surveys" ? "/api/surveys/admin?page=1&pageSize=50" : next === "events" ? "/api/events/admin?page=1&pageSize=50" : "/api/achievements");
		setRows(listOf(data).map((item) => mapRow(item, next)).filter((item) => Boolean(item)));
		setProofs([]);
	}
	(0, import_react.useEffect)(() => {
		reload(kind).catch((reason) => {
			setError(reason instanceof Error ? reason.message : "Не удалось загрузить активности");
		});
	}, [kind]);
	(0, import_react.useEffect)(() => {
		const id = draft?.id;
		if (!id || kind !== "quests" && kind !== "surveys" && kind !== "events") {
			setSteps([]);
			setQuestions([]);
			setParticipants([]);
			return;
		}
		let cancelled = false;
		(async () => {
			if (kind === "quests") {
				const data = await apex(`/api/quests/${id}`);
				if (cancelled) return;
				setSteps((data.steps ?? []).map(mapStep).filter((item) => Boolean(item)));
			} else if (kind === "surveys") {
				const data = await apex(`/api/surveys/${id}`);
				if (cancelled) return;
				setQuestions((data.questions ?? []).map(mapQuestion).filter((item) => Boolean(item)));
			} else {
				const data = await apex(`/api/events/${id}/participants?page=1&pageSize=50`);
				if (cancelled) return;
				setParticipants(listOf(data).map(mapParticipant).filter((item) => Boolean(item)));
			}
		})().catch((reason) => {
			if (!cancelled) setError(reason instanceof Error ? reason.message : "Не удалось загрузить состав");
		});
		return () => {
			cancelled = true;
		};
	}, [draft?.id, kind]);
	async function save() {
		if (!draft) return;
		if (kind !== "achievements" && !draft.title.trim()) {
			toast.error("Укажите название");
			return;
		}
		const body = kind === "achievements" ? {
			code: draft.code,
			name: draft.title.trim(),
			description: draft.description.trim(),
			rewardAmount: draft.reward,
			isActive: draft.active
		} : kind === "events" ? {
			title: draft.title.trim(),
			description: draft.description.trim(),
			startAt: toIso(draft.startAt),
			endAt: toIso(draft.endAt),
			location: draft.location.trim(),
			maxParticipants: draft.maxParticipants.trim() ? Number(draft.maxParticipants) : null,
			rewardAmount: draft.reward,
			isActive: draft.active
		} : kind === "surveys" ? {
			title: draft.title.trim(),
			description: draft.description.trim(),
			rewardAmount: draft.reward,
			startAt: toIso(draft.startAt),
			endAt: toIso(draft.endAt),
			allowMultipleResponses: false,
			isActive: draft.active
		} : {
			title: draft.title.trim(),
			description: draft.description.trim(),
			rewardAmount: draft.reward,
			startAt: toIso(draft.startAt),
			endAt: toIso(draft.endAt),
			isActive: draft.active
		};
		const path = kind === "quests" ? "/api/quests" : kind === "surveys" ? "/api/surveys" : kind === "events" ? "/api/events" : "/api/achievements";
		try {
			if (kind === "achievements") await apex(`${path}/${draft.id}`, {
				method: "PUT",
				body: JSON.stringify(body)
			});
			else if (draft.id) await apex(`${path}/${draft.id}`, {
				method: "PUT",
				body: JSON.stringify(body)
			});
			else await apex(path, {
				method: "POST",
				body: JSON.stringify(body)
			});
			toast.success("Сохранено");
			setDraft(null);
			await reload();
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось сохранить");
		}
	}
	async function remove(id) {
		const path = kind === "quests" ? "/api/quests" : kind === "surveys" ? "/api/surveys" : "/api/events";
		try {
			await apex(`${path}/${id}`, { method: "DELETE" });
			toast.success("Скрыто");
			await reload();
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось скрыть");
		}
	}
	async function saveStep() {
		if (!draft?.id || !stepDraft.title.trim()) {
			toast.error("Укажите название шага");
			return;
		}
		const body = {
			title: stepDraft.title.trim(),
			description: stepDraft.description.trim(),
			completionType: stepDraft.completionType,
			sortOrder: stepDraft.sortOrder,
			isRequired: stepDraft.required
		};
		try {
			await apex(stepDraft.id ? `/api/quests/${draft.id}/steps/${stepDraft.id}` : `/api/quests/${draft.id}/steps`, {
				method: stepDraft.id ? "PUT" : "POST",
				body: JSON.stringify(body)
			});
			toast.success(stepDraft.id ? "Шаг обновлён" : "Шаг добавлен");
			setStepDraft(EMPTY_STEP);
			const record = await apex(`/api/quests/${draft.id}`);
			setSteps((record.steps ?? []).map(mapStep).filter((item) => Boolean(item)));
			await reload();
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось сохранить шаг");
		}
	}
	async function removeStep(stepId) {
		if (!draft?.id) return;
		try {
			await apex(`/api/quests/${draft.id}/steps/${stepId}`, { method: "DELETE" });
			setSteps((items) => items.filter((item) => item.id !== stepId));
			toast.success("Шаг удалён");
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось удалить шаг");
		}
	}
	async function saveQuestion() {
		if (!draft?.id || !questionDraft.text.trim()) {
			toast.error("Напишите вопрос");
			return;
		}
		const options = questionDraft.options.split("\n").map((item) => item.trim()).filter(Boolean);
		if ((questionDraft.type === "single_choice" || questionDraft.type === "multiple_choice") && options.length < 2) {
			toast.error("Для выбора нужны хотя бы два варианта, каждый с новой строки");
			return;
		}
		const body = {
			questionText: questionDraft.text.trim(),
			questionType: questionDraft.type,
			options: questionDraft.type === "single_choice" || questionDraft.type === "multiple_choice" ? options : [],
			isRequired: questionDraft.required,
			sortOrder: questionDraft.sortOrder
		};
		try {
			await apex(questionDraft.id ? `/api/surveys/${draft.id}/questions/${questionDraft.id}` : `/api/surveys/${draft.id}/questions`, {
				method: questionDraft.id ? "PUT" : "POST",
				body: JSON.stringify(body)
			});
			toast.success(questionDraft.id ? "Вопрос обновлён" : "Вопрос добавлен");
			setQuestionDraft(EMPTY_QUESTION);
			const record = await apex(`/api/surveys/${draft.id}`);
			setQuestions((record.questions ?? []).map(mapQuestion).filter((item) => Boolean(item)));
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось сохранить вопрос");
		}
	}
	async function removeQuestion(questionId) {
		if (!draft?.id) return;
		try {
			await apex(`/api/surveys/${draft.id}/questions/${questionId}`, { method: "DELETE" });
			setQuestions((items) => items.filter((item) => item.id !== questionId));
			toast.success("Вопрос удалён");
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось удалить вопрос");
		}
	}
	async function setAttendance(participantId, status) {
		if (!draft?.id) return;
		try {
			await apex(`/api/events/${draft.id}/participants/${participantId}/attendance`, {
				method: "PUT",
				body: JSON.stringify({ status })
			});
			setParticipants((items) => items.map((item) => item.id === participantId ? {
				...item,
				status
			} : item));
			toast.success(status === "attended" ? "Явка подтверждена" : "Отмечена неявка");
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось отметить явку");
		}
	}
	async function review(id, status) {
		try {
			await apex(`/api/quests/proofs/${id}/review`, {
				method: "POST",
				body: JSON.stringify({ status })
			});
			toast.success(status === "approved" ? "Принято" : "Отклонено");
			await reload("proofs");
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Не удалось проверить");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex gap-2 overflow-x-auto",
			children: [
				{
					id: "quests",
					label: "Квесты"
				},
				{
					id: "surveys",
					label: "Опросы"
				},
				{
					id: "events",
					label: "Мероприятия"
				},
				{
					id: "achievements",
					label: "Достижения"
				},
				{
					id: "proofs",
					label: "Проверки"
				}
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setKind(item.id);
					setDraft(null);
				},
				className: `min-h-10 shrink-0 rounded-md px-3 text-sm font-semibold ${kind === item.id ? "bg-brand text-white" : "bg-card"}`,
				children: item.label
			}, item.id))
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-danger",
			children: error
		}) : null,
		kind === "proofs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			value: query,
			onChange: (event) => setQuery(event.target.value),
			placeholder: "Поиск проверки",
			"aria-label": "Поиск проверки",
			className: "mb-3 max-w-xs"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-2",
			children: [proofs.filter((item) => `${item.quest} ${item.step} ${people.find((person) => person.id === item.userId)?.name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "Проверок нет."
			}) : null, proofs.filter((item) => `${item.quest} ${item.step} ${people.find((person) => person.id === item.userId)?.name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())).map((item) => {
				const author = people.find((person) => person.id === item.userId)?.name;
				const link = /^https?:\/\//i.test(item.path);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-card px-3 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: item.quest || "Квест"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted",
							children: ["Шаг: ", item.step || "без названия"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1",
							children: ["От: ", author || "Сотрудник"]
						}),
						item.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 break-all",
							children: [
								"Отправлено:",
								" ",
								link ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "font-semibold text-brand",
									href: item.path,
									target: "_blank",
									rel: "noreferrer",
									children: "открыть файл"
								}) : item.path
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted",
							children: "Файл не приложен"
						}),
						item.comment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted",
							children: ["Комментарий: ", item.comment]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: proofStatusLabel(item.status)
						}),
						item.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => void review(item.id, "approved"),
								children: "Принять"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "line",
								onClick: () => void review(item.id, "rejected"),
								children: "Отклонить"
							})]
						}) : null
					]
				}, item.id);
			})]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Поиск",
					"aria-label": "Поиск активности",
					className: "max-w-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
					value: onlyActive,
					onChange: (event) => setOnlyActive(event.target.value),
					"aria-label": "Статус активности",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Все"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "yes",
							children: "Активные"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "no",
							children: "Скрытые"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 sm:grid-cols-2",
				children: rows.filter((row) => {
					if (onlyActive === "yes" && !row.active) return false;
					if (onlyActive === "no" && row.active) return false;
					const needle = query.trim().toLowerCase();
					return !needle || `${row.title} ${row.description} ${row.extra}`.toLowerCase().includes(needle);
				}).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setDraft(row),
					className: "flex h-full w-full flex-col rounded-xl border border-line bg-gradient-to-b from-surface to-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-mid hover:shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: row.title
						}),
						row.extra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 text-xs text-muted",
							children: row.extra
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-2 text-sm",
							children: [formatNumber(row.reward), " апексов"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${row.active ? "bg-emerald-100 text-emerald-800" : "bg-card text-muted"}`,
							children: row.active ? "Активно" : "Скрыто"
						})
					]
				}), kind !== "achievements" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-1 text-xs font-semibold text-muted hover:text-ink",
					onClick: () => void remove(row.id),
					children: "Скрыть"
				}) : null] }, row.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3 rounded-lg bg-card p-4",
				onSubmit: (event) => {
					event.preventDefault();
					save();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: draft?.id ? "Редактирование" : "Новая запись"
					}), kind !== "achievements" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm font-semibold text-brand",
						onClick: () => setDraft({ ...EMPTY }),
						children: "Новая"
					}) : null]
				}), draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: kind === "achievements" ? "Название" : "Название",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: draft.title,
							onChange: (event) => setDraft({
								...draft,
								title: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Описание",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: draft.description,
							onChange: (event) => setDraft({
								...draft,
								description: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Награда, апексы",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: draft.reward,
							onChange: (event) => setDraft({
								...draft,
								reward: Number(event.target.value)
							})
						})
					}),
					kind === "events" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Место",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: draft.location,
							onChange: (event) => setDraft({
								...draft,
								location: event.target.value
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Мест, пусто — без лимита",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: draft.maxParticipants,
							onChange: (event) => setDraft({
								...draft,
								maxParticipants: event.target.value
							})
						})
					})] }) : null,
					kind !== "achievements" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Начало",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "datetime-local",
								value: draft.startAt,
								onChange: (event) => setDraft({
									...draft,
									startAt: event.target.value
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Конец",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								type: "datetime-local",
								value: draft.endAt,
								onChange: (event) => setDraft({
									...draft,
									endAt: event.target.value
								})
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: draft.active,
							onChange: (event) => setDraft({
								...draft,
								active: event.target.checked
							})
						}), "Показывать сотрудникам"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Сохранить"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: kind === "achievements" ? "Выберите достижение. Новые создаются на сервере, здесь можно изменить название и награду." : "Выберите запись или создайте новую."
				})]
			})]
		}),
		draft?.id && kind === "quests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-lg bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Шаги квеста"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2",
					children: [steps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Шагов пока нет."
					}) : null, steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							index + 1,
							". ",
							step.title,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" · ", step.completionType === "proof" ? "с подтверждением" : step.completionType === "automatic" ? "автоматически" : "вручную"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-brand",
								onClick: () => setStepDraft(step),
								children: "Изменить"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-muted",
								onClick: () => void removeStep(step.id),
								children: "Удалить"
							})]
						})]
					}, step.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Название шага",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: stepDraft.title,
								onChange: (event) => setStepDraft({
									...stepDraft,
									title: event.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Тип",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
								value: stepDraft.completionType,
								onChange: (event) => setStepDraft({
									...stepDraft,
									completionType: event.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "manual",
										children: "Отмечает сам сотрудник"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "proof",
										children: "Нужно подтверждение"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "automatic",
										children: "Засчитывается автоматически"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Описание",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: stepDraft.description,
								onChange: (event) => setStepDraft({
									...stepDraft,
									description: event.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Порядок",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "numeric",
								value: stepDraft.sortOrder,
								onChange: (event) => setStepDraft({
									...stepDraft,
									sortOrder: Number(event.target.value)
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: stepDraft.required,
						onChange: (event) => setStepDraft({
							...stepDraft,
							required: event.target.checked
						})
					}), "Обязательный шаг"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => void saveStep(),
						children: stepDraft.id ? "Сохранить шаг" : "Добавить шаг"
					}), stepDraft.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "line",
						onClick: () => setStepDraft(EMPTY_STEP),
						children: "Новый шаг"
					}) : null]
				})
			]
		}) : null,
		draft?.id && kind === "surveys" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-lg bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Вопросы опроса"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2",
					children: [questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Вопросов пока нет."
					}) : null, questions.map((question, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							index + 1,
							". ",
							question.text,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" · ", QUESTION_TYPES.find((item) => item[0] === question.type)?.[1] ?? question.type]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-brand",
								onClick: () => setQuestionDraft(question),
								children: "Изменить"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-muted",
								onClick: () => void removeQuestion(question.id),
								children: "Удалить"
							})]
						})]
					}, question.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Текст вопроса",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: questionDraft.text,
								onChange: (event) => setQuestionDraft({
									...questionDraft,
									text: event.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Тип ответа",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
								value: questionDraft.type,
								onChange: (event) => setQuestionDraft({
									...questionDraft,
									type: event.target.value
								}),
								children: QUESTION_TYPES.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: id,
									children: label
								}, id))
							})
						}),
						questionDraft.type === "single_choice" || questionDraft.type === "multiple_choice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Варианты, каждый с новой строки",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: questionDraft.options,
								onChange: (event) => setQuestionDraft({
									...questionDraft,
									options: event.target.value
								})
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Порядок",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								inputMode: "numeric",
								value: questionDraft.sortOrder,
								onChange: (event) => setQuestionDraft({
									...questionDraft,
									sortOrder: Number(event.target.value)
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: questionDraft.required,
						onChange: (event) => setQuestionDraft({
							...questionDraft,
							required: event.target.checked
						})
					}), "Обязательный вопрос"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => void saveQuestion(),
						children: questionDraft.id ? "Сохранить вопрос" : "Добавить вопрос"
					}), questionDraft.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "line",
						onClick: () => setQuestionDraft(EMPTY_QUESTION),
						children: "Новый вопрос"
					}) : null]
				})
			]
		}) : null,
		draft?.id && kind === "events" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-lg bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-bold",
				children: "Участники"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-2",
				children: [participants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Пока никто не записался."
				}) : null, participants.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [person.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [" · ", attendanceLabel(person.status)]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void setAttendance(person.id, "attended"),
							children: "Был"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "line",
							onClick: () => void setAttendance(person.id, "no_show"),
							children: "Неявка"
						})]
					})]
				}, person.id))]
			})]
		}) : null
	] });
}
function list(data) {
	const source = Array.isArray(data) ? data : data?.items;
	return Array.isArray(source) ? source.filter((item) => Boolean(item) && typeof item === "object") : [];
}
function ProductTools({ productId }) {
	const [variants, setVariants] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [badges, setBadges] = (0, import_react.useState)([]);
	const [discounts, setDiscounts] = (0, import_react.useState)([]);
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("0");
	const [stock, setStock] = (0, import_react.useState)("1");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [categoryName, setCategoryName] = (0, import_react.useState)("");
	const [badgeName, setBadgeName] = (0, import_react.useState)("");
	const [badgeColor, setBadgeColor] = (0, import_react.useState)("#306cc0");
	const [discount, setDiscount] = (0, import_react.useState)("10");
	async function reload() {
		const [variantRows, categoryRows, badgeRows, discountRows] = await Promise.all([
			apex(`/api/products/${productId}/variants`).catch(() => []),
			apex("/api/products/variant-categories").catch(() => []),
			apex("/api/badges").catch(() => []),
			apex(`/api/products/${productId}/discounts`).catch(() => [])
		]);
		setVariants(list(variantRows));
		setCategories(list(categoryRows));
		setBadges(list(badgeRows));
		setDiscounts(list(discountRows));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, [productId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-4 rounded-xl border border-line bg-surface p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold",
				children: "Варианты"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-1 text-sm",
				children: [variants.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(item.name) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							String(item.price ?? ""),
							" · ",
							String(item.stock ?? "")
						]
					})]
				}, String(item.id))), variants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "Вариантов нет."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: name,
						onChange: (event) => setName(event.target.value),
						placeholder: "Название варианта"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: price,
							onChange: (event) => setPrice(event.target.value),
							placeholder: "Цена"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: stock,
							onChange: (event) => setStock(event.target.value),
							placeholder: "Остаток"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
						value: categoryId,
						onChange: (event) => setCategoryId(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Без категории"
						}), categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: String(item.id),
							children: String(item.name)
						}, String(item.id)))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						onClick: () => {
							apex(`/api/products/${productId}/variants`, {
								method: "POST",
								body: JSON.stringify({
									name,
									categoryId: categoryId ? Number(categoryId) : null,
									price: Number(price),
									stock: Number(stock)
								})
							}).then(() => {
								setName("");
								toast.success("Вариант создан");
								return reload();
							}).catch((error) => toast.error(error instanceof Error ? error.message : "Не получилось"));
						},
						children: "Добавить вариант"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: categoryName,
							onChange: (event) => setCategoryName(event.target.value),
							placeholder: "Новая категория вариантов"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "line",
							onClick: () => {
								apex("/api/products/variant-categories", {
									method: "POST",
									body: JSON.stringify({ name: categoryName })
								}).then(() => {
									setCategoryName("");
									toast.success("Категория создана");
									return reload();
								}).catch((error) => toast.error(error instanceof Error ? error.message : "Не получилось"));
							},
							children: "Создать"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold",
				children: "Бейджи и скидки"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm",
				children: badges.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full px-2 py-0.5 text-xs font-semibold text-white",
						style: { background: String(item.color || "#306cc0") },
						children: String(item.name)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs font-semibold text-brand",
						onClick: () => {
							apex(`/api/products/${productId}/badges`, {
								method: "POST",
								body: JSON.stringify({ badgeId: Number(item.id) })
							}).then(() => toast.success("Бейдж назначен")).catch((error) => toast.error(error instanceof Error ? error.message : "Не получилось"));
						},
						children: "Назначить"
					})]
				}, String(item.id)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: badgeName,
						onChange: (event) => setBadgeName(event.target.value),
						placeholder: "Новый бейдж"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Цвет бейджа",
						type: "color",
						value: badgeColor,
						onChange: (event) => setBadgeColor(event.target.value),
						className: "size-11"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						onClick: () => {
							apex("/api/badges", {
								method: "POST",
								body: JSON.stringify({
									name: badgeName,
									color: badgeColor,
									code: badgeName.toLowerCase().replace(/\s+/g, "-"),
									isActive: true,
									sortOrder: 0,
									assignmentType: "manual"
								})
							}).then(() => {
								setBadgeName("");
								toast.success("Бейдж создан");
								return reload();
							}).catch((error) => toast.error(error instanceof Error ? error.message : "Не получилось"));
						},
						children: "Бейдж"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: ["Скидки: ", discounts.map((item) => `${item.discountPercent}%`).join(", ") || "нет"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: discount,
					onChange: (event) => setDiscount(event.target.value),
					placeholder: "Процент"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "line",
					onClick: () => {
						apex(`/api/products/${productId}/discounts`, {
							method: "POST",
							body: JSON.stringify({
								discountPercent: Number(discount),
								startsAt: (/* @__PURE__ */ new Date()).toISOString(),
								isActive: true
							})
						}).then(() => {
							toast.success("Скидка сохранена");
							return reload();
						}).catch((error) => toast.error(error instanceof Error ? error.message : "Не получилось"));
					},
					children: "Скидка"
				})]
			})
		]
	});
}
function NewsDesk() {
	const [title, setTitle] = (0, import_react.useState)("");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [items, setItems] = (0, import_react.useState)([]);
	function load() {
		apex("/api/company-news?page=1&pageSize=20").then((data) => setItems(list(data))).catch(() => setItems([]));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-xl border border-line bg-surface p-4 shadow-sm",
			onSubmit: (event) => {
				event.preventDefault();
				apex("/api/company-news", {
					method: "POST",
					body: JSON.stringify({
						title,
						summary,
						content
					})
				}).then(() => {
					setTitle("");
					setSummary("");
					setContent("");
					toast.success("Новость опубликована");
					load();
				}).catch((error) => toast.error(error instanceof Error ? error.message : "Не получилось"));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Новая новость"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Заголовок",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: title,
						onChange: (event) => setTitle(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Коротко",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: summary,
						onChange: (event) => setSummary(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Текст",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: content,
						onChange: (event) => setContent(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Опубликовать"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-line bg-gradient-to-r from-brand-wash to-surface px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: String(item.title)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: String(item.summary || "")
				})]
			}, String(item.id)))
		})]
	});
}
var TABS = [
	"Товары",
	"Заказы",
	"Сотрудники",
	"Активности",
	"Экономика",
	"Обращения",
	"Лента"
];
function tabsFor(role) {
	if (role === "hr") return ["Активности"];
	if (role === "merchandiser") return ["Товары", "Заказы"];
	if (role === "support") return ["Обращения"];
	if (role === "manager") return ["Сотрудники"];
	if (role === "admin" || role === "chief") return [...TABS];
	return TABS.filter((item) => item !== "Лента");
}
function AdminPage() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const allowed = user ? tabsFor(user.role) : [];
	const [tab, setTab] = (0, import_react.useState)(allowed[0] ?? "Товары");
	if (!user) return null;
	if (!canOpenAdmin(user.role) || allowed.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Недостаточно прав"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Этот раздел доступен по роли: магазин, активности, сотрудники отдела или обращения."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 inline-block text-sm font-semibold text-brand",
				children: "На главную"
			})
		]
	});
	const current = allowed.includes(tab) ? tab : allowed[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: user.role === "support" ? "Обращения" : user.role === "manager" ? "Сотрудники" : canManageActivities(user.role) && !canManageShop(user.role) ? "Активности" : canManageShop(user.role) && !canManageActivities(user.role) ? "Магазин" : "Администрирование"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Вы вошли как ",
					user.name,
					"."
				]
			}),
			allowed.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-1 rounded-lg bg-card p-1",
				role: "tablist",
				children: allowed.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": current === item,
					onClick: () => setTab(item),
					className: `min-h-10 rounded-md px-3 text-sm font-semibold ${current === item ? "bg-brand text-white" : "text-ink hover:bg-surface"}`,
					children: item
				}, item))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [
					current === "Товары" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Products, {}) : null,
					current === "Заказы" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orders, {}) : null,
					current === "Сотрудники" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(People, {}) : null,
					current === "Активности" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activities, {}) : null,
					current === "Экономика" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Economy, {}) : null,
					current === "Обращения" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tickets, {}) : null,
					current === "Лента" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsDesk, {}) : null
				]
			})
		]
	});
}
function orderTone(status) {
	if (status === "cancelled") return "bg-rose-100 text-rose-800";
	if (status === "ready") return "bg-emerald-100 text-emerald-800";
	if (status === "processing") return "bg-amber-100 text-amber-950";
	return "bg-sky-100 text-sky-900";
}
function emptyProduct() {
	return {
		id: "new",
		category: "",
		title: "",
		description: "",
		price: 500,
		stock: 1,
		active: true,
		image: "/rewards/card-c.jpg"
	};
}
function Products() {
	const products = useStore((state) => state.products);
	const categories = useStore((state) => state.categories);
	const save = useStore((state) => state.saveProduct);
	const uploadImage = useStore((state) => state.uploadImage);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [onlyActive, setOnlyActive] = (0, import_react.useState)("all");
	const [categoryId, setCategoryId] = (0, import_react.useState)("all");
	const filtered = products.filter((product) => {
		const needle = query.trim().toLowerCase();
		const text = `${product.title} ${product.categoryName ?? ""} ${categoryLabel(product.category, product.categoryName)}`.toLowerCase();
		if (needle && !text.includes(needle)) return false;
		if (onlyActive === "yes" && !product.active) return false;
		if (onlyActive === "no" && product.active) return false;
		if (categoryId !== "all" && product.category !== categoryId) return false;
		return true;
	});
	const page = usePage(filtered, 8, `${query}|${onlyActive}|${categoryId}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Поиск товара",
						"aria-label": "Поиск товара",
						className: "max-w-xs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
						value: onlyActive,
						onChange: (event) => setOnlyActive(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Все статусы"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "yes",
								children: "В каталоге"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "no",
								children: "Скрытые"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
						value: categoryId,
						onChange: (event) => setCategoryId(event.target.value),
						"aria-label": "Категория товара",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Все категории"
						}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: category.id,
							children: category.name
						}, category.id))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 sm:grid-cols-2",
				children: page.items.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setDraft(product),
					className: "flex w-full gap-3 rounded-xl border border-line bg-gradient-to-b from-surface to-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-mid hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: "",
						className: "size-16 rounded-lg object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: product.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted",
								children: categoryLabel(product.category, product.categoryName)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-sm",
								children: [
									formatNumber(product.price),
									" апексов · ",
									product.stock,
									" шт."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${product.active ? "bg-emerald-100 text-emerald-800" : "bg-card text-muted"}`,
								children: product.active ? "В каталоге" : "Скрыт"
							})
						]
					})]
				}) }, product.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				page: page.page,
				pages: page.pages,
				total: page.total,
				onPage: page.setPage
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-lg bg-card p-4",
			onSubmit: (event) => {
				event.preventDefault();
				if (!draft || saving) return;
				setSaving(true);
				save(draft).then((result) => {
					setSaving(false);
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Товар сохранён");
						setDraft(null);
					}
				});
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: draft ? "Карточка товара" : "Товар"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm font-semibold text-brand",
					onClick: () => setDraft(emptyProduct()),
					children: "Новый"
				})]
			}), draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Название",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: draft.title,
						onChange: (event) => setDraft({
							...draft,
							title: event.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Описание",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: draft.description,
						onChange: (event) => setDraft({
							...draft,
							description: event.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Фото",
					children: [
						draft.image.startsWith("http") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: draft.image,
							alt: "",
							className: "mb-2 h-24 w-24 rounded-md object-cover"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/jpeg,image/png,image/webp",
							className: "block w-full text-sm",
							disabled: uploading,
							onChange: (event) => {
								const file = event.target.files?.[0];
								event.target.value = "";
								if (!file || !draft) return;
								setUploading(true);
								uploadImage(file, "products").then((result) => {
									setUploading(false);
									if (!result.ok || !result.url) toast.error(result.ok ? "Сервер не вернул ссылку" : result.error);
									else setDraft({
										...draft,
										image: result.url
									});
								});
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: uploading ? "Загружаем фото…" : "JPEG, PNG или WebP, до 2 МБ."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Категория",
					children: categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: draft.category,
						inputMode: "numeric",
						placeholder: "id категории",
						onChange: (event) => setDraft({
							...draft,
							category: event.target.value
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: draft.category,
						onChange: (event) => setDraft({
							...draft,
							category: event.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Без категории"
						}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: category.id,
							children: category.name
						}, category.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Цена, апексы",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: draft.price,
							onChange: (event) => setDraft({
								...draft,
								price: Number(event.target.value)
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Остаток",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: draft.stock,
							onChange: (event) => setDraft({
								...draft,
								stock: Number(event.target.value)
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: draft.active,
						onChange: (event) => setDraft({
							...draft,
							active: event.target.checked
						})
					}), "Показывать в каталоге"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: saving || uploading,
					children: saving ? "Сохраняем…" : "Сохранить"
				}),
				draft.id !== "new" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTools, { productId: draft.id }) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Выберите товар или создайте новый."
			})]
		})]
	});
}
function Orders() {
	const orders = useStore((state) => state.allOrders);
	const people = useStore((state) => state.people);
	const updateOrderStatus = useStore((state) => state.setOrderStatus);
	const loadAllOrders = useStore((state) => state.loadAllOrders);
	const [error, setError] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [period, setPeriod] = (0, import_react.useState)("all");
	const filtered = orders.filter((order) => {
		const text = `${people.find((item) => item.id === order.userId)?.name ?? ""} ${order.items.map((item) => `${item.title} ${item.variantName ?? ""}`).join(" ")}`.toLowerCase();
		if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;
		if (status !== "all" && order.status !== status) return false;
		if (period !== "all") {
			const age = Date.now() - new Date(order.createdAt).getTime();
			const limit = period === "1" ? 864e5 : period === "7" ? 6048e5 : 2592e6;
			if (!Number.isFinite(age) || age > limit) return false;
		}
		return true;
	});
	const page = usePage(filtered, 8, `${query}|${status}|${period}`);
	(0, import_react.useEffect)(() => {
		loadAllOrders().catch((reason) => {
			setError(reason instanceof Error ? reason.message : "Не удалось загрузить заказы");
		});
	}, [loadAllOrders]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-danger",
			children: error
		}) : null,
		orders.length === 0 && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Заказов пока нет."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Сотрудник или товар",
					"aria-label": "Поиск заказа",
					className: "max-w-xs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
					value: status,
					onChange: (event) => setStatus(event.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "Все статусы"
					}), ORDER_FLOW.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item,
						children: orderStatusLabel(item)
					}, item))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
					value: period,
					onChange: (event) => setPeriod(event.target.value),
					"aria-label": "Период заказов",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "За всё время"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "1",
							children: "Сегодня"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "7",
							children: "7 дней"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "30",
							children: "30 дней"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: page.items.map((order) => {
				const person = people.find((item) => item.id === order.userId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-line bg-gradient-to-b from-surface to-card p-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [person ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/people/$userId",
								params: { userId: person.id },
								className: "flex items-center gap-2 font-semibold hover:text-brand",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
									user: person,
									className: "size-9"
								}), person.name]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Сотрудник" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-1 text-xs font-semibold ${orderTone(order.status)}`,
								children: orderStatusLabel(order.status)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: order.items.map((item) => `${item.title}${item.variantName ? ` (${item.variantName})` : ""} ×${item.qty}`).join(", ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold tabular",
								children: [formatNumber(order.total), " апексов"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-10 rounded-md border border-line bg-surface px-2",
								value: order.status,
								onChange: (event) => {
									updateOrderStatus(order.id, event.target.value).then((result) => {
										if (!result.ok) toast.error(result.error);
										else toast.success(event.target.value === "cancelled" ? "Заказ отменён, апексы вернулись на баланс" : "Статус заказа обновлён");
									});
								},
								children: [!ORDER_FLOW.includes(order.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: order.status,
									children: orderStatusLabel(order.status)
								}) : null, ORDER_FLOW.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item,
									children: orderStatusLabel(item)
								}, item))]
							})]
						})
					]
				}, order.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
			page: page.page,
			pages: page.pages,
			total: page.total,
			onPage: page.setPage
		})
	] });
}
function People() {
	const people = useStore((state) => state.people);
	const me = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const departmentIds = useStore((state) => state.departmentIds);
	const [peopleQuery, setPeopleQuery] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const visible = (me?.role === "manager" ? people.filter((person) => departmentIds.includes(person.id)) : people).filter((person) => {
		const needle = peopleQuery.trim().toLowerCase();
		if (roleFilter !== "all" && person.role !== roleFilter) return false;
		if (!needle) return true;
		return `${person.name} ${person.department} ${person.position}`.toLowerCase().includes(needle);
	});
	const peoplePage = usePage(visible, 8, `${peopleQuery}|${roleFilter}`);
	const roles = useStore((state) => state.roleCatalog);
	const setRole = useStore((state) => state.setUserRole);
	const setStatus = useStore((state) => state.setUserStatus);
	const updateEmployee = useStore((state) => state.updateEmployee);
	const createEmployee = useStore((state) => state.createEmployee);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [middleName, setMiddleName] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("");
	const [position, setPosition] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)({
		id: "",
		firstName: "",
		lastName: "",
		middleName: "",
		department: "",
		position: ""
	});
	const editing = people.find((person) => person.id === edit.id);
	const canCreate = me?.role !== "manager";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		canCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-4 grid gap-3 rounded-lg bg-card p-4 sm:grid-cols-2",
			onSubmit: (event) => {
				event.preventDefault();
				setPending(true);
				createEmployee({
					email,
					password,
					firstName,
					lastName,
					middleName,
					department,
					position
				}).then((result) => {
					setPending(false);
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Сотрудник создан. При первом входе он должен сменить пароль.");
						setEmail("");
						setPassword("");
						setFirstName("");
						setLastName("");
						setMiddleName("");
					}
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold sm:col-span-2",
					children: "Новый сотрудник"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Почта",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "email",
						value: email,
						onChange: (event) => setEmail(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Временный пароль",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "text",
						value: password,
						onChange: (event) => setPassword(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Фамилия",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: lastName,
						onChange: (event) => setLastName(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Имя",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: firstName,
						onChange: (event) => setFirstName(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Отчество",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: middleName,
						onChange: (event) => setMiddleName(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionField, {
					label: "Отдел",
					value: department,
					options: [...new Set(people.map((person) => person.department.trim()).filter(Boolean))].sort(),
					onChange: setDepartment
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionField, {
					label: "Должность",
					value: position,
					options: [...new Set(people.map((person) => person.position.trim()).filter(Boolean))].sort(),
					onChange: setPosition
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending,
					className: "sm:col-span-2 sm:w-auto",
					children: "Создать"
				})
			]
		}) : null,
		editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mb-4 grid gap-3 rounded-lg bg-card p-4 sm:grid-cols-2",
			onSubmit: (event) => {
				event.preventDefault();
				updateEmployee(edit).then((result) => {
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Данные сотрудника сохранены");
						setEdit({
							id: "",
							firstName: "",
							lastName: "",
							middleName: "",
							department: "",
							position: ""
						});
					}
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-lg font-bold sm:col-span-2",
					children: ["Данные: ", editing.name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Фамилия",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: edit.lastName,
						onChange: (event) => setEdit({
							...edit,
							lastName: event.target.value
						}),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Имя",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: edit.firstName,
						onChange: (event) => setEdit({
							...edit,
							firstName: event.target.value
						}),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Отчество",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: edit.middleName,
						onChange: (event) => setEdit({
							...edit,
							middleName: event.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Отдел",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: edit.department,
						onChange: (event) => setEdit({
							...edit,
							department: event.target.value
						}),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Должность",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: edit.position,
						onChange: (event) => setEdit({
							...edit,
							position: event.target.value
						}),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Сохранить"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "line",
						onClick: () => setEdit({
							id: "",
							firstName: "",
							lastName: "",
							middleName: "",
							department: "",
							position: ""
						}),
						children: "Отмена"
					})]
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				value: peopleQuery,
				onChange: (event) => setPeopleQuery(event.target.value),
				placeholder: "Поиск сотрудника",
				"aria-label": "Поиск сотрудника",
				className: "max-w-xs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
				value: roleFilter,
				onChange: (event) => setRoleFilter(event.target.value),
				"aria-label": "Роль",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "Все роли"
				}), Object.keys(ROLE_LABEL).map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: role,
					children: ROLE_LABEL[role]
				}, role))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg border border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[760px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-card text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Сотрудник"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Отдел"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Роль"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Статус"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-3 text-muted",
					colSpan: 4,
					children: "В вашем отделе пока никого нет."
				}) }) : null, peoplePage.items.map((person) => {
					const code = person.roleCodes?.[0] ?? "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
										user: person,
										className: "size-8"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: person.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: person.position
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-1 text-xs font-semibold text-brand",
									onClick: () => {
										setEdit({
											id: person.id,
											firstName: person.firstName ?? "",
											lastName: person.lastName ?? "",
											middleName: person.middleName ?? "",
											department: person.department,
											position: person.position
										});
									},
									children: "Изменить данные"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: person.department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: me?.role === "manager" ? roleCodeLabel(code || person.role) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-10 max-w-48 rounded-md border border-line bg-surface px-2",
									value: code,
									onChange: (event) => {
										setRole(person.id, event.target.value).then((result) => {
											if (!result.ok) toast.error(result.error);
										});
									},
									children: [code && !roles.some((role) => role.code === code) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: code,
										children: roleCodeLabel(code)
									}) : null, roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: role.code,
										children: roleCodeLabel(role.code)
									}, role.code))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "font-semibold text-brand",
									onClick: () => void setStatus(person.id, person.status === "active" ? "blocked" : "active").then((result) => {
										if (!result.ok) toast.error(result.error);
									}),
									children: person.status === "active" ? "Активен" : "Заблокирован"
								})
							})
						]
					}, person.id);
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
			page: peoplePage.page,
			pages: peoplePage.pages,
			total: peoplePage.total,
			onPage: peoplePage.setPage
		})
	] });
}
function Activities() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminActivities, {});
}
function Economy() {
	const people = useStore((state) => state.people);
	const ledger = useStore((state) => state.allLedger);
	const loadAllLedger = useStore((state) => state.loadAllLedger);
	const adjust = useStore((state) => state.adjustBalance);
	const [userId, setUserId] = (0, import_react.useState)(people[0]?.id ?? "");
	const [amount, setAmount] = (0, import_react.useState)(100);
	const [reason, setReason] = (0, import_react.useState)("");
	const [balanceType, setBalanceType] = (0, import_react.useState)("Personal");
	const [error, setError] = (0, import_react.useState)("");
	const [adjusting, setAdjusting] = (0, import_react.useState)(false);
	const [ledgerQuery, setLedgerQuery] = (0, import_react.useState)("");
	const [ledgerType, setLedgerType] = (0, import_react.useState)("all");
	const sorted = [...ledger].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).filter((entry) => {
		if (ledgerType !== "all" && entry.type !== ledgerType) return false;
		return `${people.find((person) => person.id === entry.userId)?.name ?? ""} ${entry.reason}`.toLowerCase().includes(ledgerQuery.trim().toLowerCase());
	});
	const ledgerPage = usePage(sorted, 8, `${ledgerQuery}|${ledgerType}`);
	(0, import_react.useEffect)(() => {
		loadAllLedger().catch((reason) => {
			setError(reason instanceof Error ? reason.message : "Не удалось загрузить транзакции");
		});
	}, [loadAllLedger]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-lg bg-card p-4",
			onSubmit: (event) => {
				event.preventDefault();
				if (adjusting) return;
				setAdjusting(true);
				adjust({
					userId,
					amount,
					reason,
					balanceType
				}).then((result) => {
					setAdjusting(false);
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Баланс обновлён");
						setReason("");
						loadAllLedger();
					}
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Корректировка"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Какой баланс",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: balanceType,
						onChange: (event) => setBalanceType(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Personal",
							children: "Личный"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Reward",
							children: "Рабочий, для поощрений"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Сотрудник",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: userId,
						onChange: (event) => setUserId(event.target.value),
						children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: person.id,
							children: person.name
						}, person.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Сумма",
					hint: "Отрицательная списывает апексы. Баланс ниже нуля невозможен.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						inputMode: "numeric",
						value: amount,
						onChange: (event) => setAmount(Number(event.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Причина",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: reason,
						onChange: (event) => setReason(event.target.value),
						placeholder: "За что корректировка"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: adjusting,
					children: adjusting ? "Проводим…" : "Провести"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: ledgerQuery,
					onChange: (event) => setLedgerQuery(event.target.value),
					placeholder: "Поиск по сотруднику или причине",
					"aria-label": "Поиск транзакций",
					className: "max-w-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
					value: ledgerType,
					onChange: (event) => setLedgerType(event.target.value),
					"aria-label": "Тип операции",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "Все операции"
					}), Object.keys(ENTRY_LABEL).map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: type,
						children: ENTRY_LABEL[type]
					}, type))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "divide-y divide-line rounded-lg border border-line",
				children: [ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-3 py-3 text-sm text-muted",
					children: "Транзакций пока нет."
				}) : null, ledgerPage.items.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "min-w-0 break-words",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: people.find((person) => person.id === entry.userId)?.name ?? "Сотрудник"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", entry.reason]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 tabular font-semibold",
						children: [entry.amount > 0 ? "+" : "", formatNumber(entry.amount)]
					})]
				}, entry.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				page: ledgerPage.page,
				pages: ledgerPage.pages,
				total: ledgerPage.total,
				onPage: ledgerPage.setPage
			})
		] })]
	});
}
function Tickets() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const tickets = useStore((state) => state.tickets);
	const ticketsError = useStore((state) => state.ticketsError);
	const loadTickets = useStore((state) => state.loadTickets);
	const setStatus = useStore((state) => state.setTicketStatus);
	const assignTicket = useStore((state) => state.assignTicket);
	const [ticketQuery, setTicketQuery] = (0, import_react.useState)("");
	const [ticketStatus, setTicketStatus] = (0, import_react.useState)("all");
	const filteredTickets = tickets.filter((ticket) => {
		if (ticketStatus !== "all" && ticket.status !== ticketStatus) return false;
		return `${ticket.subject ?? ""} ${ticket.id} ${ticket.userName ?? ""}`.toLowerCase().includes(ticketQuery.trim().toLowerCase());
	});
	const ticketPage = usePage(filteredTickets, 8, `${ticketQuery}|${ticketStatus}`);
	(0, import_react.useEffect)(() => {
		loadTickets();
	}, [loadTickets]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Ответ пишется в карточке обращения."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				value: ticketQuery,
				onChange: (event) => setTicketQuery(event.target.value),
				placeholder: "Поиск обращения",
				"aria-label": "Поиск обращения",
				className: "max-w-xs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-11 rounded-md border border-line bg-surface px-3 text-sm",
				value: ticketStatus,
				onChange: (event) => setTicketStatus(event.target.value),
				"aria-label": "Статус обращения",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "Все статусы"
				}), Object.keys(TICKET_STATUS).map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: status,
					children: TICKET_STATUS[status]
				}, status))]
			})]
		}),
		ticketsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-danger",
			children: ticketsError
		}) : null,
		tickets.length === 0 && !ticketsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Обращений пока нет."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: ticketPage.items.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-center gap-3 rounded-lg bg-card px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: ticket.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [ticket.userName || "Сотрудник", ticket.assignedName ? ` · ведёт ${ticket.assignedName}` : " · не назначено"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-10 rounded-md border border-line bg-surface px-2 text-sm",
						value: ticket.status,
						onChange: (event) => {
							setStatus(ticket.id, event.target.value).then((result) => {
								if (!result.ok) toast.error(result.error);
							});
						},
						children: Object.keys(TICKET_STATUS).map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: status,
							children: TICKET_STATUS[status]
						}, status))
					}),
					user && !ticket.assignedTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm font-semibold text-brand",
						onClick: () => void assignTicket(ticket.id, user.id).then((result) => {
							if (!result.ok) toast.error(result.error);
						}),
						children: "Взять"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/support",
						className: "text-sm font-semibold text-brand",
						children: "Открыть"
					})
				]
			}, ticket.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
			page: ticketPage.page,
			pages: ticketPage.pages,
			total: ticketPage.total,
			onPage: ticketPage.setPage
		})
	] });
}
function OptionField({ label, value, options, onChange }) {
	const [other, setOther] = (0, import_react.useState)(false);
	if (options.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			value,
			onChange: (event) => onChange(event.target.value),
			required: true
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
			value: other ? "__custom" : value,
			onChange: (event) => {
				if (event.target.value === "__custom") {
					setOther(true);
					onChange("");
					return;
				}
				setOther(false);
				onChange(event.target.value);
			},
			required: !other,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Выберите"
				}),
				options.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: item,
					children: item
				}, item)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "__custom",
					children: "Другое"
				})
			]
		}), other ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			className: "mt-2",
			value,
			placeholder: "Своё значение",
			onChange: (event) => onChange(event.target.value),
			required: true
		}) : null]
	});
}
//#endregion
export { AdminPage as component };
