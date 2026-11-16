import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Award, S as Gift, a as Undo2, c as SlidersHorizontal, l as ShoppingBag, x as Heart } from "../_libs/lucide-react.mjs";
import { S as Chip, _ as formatNumber, b as pointsLabel, f as useStore, g as formatDateTime } from "./router-Dr41VdEz.mjs";
import { a as Shell, n as ENTRY_LABEL } from "./shell-1JLU4O9d.mjs";
import { n as usePage, t as Pager } from "./pager-DvNdDOo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-D6aAUAJ6.js
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
		id: "refund",
		label: "Возвраты"
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
	const page = usePage(rows, 8, filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "История"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Покупки списывают личные апексы. Поощрение руководителя списывается с его рабочего баланса. Личная благодарность баланс отправителя не меняет."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
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
				className: "mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line shadow-[0_10px_30px_-18px_rgba(20,40,70,0.45)]",
				children: page.items.map((entry) => {
					const other = people.find((person) => person.id === entry.counterpartyId);
					const positive = entry.amount > 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-surface px-4 py-3 transition hover:bg-brand-wash/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-full bg-brand-wash text-brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryIcon, { type: entry.type })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: ENTRY_LABEL[entry.type]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm break-words text-muted",
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
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "shrink-0 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `text-lg font-bold tabular ${positive ? "text-brand" : "text-ink"}`,
									children: [
										positive ? "+" : "",
										formatNumber(entry.amount),
										" ",
										pointsLabel(Math.abs(entry.amount))
									]
								}), entry.type === "manager_award" && entry.amount < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted",
									children: "рабочий"
								}) : null]
							})
						]
					}, entry.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				page: page.page,
				pages: page.pages,
				total: page.total,
				onPage: page.setPage
			})
		]
	});
}
function EntryIcon({ type }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(type === "recognition_received" || type === "recognition_sent" ? Heart : type === "manager_award" ? Award : type === "purchase" ? ShoppingBag : type === "refund" ? Undo2 : type === "admin_adjustment" ? SlidersHorizontal : Gift, { className: "size-4" });
}
//#endregion
export { HistoryPage as component };
