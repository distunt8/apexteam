import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as formatPoints, i as useStore, m as Panel, o as formatDateTime } from "./router-CTHYymUA.mjs";
import { i as Shell, s as orderStatusLabel } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-Cz2zdOmU.js
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const userId = useStore((state) => state.currentUserId);
	const orders = useStore((state) => state.orders).filter((order) => order.userId === userId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Мои заказы"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Статус меняет администратор. Отмена возвращает баллы."
			}),
			orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Заказов пока нет."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: order.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-brand-wash px-3 py-1 text-xs font-semibold text-brand-deep",
							children: orderStatusLabel(order.status)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: formatDateTime(order.createdAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 text-sm",
						children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								item.title,
								" × ",
								item.qty
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular text-muted",
								children: formatPoints(item.price * item.qty)
							})]
						}, item.productId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm font-semibold",
						children: ["Итого ", formatPoints(order.total)]
					})
				] }) }, order.id))
			})
		]
	});
}
//#endregion
export { OrdersPage as component };
