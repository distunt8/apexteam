import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as useStore, v as formatPoints, w as Panel } from "./router-Dr41VdEz.mjs";
import { t as AchievementMark } from "./achievement-mark-BYsHoESd.mjs";
import { a as Shell } from "./shell-1JLU4O9d.mjs";
import { t as ActivityLevelCard } from "./activity-level-CqKbBvop.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-activity-D5xs_HRZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MyActivityPage() {
	const catalog = useStore((state) => state.activitiesCatalog);
	const load = useStore((state) => state.loadActivities);
	const loadEngagement = useStore((state) => state.loadEngagement);
	(0, import_react.useEffect)(() => {
		load();
		loadEngagement();
	}, [load, loadEngagement]);
	const quests = catalog.quests.filter((item) => item.status === "in_progress" || item.status === "completed");
	const surveys = catalog.surveys.filter((item) => item.hasResponded);
	const events = catalog.events.filter((item) => item.status === "registered" || item.status === "attended");
	const badges = catalog.achievements.filter((item) => item.earned);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight",
			children: "Моя активность"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Квесты, опросы, мероприятия и достижения, в которых вы уже участвуете."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 max-w-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLevelCard, { detailed: true })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Квесты",
					tone: "border-sky-300",
					empty: "Вы ещё не вступали в квесты",
					children: quests.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						title: item.title,
						meta: item.status === "completed" ? "Завершён" : "В процессе",
						extra: formatPoints(item.reward)
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Опросы",
					tone: "border-amber-300",
					empty: "Ответов пока нет",
					children: surveys.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						title: item.title,
						meta: "Ответ отправлен",
						extra: item.reward > 0 ? formatPoints(item.reward) : ""
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Мероприятия",
					tone: "border-emerald-300",
					empty: "Записей пока нет",
					children: events.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						title: item.title,
						meta: item.status === "attended" ? "Посещение подтверждено" : "Вы записаны"
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					title: "Достижения",
					tone: "border-violet-300",
					empty: "Открытых достижений пока нет",
					children: badges.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-lg bg-surface px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementMark, {
							iconUrl: item.iconUrl,
							earned: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: item.description
						})] })]
					}, item.id))
				})
			]
		}),
		quests.length + surveys.length + events.length + badges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/activities",
				className: "font-semibold text-brand",
				children: "Перейти ко всем активностям"
			})
		}) : null
	] });
}
function Block({ title, empty, tone, children }) {
	const list = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: `border-l-4 ${tone}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-bold",
			children: title
		}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: empty
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children
		})]
	});
}
function Row({ title, meta, extra }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-md bg-surface px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-0.5 text-xs text-muted",
			children: [meta, extra ? ` · ${extra}` : ""]
		})]
	});
}
//#endregion
export { MyActivityPage as component };
