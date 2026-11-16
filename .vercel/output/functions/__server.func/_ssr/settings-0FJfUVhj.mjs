import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Field, E as TextInput, a as useTheme, f as useStore, w as Panel, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell } from "./shell-1JLU4O9d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-0FJfUVhj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight",
			children: "Настройки"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Тема и пароль. Остальной профиль остаётся на своей странице."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/profile",
			className: "mt-3 inline-block text-sm font-semibold text-brand",
			children: "Вернуться в профиль"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSwitch, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordCard, {})
	] });
}
function ThemeSwitch() {
	const { choice, setChoice } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: "Тема"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: [
				{
					id: "system",
					label: "Как в системе"
				},
				{
					id: "light",
					label: "Светлая"
				},
				{
					id: "dark",
					label: "Тёмная"
				}
			].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setChoice(option.id),
				className: `min-h-11 rounded-md px-3 text-sm font-semibold transition hover:-translate-y-0.5 ${choice === option.id ? "bg-brand text-white" : "bg-card text-ink"}`,
				children: option.label
			}, option.id))
		})]
	});
}
function PasswordCard() {
	const changePassword = useStore((state) => state.changePassword);
	const [current, setCurrent] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [again, setAgain] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "Пароль"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 grid gap-3 sm:grid-cols-2",
			onSubmit: (event) => {
				event.preventDefault();
				if (password.length < 6) {
					toast.error("Пароль должен быть не короче 6 символов");
					return;
				}
				if (password === current) {
					toast.error("Новый пароль совпадает с текущим");
					return;
				}
				if (password !== again) {
					toast.error("Пароли не совпадают");
					return;
				}
				setPending(true);
				changePassword(password, current).then((result) => {
					setPending(false);
					if (!result.ok) toast.error(result.error);
					else {
						toast.success("Пароль изменён");
						setCurrent("");
						setPassword("");
						setAgain("");
					}
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Текущий пароль",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "password",
						autoComplete: "current-password",
						value: current,
						onChange: (event) => setCurrent(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Новый пароль",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "password",
						autoComplete: "new-password",
						minLength: 6,
						value: password,
						onChange: (event) => setPassword(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Повтор",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "password",
						autoComplete: "new-password",
						value: again,
						onChange: (event) => setAgain(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: pending,
						children: pending ? "Сохраняем…" : "Сменить пароль"
					})
				})
			]
		})]
	});
}
//#endregion
export { SettingsPage as component };
