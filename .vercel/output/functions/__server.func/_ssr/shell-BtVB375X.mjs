import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, m as useRouterState, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ChevronDown, d as LogOut, f as LifeBuoy, g as Gem, h as History, m as House, n as Users, p as LayoutDashboard, r as UserRound, s as ShoppingBag, t as Zap, v as Bell } from "../_libs/lucide-react.mjs";
import { _ as Wordmark, i as useStore, o as formatDateTime, r as isAdminRole, s as formatNumber, v as cn } from "./router-CTHYymUA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-BtVB375X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_LABEL = {
	employee: "Сотрудник",
	manager: "Руководитель",
	admin: "Администратор",
	chief: "Главный администратор"
};
var CATEGORY_LABEL = {
	merch: "Мерч",
	certificate: "Сертификаты",
	experience: "Впечатления"
};
function categoryLabel(id, name) {
	if (name?.trim()) return name;
	return CATEGORY_LABEL[id] ?? "Без категории";
}
var ORDER_STATUS = {
	created: "Создан",
	processing: "Обрабатывается",
	ready: "Готов",
	issued: "Выдан",
	cancelled: "Отменён"
};
function orderStatusLabel(status) {
	return ORDER_STATUS[status] ?? status;
}
var TICKET_STATUS = {
	open: "Открыто",
	answered: "Есть ответ",
	closed: "Закрыто"
};
var ENTRY_LABEL = {
	activity_reward: "Награда за активность",
	recognition_sent: "Благодарность отправлена",
	recognition_received: "Благодарность получена",
	manager_award: "Поощрение руководителя",
	purchase: "Покупка",
	refund: "Возврат",
	admin_adjustment: "Корректировка"
};
var ORDER_FLOW = [
	"created",
	"processing",
	"ready",
	"issued",
	"cancelled"
];
var TOP = [
	{
		to: "/",
		label: "Главная",
		icon: House
	},
	{
		to: "/activities",
		label: "Активности",
		icon: Zap
	},
	{
		to: "/colleagues",
		label: "Коллеги",
		icon: Users
	},
	{
		to: "/catalog",
		label: "Магазин",
		icon: ShoppingBag
	},
	{
		to: "/support",
		label: "Поддержка",
		icon: LifeBuoy
	}
];
var SIDE = [
	{
		to: "/catalog",
		label: "Каталог"
	},
	{
		to: "/cart",
		label: "Корзина"
	},
	{
		to: "/orders",
		label: "Мои заказы"
	},
	{
		to: "/history",
		label: "История"
	},
	{
		to: "/profile",
		label: "Профиль"
	},
	{
		to: "/support",
		label: "Поддержка"
	}
];
var BOTTOM = [
	{
		to: "/",
		label: "Главная",
		icon: House
	},
	{
		to: "/activities",
		label: "Активности",
		icon: Zap
	},
	{
		to: "/catalog",
		label: "Магазин",
		icon: ShoppingBag
	},
	{
		to: "/profile",
		label: "Профиль",
		icon: UserRound
	}
];
function activePath(path, to) {
	if (to === "/") return path === "/";
	return path === to || path.startsWith(`${to}/`);
}
function Shell({ mode, children }) {
	const path = useRouterState({ select: (state) => state.location.pathname });
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const cartCount = useStore((state) => state.cart.reduce((sum, item) => sum + item.qty, 0));
	const unread = useStore((state) => state.notices.filter((notice) => notice.userId === state.currentUserId && !notice.read).length);
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-surface text-ink",
		children: [
			mode === "top" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "shrink-0",
							"aria-label": "На главную",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-1 lg:flex",
							children: TOP.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: cn("rounded-md px-3 py-2 text-sm", activePath(path, item.to) ? "font-semibold text-brand" : "text-ink hover:bg-card"),
								children: item.label
							}, item.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceMenu, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notices, { unread }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMenu, {})
							]
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					"aria-label": "На главную",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "h-8" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							className: "relative grid size-11 place-items-center",
							"aria-label": "Корзина",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), cartCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white",
								children: cartCount
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceMenu, { compact: true }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notices, { unread }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMenu, { compact: true })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn(mode === "shop" && "lg:grid lg:grid-cols-[220px_minmax(0,1fr)]"),
				children: [mode === "shop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "hidden min-h-screen flex-col border-r border-line bg-sidebar px-4 py-6 lg:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "На главную",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "mt-8 flex flex-col gap-1",
							children: [SIDE.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex min-h-11 items-center rounded-md px-3 text-[15px]", activePath(path, item.to) ? "font-bold text-brand" : "text-ink hover:bg-surface"),
								children: [item.label, item.to === "/cart" && cartCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-xs font-semibold text-brand",
									children: cartCount
								}) : null]
							}, item.to)), isAdminRole(user.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin",
								className: cn("flex min-h-11 items-center gap-2 rounded-md px-3 text-[15px]", activePath(path, "/admin") ? "font-bold text-brand" : "text-ink hover:bg-surface"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-4" }), "Администрирование"]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto space-y-3 pt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Личный баланс"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-2 text-2xl font-bold text-brand",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: formatNumber(user.balance)
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Рабочий · поощрения"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-lg font-bold tabular",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RewardAmount, {})
							})] })]
						})
					]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full min-w-0 max-w-[1200px] px-4 pt-5 pb-28 sm:px-6 lg:pb-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid h-16 grid-cols-4",
					children: BOTTOM.map((item) => {
						const Icon = item.icon;
						const on = activePath(path, item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-full flex-col items-center justify-center gap-1 text-[11px]", on ? "font-semibold text-brand" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
						}) }, item.to);
					})
				})
			})
		]
	});
}
function RewardAmount() {
	const reward = useStore((state) => state.rewardBalance);
	if (reward == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-base font-medium text-muted",
		children: "нет доступа"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: formatNumber(reward) });
}
function BalanceMenu({ compact = false }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const reward = useStore((state) => state.rewardBalance);
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm hover:bg-card",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "size-4 text-brand" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular font-semibold",
					children: formatNumber(user.balance)
				}),
				compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden text-muted sm:inline",
					children: "баллов"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 text-muted" })
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 z-40 mt-1 w-64 rounded-lg border border-line bg-surface p-3 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Личный баланс"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-lg font-bold text-brand tabular",
					children: formatNumber(user.balance)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted",
					children: "Рабочий баланс · поощрения"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-lg font-bold tabular",
					children: reward == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-medium text-muted",
						children: "нет доступа"
					}) : formatNumber(reward)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted",
					children: "Покупки списывают личный. Поощрения — с рабочего."
				})
			]
		}) : null]
	});
}
function Notices({ unread }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const userId = useStore((state) => state.currentUserId);
	const notices = useStore((state) => state.notices).filter((notice) => notice.userId === userId).slice(0, 8);
	const mark = useStore((state) => state.markNoticesRead);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "relative grid size-11 place-items-center rounded-md hover:bg-card",
			"aria-label": "Уведомления",
			onClick: () => {
				setOpen((value) => !value);
				mark();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2 right-2 size-2 rounded-full bg-brand" }) : null]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute right-0 z-40 mt-1 w-[min(100vw-2rem,22rem)] rounded-lg border border-line bg-surface p-2 shadow-lg",
			children: notices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-4 text-sm text-muted",
				children: "Пока пусто"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-80 space-y-1 overflow-auto",
				children: notices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md px-2 py-2 text-sm hover:bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: notice.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: formatDateTime(notice.createdAt)
					})]
				}, notice.id))
			})
		}) : null]
	});
}
function UserMenu({ compact = false }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const logout = useStore((state) => state.logout);
	if (!user) return null;
	const title = user.roleTitle || ROLE_LABEL[user.role];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex min-h-11 items-center gap-2 rounded-md px-2 hover:bg-card",
			onClick: () => setOpen((value) => !value),
			"aria-haspopup": "menu",
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-8 place-items-center rounded-full bg-brand-wash text-xs font-bold text-brand-deep",
				children: user.name.split(" ").slice(0, 2).map((part) => part[0]).join("")
			}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden text-left sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block max-w-40 truncate text-sm leading-tight",
					children: user.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted",
					children: title
				})]
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 z-40 mt-1 w-64 rounded-lg border border-line bg-surface p-2 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 pt-1 text-sm font-medium",
					children: user.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 pb-1 text-xs text-muted",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
					to: "/history",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4" }),
					label: "История",
					onDone: () => setOpen(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
					to: "/orders",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }),
					label: "Заказы",
					onDone: () => setOpen(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
					to: "/support",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "size-4" }),
					label: "Поддержка",
					onDone: () => setOpen(false)
				}),
				isAdminRole(user.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
					to: "/admin",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-4" }),
					label: "Администрирование",
					onDone: () => setOpen(false)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-1 flex w-full min-h-10 items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-card",
					onClick: () => {
						logout();
						setOpen(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Выйти"]
				})
			]
		}) : null]
	});
}
function MenuLink({ to, label, icon, onDone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		onClick: onDone,
		className: "flex min-h-10 items-center gap-2 rounded-md px-2 text-sm hover:bg-card",
		children: [icon, label]
	});
}
//#endregion
export { TICKET_STATUS as a, Shell as i, ORDER_FLOW as n, categoryLabel as o, ROLE_LABEL as r, orderStatusLabel as s, ENTRY_LABEL as t };
