import { i as __toESM } from "../_runtime.mjs";
import { C as useRouter, X as require_react, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, p as HeadContent, v as lazyRouteComponent, w as require_jsx_runtime, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as immer } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CTHYymUA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/brand/logo.png",
		alt: "Апекс",
		className: cn("h-10 w-auto", className)
	});
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors duration-150 disabled:opacity-45", variant === "primary" && "bg-brand text-white hover:bg-brand-strong active:bg-brand-deep", variant === "ghost" && "bg-transparent text-ink hover:bg-brand-wash", variant === "soft" && "bg-brand-wash text-brand-deep hover:bg-brand-soft", variant === "line" && "border border-line bg-surface text-ink hover:border-brand-mid", className),
		...props
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-2 block text-sm font-medium text-ink",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function TextInput(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cn("h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-brand", props.className)
	});
}
function TextArea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cn("min-h-24 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-brand", props.className)
	});
}
function Chip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-10 rounded-full px-3 text-sm font-medium", active ? "bg-brand text-white" : "bg-card text-ink hover:bg-brand-wash"),
		children
	});
}
function Panel({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-xl bg-card p-4 sm:p-5", className),
		children
	});
}
function formatNumber(value) {
	return new Intl.NumberFormat("ru-RU").format(value);
}
function pointsLabel(value) {
	const abs = Math.abs(value) % 100;
	const digit = abs % 10;
	if (abs > 10 && abs < 20) return "баллов";
	if (digit === 1) return "балл";
	if (digit >= 2 && digit <= 4) return "балла";
	return "баллов";
}
function formatPoints(value) {
	return `${formatNumber(value)} ${pointsLabel(value)}`;
}
var MONTHS = [
	"янв",
	"фев",
	"мар",
	"апр",
	"мая",
	"июн",
	"июл",
	"авг",
	"сен",
	"окт",
	"ноя",
	"дек"
];
function formatDate(iso) {
	const date = new Date(iso);
	return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
function formatDateTime(iso) {
	const date = new Date(iso);
	const hh = String(date.getHours()).padStart(2, "0");
	const mm = String(date.getMinutes()).padStart(2, "0");
	return `${formatDate(iso)}, ${hh}:${mm}`;
}
function todayKey(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function firstName(full) {
	return full.split(" ")[0] ?? full;
}
function initials(full) {
	return full.split(" ").slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();
}
var TOKEN_KEY = "apex.token";
var ApexError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
	}
};
function readToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(TOKEN_KEY);
}
function writeToken(token) {
	if (typeof window === "undefined") return;
	if (token) window.localStorage.setItem(TOKEN_KEY, token);
	else window.localStorage.removeItem(TOKEN_KEY);
}
async function apex(path, init) {
	const headers = new Headers(init?.headers);
	const token = readToken();
	if (token) headers.set("authorization", `Bearer ${token}`);
	if (init?.body && !headers.has("content-type")) headers.set("content-type", "application/json");
	let response;
	try {
		response = await fetch(`/api/apex${path}`, {
			...init,
			headers
		});
	} catch {
		throw new ApexError("Нет связи с сервером Апекс. Если он спал, первый ответ занимает около минуты — повторите.", 0);
	}
	const text = await response.text();
	let data = null;
	if (text) try {
		data = JSON.parse(text);
	} catch {
		data = text;
	}
	if (!response.ok) throw new ApexError(errorText(data, response.status), response.status);
	return data;
}
function errorText(data, status) {
	if (status === 401) return "Неверный email или пароль, либо сессия закончилась.";
	if (status === 403) return "Недостаточно прав для этого действия.";
	if (status === 404) return "На сервере нет таких данных.";
	if (status === 409) return "Данные уже изменились. Обновите и повторите.";
	if (status === 502 || status === 503 || status === 0) return "Сервер Апекс не ответил. Если он спал, подождите около минуты и повторите.";
	return serverMessage(data) || `Сервер ответил ошибкой ${status}.`;
}
function serverMessage(data) {
	if (typeof data === "string" && data.trim()) return data.trim().slice(0, 280);
	if (!data || typeof data !== "object") return "";
	const record = data;
	for (const key of [
		"message",
		"detail",
		"title",
		"error"
	]) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
	if (record.errors && typeof record.errors === "object") {
		const parts = [];
		for (const value of Object.values(record.errors)) if (Array.isArray(value)) parts.push(...value.map(String));
		else if (typeof value === "string") parts.push(value);
		if (parts.length) return parts.join(" ");
	}
	return "";
}
function extractToken(data) {
	return digToken(data, 0);
}
function digToken(data, depth) {
	if (depth > 5 || data == null) return null;
	if (typeof data === "string") {
		const value = data.trim();
		if (value.length > 20 && !value.includes(" ")) return value;
		return null;
	}
	if (typeof data !== "object") return null;
	if (Array.isArray(data)) {
		for (const item of data) {
			const found = digToken(item, depth + 1);
			if (found) return found;
		}
		return null;
	}
	const record = data;
	for (const key of [
		"accessToken",
		"access_token",
		"token",
		"jwt",
		"bearerToken",
		"idToken"
	]) {
		const value = record[key];
		if (typeof value === "string" && value.trim().length > 20) return value.trim();
		if (value && typeof value === "object") {
			const nested = digToken(value, depth + 1);
			if (nested) return nested;
		}
	}
	for (const value of Object.values(record)) {
		const found = digToken(value, depth + 1);
		if (found) return found;
	}
	return null;
}
function shapeOf(data) {
	if (data == null) return "пусто";
	if (Array.isArray(data)) return `массив из ${data.length}`;
	if (typeof data !== "object") return typeof data;
	const keys = Object.keys(data);
	return keys.length ? keys.slice(0, 10).join(", ") : "пустой объект";
}
function obj(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function asArray(data) {
	if (Array.isArray(data)) return data;
	const record = obj(data);
	if (!record) return [];
	for (const key of [
		"items",
		"data",
		"results",
		"value",
		"products",
		"orders",
		"users",
		"categories",
		"transactions",
		"cartItems",
		"lines",
		"entries",
		"leaderboard",
		"thanks"
	]) if (Array.isArray(record[key])) return record[key];
	for (const value of Object.values(record)) if (Array.isArray(value)) return value;
	if (record.data) return asArray(record.data);
	return [];
}
function str(value) {
	return typeof value === "string" ? value : value == null ? "" : String(value);
}
function num(value) {
	const parsed = typeof value === "number" ? value : Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}
function noteList(data, label, warnings) {
	const list = asArray(data);
	if (list.length === 0 && data && typeof data === "object" && !Array.isArray(data)) {
		const keys = Object.keys(data);
		const wrappers = /* @__PURE__ */ new Set([
			"items",
			"data",
			"results",
			"value"
		]);
		if (keys.length > 0 && !keys.every((key) => wrappers.has(key))) warnings.push(`${label}: не разобрал ответ (${shapeOf(data)}).`);
	}
	return list;
}
var FALLBACKS = [
	"/rewards/hoodie.jpg",
	"/rewards/tshirt.jpg",
	"/rewards/card-a.jpg",
	"/rewards/card-b.jpg",
	"/rewards/card-c.jpg",
	"/rewards/headphones.jpg",
	"/rewards/dayoff.jpg",
	"/rewards/cooking.jpg",
	"/rewards/balloon.jpg"
];
function mapRole(codes, canAdmin) {
	const folded = codes.map((code) => code.toLowerCase());
	if (folded.some((code) => /chief|super|owner|director|главн/.test(code))) return "chief";
	if (canAdmin || folded.some((code) => code.includes("admin"))) return "admin";
	if (folded.some((code) => /manager|lead|supervisor|hr|руковод/.test(code))) return "manager";
	return "employee";
}
var ROLE_TITLE = {
	employee: "Сотрудник",
	manager: "Руководитель",
	admin: "Администратор",
	chief: "Главный администратор"
};
function fullName(record) {
	const parts = [
		record.lastName,
		record.firstName,
		record.middleName
	].map(str).filter(Boolean);
	if (parts.length) return parts.join(" ");
	return str(record.name || record.fullName || "Сотрудник");
}
function mapUser(raw, balance = 0, score = 0, budget = 0) {
	const record = obj(raw);
	if (!record || record.id == null) return null;
	const codes = Array.isArray(record.roles) ? record.roles.map(str).filter(Boolean) : [];
	const names = Array.isArray(record.roleNames) ? record.roleNames.map(str) : [];
	const role = mapRole(codes, Boolean(record.canAccessAdminPanel));
	return {
		id: str(record.id),
		name: fullName(record),
		firstName: str(record.firstName),
		lastName: str(record.lastName),
		middleName: str(record.middleName),
		avatarUrl: str(record.avatarUrl),
		position: str(record.position),
		department: str(record.department),
		role,
		roleCodes: codes,
		roleTitle: names.filter(Boolean).join(", ") || ROLE_TITLE[role],
		balance,
		score,
		budget,
		budgetLimit: 0,
		status: record.isActive === false ? "blocked" : "active"
	};
}
function mapCategory(raw) {
	const record = obj(raw);
	if (!record || record.id == null) return null;
	return {
		id: str(record.id),
		name: str(record.name || "Категория"),
		sort: num(record.sortOrder)
	};
}
function mapProduct(raw, index, names) {
	const record = obj(raw);
	if (!record) return null;
	const id = record.id ?? record.productId;
	if (id == null) return null;
	const category = obj(record.category);
	const categoryId = record.categoryId ?? category?.id;
	const categoryName = str(record.categoryName || category?.name || names.get(str(categoryId)) || "");
	const image = str(record.imageUrl || record.image);
	return {
		id: str(id),
		category: categoryId == null ? "" : str(categoryId),
		categoryName,
		title: str(record.name || record.title || "Товар"),
		description: str(record.description),
		price: num(record.price),
		stock: record.stock == null ? record.isDigital ? 99 : 0 : num(record.stock),
		active: record.isActive !== false && record.active !== false,
		image: image || FALLBACKS[index % FALLBACKS.length] || "/rewards/card-a.jpg",
		popular: index < 3,
		isDigital: Boolean(record.isDigital)
	};
}
function mapCartItem(raw) {
	const record = obj(raw);
	if (!record) return null;
	const product = obj(record.product);
	const productId = record.productId ?? product?.id;
	if (productId == null) return null;
	const lineId = record.id ?? record.cartItemId ?? record.itemId;
	return {
		lineId: lineId == null ? "" : str(lineId),
		productId: str(productId),
		qty: Math.max(1, num(record.quantity ?? record.qty ?? 1))
	};
}
function mapStatus(value) {
	return {
		created: "created",
		new: "created",
		pending: "created",
		processing: "processing",
		inprogress: "processing",
		in_progress: "processing",
		ready: "ready",
		issued: "issued",
		completed: "issued",
		done: "issued",
		delivered: "issued",
		cancelled: "cancelled",
		canceled: "cancelled"
	}[value.trim().toLowerCase()] ?? (value || "created");
}
function statusToApi(status) {
	return {
		created: "Created",
		processing: "Processing",
		ready: "Ready",
		issued: "Issued",
		cancelled: "Cancelled"
	}[status] ?? status;
}
function mapOrder(raw, fallbackUserId) {
	const record = obj(raw);
	if (!record) return null;
	const id = record.id ?? record.orderId;
	if (id == null) return null;
	const items = asArray(record.items ?? record.lines ?? record.orderItems ?? record.products).map((item) => {
		const line = obj(item);
		if (!line) return null;
		const product = obj(line.product);
		return {
			productId: str(line.productId ?? product?.id ?? ""),
			title: str(line.name || line.title || product?.name || "Товар"),
			price: num(line.price ?? line.unitPrice ?? product?.price),
			qty: Math.max(1, num(line.quantity ?? line.qty ?? 1))
		};
	}).filter((item) => Boolean(item));
	const computed = items.reduce((sum, item) => sum + item.price * item.qty, 0);
	return {
		id: str(id),
		userId: str(record.userId || fallbackUserId),
		items,
		total: record.total != null || record.totalPrice != null ? num(record.total ?? record.totalPrice) : computed,
		status: mapStatus(str(record.status || record.orderStatus || "created")),
		createdAt: str(record.createdAt || (/* @__PURE__ */ new Date()).toISOString())
	};
}
function mapEntryType(amount, hint) {
	const blob = hint.toLowerCase();
	if (/refund|возврат/.test(blob)) return "refund";
	if (/purchase|order|заказ/.test(blob)) return amount < 0 ? "purchase" : "refund";
	if (/manager|bonus|поощр/.test(blob)) return amount < 0 ? "recognition_sent" : "manager_award";
	if (/thank|благодар/.test(blob)) return amount < 0 ? "recognition_sent" : "recognition_received";
	if (/admin|коррект|adjust/.test(blob)) return "admin_adjustment";
	if (/activity|achievement|daily|актив|достиж/.test(blob)) return "activity_reward";
	return amount < 0 ? "purchase" : "activity_reward";
}
function mapTransaction(raw, userId) {
	const record = obj(raw);
	if (!record || record.id == null) return null;
	const amount = num(record.amount);
	const description = str(record.description);
	const related = str(record.relatedEntityType);
	return {
		id: str(record.id),
		userId,
		type: mapEntryType(amount, `${related} ${description}`),
		amount,
		reason: description || related || "Операция",
		counterpartyId: record.relatedUserId ? str(record.relatedUserId) : void 0,
		createdAt: str(record.createdAt || (/* @__PURE__ */ new Date()).toISOString())
	};
}
function personName(raw) {
	const record = obj(raw);
	if (!record) return "";
	return fullName(record);
}
function mapThank(raw) {
	const record = obj(raw);
	if (!record) return null;
	const id = record.id ?? record.thankId;
	if (id == null) return null;
	const kindBlob = str(record.type || record.kind || record.thankType).toLowerCase();
	const from = obj(record.fromUser || record.sender || record.author);
	const to = obj(record.toUser || record.recipient);
	return {
		id: str(id),
		fromId: str(record.fromUserId || record.senderId || record.fromId || from?.id || ""),
		toId: str(record.toUserId || record.recipientId || record.toId || to?.id || ""),
		fromName: personName(from),
		toName: personName(to),
		amount: num(record.amount ?? record.points),
		message: str(record.message || record.text),
		kind: /manager|bonus|поощр/.test(kindBlob) ? "manager" : "peer",
		createdAt: str(record.createdAt || (/* @__PURE__ */ new Date()).toISOString())
	};
}
function mapBoard(raw) {
	const record = obj(raw);
	if (!record) return null;
	const user = obj(record.user);
	const id = str(record.userId || user?.id || record.id || "");
	if (!id) return null;
	const nested = user ? fullName(user) : "";
	return {
		id,
		name: str(record.fullName || record.name || record.userName || nested || "Сотрудник"),
		score: num(record.score ?? record.points ?? record.totalPoints ?? record.total ?? record.amount ?? record.value)
	};
}
function amountOf(data) {
	if (typeof data === "number") return data;
	const record = obj(data);
	if (!record) return 0;
	if (record.amount != null) return num(record.amount);
	if (record.balance != null) return num(record.balance);
	return 0;
}
async function optional(path) {
	try {
		return {
			ok: true,
			data: await apex(path)
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
async function loadWorkspace() {
	const warnings = [];
	const meRaw = await apex("/api/users/me");
	const me = mapUser(meRaw);
	if (!me) throw new ApexError(`Профиль пришёл в неожиданном виде (${shapeOf(meRaw)}).`, 200);
	const [usersRes, personalRes, rewardRes, txRes, productsRes, categoriesRes, cartRes, ordersRes, inRes, outRes, boardRes, rolesRes] = await Promise.all([
		optional("/api/users"),
		optional("/api/balances/me"),
		optional("/api/admin/balances/me"),
		optional("/api/balances/me/transactions?skip=0&take=50"),
		optional("/api/products"),
		optional("/api/categories"),
		optional("/api/cart"),
		optional("/api/orders"),
		optional("/api/thanks/for-me"),
		optional("/api/thanks/from-me"),
		optional("/api/leaderboard?limit=20"),
		optional("/api/roles")
	]);
	const personal = personalRes.ok ? amountOf(personalRes.data) : 0;
	if (!personalRes.ok && personalRes.error instanceof ApexError && personalRes.error.status !== 404) warnings.push(`Личный баланс: ${personalRes.error.message}`);
	let rewardBalance = null;
	if (rewardRes.ok) rewardBalance = amountOf(rewardRes.data);
	else if (rewardRes.error instanceof ApexError && rewardRes.error.status !== 403 && rewardRes.error.status !== 404) warnings.push(`Рабочий баланс: ${rewardRes.error.message}`);
	me.balance = personal;
	me.budget = rewardBalance ?? 0;
	const people = /* @__PURE__ */ new Map();
	if (usersRes.ok) {
		const list = noteList(usersRes.data, "Сотрудники", warnings);
		for (const item of list) {
			const person = mapUser(item);
			if (person) people.set(person.id, person);
		}
	} else if (usersRes.error instanceof ApexError && usersRes.error.status !== 404) warnings.push(`Список сотрудников: ${usersRes.error.message}`);
	const self = people.get(me.id);
	people.set(me.id, {
		...self ?? me,
		...me,
		balance: personal,
		budget: rewardBalance ?? 0
	});
	const categories = categoriesRes.ok ? noteList(categoriesRes.data, "Категории", warnings).map(mapCategory).filter((item) => Boolean(item)).sort((a, b) => a.sort - b.sort) : [];
	if (!categoriesRes.ok && categoriesRes.error instanceof ApexError && categoriesRes.error.status !== 404) warnings.push(`Категории: ${categoriesRes.error.message}`);
	const categoryNames = new Map(categories.map((item) => [item.id, item.name]));
	const products = productsRes.ok ? noteList(productsRes.data, "Товары", warnings).map((item, index) => mapProduct(item, index, categoryNames)).filter((item) => Boolean(item)) : [];
	if (!productsRes.ok && productsRes.error instanceof ApexError && productsRes.error.status !== 404) warnings.push(`Каталог: ${productsRes.error.message}`);
	const cart = cartRes.ok ? noteList(cartRes.data, "Корзина", warnings).map(mapCartItem).filter((item) => Boolean(item)) : [];
	if (!cartRes.ok && cartRes.error instanceof ApexError) warnings.push(`Корзина: ${cartRes.error.message}`);
	if (cart.some((item) => !item.lineId)) warnings.push("Корзина: у строки нет id, количество может не сохраниться.");
	const orders = ordersRes.ok ? noteList(ordersRes.data, "Заказы", warnings).map((item) => mapOrder(item, me.id)).filter((item) => Boolean(item)) : [];
	if (!ordersRes.ok && ordersRes.error instanceof ApexError) warnings.push(`Заказы: ${ordersRes.error.message}`);
	const ledger = txRes.ok ? noteList(txRes.data, "Транзакции", warnings).map((item) => mapTransaction(item, me.id)).filter((item) => Boolean(item)) : [];
	if (!txRes.ok && txRes.error instanceof ApexError && txRes.error.status !== 404) warnings.push(`История баланса: ${txRes.error.message}`);
	const feedMap = /* @__PURE__ */ new Map();
	for (const pack of [inRes, outRes]) {
		if (!pack.ok) {
			if (pack.error instanceof ApexError && pack.error.status !== 404) warnings.push(`Благодарности: ${pack.error.message}`);
			continue;
		}
		for (const item of noteList(pack.data, "Благодарности", warnings)) {
			const thank = mapThank(item);
			if (thank) feedMap.set(thank.id, thank);
		}
	}
	const feed = [...feedMap.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	for (const item of feed) {
		if (!item.fromName) item.fromName = people.get(item.fromId)?.name;
		if (!item.toName) item.toName = people.get(item.toId)?.name;
	}
	const leaderboard = boardRes.ok ? noteList(boardRes.data, "Лидерборд", warnings).map(mapBoard).filter((item) => Boolean(item)) : [];
	if (!boardRes.ok && boardRes.error instanceof ApexError) warnings.push(`Лидерборд: ${boardRes.error.message}`);
	for (const row of leaderboard) {
		const person = people.get(row.id);
		if (person) person.score = row.score;
		else if (!row.name || row.name === "Сотрудник") row.name = "Сотрудник";
	}
	const roleCatalog = rolesRes.ok ? noteList(rolesRes.data, "Роли", warnings).map((item) => {
		const record = obj(item);
		if (!record || !record.code) return null;
		return {
			code: str(record.code),
			name: str(record.name || record.code)
		};
	}).filter((item) => Boolean(item)) : [];
	if (!rolesRes.ok && rolesRes.error instanceof ApexError) warnings.push(`Роли: ${rolesRes.error.message}`);
	const titled = people.get(me.id);
	if (titled && roleCatalog.length) {
		const names = (titled.roleCodes ?? []).map((code) => roleCatalog.find((role) => role.code === code)?.name).filter((name) => Boolean(name));
		if (names.length) titled.roleTitle = names.join(", ");
	}
	return {
		currentUserId: me.id,
		people: [...people.values()],
		products,
		categories,
		cart,
		orders,
		ledger,
		feed,
		roleCatalog,
		leaderboard,
		rewardBalance,
		apiWarnings: warnings
	};
}
var seed = () => ({
	session: "unknown",
	sessionError: "",
	currentUserId: "",
	seq: 100,
	people: [],
	products: [],
	categories: [],
	roleCatalog: [],
	leaderboard: [],
	rewardBalance: null,
	apiWarnings: [],
	cart: [],
	orders: [],
	ledger: [],
	activities: [
		{
			id: "act-steps",
			title: "8 000 шагов",
			description: "Дневная цель. В прототипе шаги приходят из демонстрационного источника, без Health Connect.",
			category: "challenge",
			kind: "steps",
			reward: 80,
			target: 8e3,
			active: true,
			builtin: true
		},
		{
			id: "act-streak",
			title: "7 дней активности",
			description: "Заходите и отмечайте день. На седьмой день — разовая награда.",
			category: "challenge",
			kind: "streak",
			reward: 300,
			target: 7,
			active: true,
			builtin: true
		},
		{
			id: "act-team",
			title: "Команда в движении",
			description: "Общий челлендж подразделения. Отметьте участие — команда ближе к призу.",
			category: "challenge",
			kind: "once",
			reward: 20,
			target: 1,
			active: true,
			builtin: true
		},
		{
			id: "act-quiz",
			title: "Сколько в тебе хайпа?",
			description: "Короткий опрос о том, как устроена команда. Нужны 2 верных ответа из 3.",
			category: "survey",
			kind: "quiz",
			reward: 10,
			target: 1,
			active: true,
			builtin: true
		},
		{
			id: "act-meetup",
			title: "Внутренний митап",
			description: "Подтвердите участие во встрече пятницы. Начисление один раз.",
			category: "event",
			kind: "once",
			reward: 40,
			target: 1,
			active: true,
			builtin: true
		}
	],
	progress: [],
	feed: [],
	tickets: [],
	notices: []
});
function nextId(state, prefix) {
	state.seq += 1;
	return `${prefix}-${state.seq}`;
}
function person(state, id) {
	return state.people.find((item) => item.id === id);
}
function pushNotice(state, userId, text) {
	state.notices.unshift({
		id: nextId(state, "n"),
		userId,
		text,
		read: false,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
function isAdminRole(role) {
	return role === "admin" || role === "chief";
}
function awardAmounts(role) {
	if (role === "employee") return [
		10,
		20,
		30,
		50
	];
	return [
		50,
		100,
		200,
		500
	];
}
function findProgress(state, userId, activityId, period) {
	return state.progress.find((item) => item.userId === userId && item.activityId === activityId && item.period === period);
}
function rewardOnce(state, user, activity, _reason) {
	pushNotice(state, user.id, `«${activity.title}» отмечено на этом устройстве. Баллы на сервере не меняются — активности пока не в базе.`);
	return { ok: true };
}
var booting = null;
async function commit(set, run) {
	try {
		await run();
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "Не получилось"
		};
	}
	try {
		set(await loadWorkspace());
	} catch (error) {
		if (error instanceof ApexError && error.status === 401) {
			writeToken(null);
			set({
				session: "anon",
				sessionError: "Сессия закончилась. Войдите снова."
			});
			return {
				ok: false,
				error: "Сессия закончилась. Войдите снова."
			};
		}
	}
	return { ok: true };
}
var useStore = create()(persist(immer((set, get) => ({
	...seed(),
	boot: async () => {
		if (get().session === "ready") return;
		if (booting) return booting;
		booting = (async () => {
			if (!readToken()) {
				set({
					session: "anon",
					sessionError: ""
				});
				return;
			}
			set({
				session: "loading",
				sessionError: ""
			});
			try {
				set({
					...await loadWorkspace(),
					session: "ready",
					sessionError: ""
				});
			} catch (error) {
				if (error instanceof ApexError && error.status === 401) {
					writeToken(null);
					set({
						session: "anon",
						sessionError: "Сессия закончилась. Войдите снова."
					});
					return;
				}
				set({
					session: "error",
					sessionError: error instanceof Error ? error.message : "Не удалось открыть данные."
				});
			}
		})().finally(() => {
			booting = null;
		});
		return booting;
	},
	login: async (email, password) => {
		set({
			session: "loading",
			sessionError: ""
		});
		try {
			const data = await apex("/api/Auth/login", {
				method: "POST",
				body: JSON.stringify({
					email: email.trim(),
					password
				})
			});
			const token = extractToken(data);
			if (!token) {
				const message = `Вход прошёл, но токен не найден. Поля ответа: ${shapeOf(data)}.`;
				set({
					session: "anon",
					sessionError: message
				});
				return {
					ok: false,
					error: message
				};
			}
			writeToken(token);
			set({
				...await loadWorkspace(),
				session: "ready",
				sessionError: ""
			});
			return { ok: true };
		} catch (error) {
			const message = error instanceof Error ? error.message : "Не удалось войти";
			writeToken(null);
			set({
				session: "anon",
				sessionError: message
			});
			return {
				ok: false,
				error: message
			};
		}
	},
	logout: () => {
		writeToken(null);
		set({
			session: "anon",
			sessionError: "",
			currentUserId: "",
			people: [],
			products: [],
			categories: [],
			roleCatalog: [],
			leaderboard: [],
			rewardBalance: null,
			apiWarnings: [],
			cart: [],
			orders: [],
			ledger: [],
			feed: []
		});
	},
	refresh: async () => {
		set({
			...await loadWorkspace(),
			session: "ready",
			sessionError: ""
		});
	},
	addToCart: async (productId) => {
		const state = get();
		const product = state.products.find((item) => item.id === productId);
		if (!product || !product.active) return {
			ok: false,
			error: "Товар недоступен"
		};
		if (product.stock <= 0) return {
			ok: false,
			error: "Нет в наличии"
		};
		const existing = state.cart.find((item) => item.productId === productId);
		const nextQty = (existing?.qty ?? 0) + 1;
		if (nextQty > product.stock) return {
			ok: false,
			error: "Больше, чем есть на складе"
		};
		return commit(set, async () => {
			if (existing?.lineId) await apex(`/api/cart/items/${existing.lineId}`, {
				method: "PUT",
				body: JSON.stringify({ quantity: nextQty })
			});
			else await apex("/api/cart/items", {
				method: "POST",
				body: JSON.stringify({
					productId: Number(productId),
					quantity: 1
				})
			});
		});
	},
	setQty: async (productId, qty) => {
		const line = get().cart.find((item) => item.productId === productId);
		if (!line?.lineId) return {
			ok: false,
			error: "Не нашёл строку корзины на сервере"
		};
		return commit(set, async () => {
			if (qty <= 0) await apex(`/api/cart/items/${line.lineId}`, { method: "DELETE" });
			else await apex(`/api/cart/items/${line.lineId}`, {
				method: "PUT",
				body: JSON.stringify({ quantity: qty })
			});
		});
	},
	checkout: async () => {
		if (get().cart.length === 0) return {
			ok: false,
			error: "Корзина пуста"
		};
		return commit(set, async () => {
			await apex("/api/orders/checkout", { method: "POST" });
		});
	},
	completeSteps: () => {
		let result = {
			ok: false,
			error: "Активность недоступна"
		};
		set((state) => {
			const user = person(state, state.currentUserId);
			const activity = state.activities.find((item) => item.id === "act-steps");
			if (!user || !activity || !activity.active) return;
			const period = todayKey();
			let row = findProgress(state, user.id, activity.id, period);
			if (!row) {
				row = {
					userId: user.id,
					activityId: activity.id,
					period,
					value: 0,
					rewarded: false
				};
				state.progress.push(row);
			}
			if (row.rewarded) {
				result = {
					ok: false,
					error: "Баллы за шаги сегодня уже начислены"
				};
				return;
			}
			row.value = activity.target;
			row.rewarded = true;
			result = rewardOnce(state, user, activity, "Дневная цель шагов");
		});
		return result;
	},
	checkIn: () => {
		let result = {
			ok: false,
			error: "Активность недоступна"
		};
		set((state) => {
			const user = person(state, state.currentUserId);
			const activity = state.activities.find((item) => item.id === "act-streak");
			if (!user || !activity || !activity.active) return;
			const today = todayKey();
			let row = findProgress(state, user.id, activity.id, "streak");
			if (!row) {
				row = {
					userId: user.id,
					activityId: activity.id,
					period: "streak",
					value: 0,
					rewarded: false
				};
				state.progress.push(row);
			}
			if (row.meta === today) {
				result = {
					ok: false,
					error: "Сегодня вы уже отметились"
				};
				return;
			}
			const yesterday = /* @__PURE__ */ new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			const continues = row.meta === todayKey(yesterday);
			row.value = continues ? row.value + 1 : 1;
			row.meta = today;
			if (row.value >= activity.target && !row.rewarded) {
				row.rewarded = true;
				result = rewardOnce(state, user, activity, "Серия из 7 дней");
			} else result = { ok: true };
		});
		return result;
	},
	completeOnce: (activityId) => {
		let result = {
			ok: false,
			error: "Активность недоступна"
		};
		set((state) => {
			const user = person(state, state.currentUserId);
			const activity = state.activities.find((item) => item.id === activityId && item.kind === "once");
			if (!user || !activity || !activity.active) return;
			let row = findProgress(state, user.id, activity.id, "once");
			if (row?.rewarded) {
				result = {
					ok: false,
					error: "Награда за это задание уже получена"
				};
				return;
			}
			if (!row) {
				row = {
					userId: user.id,
					activityId: activity.id,
					period: "once",
					value: 1,
					rewarded: true
				};
				state.progress.push(row);
			} else {
				row.value = 1;
				row.rewarded = true;
			}
			result = rewardOnce(state, user, activity, activity.title);
		});
		return result;
	},
	submitQuiz: (correct) => {
		let result = {
			ok: false,
			error: "Опрос недоступен"
		};
		set((state) => {
			const user = person(state, state.currentUserId);
			const activity = state.activities.find((item) => item.id === "act-quiz");
			if (!user || !activity || !activity.active) return;
			if (findProgress(state, user.id, activity.id, "once")?.rewarded) {
				result = {
					ok: false,
					error: "Опрос уже пройден"
				};
				return;
			}
			if (correct < 2) {
				result = {
					ok: false,
					error: "Нужно минимум 2 верных ответа. Можно попробовать ещё раз"
				};
				return;
			}
			state.progress.push({
				userId: user.id,
				activityId: activity.id,
				period: "once",
				value: correct,
				rewarded: true
			});
			result = rewardOnce(state, user, activity, "Опрос «Сколько в тебе хайпа?»");
		});
		return result;
	},
	sendRecognition: async ({ toId, amount, message, asManager }) => {
		const textMessage = message.trim();
		if (textMessage.length > 120) return {
			ok: false,
			error: "Сообщение длиннее 120 символов"
		};
		const state = get();
		const sender = state.people.find((item) => item.id === state.currentUserId);
		const recipient = state.people.find((item) => item.id === toId);
		if (!sender || !recipient) return {
			ok: false,
			error: "Сотрудник не найден"
		};
		if (sender.id === recipient.id) return {
			ok: false,
			error: "Нельзя поблагодарить самого себя"
		};
		if (recipient.status !== "active") return {
			ok: false,
			error: "Этому сотруднику сейчас нельзя отправить"
		};
		if (!Number.isInteger(amount) || amount <= 0) return {
			ok: false,
			error: "Укажите сумму"
		};
		const body = {
			toUserId: toId,
			amount
		};
		if (textMessage) body.message = textMessage;
		if (!asManager) body.isPublic = true;
		return commit(set, async () => {
			await apex(asManager ? "/api/thanks/manager-bonus" : "/api/thanks", {
				method: "POST",
				body: JSON.stringify(body)
			});
		});
	},
	createTicket: (subject, text) => {
		const title = subject.trim();
		const body = text.trim();
		if (title.length < 3) return {
			ok: false,
			error: "Укажите тему"
		};
		if (body.length < 5) return {
			ok: false,
			error: "Опишите вопрос"
		};
		set((state) => {
			const user = person(state, state.currentUserId);
			if (!user) return;
			const now = (/* @__PURE__ */ new Date()).toISOString();
			state.tickets.unshift({
				id: nextId(state, "t"),
				userId: user.id,
				subject: title,
				status: "open",
				createdAt: now,
				messages: [{
					id: nextId(state, "tm"),
					authorId: user.id,
					text: body,
					createdAt: now
				}]
			});
		});
		return { ok: true };
	},
	replyTicket: (ticketId, text) => {
		const body = text.trim();
		if (body.length < 2) return {
			ok: false,
			error: "Введите ответ"
		};
		let result = {
			ok: false,
			error: "Недостаточно прав"
		};
		set((state) => {
			const actor = person(state, state.currentUserId);
			if (!actor || !isAdminRole(actor.role)) return;
			const ticket = state.tickets.find((item) => item.id === ticketId);
			if (!ticket) {
				result = {
					ok: false,
					error: "Обращение не найдено"
				};
				return;
			}
			ticket.messages.push({
				id: nextId(state, "tm"),
				authorId: actor.id,
				text: body,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			ticket.status = "answered";
			pushNotice(state, ticket.userId, `${actor.name} ответила на обращение «${ticket.subject}».`);
			result = { ok: true };
		});
		return result;
	},
	setTicketStatus: (ticketId, status) => {
		let result = {
			ok: false,
			error: "Недостаточно прав"
		};
		set((state) => {
			const actor = person(state, state.currentUserId);
			if (!actor || !isAdminRole(actor.role)) return;
			const ticket = state.tickets.find((item) => item.id === ticketId);
			if (!ticket) return;
			ticket.status = status;
			result = { ok: true };
		});
		return result;
	},
	setOrderStatus: async (orderId, status) => commit(set, async () => {
		await apex(`/api/orders/${orderId}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status: statusToApi(status) })
		});
	}),
	saveProduct: async (product) => {
		if (!product.title.trim()) return {
			ok: false,
			error: "Укажите название"
		};
		if (product.price < 0 || !Number.isInteger(product.price)) return {
			ok: false,
			error: "Цена должна быть целым числом"
		};
		if (product.stock < 0 || !Number.isInteger(product.stock)) return {
			ok: false,
			error: "Остаток должен быть целым числом"
		};
		const categoryId = Number(product.category);
		const body = {
			categoryId: Number.isInteger(categoryId) ? categoryId : null,
			name: product.title.trim(),
			description: product.description.trim(),
			price: product.price,
			imageUrl: product.image.startsWith("http") ? product.image : "",
			stock: product.stock,
			isActive: product.active,
			isDigital: Boolean(product.isDigital)
		};
		const isNew = !product.id || product.id === "new" || product.id.startsWith("p-");
		return commit(set, async () => {
			await apex(isNew ? "/api/products" : `/api/products/${product.id}`, {
				method: isNew ? "POST" : "PUT",
				body: JSON.stringify(body)
			});
		});
	},
	adjustBalance: async ({ userId, amount, reason, balanceType }) => {
		const why = reason.trim();
		if (!why) return {
			ok: false,
			error: "Укажите причину"
		};
		if (!Number.isInteger(amount) || amount === 0) return {
			ok: false,
			error: "Сумма — целое число, не ноль"
		};
		return commit(set, async () => {
			await apex("/api/admin/balances/adjust", {
				method: "POST",
				body: JSON.stringify({
					userId,
					type: balanceType ?? "Personal",
					amount,
					transactionType: "AdminAdjustment",
					description: why
				})
			});
		});
	},
	setUserRole: async (userId, roleCode) => {
		if (!roleCode) return {
			ok: false,
			error: "Выберите роль"
		};
		return commit(set, async () => {
			await apex(`/api/users/${userId}/roles`, {
				method: "PUT",
				body: JSON.stringify({ roleCodes: [roleCode] })
			});
		});
	},
	setUserStatus: async (userId, status) => {
		const state = get();
		const target = state.people.find((item) => item.id === userId);
		if (!target || target.id === state.currentUserId) return {
			ok: false,
			error: "Этого сотрудника нельзя изменить"
		};
		return commit(set, async () => {
			await apex(`/api/users/${userId}`, {
				method: "PATCH",
				body: JSON.stringify({
					firstName: target.firstName ?? "",
					lastName: target.lastName ?? "",
					middleName: target.middleName ?? "",
					avatarUrl: target.avatarUrl ?? "",
					department: target.department,
					position: target.position,
					isActive: status === "active"
				})
			});
		});
	},
	saveActivity: (activity) => set((state) => {
		const actor = person(state, state.currentUserId);
		if (!actor || !isAdminRole(actor.role)) return;
		const index = state.activities.findIndex((item) => item.id === activity.id);
		const next = {
			...activity,
			title: activity.title.trim(),
			reward: Math.max(0, Math.round(activity.reward))
		};
		if (!next.title) return;
		if (index >= 0) state.activities[index] = {
			...state.activities[index],
			...next
		};
		else state.activities.push({
			...next,
			kind: "once",
			builtin: false,
			target: 1
		});
	}),
	markNoticesRead: () => set((state) => {
		for (const notice of state.notices) if (notice.userId === state.currentUserId) notice.read = true;
	})
})), {
	name: "apex-device-v1",
	skipHydration: true,
	partialize: (state) => ({
		activities: state.activities,
		progress: state.progress,
		tickets: state.tickets,
		notices: state.notices,
		seq: state.seq
	})
}));
function SessionGate({ children }) {
	const session = useStore((state) => state.session);
	const sessionError = useStore((state) => state.sessionError);
	const boot = useStore((state) => state.boot);
	(0, import_react.useEffect)(() => {
		useStore.persist.rehydrate();
		boot();
	}, [boot]);
	if (session === "ready") return children;
	if (session === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "h-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-6 text-sm text-muted",
		children: "Подключаемся к базе Апекс. Если сервер спал, первый ответ занимает около минуты."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Login, { error: sessionError });
}
function Screen({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-surface px-4 py-10 text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-sm",
			children
		})
	});
}
function Login({ error }) {
	const login = useStore((state) => state.login);
	const boot = useStore((state) => state.boot);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "h-12" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-6 text-2xl font-bold tracking-tight",
			children: "Вход в Апекс"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Те же почта и пароль, что на сервере. Если хостинг спал, вход может занять около минуты."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 space-y-3",
			onSubmit: (event) => {
				event.preventDefault();
				setPending(true);
				login(email, password).finally(() => setPending(false));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Почта",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "email",
						autoComplete: "username",
						value: email,
						onChange: (event) => setEmail(event.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Пароль",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "password",
						autoComplete: "current-password",
						value: password,
						onChange: (event) => setPassword(event.target.value),
						required: true
					})
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: pending,
					children: pending ? "Ждём сервер…" : "Войти"
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "w-full text-sm font-semibold text-brand",
					onClick: () => void boot(),
					children: "Повторить, если сервер только проснулся"
				}) : null
			]
		})
	] });
}
var styles_default = "/assets/styles-DMo-O_46.css";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Апекс — платформа вовлечённости" },
			{
				name: "description",
				content: "Корпоративная платформа: баллы, благодарности, активности и каталог наград."
			},
			{
				name: "theme-color",
				content: "#306CC0"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ru",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: true,
				closeButton: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$9 = () => import("./routes-LBaF2bcA.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./activities-DzMp2Qmw.mjs");
var Route$8 = createFileRoute("/activities")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin-CkYlyN79.mjs");
var Route$7 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./cart-BTPWJqYd.mjs");
var Route$6 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./catalog-DYpEkn0B.mjs");
var Route$5 = createFileRoute("/catalog")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./colleagues-Bi2VqAvp.mjs");
var Route$4 = createFileRoute("/colleagues")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./history-BFSPcFZO.mjs");
var Route$3 = createFileRoute("/history")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./orders-Cz2zdOmU.mjs");
var Route$2 = createFileRoute("/orders")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./profile-CRxcdcUT.mjs");
var Route$1 = createFileRoute("/profile")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./support-DGQ49eJB.mjs");
var Route = createFileRoute("/support")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	ActivitiesRoute: Route$8.update({
		id: "/activities",
		path: "/activities",
		getParentRoute: () => Route$10
	}),
	AdminRoute: Route$7.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$10
	}),
	CartRoute: Route$6.update({
		id: "/cart",
		path: "/cart",
		getParentRoute: () => Route$10
	}),
	CatalogRoute: Route$5.update({
		id: "/catalog",
		path: "/catalog",
		getParentRoute: () => Route$10
	}),
	ColleaguesRoute: Route$4.update({
		id: "/colleagues",
		path: "/colleagues",
		getParentRoute: () => Route$10
	}),
	HistoryRoute: Route$3.update({
		id: "/history",
		path: "/history",
		getParentRoute: () => Route$10
	}),
	OrdersRoute: Route$2.update({
		id: "/orders",
		path: "/orders",
		getParentRoute: () => Route$10
	}),
	ProfileRoute: Route$1.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$10
	}),
	SupportRoute: Route.update({
		id: "/support",
		path: "/support",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Wordmark as _, firstName as a, formatPoints as c, Button as d, Chip as f, TextInput as g, TextArea as h, useStore as i, initials as l, Panel as m, awardAmounts as n, formatDateTime as o, Field as p, isAdminRole as r, formatNumber as s, router_exports as t, todayKey as u, cn as v };
