import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Gem } from "../_libs/lucide-react.mjs";
import { _ as formatNumber, d as hasWorkBalance, f as useStore, h as firstName, p as apex, v as formatPoints, w as Panel, x as Button } from "./router-Dr41VdEz.mjs";
import { t as AchievementMark } from "./achievement-mark-BYsHoESd.mjs";
import { a as Shell, s as UserAvatar } from "./shell-1JLU4O9d.mjs";
import { t as ActivityLevelCard } from "./activity-level-CqKbBvop.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dl5RaUlV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const people = useStore((state) => state.people);
	const feed = useStore((state) => state.feed);
	const products = useStore((state) => state.products);
	const leaderboard = useStore((state) => state.leaderboard);
	const leaderboardKind = useStore((state) => state.leaderboardKind);
	const catalog = useStore((state) => state.activitiesCatalog);
	const loadActivities = useStore((state) => state.loadActivities);
	const loadEngagement = useStore((state) => state.loadEngagement);
	const [news, setNews] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		loadActivities();
		loadEngagement();
		apex("/api/company-news?page=1&pageSize=4").then((data) => {
			const list = Array.isArray(data) ? data : data?.items;
			if (!Array.isArray(list)) return;
			setNews(list.map((item) => {
				const record = item;
				return {
					id: String(record.id ?? ""),
					title: String(record.title ?? ""),
					summary: String(record.summary ?? "")
				};
			}).filter((item) => item.id && item.title));
		}).catch(() => void 0);
	}, [loadActivities, loadEngagement]);
	if (!user) return null;
	const board = leaderboard.length > 0 ? leaderboard : [...people].filter((person) => person.status === "active").sort((a, b) => b.score - a.score).map((person) => ({
		id: person.id,
		name: person.name,
		score: person.score
	}));
	const top = board.slice(0, 5);
	const greet = user.firstName?.trim() || firstName(user.name);
	const popular = products.filter((product) => product.active && product.popular);
	const activities = [
		...catalog.quests.map((item) => ({
			id: `quest-${item.id}`,
			kind: "quest",
			title: item.title,
			prize: item.reward > 0 ? formatPoints(item.reward) : "Квест"
		})),
		...catalog.surveys.map((item) => ({
			id: `survey-${item.id}`,
			kind: "survey",
			title: item.title,
			prize: item.reward > 0 ? formatPoints(item.reward) : "Опрос"
		})),
		...catalog.events.map((item) => ({
			id: `event-${item.id}`,
			kind: "event",
			title: item.title,
			prize: item.reward > 0 ? formatPoints(item.reward) : "Мероприятие"
		}))
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-4xl font-bold",
				children: ["Здравствуйте, ", greet]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-base text-muted",
				children: "Спасибо, что делаете нашу компанию лучше каждый день."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 hidden items-start gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
							board: top,
							full: board,
							people,
							currentId: user.id,
							caption: leaderboardKind === "activity" ? "Топ по апексам за квесты, опросы, мероприятия и достижения" : "Топ по благодарностям"
						}),
						news.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(News, { items: news }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Achievements, { items: catalog.achievements }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivitiesPreview, {
							items: activities,
							loading: catalog.status === "loading" || catalog.status === "idle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feed, {
							people,
							feed
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLevelCard, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceCard, { user }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popular, { products: popular })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-8 lg:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLevelCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceCard, { user }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivitiesPreview, {
						items: activities,
						loading: catalog.status === "loading" || catalog.status === "idle",
						scroll: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
						board: top,
						full: board,
						people,
						currentId: user.id,
						caption: leaderboardKind === "activity" ? "Топ по апексам за квесты, опросы, мероприятия и достижения" : "Топ по благодарностям"
					}),
					news.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(News, { items: news }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Achievements, { items: catalog.achievements }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feed, {
						people,
						feed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popular, { products: popular })
				]
			})
		]
	});
}
function Leaderboard({ board, full, people, currentId, caption }) {
	const mineAt = full.findIndex((person) => person.id === currentId);
	const shown = mineAt >= 0 && mineAt < board.length;
	const me = people.find((person) => person.id === currentId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Лидерборд"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: caption
		}),
		board.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Пока пусто."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-5 space-y-1",
			children: board.map((person, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderRow, {
				person,
				place: index + 1,
				people,
				mine: person.id === currentId
			}, person.id))
		}),
		!shown && me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 border-t border-dashed border-line pt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderRow, {
				person: {
					id: me.id,
					name: me.name,
					score: full[mineAt]?.score ?? me.score
				},
				place: mineAt >= 0 ? mineAt + 1 : full.length + 1,
				people,
				mine: true
			})
		}) : null
	] });
}
function LeaderRow({ person, place, people, mine }) {
	const profile = people.find((item) => item.id === person.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/people/$userId",
		params: { userId: person.id },
		className: `flex min-w-0 items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-brand-wash ${mine ? "bg-brand-wash ring-1 ring-brand" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${place <= 3 ? "bg-brand text-white" : "bg-brand-wash text-brand-deep"}`,
				children: place
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
				user: {
					name: person.name,
					avatarUrl: profile?.avatarUrl
				},
				className: "size-9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 truncate text-sm",
				children: person.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular shrink-0 text-sm font-semibold",
				children: formatNumber(person.score)
			})
		]
	});
}
function BalanceCard({ user }) {
	const reward = useStore((state) => state.rewardBalance);
	const showWork = hasWorkBalance(user.role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "border-brand-soft bg-gradient-to-br from-brand-wash via-surface to-card text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: showWork ? "Балансы" : "Ваш баланс"
			}),
			showWork ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted",
				children: "Личный"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `${showWork ? "" : "mt-3"} text-3xl font-bold text-brand`,
				children: formatPoints(user.balance)
			}),
			showWork ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted",
				children: "Рабочий · поощрения"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xl font-bold",
				children: reward == null ? "нет доступа" : formatPoints(reward)
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/catalog",
				className: "mt-6 block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					children: "В магазин за призами"
				})
			})
		]
	});
}
function ActivitiesPreview({ items, loading, scroll = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Активности"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/activities",
				className: "shrink-0 text-sm font-semibold text-brand",
				children: "Все"
			})]
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: loading ? "Загружаем." : "Пока нет активных заданий."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: scroll ? "mt-3 flex gap-3 overflow-x-auto pb-1" : "mt-3 grid grid-cols-3 gap-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/activities",
				search: {
					kind: item.kind,
					focus: item.id
				},
				className: `rounded-xl border border-line bg-gradient-to-b from-surface to-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-mid hover:shadow-md ${scroll ? "w-56 shrink-0" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-brand",
					children: item.prize
				})]
			}, item.id))
		})]
	});
}
function Achievements({ items }) {
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-xl font-bold",
		children: "Достижения"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 grid grid-cols-3 gap-3",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/activities",
			search: {
				kind: "achievement",
				focus: `achievement-${item.id}`
			},
			className: "rounded-xl bg-card px-2 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-wash hover:shadow-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementMark, {
				iconUrl: item.iconUrl,
				earned: item.earned,
				className: "mx-auto size-8"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-tight",
				children: item.name
			})]
		}, item.id))
	})] });
}
function News({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-xl font-bold",
		children: "Новости"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 space-y-2",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-xl bg-gradient-to-r from-brand-wash to-surface px-4 py-3 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: item.title
			}), item.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: item.summary
			}) : null]
		}, item.id))
	})] });
}
function Feed({ people, feed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Лента благодарностей"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/colleagues",
				className: "shrink-0 text-sm font-semibold text-brand",
				children: "Поблагодарить"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-4 divide-y divide-line",
			children: [feed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "Пока нет благодарностей с вашим участием."
			}) : null, feed.slice(0, 5).map((item) => {
				const from = people.find((person) => person.id === item.fromId);
				const to = people.find((person) => person.id === item.toId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
						user: {
							name: from?.name || item.fromName || "Сотрудник",
							avatarUrl: from?.avatarUrl
						},
						className: "size-8"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: from?.name || item.fromName || "Сотрудник"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" → ", to?.name || item.toName || "Сотрудник"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" — ", item.message || "без сообщения"] }),
							item.amount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-brand",
								children: [" +", formatNumber(item.amount)]
							}) : null,
							item.kind === "manager" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs font-semibold text-brand",
								children: "поощрение"
							}) : null
						]
					})]
				}, item.id);
			})]
		})]
	});
}
function Popular({ products }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "Магазин — популярное"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-4",
			children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: "",
						className: "size-14 rounded-md object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: product.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: formatPoints(product.price)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "size-4 shrink-0 text-brand" })
				]
			}, product.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/catalog",
			className: "mt-5 inline-block text-sm font-semibold text-brand",
			children: "Весь каталог"
		})
	] });
}
//#endregion
export { Home as component };
