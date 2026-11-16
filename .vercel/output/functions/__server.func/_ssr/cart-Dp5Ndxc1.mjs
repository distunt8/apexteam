import { i as __toESM } from "../_runtime.mjs";
import { S as useNavigate, X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Plus, m as Minus, s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as formatNumber, f as useStore, v as formatPoints, w as Panel, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell } from "./shell-1JLU4O9d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-Dp5Ndxc1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const cart = useStore((state) => state.cart);
	const products = useStore((state) => state.products);
	const balance = useStore((state) => state.people.find((person) => person.id === state.currentUserId)?.balance ?? 0);
	const setQty = useStore((state) => state.setQty);
	const checkout = useStore((state) => state.checkout);
	const navigate = useNavigate();
	const [pending, setPending] = (0, import_react.useState)(false);
	const lines = cart.map((item) => {
		const product = products.find((entry) => entry.id === item.productId);
		return product ? {
			...item,
			product
		} : null;
	}).filter((item) => Boolean(item));
	const total = lines.reduce((sum, line) => sum + (line.unitPrice ?? line.product.price) * line.qty, 0);
	const short = total > balance;
	function change(lineId, qty) {
		setQty(lineId, qty).then((result) => {
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
					className: "flex gap-3 rounded-xl border border-line bg-gradient-to-b from-surface to-card p-3 shadow-sm transition hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: line.image || line.product.image,
						alt: "",
						className: "size-20 rounded-md object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: line.product.title
							}),
							line.variantName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-brand",
								children: line.variantName
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: formatPoints(line.unitPrice ?? line.product.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-11 place-items-center rounded-md border border-line transition hover:bg-brand-wash",
										"aria-label": "Уменьшить",
										onClick: () => change(line.lineId, line.qty - 1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular w-6 text-center text-sm font-semibold",
										children: line.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "grid size-11 place-items-center rounded-md border border-line transition hover:bg-brand-wash",
										"aria-label": "Увеличить",
										onClick: () => change(line.lineId, line.qty + 1),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ml-auto grid size-11 place-items-center rounded-md text-danger",
										"aria-label": "Удалить",
										onClick: () => change(line.lineId, 0),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							})
						]
					})]
				}, line.lineId || `${line.productId}-${line.variantId}`))
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
					children: "Недостаточно апексов. Уберите позицию или заработайте ещё."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					disabled: short || pending,
					onClick: () => {
						if (pending) return;
						setPending(true);
						checkout().then((result) => {
							setPending(false);
							if (!result.ok) toast.error(result.error);
							else {
								toast.success("Заказ оформлен");
								navigate({ to: "/orders" });
							}
						});
					},
					children: pending ? "Оформляем…" : "Оплатить апексами"
				})
			] })]
		})]
	});
}
//#endregion
export { CartPage as component };
