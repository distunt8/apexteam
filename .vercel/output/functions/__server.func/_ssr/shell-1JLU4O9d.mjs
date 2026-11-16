import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, m as useRouterState, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Gem, T as Bell, _ as LifeBuoy, b as History, g as LogOut, h as Menu, i as UserRound, l as ShoppingBag, n as X, p as Pencil, r as Users, t as Zap, u as Settings, v as LayoutDashboard, w as ChevronDown, y as House } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Wordmark, O as cn, _ as formatNumber, b as pointsLabel, d as hasWorkBalance, f as useStore, u as canOpenAdmin, x as Button, y as initials } from "./router-Dr41VdEz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-1JLU4O9d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UserAvatar({ user, className, src = user.avatarUrl }) {
	const [failed, setFailed] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-wash text-xs font-bold text-brand-deep", className, "rounded-full"),
		children: src && src !== failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: user.name,
			className: "size-full object-cover",
			onError: () => setFailed(src)
		}) : initials(user.name)
	});
}
function AvatarEditor({ user, compact = false }) {
	const upload = useStore((state) => state.uploadAvatar);
	const input = (0, import_react.useRef)(null);
	const generation = (0, import_react.useRef)(0);
	const [file, setFile] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)();
	const [pending, setPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!file) {
			setPreview(void 0);
			return;
		}
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);
	(0, import_react.useEffect)(() => () => {
		generation.current++;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
			user,
			src: preview ?? user.avatarUrl,
			className: "size-16 text-base"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: input,
					type: "file",
					accept: "image/jpeg,image/png,image/webp",
					className: "sr-only",
					"aria-label": `Выбрать фото: ${user.name}`,
					disabled: pending,
					onChange: async (event) => {
						const selected = event.target.files?.[0];
						event.target.value = "";
						const attempt = ++generation.current;
						if (!selected) return;
						if (selected.size > 2097152) {
							toast.error("Фото должно быть не больше 2 МБ");
							return;
						}
						if (![
							"image/jpeg",
							"image/png",
							"image/webp"
						].includes(selected.type)) {
							toast.error("Выберите JPEG, PNG или WebP");
							return;
						}
						try {
							const bitmap = await createImageBitmap(selected);
							const valid = bitmap.width <= 8192 && bitmap.height <= 8192;
							bitmap.close();
							if (!valid) {
								toast.error("Размер фото — не более 8192 × 8192 пикселей");
								return;
							}
							if (attempt === generation.current) setFile(selected);
						} catch {
							toast.error("Не удалось открыть изображение. Выберите другое фото.");
						}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-9 place-items-center rounded-full border border-line bg-surface text-ink shadow-sm transition hover:border-brand hover:text-brand",
						"aria-label": "Изменить фото",
						disabled: pending,
						onClick: () => input.current?.click(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
					}), file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: pending,
						onClick: async () => {
							setPending(true);
							try {
								const result = await upload(user.id, file);
								if (!result.ok) toast.error(result.error);
								else {
									setFile(null);
									toast.success("Фото сохранено");
								}
							} finally {
								setPending(false);
							}
						},
						children: pending ? "Сохраняем…" : "Сохранить фото"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: pending,
						onClick: () => {
							generation.current++;
							setFile(null);
						},
						children: "Отмена"
					})] }) : null]
				}),
				!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					"aria-live": "polite",
					children: file ? "Предпросмотр. Нажмите «Сохранить фото»." : "JPEG, PNG или WebP, до 2 МБ"
				}) : null
			]
		})]
	});
}
var ROLE_LABEL = {
	employee: "Сотрудник",
	manager: "Руководитель",
	hr: "HR",
	merchandiser: "Мерчендайзер",
	support: "Оператор поддержки",
	admin: "Администратор",
	chief: "Главный администратор"
};
function roleCodeLabel(code) {
	const key = code.trim().toLowerCase();
	if (/superadmin|super-admin|chief|owner/.test(key)) return "Главный администратор";
	if (/^admin$|administrator/.test(key)) return "Администратор";
	if (/humanresources|^hr$/.test(key)) return "HR";
	if (/merchandiser|^merch$/.test(key)) return "Мерчендайзер";
	if (/support/.test(key) || key === "operator" || key === "helpdesk") return "Оператор поддержки";
	if (/manager|lead|supervisor/.test(key)) return "Руководитель";
	if (/employee|^user$/.test(key)) return "Сотрудник";
	return ROLE_LABEL[key] ?? code;
}
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
	paid: "Оплачен",
	pending: "Ожидает",
	processing: "Обрабатывается",
	ready: "Готов",
	completed: "Завершён",
	issued: "Выдан",
	cancelled: "Отменён",
	created: "Создан"
};
function orderStatusLabel(status) {
	return ORDER_STATUS[status.trim().toLowerCase()] ?? status;
}
var TICKET_STATUS = {
	open: "Открыто",
	in_progress: "В работе",
	resolved: "Решено",
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
	"paid",
	"processing",
	"ready",
	"cancelled"
];
var NAV = [
	{
		to: "/",
		label: "Главная",
		icon: House
	},
	{
		id: "activities",
		label: "Активности",
		icon: Zap,
		items: [{
			to: "/activities",
			label: "Все активности"
		}, {
			to: "/my-activity",
			label: "Моя активность"
		}]
	},
	{
		to: "/colleagues",
		label: "Коллеги",
		icon: Users
	},
	{
		id: "shop",
		label: "Магазин",
		icon: ShoppingBag,
		items: [
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
			}
		]
	},
	{
		to: "/history",
		label: "История",
		icon: History
	},
	{
		to: "/support",
		label: "Поддержка",
		icon: LifeBuoy
	},
	{
		to: "/profile",
		label: "Профиль",
		icon: UserRound
	}
];
function isGroup(item) {
	return "items" in item;
}
function activePath(path, to) {
	if (to === "/") return path === "/";
	return path === to || path.startsWith(`${to}/`);
}
function Shell({ children }) {
	const path = useRouterState({ select: (state) => state.location.pathname });
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const cartCount = useStore((state) => state.cart.reduce((sum, item) => sum + item.qty, 0));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [opened, setOpened] = (0, import_react.useState)(null);
	if (!user) return null;
	const groupOpen = (group) => opened === group.id || group.items.some((item) => activePath(path, item.to));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-surface text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-3 lg:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						"aria-label": "Меню",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						"aria-label": "На главную",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "h-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/notifications",
						className: "grid size-11 place-items-center",
						"aria-label": "Уведомления",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMenu, { compact: true })
				]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "fixed inset-0 z-40 bg-black/40 lg:hidden",
				"aria-label": "Закрыть меню",
				onClick: () => setOpen(false)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-line bg-sidebar px-3 py-5 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "На главную",
							onClick: () => setOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 place-items-center lg:hidden",
							"aria-label": "Закрыть",
							onClick: () => setOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mt-6 flex flex-1 flex-col gap-1 overflow-y-auto",
						children: [NAV.map((item) => {
							if (!isGroup(item)) {
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									onClick: () => setOpen(false),
									className: cn("flex min-h-11 items-center gap-2.5 rounded-md px-3 text-[15px]", activePath(path, item.to) ? "bg-brand-wash font-semibold text-brand" : "text-ink hover:bg-surface"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), item.label]
								}, item.to);
							}
							const Icon = item.icon;
							const expanded = groupOpen(item);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-[15px] hover:bg-surface",
								"aria-expanded": expanded,
								onClick: () => setOpened(expanded ? "" : item.id),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1",
										children: item.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-muted transition-transform", expanded && "rotate-180") })
								]
							}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 ml-4 flex flex-col gap-0.5 border-l border-line pl-2",
								children: item.items.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: child.to,
									onClick: () => setOpen(false),
									className: cn("flex min-h-10 items-center rounded-md px-3 text-sm", activePath(path, child.to) ? "font-bold text-brand" : "text-ink hover:bg-surface"),
									children: [child.label, child.to === "/cart" && cartCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs font-semibold text-brand",
										children: cartCount
									}) : null]
								}, child.to))
							}) : null] }, item.id);
						}), canOpenAdmin(user.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							onClick: () => setOpen(false),
							className: cn("flex min-h-11 items-center gap-2 rounded-md px-3 text-[15px]", activePath(path, "/admin") ? "bg-brand-wash font-bold text-brand" : "text-ink hover:bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-4 shrink-0" }), "Администрирование"]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 border-t border-line px-2 pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Личный баланс"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-2 text-xl font-bold text-brand",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "size-4" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular",
										children: formatNumber(user.balance)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-muted",
										children: pointsLabel(user.balance)
									})
								]
							})] }),
							hasWorkBalance(user.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Рабочий · поощрения"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-lg font-bold tabular",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RewardAmount, {})
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-2 lg:flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
										user,
										className: "size-10"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: user.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted",
											children: user.roleTitle || ROLE_LABEL[user.role]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/settings",
										className: "grid size-10 place-items-center rounded-md hover:bg-surface",
										"aria-label": "Настройки",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logout, {})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "lg:pl-[260px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full min-w-0 max-w-[1400px] px-2 pt-4 pb-12 sm:px-3",
					children
				})
			})
		]
	});
}
function Logout() {
	const logout = useStore((state) => state.logout);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "grid size-10 place-items-center rounded-md hover:bg-surface",
		"aria-label": "Выйти",
		onClick: () => logout(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
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
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
				user,
				className: "size-10"
			}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden max-w-40 truncate text-sm sm:block",
				children: user.name
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 z-40 mt-1 w-56 rounded-lg border border-line bg-surface p-2 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 pt-1 text-sm font-medium",
					children: user.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 pb-1 text-xs text-muted",
					children: title
				}),
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
//#endregion
export { Shell as a, categoryLabel as c, ROLE_LABEL as i, orderStatusLabel as l, ENTRY_LABEL as n, TICKET_STATUS as o, ORDER_FLOW as r, UserAvatar as s, AvatarEditor as t, roleCodeLabel as u };
