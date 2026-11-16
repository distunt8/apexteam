import { i as __toESM } from "../_runtime.mjs";
import { S as useNavigate, X as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as TextInput, T as TextArea, f as useStore, n as Route, v as formatPoints, w as Panel, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell } from "./shell-1JLU4O9d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/surveys._surveyId-CDISyuun.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SurveyPage() {
	const { surveyId } = Route.useParams();
	const survey = useStore((state) => state.activitiesCatalog.surveys.find((item) => item.id === surveyId));
	const submit = useStore((state) => state.submitSurvey);
	const navigate = useNavigate();
	const [values, setValues] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!survey) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-3xl font-bold",
		children: "Опрос не найден"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/activities",
		search: { kind: "survey" },
		className: "mt-4 inline-block text-sm font-semibold text-brand",
		children: "Ко всем активностям"
	})] });
	const locked = !survey.canRespond;
	async function send() {
		if (!survey) return;
		if (survey.questions.find((question) => question.required && empty(values[question.id]))) {
			toast.error("Заполните обязательные вопросы");
			return;
		}
		setBusy(true);
		const result = await submit(survey.id, survey.questions.filter((question) => !empty(values[question.id])).map((question) => ({
			questionId: question.id,
			value: values[question.id]
		})));
		setBusy(false);
		if (!result.ok) toast.error(result.error);
		else {
			toast.success("Ответы отправлены");
			navigate({
				to: "/activities",
				search: { kind: "survey" }
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold text-brand",
			children: "Опрос"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 text-3xl font-bold tracking-tight",
			children: survey.title
		}),
		survey.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm text-muted",
			children: survey.description
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: survey.reward > 0 ? `Награда ${formatPoints(survey.reward)}` : "Без награды"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-5 max-w-2xl",
			children: [
				survey.questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Вопросов пока нет."
				}) : null,
				locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Ответ уже отправлен."
				}) : null,
				!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [survey.questions.map((question) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Question, {
						question,
						value: values[question.id],
						onChange: (value) => setValues((current) => ({
							...current,
							[question.id]: value
						}))
					}, question.id)), survey.questions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void send(),
						children: busy ? "Отправляем…" : "Отправить ответы"
					}) : null]
				}) : null
			]
		})
	] });
}
function empty(value) {
	return value == null || value === "" || Array.isArray(value) && value.length === 0;
}
function Question({ question, value, onChange }) {
	const selected = Array.isArray(value) ? value.map(String) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
			className: "text-sm font-semibold",
			children: [question.text, question.required ? "" : " · необязательно"]
		}),
		question.type === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
			className: "mt-2 min-h-16",
			value: typeof value === "string" ? value : "",
			onChange: (event) => onChange(event.target.value)
		}) : null,
		question.type === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			className: "mt-2 max-w-40",
			inputMode: "numeric",
			value: value == null ? "" : String(value),
			onChange: (event) => onChange(event.target.value === "" ? "" : Number(event.target.value))
		}) : null,
		question.type === "boolean" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex gap-4 text-sm",
			children: [true, false].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-10 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "radio",
					checked: value === option,
					onChange: () => onChange(option)
				}), option ? "Да" : "Нет"]
			}, String(option)))
		}) : null,
		question.type === "rating" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex gap-2",
			children: [
				1,
				2,
				3,
				4,
				5
			].map((score) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(score),
				className: `grid size-11 place-items-center rounded-md text-sm font-bold ${value === score ? "bg-brand text-white" : "bg-card"}`,
				children: score
			}, score))
		}) : null,
		question.type === "single_choice" || question.type === "multiple_choice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-col gap-1",
			children: question.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-10 items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: question.type === "single_choice" ? "radio" : "checkbox",
					checked: question.type === "single_choice" ? value === option : selected.includes(option),
					onChange: () => {
						if (question.type === "single_choice") onChange(option);
						else onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
					}
				}), option]
			}, option))
		}) : null
	] });
}
//#endregion
export { SurveyPage as component };
