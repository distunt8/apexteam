import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Button, g as TextInput, h as TextArea, i as useStore, l as initials, n as awardAmounts, s as formatNumber } from "./router-CTHYymUA.mjs";
import { i as Shell } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/colleagues-Bi2VqAvp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ColleaguesPage() {
	const people = useStore((state) => state.people);
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const send = useStore((state) => state.sendRecognition);
	const reward = useStore((state) => state.rewardBalance);
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
	if (!user) return null;
	const amounts = awardAmounts(user.role);
	const target = people.find((person) => person.id === selected);
	const canReward = user.role !== "employee" || reward != null;
	function submit() {
		if (!selected || amount == null) {
			toast.error("Выберите коллегу и сумму");
			return;
		}
		setPending(true);
		send({
			toId: selected,
			amount,
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Выберите коллегу и отправьте благодарность. Себе отправить нельзя."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm",
				children: [
					"Личный баланс: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-brand",
						children: formatNumber(user.balance)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							" ",
							"· рабочий: ",
							reward == null ? "нет доступа" : formatNumber(reward)
						]
					})
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
						children: list.map((person) => {
							const self = person.id === user.id;
							const on = person.id === selected;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: self,
								onClick: () => setSelected(person.id),
								className: `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left ${on ? "bg-brand-wash" : "bg-card"} disabled:opacity-50`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white",
										children: initials(person.name)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate font-semibold",
											children: person.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-xs text-muted",
											children: person.position
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-brand",
										children: self ? "Это вы" : "Спасибо"
									})
								]
							}) }, person.id);
						})
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
							}), "Списать с рабочего баланса (поощрение)"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: amounts.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAmount(value),
								className: `min-h-11 min-w-14 rounded-md px-3 text-sm font-bold ${amount === value ? "bg-brand text-white" : "bg-surface text-ink"}`,
								children: value
							}, value))
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
							disabled: !target || amount == null || pending,
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
