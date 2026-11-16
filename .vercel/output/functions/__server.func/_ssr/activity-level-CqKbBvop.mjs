import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as formatNumber, f as useStore, w as Panel } from "./router-Dr41VdEz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-level-CqKbBvop.js
var import_jsx_runtime = require_jsx_runtime();
function ActivityLevelCard({ detailed = false }) {
	const engagement = useStore((state) => state.engagement);
	const error = useStore((state) => state.engagementError);
	const status = useStore((state) => state.engagementStatus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold tracking-wide text-muted",
			children: "УРОВЕНЬ АКТИВНОСТИ"
		}),
		!engagement && status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Загружаем уровень с сервера…"
		}) : null,
		!engagement && status !== "loading" && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-danger",
			children: error
		}) : null,
		engagement ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xl font-bold",
					children: engagement.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "tabular text-sm text-muted",
					children: [
						formatNumber(engagement.score),
						"/",
						formatNumber(engagement.maxScore)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1.5 overflow-hidden rounded-full bg-line",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-brand",
					style: { width: `${Math.round(engagement.progress * 100)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: engagement.nextTitle ? `До «${engagement.nextTitle}» ещё ${formatNumber(engagement.pointsToNext ?? 0)}` : "Высший уровень"
			}),
			detailed && engagement.breakdown.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1.5",
				children: engagement.breakdown.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 truncate",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular shrink-0 font-semibold",
						children: formatNumber(item.points)
					})]
				}, item.code || item.title))
			}) : null
		] }) : null,
		detailed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/my-activity",
			className: "mt-3 inline-block text-sm font-semibold text-brand",
			children: "Моя активность"
		})
	] });
}
//#endregion
export { ActivityLevelCard as t };
