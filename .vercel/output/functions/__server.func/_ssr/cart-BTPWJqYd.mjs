import { S as useNavigate, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, l as Plus, u as Minus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatPoints, d as Button, i as useStore, m as Panel, s as formatNumber } from "./router-CTHYymUA.mjs";
import { i as Shell } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-BTPWJqYd.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const cart = useStore((state) => state.cart);
	const products = useStore((state) => state.products);
	const balance = useStore((state) => state.people.find((person) => person.id === state.currentUserId)?.balance ?? 0);
	const setQty = useStore((state) => state.setQty);
	const checkout = useStore((state) => state.checkout);
	const navigate = useNavigate();
	const lines = cart.map((item) => {
		const product = products.find((entry) => entry.id === item.productId);
		return product ? {
			...item,
			product
		} : null;
	}).filter((item) => Boolean(item));
	const total = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
	const short = total > balance;
	function change(productId, qty) {
		setQty(productId, qty).then((result) => {
			if (!result.ok) toast.error(result.error);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight",
			children: "Корзина"
		}), lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Пока пусто. Награды ждут в каталоге."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/catalog",
				className: "mt-4 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "В каталог" })
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 rounded-lg bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: line.product.image,
						alt: "",
						className: "size-20 rounded-md object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: line.product.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: formatPoints(line.product.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-11 place-items-center rounded-md border border-line",
										"aria-label": "Уменьшить",
										onClick: () => change(line.productId, line.qty - 1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular w-6 text-center text-sm font-semibold",
										children: line.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-11 place-items-center rounded-md border border-line",
										"aria-label": "Увеличить",
										onClick: () => change(line.productId, line.qty + 1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ml-auto grid size-11 place-items-center rounded-md text-danger",
										"aria-label": "Удалить",
										onClick: () => change(line.productId, 0),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							})
						]
					})]
				}, line.lineId || line.productId))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "К оплате"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-2xl font-bold text-brand",
					children: formatPoints(total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: ["На балансе ", formatNumber(balance)]
				}),
				short ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: "Недостаточно баллов. Уберите позицию или заработайте ещё."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => {
						checkout().then((result) => {
							if (!result.ok) toast.error(result.error);
							else {
								toast.success("Заказ оформлен");
								navigate({ to: "/orders" });
							}
						});
					},
					children: "Оплатить баллами"
				})
			] })]
		})]
	});
}
//#endregion
export { CartPage as component };
