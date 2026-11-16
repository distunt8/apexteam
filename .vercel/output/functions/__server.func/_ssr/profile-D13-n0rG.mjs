import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Gem, u as Settings } from "../_libs/lucide-react.mjs";
import { _ as formatNumber, d as hasWorkBalance, f as useStore, g as formatDateTime, v as formatPoints, w as Panel } from "./router-Dr41VdEz.mjs";
import { t as AchievementMark } from "./achievement-mark-BYsHoESd.mjs";
import { a as Shell, i as ROLE_LABEL, t as AvatarEditor } from "./shell-1JLU4O9d.mjs";
import { n as usePage, t as Pager } from "./pager-DvNdDOo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-D13-n0rG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const reward = useStore((state) => state.rewardBalance);
	const people = useStore((state) => state.people);
	const feed = useStore((state) => state.feed);
	const achievements = useStore((state) => state.activitiesCatalog.achievements);
	const achievementsStatus = useStore((state) => state.activitiesCatalog.status);
	const loadActivities = useStore((state) => state.loadActivities);
	const kind = useStore((state) => state.leaderboardKind);
	const [tab, setTab] = (0, import_react.useState)("thanks");
	(0, import_react.useEffect)(() => {
		loadActivities();
	}, [loadActivities]);
	if (!user) return null;
	const received = feed.filter((item) => item.toId === user.id);
	const sent = feed.filter((item) => item.fromId === user.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Профиль"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/settings",
					className: "inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-brand hover:bg-brand-wash",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), "Настройки"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarEditor, { user }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
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
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-5 bg-gradient-to-br from-brand-wash via-surface to-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Текущий баланс"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-4xl font-bold text-brand",
						children: formatPoints(user.balance)
					}),
					hasWorkBalance(user.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: [
							"Рабочий баланс (поощрения):",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: reward == null ? "нет доступа" : formatNumber(reward)
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							kind === "activity" ? "Апексы за активности" : "В рейтинге благодарностей",
							": ",
							formatNumber(user.score)
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				role: "tablist",
				children: [["thanks", "Благодарности"], ["badges", "Достижения"]].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: `min-h-11 rounded-md px-3 text-sm font-semibold transition hover:-translate-y-0.5 ${tab === id ? "bg-brand text-white" : "bg-card text-ink"}`,
					children: label
				}, id))
			}),
			tab === "thanks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThanksBlock, {
					title: "Полученные",
					empty: "Вас пока никто не благодарил",
					items: received,
					people,
					side: "from"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThanksBlock, {
					title: "Отправленные",
					empty: "Вы ещё никого не благодарили",
					items: sent,
					people,
					side: "to"
				})]
			}) : null,
			tab === "badges" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: [
					achievementsStatus === "loading" && achievements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Загружаем достижения."
					}) : null,
					achievementsStatus !== "loading" && achievements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Достижений пока нет."
					}) : null,
					achievements.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementMark, {
								iconUrl: badge.iconUrl,
								earned: badge.earned
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-semibold",
								children: badge.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: badge.earned ? "Открыто" : badge.description
							})
						]
					}, badge.id))
				]
			}) : null
		]
	});
}
function ThanksBlock({ title, empty, items, people, side }) {
	const page = usePage(items, 5, title);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: title
		}),
		items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: empty
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: page.items.map((item) => {
				const personId = side === "from" ? item.fromId : item.toId;
				const name = people.find((entry) => entry.id === personId)?.name || (side === "from" ? item.fromName : item.toName) || "Коллега";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 shadow-sm transition hover:bg-brand-wash",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: name
							}),
							item.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: item.message
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [item.createdAt ? formatDateTime(item.createdAt) : "", item.kind === "manager" ? " · поощрение" : ""]
							})
						]
					}), item.amount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex shrink-0 items-center gap-1 text-sm font-semibold text-brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "size-4" }), formatNumber(item.amount)]
					}) : null]
				}, item.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
			page: page.page,
			pages: page.pages,
			total: page.total,
			onPage: page.setPage
		})
	] });
}
//#endregion
export { ProfilePage as component };
