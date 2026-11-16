import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Field, E as TextInput, T as TextArea, f as useStore, g as formatDateTime, l as canManageSupport, w as Panel, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell, o as TICKET_STATUS } from "./shell-1JLU4O9d.mjs";
import { n as usePage, t as Pager } from "./pager-DvNdDOo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-BI7NhHnd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SupportPage() {
	const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
	const tickets = useStore((state) => state.tickets);
	const ticketsError = useStore((state) => state.ticketsError);
	const loadTickets = useStore((state) => state.loadTickets);
	const createTicket = useStore((state) => state.createTicket);
	const reply = useStore((state) => state.replyTicket);
	const openTicket = useStore((state) => state.openTicket);
	const setStatus = useStore((state) => state.setTicketStatus);
	const assignTicket = useStore((state) => state.assignTicket);
	const [subject, setSubject] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [replying, setReplying] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		loadTickets();
	}, [loadTickets]);
	const current = tickets.find((ticket) => ticket.id === openId) ?? tickets[0];
	const ticketPage = usePage(tickets, 8);
	(0, import_react.useEffect)(() => {
		if (current?.id) openTicket(current.id);
	}, [
		current?.id,
		tickets.length,
		openTicket
	]);
	if (!user) return null;
	const staff = canManageSupport(user.role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Поддержка"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: staff ? "Все обращения сотрудников. Ответ и статус пишутся здесь." : "Напишите вопрос. Ответ придёт в это же обращение."
			}),
			ticketsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				children: ticketsError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 grid gap-3 rounded-lg bg-card p-4",
				onSubmit: (event) => {
					event.preventDefault();
					setPending(true);
					createTicket(subject, text).then((result) => {
						setPending(false);
						if (!result.ok) toast.error(result.error);
						else {
							toast.success("Обращение создано");
							setSubject("");
							setText("");
						}
					});
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
						disabled: pending,
						children: "Отправить обращение"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2",
					children: [tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Обращений пока нет."
					}) : null, ticketPage.items.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpenId(ticket.id),
						className: `w-full rounded-lg px-3 py-3 text-left ${current?.id === ticket.id ? "bg-brand-wash" : "bg-card"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-semibold",
							children: ticket.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-xs text-muted",
							children: [
								staff ? `${ticket.userName || "Сотрудник"} · ` : "",
								TICKET_STATUS[ticket.status],
								ticket.assignedName ? ` · ${ticket.assignedName}` : ""
							]
						})]
					}) }, ticket.id))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
					page: ticketPage.page,
					pages: ticketPage.pages,
					total: ticketPage.total,
					onPage: ticketPage.setPage
				})] }), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: current.subject
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							current.userName || "Сотрудник",
							" · ",
							TICKET_STATUS[current.status],
							current.assignedName ? ` · ведёт ${current.assignedName}` : staff ? " · не назначено" : ""
						]
					}),
					staff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-10 rounded-md border border-line bg-surface px-2 text-sm",
							value: current.status,
							onChange: (event) => {
								const status = event.target.value;
								setStatus(current.id, status).then((result) => {
									if (!result.ok) toast.error(result.error);
								});
							},
							children: Object.keys(TICKET_STATUS).map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: status,
								children: TICKET_STATUS[status]
							}, status))
						}), current.assignedTo === user.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "line",
							onClick: () => void assignTicket(current.id, null).then((result) => {
								if (!result.ok) toast.error(result.error);
							}),
							children: "Снять с себя"
						}) : !current.assignedTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "line",
							onClick: () => void assignTicket(current.id, user.id).then((result) => {
								if (!result.ok) toast.error(result.error);
								else toast.success("Обращение у вас");
							}),
							children: "Взять себе"
						}) : null]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-3",
						children: [current.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "Сообщений пока нет."
						}) : null, current.messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md bg-surface px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-brand-deep",
									children: message.authorName || "Сотрудник"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm",
									children: message.text
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: message.createdAt ? formatDateTime(message.createdAt) : ""
								})
							]
						}, message.id))]
					}),
					current.status === "closed" || current.status === "resolved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: current.status === "resolved" ? "Обращение решено. Новые сообщения не принимаются." : "Обращение закрыто. Новые сообщения не принимаются."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4",
						onSubmit: (event) => {
							event.preventDefault();
							if (replying) return;
							setReplying(true);
							reply(current.id, answer).then((result) => {
								setReplying(false);
								if (!result.ok) toast.error(result.error);
								else {
									setAnswer("");
									toast.success("Сообщение отправлено");
								}
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: answer,
							onChange: (event) => setAnswer(event.target.value),
							placeholder: "Сообщение"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "mt-2",
							disabled: replying,
							children: "Отправить"
						})]
					})
				] }) : null]
			})
		]
	});
}
//#endregion
export { SupportPage as component };
