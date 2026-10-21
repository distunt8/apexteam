import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as LifeBuoy, g as Gem, o as Star } from "../_libs/lucide-react.mjs";
import { a as firstName, c as formatPoints, d as Button, i as useStore, m as Panel, s as formatNumber } from "./router-CTHYymUA.mjs";
import { i as Shell } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-LBaF2bcA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const people = useStore((state) => state.people);
	const feed = useStore((state) => state.feed);
	const products = useStore((state) => state.products);
	const progress = useStore((state) => state.progress);
	const orders = useStore((state) => state.orders);
	const leaderboard = useStore((state) => state.leaderboard);
	const warnings = useStore((state) => state.apiWarnings);
	const [helloPart, setHelloPart] = (0, import_react.useState)("Добрый день");
	(0, import_react.useEffect)(() => {
		const hour = (/* @__PURE__ */ new Date()).getHours();
		setHelloPart(hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер");
	}, []);
	if (!user) return null;
	const board = leaderboard.length > 0 ? leaderboard : [...people].filter((person) => person.status === "active").sort((a, b) => b.score - a.score).map((person) => ({
		id: person.id,
		name: person.name,
		score: person.score
	}));
	const popular = products.filter((product) => product.active && product.popular);
	const challenges = [
		{
			title: "7 дней активности",
			prize: "Приз: 300 баллов",
			to: "/activities"
		},
		{
			title: "Команда в движении",
			prize: "Приз: 500 баллов",
			to: "/activities"
		},
		{
			title: "Неделя благодарностей",
			prize: "Приз: 200 баллов",
			to: "/colleagues"
		}
	];
	const unlocked = /* @__PURE__ */ new Set();
	if (orders.some((order) => order.userId === user.id && order.status !== "cancelled")) unlocked.add("Покупка");
	if (feed.some((item) => item.fromId === user.id)) unlocked.add("Благодарность");
	if ((progress.find((item) => item.userId === user.id && item.activityId === "act-streak")?.value ?? 0) >= 7) unlocked.add("Серия");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-[1.75rem] font-bold tracking-tight",
				suppressHydrationWarning: true,
				children: [
					helloPart,
					", ",
					firstName(user.name),
					"!"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Спасибо, что делаете нашу компанию лучше каждый день."
			}),
			warnings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-4 rounded-lg bg-card px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer font-semibold",
					children: "Сервер отдал часть данных не так, как ждёт экран"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc space-y-1 pl-4 text-muted",
					children: warnings.map((warning) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: warning }, warning))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/support",
				className: "mt-4 flex min-h-12 items-center gap-3 rounded-xl bg-card px-4 py-3 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "size-5 shrink-0 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold",
						children: "Поддержка"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: "Вопрос по заказу, баллам или доступу"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 hidden items-start gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_300px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, { board }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceCard, { user }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Challenges, { items: challenges }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feed, {
							people,
							feed
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popular, { products: popular })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-4 lg:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceCard, { user }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Challenges, {
						items: challenges,
						scroll: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badges, {
						badges: [
							{
								id: "Серия",
								title: "7 дней"
							},
							{
								id: "Благодарность",
								title: "Благодарность"
							},
							{
								id: "Покупка",
								title: "Первая награда"
							}
						],
						unlocked
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, { board }),
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
function Leaderboard({ board }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Лидерборд"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "По данным сервера"
		}),
		board.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Пока пусто."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 grid gap-2 sm:grid-cols-2",
			children: board.map((person, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex min-w-0 items-center gap-3 rounded-lg bg-surface px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${index < 3 ? "bg-brand text-white" : "bg-brand-wash text-brand-deep"}`,
						children: index + 1
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
			}, person.id))
		})
	] });
}
function BalanceCard({ user }) {
	const reward = useStore((state) => state.rewardBalance);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "Балансы"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted",
			children: "Личный"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-3xl font-bold text-brand",
			children: formatPoints(user.balance)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted",
			children: "Рабочий · поощрения"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xl font-bold",
			children: reward == null ? "нет доступа" : formatPoints(reward)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/catalog",
			className: "mt-5 block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				children: "В магазин за призами"
			})
		})
	] });
}
function Challenges({ items, scroll = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Активные вызовы"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: scroll ? "mt-3 flex gap-3 overflow-x-auto pb-1" : "mt-3 grid grid-cols-3 gap-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: `rounded-lg bg-card p-4 ${scroll ? "w-56 shrink-0" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-brand",
					children: item.prize
				})]
			}, item.title))
		})]
	});
}
function Badges({ badges, unlocked }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-xl font-bold",
		children: "Достижения"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 grid grid-cols-3 gap-3",
		children: badges.map((badge) => {
			const on = unlocked.has(badge.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-card px-2 py-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `mx-auto size-6 ${on ? "fill-brand text-brand" : "text-brand-soft"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs leading-tight",
					children: badge.title
				})]
			}, badge.id);
		})
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
			className: "mt-3 space-y-2",
			children: [feed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "Пока нет благодарностей с вашим участием."
			}) : null, feed.slice(0, 5).map((item) => {
				const from = people.find((person) => person.id === item.fromId);
				const to = people.find((person) => person.id === item.toId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-card px-4 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: from?.name || item.fromName || "Сотрудник"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" → ", to?.name || item.toName || "Сотрудник"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" — ", item.message] }),
						item.kind === "manager" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs font-semibold text-brand",
							children: "поощрение"
						}) : null
					]
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
