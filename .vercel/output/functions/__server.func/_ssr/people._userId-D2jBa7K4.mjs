import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as formatNumber, f as useStore, g as formatDateTime, p as apex, r as Route$1, w as Panel } from "./router-Dr41VdEz.mjs";
import { t as AchievementMark } from "./achievement-mark-BYsHoESd.mjs";
import { a as Shell, i as ROLE_LABEL, s as UserAvatar } from "./shell-1JLU4O9d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people._userId-D2jBa7K4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PersonPage() {
	const { userId } = Route$1.useParams();
	const person = useStore((state) => state.people.find((item) => item.id === userId));
	const me = useStore((state) => state.currentUserId);
	const board = useStore((state) => state.leaderboard);
	const kind = useStore((state) => state.leaderboardKind);
	const feed = useStore((state) => state.feed);
	const [badges, setBadges] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		apex(`/api/achievements/users/${userId}`).then((data) => {
			const list = Array.isArray(data) ? data : data?.items;
			if (!Array.isArray(list)) return;
			setBadges(list.map((item) => {
				const record = item;
				const achievement = record.achievement ?? record;
				return {
					id: String(achievement.id ?? record.id ?? ""),
					name: String(achievement.name ?? "Достижение"),
					iconUrl: String(achievement.iconUrl ?? "")
				};
			}));
		}).catch(() => setBadges([]));
	}, [userId]);
	const thanks = feed.filter((item) => item.toId === userId);
	const score = board.find((item) => item.id === userId)?.score ?? person?.score ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: !person ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-3xl font-bold tracking-tight",
		children: "Сотрудник не найден"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/colleagues",
		className: "mt-4 inline-block text-sm font-semibold text-brand",
		children: "К коллегам"
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight",
			children: "Профиль"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
						user: person,
						className: "size-16 text-lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl font-bold",
							children: person.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: person.position || "Должность не указана"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								person.department || "Отдел не указан",
								" · ",
								person.roleTitle || ROLE_LABEL[person.role]
							]
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm",
					children: [
						kind === "activity" ? "Апексы за активности" : "Благодарности в рейтинге",
						": ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: formatNumber(score)
						})
					]
				}),
				person.status !== "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Аккаунт заблокирован"
				}) : null,
				person.id === me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					className: "mt-4 inline-block text-sm font-semibold text-brand",
					children: "Открыть свой профиль"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/colleagues",
					className: "mt-4 inline-block text-sm font-semibold text-brand",
					children: "Поблагодарить в списке коллег"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Полученные благодарности"
				}),
				thanks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "В вашей ленте таких благодарностей нет."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: thanks.slice(0, 8).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: item.fromName || "Коллега"
							}),
							item.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" — ", item.message]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted",
								children: item.createdAt ? formatDateTime(item.createdAt) : ""
							})
						]
					}, item.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Достижения"
				}),
				badges.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Пока нет открытых достижений."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-card p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementMark, {
							iconUrl: badge.iconUrl,
							className: "mx-auto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs",
							children: badge.name
						})]
					}, badge.id))
				})
			]
		})
	] }) });
}
//#endregion
export { PersonPage as component };
