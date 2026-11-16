import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as TextInput, T as TextArea, _ as formatNumber, b as pointsLabel, d as hasWorkBalance, f as useStore, o as awardAmounts, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell, s as UserAvatar } from "./shell-1JLU4O9d.mjs";
import { n as usePage, t as Pager } from "./pager-DvNdDOo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/colleagues-ZHRNgzeN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ColleaguesPage() {
	const people = useStore((state) => state.people);
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const send = useStore((state) => state.sendRecognition);
	const reward = useStore((state) => state.rewardBalance);
	const feed = useStore((state) => state.feed);
	const [query, setQuery] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [asManager, setAsManager] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(false);
	const list = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return people.filter((person) => {
			if (person.status !== "active") return false;
			if (!needle) return true;
			return `${person.name} ${person.position} ${person.department}`.toLowerCase().includes(needle);
		});
	}, [people, query]);
	const page = usePage(list, 8, query);
	if (!user) return null;
	const amounts = awardAmounts(user.role);
	const target = people.find((person) => person.id === selected);
	const canReward = hasWorkBalance(user.role);
	const thanked = Boolean(target && feed.some((item) => item.fromId === user.id && item.toId === target.id && item.kind !== "manager" && Date.parse(item.createdAt) >= Date.now() - 6048e5));
	function submit() {
		if (!selected) {
			toast.error("Выберите коллегу");
			return;
		}
		if (asManager && amount == null) {
			toast.error("Выберите сумму поощрения");
			return;
		}
		setPending(true);
		send({
			toId: selected,
			amount: amount ?? 0,
			message,
			asManager: canReward && asManager
		}).then((result) => {
			setPending(false);
			if (!result.ok) toast.error(result.error);
			else {
				toast.success(asManager ? "Поощрение отправлено" : "Благодарность отправлена");
				setMessage("");
				setAmount(null);
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "top",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Коллеги"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Благодарность не списывает ваши апексы: коллега получает ",
					25,
					" ",
					pointsLabel(25),
					". Одному человеку — только раз в неделю.",
					canReward ? " Поощрение руководителя списывается с рабочего баланса." : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm",
				children: [
					"Личный баланс: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-brand",
						children: formatNumber(user.balance)
					}),
					canReward && asManager ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [" · рабочий: ", reward == null ? "нет доступа" : formatNumber(reward)]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Поиск по коллегам",
							"aria-label": "Поиск по коллегам",
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs font-semibold tracking-wide text-muted",
						children: "КОЛЛЕГИ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-2",
						children: page.items.map((person) => {
							const self = person.id === user.id;
							const on = person.id === selected;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: `rounded-lg px-3 py-3 ${on ? "bg-brand-wash" : "bg-card"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
											user: person,
											className: "size-11"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/people/$userId",
												params: { userId: person.id },
												className: "block truncate font-semibold hover:text-brand",
												children: person.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-xs text-muted",
												children: person.position
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: self,
											onClick: () => setSelected(person.id),
											className: "text-sm font-medium text-brand disabled:opacity-50",
											children: self ? "Это вы" : on ? "Выбран" : "Спасибо"
										})
									]
								})
							}, person.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
						page: page.page,
						pages: page.pages,
						total: page.total,
						onPage: page.setPage
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "rounded-xl bg-card p-4 lg:sticky lg:top-20",
					onSubmit: (event) => {
						event.preventDefault();
						submit();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: asManager ? "Поощрение с рабочего баланса" : "Личная благодарность"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: target ? `Кому: ${target.name}` : "Сначала выберите коллегу слева"
						}),
						canReward ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 flex min-h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: asManager,
								onChange: (event) => setAsManager(event.target.checked)
							}), "Поощрение с рабочего баланса"]
						}) : null,
						asManager ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: amounts.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAmount(value),
								className: `min-h-11 min-w-14 rounded-md px-3 text-sm font-bold ${amount === value ? "bg-brand text-white" : "bg-surface text-ink"}`,
								children: value
							}, value))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: thanked ? "Этому коллеге на этой неделе уже отправлена благодарность." : `Коллега получит 25 ${pointsLabel(25)}.`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm font-medium",
							children: ["Сообщение (необязательно)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
								value: message,
								maxLength: 120,
								onChange: (event) => setMessage(event.target.value),
								placeholder: "Напишите несколько слов благодарности",
								className: "mt-2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-right text-xs text-muted",
							children: [message.length, "/120"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "mt-3 w-full",
							disabled: !target || pending || (asManager ? amount == null : thanked),
							children: "Отправить"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ColleaguesPage as component };
