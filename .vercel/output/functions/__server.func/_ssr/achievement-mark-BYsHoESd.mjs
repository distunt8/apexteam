import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Award } from "../_libs/lucide-react.mjs";
import { O as cn } from "./router-Dr41VdEz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/achievement-mark-BYsHoESd.js
var import_jsx_runtime = require_jsx_runtime();
function AchievementMark({ iconUrl, earned = true, className }) {
	if (iconUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: iconUrl,
		alt: "",
		className: cn("size-8 rounded-lg object-cover", !earned && "opacity-40", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: cn("size-6", earned ? "text-brand" : "text-brand-soft", className) });
}
//#endregion
export { AchievementMark as t };
