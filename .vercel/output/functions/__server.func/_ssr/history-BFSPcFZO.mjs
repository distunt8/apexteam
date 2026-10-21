import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Chip, i as useStore, o as formatDateTime, s as formatNumber } from "./router-CTHYymUA.mjs";
import { i as Shell, t as ENTRY_LABEL } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-BFSPcFZO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		id: "all",
		label: "Все"
	},
	{
		id: "activity_reward",
		label: "Активности"
	},
	{
		id: "recognition_received",
		label: "Благодарности"
	},
	{
		id: "manager_award",
		label: "Поощрения"
	},
	{
		id: "purchase",
		label: "Покупки"
	},
	{
		id: "admin_adjustment",
		label: "Корректировки"
	}
];
function HistoryPage() {
	const userId = useStore((state) => state.currentUserId);
	const people = useStore((state) => state.people);
	const ledger = useStore((state) => state.ledger).filter((entry) => entry.userId === userId);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const rows = ledger.filter((entry) => {
		if (filter === "all") return true;
		if (filter === "recognition_received") return entry.type === "recognition_received" || entry.type === "recognition_sent";
		return entry.type === filter;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "История"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Покупки и начисления меняют баланс. Отправленная благодарность списывается из бюджета, не из баллов на награды."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: filter === item.id,
					onClick: () => setFilter(item.id),
					children: item.label
				}, item.id))
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Операций с таким фильтром нет."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line rounded-lg border border-line",
				children: rows.map((entry) => {
					const other = people.find((person) => person.id === entry.counterpartyId);
					const budget = entry.type === "recognition_sent";
					const positive = entry.amount > 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-start justify-between gap-3 bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: ENTRY_LABEL[entry.type]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: entry.reason
							}),
							other ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									positive ? "От" : "Кому",
									": ",
									other.name
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: formatDateTime(entry.createdAt)
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `tabular text-sm font-bold ${positive ? "text-brand" : "text-ink"}`,
							children: [
								positive ? "+" : "",
								formatNumber(entry.amount),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 font-medium text-muted",
									children: budget ? "бюджет" : "баллы"
								})
							]
						})]
					}, entry.id);
				})
			})
		]
	});
}
//#endregion
export { HistoryPage as component };
