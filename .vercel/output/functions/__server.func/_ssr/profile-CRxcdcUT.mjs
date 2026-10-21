import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as LifeBuoy, o as Star } from "../_libs/lucide-react.mjs";
import { c as formatPoints, i as useStore, l as initials, m as Panel, o as formatDateTime, s as formatNumber } from "./router-CTHYymUA.mjs";
import { i as Shell, r as ROLE_LABEL, s as orderStatusLabel, t as ENTRY_LABEL } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CRxcdcUT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const reward = useStore((state) => state.rewardBalance);
	const people = useStore((state) => state.people);
	const ledger = useStore((state) => state.ledger);
	const orders = useStore((state) => state.orders);
	const progress = useStore((state) => state.progress);
	const feed = useStore((state) => state.feed);
	const [tab, setTab] = (0, import_react.useState)("history");
	if (!user) return null;
	const mine = ledger.filter((entry) => entry.userId === user.id);
	const myOrders = orders.filter((order) => order.userId === user.id);
	const streak = progress.find((item) => item.userId === user.id && item.activityId === "act-streak")?.value ?? 0;
	const badges = [
		{
			title: "10К шагов",
			on: progress.filter((item) => item.userId === user.id && item.activityId === "act-steps").reduce((max, item) => Math.max(max, item.value), 0) >= 1e4,
			hint: "Наберите 10 000 шагов за день"
		},
		{
			title: "Активность",
			on: progress.some((item) => item.userId === user.id && item.rewarded),
			hint: "Получите любую награду"
		},
		{
			title: "Целеустремлённость",
			on: streak >= 7,
			hint: `${streak} из 7 дней серии`
		},
		{
			title: "Первая награда",
			on: myOrders.some((order) => order.status !== "cancelled"),
			hint: "Оформите заказ"
		},
		{
			title: "Благодарность",
			on: feed.some((item) => item.fromId === user.id),
			hint: "Поблагодарите коллегу"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Профиль"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-20 place-items-center rounded-2xl bg-brand text-xl font-bold text-white",
					children: initials(user.name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl font-bold",
						children: user.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: user.position
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							user.department,
							" · ",
							user.roleTitle || ROLE_LABEL[user.role]
						]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Текущий баланс"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-4xl font-bold text-brand",
						children: formatPoints(user.balance)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: [
							"Рабочий баланс (поощрения):",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: reward == null ? "нет доступа" : formatNumber(reward)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"В рейтинге: ",
							formatNumber(user.score),
							" накопленных баллов"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/support",
				className: "mt-4 flex min-h-12 items-center gap-3 rounded-xl bg-card px-4 py-3 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "size-5 shrink-0 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-semibold",
					children: "Поддержка"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted",
					children: "Написать, если не пришёл заказ или баллы"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex gap-2",
				children: [
					["history", "История"],
					["orders", "Покупки"],
					["badges", "Достижения"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `min-h-11 rounded-md px-3 text-sm font-semibold ${tab === id ? "bg-brand text-white" : "bg-card text-ink"}`,
					children: label
				}, id))
			}),
			tab === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-2",
				children: [mine.slice(0, 8).map((entry) => {
					const other = people.find((person) => person.id === entry.counterpartyId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 rounded-lg bg-card px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: entry.reason
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								ENTRY_LABEL[entry.type],
								other ? ` · ${other.name}` : "",
								" · ",
								formatDateTime(entry.createdAt)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `tabular text-sm font-bold ${entry.amount > 0 ? "text-brand" : "text-ink"}`,
							children: [entry.amount > 0 ? "+" : "", formatNumber(entry.amount)]
						})]
					}, entry.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/history",
					className: "inline-block py-2 text-sm font-semibold text-brand",
					children: "Вся история"
				}) })]
			}) : null,
			tab === "orders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-2",
				children: [myOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Покупок пока нет."
				}) : null, myOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-card px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: order.items.map((item) => item.title).join(", ")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block text-xs text-muted",
						children: [
							orderStatusLabel(order.status),
							" · ",
							formatPoints(order.total)
						]
					})]
				}, order.id))]
			}) : null,
			tab === "badges" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-6 ${badge.on ? "fill-brand text-brand" : "text-brand-soft"}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-semibold",
							children: badge.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: badge.on ? "Открыто" : badge.hint
						})
					]
				}, badge.title))
			}) : null
		]
	});
}
//#endregion
export { ProfilePage as component };
