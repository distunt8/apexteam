import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as useStore, g as formatDateTime, v as formatPoints, w as Panel } from "./router-Dr41VdEz.mjs";
import { a as Shell, l as orderStatusLabel } from "./shell-1JLU4O9d.mjs";
import { n as usePage, t as Pager } from "./pager-DvNdDOo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-d02WD_dG.js
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const userId = useStore((state) => state.currentUserId);
	const orders = useStore((state) => state.orders).filter((order) => order.userId === userId);
	const page = usePage(orders, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Мои заказы"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Отмену делает администратор или мерчендайзер: апексы возвращаются на баланс."
			}),
			orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Заказов пока нет."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: page.items.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: formatDateTime(order.createdAt)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`,
							children: orderStatusLabel(order.status)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 text-sm",
						children: order.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								item.title,
								item.variantName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-brand",
									children: [" · ", item.variantName]
								}) : null,
								" × ",
								item.qty
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular text-muted",
								children: formatPoints(item.price * item.qty)
							})]
						}, `${item.productId}-${item.variantName}-${index}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm font-semibold",
						children: ["Итого ", formatPoints(order.total)]
					})
				] }) }, order.id))
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
function statusTone(status) {
	if (status === "cancelled") return "bg-red-100 text-red-800";
	if (status === "issued" || status === "completed") return "bg-emerald-100 text-emerald-800";
	if (status === "processing" || status === "ready") return "bg-amber-100 text-amber-900";
	return "bg-brand-wash text-brand-deep";
}
//#endregion
export { OrdersPage as component };
