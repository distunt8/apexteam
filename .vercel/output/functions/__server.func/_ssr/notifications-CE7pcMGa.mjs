import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as formatDateTime, p as apex, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell } from "./shell-1JLU4O9d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-CE7pcMGa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	async function load() {
		const data = await apex("/api/notifications?page=1&pageSize=30");
		const list = Array.isArray(data) ? data : data?.items;
		if (!Array.isArray(list)) {
			setItems([]);
			return;
		}
		setItems(list.map((item) => {
			const record = item;
			return {
				id: String(record.id ?? ""),
				title: String(record.title || record.subject || "Уведомление"),
				body: String(record.body || record.message || record.text || ""),
				createdAt: String(record.createdAt || ""),
				read: Boolean(record.isRead || record.read)
			};
		}));
	}
	(0, import_react.useEffect)(() => {
		load().catch((reason) => setError(reason instanceof Error ? reason.message : "Не удалось загрузить уведомления"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Уведомления"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "line",
				onClick: () => {
					apex("/api/notifications/read-all", { method: "POST" }).then(() => load()).catch((reason) => setError(reason instanceof Error ? reason.message : "Не получилось"));
				},
				children: "Прочитать все"
			})]
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-danger",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-5 space-y-2",
			children: [items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "Пока пусто."
			}) : null, items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `w-full rounded-xl border border-line px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.read ? "bg-surface" : "bg-gradient-to-r from-brand-wash to-surface"}`,
				onClick: () => {
					apex(`/api/notifications/${item.id}/read`, { method: "PATCH" }).then(() => load());
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: item.title
					}),
					item.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: item.body
					}) : null,
					item.createdAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: formatDateTime(item.createdAt)
					}) : null
				]
			}) }, item.id))]
		})
	] });
}
//#endregion
export { NotificationsPage as component };
