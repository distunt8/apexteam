import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Button, g as TextInput, h as TextArea, i as useStore, m as Panel, o as formatDateTime, p as Field, r as isAdminRole } from "./router-CTHYymUA.mjs";
import { a as TICKET_STATUS, i as Shell } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-DGQ49eJB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SupportPage() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const people = useStore((state) => state.people);
	const tickets = useStore((state) => state.tickets);
	const createTicket = useStore((state) => state.createTicket);
	const reply = useStore((state) => state.replyTicket);
	const [subject, setSubject] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [answer, setAnswer] = (0, import_react.useState)("");
	if (!user) return null;
	const visible = isAdminRole(user.role) ? tickets : tickets.filter((ticket) => ticket.userId === user.id);
	const current = visible.find((ticket) => ticket.id === openId) ?? visible[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Поддержка"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Напишите вопрос. Ответ придёт в это же обращение. Обращения пока хранятся только в этом браузере — в базе такого раздела нет."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 grid gap-3 rounded-lg bg-card p-4",
				onSubmit: (event) => {
					event.preventDefault();
					const result = createTicket(subject, text);
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Обращение создано");
						setSubject("");
						setText("");
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Тема",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: subject,
							onChange: (event) => setSubject(event.target.value),
							placeholder: "Коротко, о чём речь"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Описание",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: text,
							onChange: (event) => setText(event.target.value),
							placeholder: "Что произошло и чем помочь"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full sm:w-auto",
						children: "Отправить обращение"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2",
					children: [visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Обращений пока нет."
					}) : null, visible.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpenId(ticket.id),
						className: `w-full rounded-lg px-3 py-3 text-left ${current?.id === ticket.id ? "bg-brand-wash" : "bg-card"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-semibold",
							children: ticket.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted",
							children: TICKET_STATUS[ticket.status]
						})]
					}) }, ticket.id))]
				}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: current.subject
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							people.find((person) => person.id === current.userId)?.name,
							" · ",
							TICKET_STATUS[current.status]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: current.messages.map((message) => {
							const author = people.find((person) => person.id === message.authorId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md bg-surface px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-brand-deep",
										children: author?.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm",
										children: message.text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: formatDateTime(message.createdAt)
									})
								]
							}, message.id);
						})
					}),
					isAdminRole(user.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4",
						onSubmit: (event) => {
							event.preventDefault();
							const result = reply(current.id, answer);
							if (!result.ok) toast.error(result.error);
							else {
								setAnswer("");
								toast.success("Ответ отправлен");
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: answer,
							onChange: (event) => setAnswer(event.target.value),
							placeholder: "Ответ сотруднику"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "mt-2",
							children: "Ответить"
						})]
					}) : null
				] }) : null]
			})
		]
	});
}
//#endregion
export { SupportPage as component };
