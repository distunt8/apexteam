import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pager-DvNdDOo7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function usePage(items, size = 8, resetKey = "") {
	const [page, setPage] = (0, import_react.useState)(1);
	const [seen, setSeen] = (0, import_react.useState)(resetKey);
	if (seen !== resetKey) {
		setSeen(resetKey);
		setPage(1);
	}
	const pages = Math.max(1, Math.ceil(items.length / size));
	const current = Math.min(page, pages);
	const start = (current - 1) * size;
	return {
		page: current,
		pages,
		total: items.length,
		items: items.slice(start, start + size),
		setPage
	};
}
function Pager({ page, pages, total, onPage }) {
	if (pages <= 1) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "mt-4 flex items-center justify-between gap-3 text-sm",
		"aria-label": `Страница ${page} из ${pages}, записей ${total}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-9 rounded-md border border-line bg-surface px-3 font-semibold disabled:opacity-40",
				disabled: page <= 1,
				onClick: () => onPage(page - 1),
				children: "Назад"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular text-muted",
				children: [
					page,
					" / ",
					pages
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-9 rounded-md border border-line bg-surface px-3 font-semibold disabled:opacity-40",
				disabled: page >= pages,
				onClick: () => onPage(page + 1),
				children: "Дальше"
			})
		]
	});
}
//#endregion
export { usePage as n, Pager as t };
