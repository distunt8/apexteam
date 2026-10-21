import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Button, g as TextInput, h as TextArea, i as useStore, p as Field, r as isAdminRole, s as formatNumber } from "./router-CTHYymUA.mjs";
import { a as TICKET_STATUS, i as Shell, n as ORDER_FLOW, o as categoryLabel, s as orderStatusLabel } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CkYlyN79.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"Товары",
	"Заказы",
	"Сотрудники",
	"Активности",
	"Экономика",
	"Обращения"
];
function AdminPage() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const [tab, setTab] = (0, import_react.useState)("Товары");
	if (!user) return null;
	if (!isAdminRole(user.role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Недостаточно прав"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Администрирование доступно администратору и главному администратору."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 inline-block text-sm font-semibold text-brand",
				children: "На главную"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Администрирование"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Вы вошли как ",
					user.name,
					". Роли и балансы пишутся в базу. Активности и обращения — только в этом браузере."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(item),
					className: `min-h-11 shrink-0 rounded-md px-3 text-sm font-semibold ${tab === item ? "bg-brand text-white" : "bg-card"}`,
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: tab === "Товары" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Products, {}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tab === "Заказы" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orders, {}) : null }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tab === "Сотрудники" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(People, {}) : null }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tab === "Активности" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activities, {}) : null }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tab === "Экономика" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Economy, {}) : null }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tab === "Обращения" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tickets, {}) : null })
		]
	});
}
function emptyProduct() {
	return {
		id: "new",
		category: "",
		title: "",
		description: "",
		price: 500,
		stock: 1,
		active: true,
		image: "/rewards/card-c.jpg"
	};
}
function Products() {
	const products = useStore((state) => state.products);
	const categories = useStore((state) => state.categories);
	const save = useStore((state) => state.saveProduct);
	const [draft, setDraft] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg border border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-card text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Название"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Категория"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Цена"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Остаток"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Статус"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: product.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: categoryLabel(product.category, product.categoryName)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular",
							children: formatNumber(product.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular",
							children: product.stock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: product.active ? "В каталоге" : "Скрыт"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-brand",
								onClick: () => setDraft(product),
								children: "Изменить"
							})
						})
					]
				}, product.id)) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-lg bg-card p-4",
			onSubmit: (event) => {
				event.preventDefault();
				if (!draft) return;
				save(draft).then((result) => {
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Товар сохранён");
						setDraft(null);
					}
				});
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: draft ? "Карточка товара" : "Товар"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm font-semibold text-brand",
					onClick: () => setDraft(emptyProduct()),
					children: "Новый"
				})]
			}), draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Название",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: draft.title,
						onChange: (event) => setDraft({
							...draft,
							title: event.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Описание",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
						value: draft.description,
						onChange: (event) => setDraft({
							...draft,
							description: event.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Категория",
					children: categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: draft.category,
						inputMode: "numeric",
						placeholder: "id категории",
						onChange: (event) => setDraft({
							...draft,
							category: event.target.value
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: draft.category,
						onChange: (event) => setDraft({
							...draft,
							category: event.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Без категории"
						}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: category.id,
							children: category.name
						}, category.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Цена, баллы",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: draft.price,
							onChange: (event) => setDraft({
								...draft,
								price: Number(event.target.value)
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Остаток",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							inputMode: "numeric",
							value: draft.stock,
							onChange: (event) => setDraft({
								...draft,
								stock: Number(event.target.value)
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: draft.active,
						onChange: (event) => setDraft({
							...draft,
							active: event.target.checked
						})
					}), "Показывать в каталоге"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					children: "Сохранить"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Выберите товар или создайте новый."
			})]
		})]
	});
}
function Orders() {
	const orders = useStore((state) => state.orders);
	const people = useStore((state) => state.people);
	const setStatus = useStore((state) => state.setOrderStatus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-sm text-muted",
		children: "Сервер отдаёт историю заказов текущего пользователя. Общей очереди всех сотрудников в описании API нет — если здесь только ваши заказы, так и задумано."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-lg border border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[720px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-card text-xs text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Заказ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Сотрудник"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Состав"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Сумма"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Статус"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: order.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: people.find((person) => person.id === order.userId)?.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: order.items.map((item) => `${item.title} ×${item.qty}`).join(", ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular",
						children: formatNumber(order.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 rounded-md border border-line bg-surface px-2",
							value: ORDER_FLOW.includes(order.status) ? order.status : order.status,
							onChange: (event) => {
								setStatus(order.id, event.target.value).then((result) => {
									if (!result.ok) toast.error(result.error);
								});
							},
							children: [!ORDER_FLOW.includes(order.status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: order.status,
								children: orderStatusLabel(order.status)
							}) : null, ORDER_FLOW.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: status,
								children: orderStatusLabel(status)
							}, status))]
						})
					})
				]
			}, order.id)) })]
		})
	})] });
}
function People() {
	const people = useStore((state) => state.people);
	const me = useStore((state) => state.currentUserId);
	const roles = useStore((state) => state.roleCatalog);
	const setRole = useStore((state) => state.setUserRole);
	const setStatus = useStore((state) => state.setUserStatus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-sm text-muted",
		children: "В списке виден только ваш личный баланс: чужие суммы сервер отдельно не отдаёт. Роли берутся из базы."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-lg border border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[760px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-card text-xs text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Сотрудник"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Отдел"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Личный баланс"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Роль"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Статус"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: people.map((person) => {
				const code = person.roleCodes?.[0] ?? "";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: person.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: person.position
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: person.department
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular",
							children: person.id === me ? formatNumber(person.balance) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-10 max-w-48 rounded-md border border-line bg-surface px-2",
								value: code,
								onChange: (event) => {
									setRole(person.id, event.target.value).then((result) => {
										if (!result.ok) toast.error(result.error);
									});
								},
								children: [code && !roles.some((role) => role.code === code) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: code,
									children: code
								}) : null, roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: role.code,
									children: role.name
								}, role.code))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-brand",
								onClick: () => void setStatus(person.id, person.status === "active" ? "blocked" : "active").then((result) => {
									if (!result.ok) toast.error(result.error);
								}),
								children: person.status === "active" ? "Активен" : "Заблокирован"
							})
						})
					]
				}, person.id);
			}) })]
		})
	})] });
}
function Activities() {
	const activities = useStore((state) => state.activities);
	const save = useStore((state) => state.saveActivity);
	const [title, setTitle] = (0, import_react.useState)("");
	const [reward, setReward] = (0, import_react.useState)(50);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: activities.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRow, { activity }, activity.id))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-4 flex flex-col gap-3 rounded-lg bg-card p-4 sm:flex-row sm:items-end",
		onSubmit: (event) => {
			event.preventDefault();
			save({
				id: `act-${Date.now()}`,
				title,
				description: "Задание, добавленное администратором. Награда один раз.",
				category: "event",
				kind: "once",
				reward,
				target: 1,
				active: true
			});
			setTitle("");
			toast.success("Активность создана");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Новая активность",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					value: title,
					onChange: (event) => setTitle(event.target.value),
					placeholder: "Название"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Награда",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					inputMode: "numeric",
					value: reward,
					onChange: (event) => setReward(Number(event.target.value))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Создать"
			})
		]
	})] });
}
function ActivityRow({ activity }) {
	const save = useStore((state) => state.saveActivity);
	const [reward, setReward] = (0, import_react.useState)(activity.reward);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-wrap items-center gap-3 rounded-lg bg-card px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: activity.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: activity.active ? "Видна сотрудникам" : "Скрыта"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted",
				children: ["Награда", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "ml-2 h-10 w-24 rounded-md border border-line px-2 text-sm text-ink",
					value: reward,
					inputMode: "numeric",
					onChange: (event) => setReward(Number(event.target.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "line",
				onClick: () => save({
					...activity,
					reward,
					active: !activity.active
				}),
				children: activity.active ? "Скрыть" : "Показать"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "soft",
				onClick: () => save({
					...activity,
					reward
				}),
				children: "Сохранить награду"
			})
		]
	});
}
function Economy() {
	const people = useStore((state) => state.people);
	const ledger = useStore((state) => state.ledger).slice(0, 12);
	const adjust = useStore((state) => state.adjustBalance);
	const [userId, setUserId] = (0, import_react.useState)(people[0]?.id ?? "");
	const [amount, setAmount] = (0, import_react.useState)(100);
	const [reason, setReason] = (0, import_react.useState)("");
	const [balanceType, setBalanceType] = (0, import_react.useState)("Personal");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-lg bg-card p-4",
			onSubmit: (event) => {
				event.preventDefault();
				adjust({
					userId,
					amount,
					reason,
					balanceType
				}).then((result) => {
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Баланс обновлён");
						setReason("");
					}
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Корректировка"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Какой баланс",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: balanceType,
						onChange: (event) => setBalanceType(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Personal",
							children: "Личный"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Reward",
							children: "Рабочий, для поощрений"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Сотрудник",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: userId,
						onChange: (event) => setUserId(event.target.value),
						children: people.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: person.id,
							children: person.name
						}, person.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Сумма",
					hint: "Отрицательная списывает баллы. Баланс ниже нуля невозможен.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						inputMode: "numeric",
						value: amount,
						onChange: (event) => setAmount(Number(event.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Причина",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: reason,
						onChange: (event) => setReason(event.target.value),
						placeholder: "За что корректировка"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					children: "Провести"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-line rounded-lg border border-line",
			children: ledger.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-3 py-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: people.find((person) => person.id === entry.userId)?.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [" · ", entry.reason]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "float-right tabular font-semibold",
						children: [entry.amount > 0 ? "+" : "", formatNumber(entry.amount)]
					})
				]
			}, entry.id))
		})]
	});
}
function Tickets() {
	const tickets = useStore((state) => state.tickets);
	const people = useStore((state) => state.people);
	const setStatus = useStore((state) => state.setTicketStatus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-sm text-muted",
		children: "Ответы пишутся в разделе поддержки — очередь общая для администраторов."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-wrap items-center gap-3 rounded-lg bg-card px-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: ticket.subject
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: people.find((person) => person.id === ticket.userId)?.name
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "h-10 rounded-md border border-line bg-surface px-2 text-sm",
					value: ticket.status,
					onChange: (event) => setStatus(ticket.id, event.target.value),
					children: Object.keys(TICKET_STATUS).map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: status,
						children: TICKET_STATUS[status]
					}, status))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/support",
					className: "text-sm font-semibold text-brand",
					children: "Открыть"
				})
			]
		}, ticket.id))
	})] });
}
//#endregion
export { AdminPage as component };
