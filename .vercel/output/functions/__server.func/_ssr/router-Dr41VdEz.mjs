import { i as __toESM } from "../_runtime.mjs";
import { C as useRouter, X as require_react, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, p as HeadContent, v as lazyRouteComponent, w as require_jsx_runtime, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as immer } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dr41VdEz.js
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
var FALLBACK_MESSAGE = "Не удалось открыть страницу. Обновите её.";
var RELOAD_KEY = "apex-chunk-reload";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function staleChunk(error) {
	const message = errorMessage(error);
	return /dynamically imported module|imported module|chunk|preload/i.test(message);
}
function AppErrorComponent({ error }) {
	(0, import_react.useEffect)(() => {
		if (!staleChunk(error)) return;
		try {
			if (sessionStorage.getItem(RELOAD_KEY)) return;
			sessionStorage.setItem(RELOAD_KEY, "1");
		} catch {
			return;
		}
		window.location.reload();
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-surface px-6 text-center text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Страница не открылась"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted",
				children: "Сайт обновился. Обновите страницу, чтобы загрузить новую версию."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-2 min-h-11 rounded-md bg-brand px-4 text-sm font-semibold text-white",
				onClick: () => window.location.reload(),
				children: "Обновить"
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
		className: cn("apex-wordmark h-10 w-auto", className)
	});
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold disabled:pointer-events-none disabled:opacity-45", variant === "primary" && "bg-brand text-white hover:bg-brand-strong", variant === "ghost" && "bg-transparent text-ink hover:bg-brand-wash", variant === "soft" && "bg-brand-wash text-brand-deep hover:bg-brand-soft", variant === "line" && "border border-line bg-surface text-ink hover:border-brand-mid", className),
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
		className: cn("min-h-10 rounded-full px-3.5 text-sm font-medium", active ? "bg-brand text-white" : "bg-card text-ink hover:bg-brand-wash"),
		children
	});
}
function Panel({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-xl border border-line bg-gradient-to-b from-surface to-card p-5 shadow-[0_10px_30px_-18px_rgba(20,40,70,0.45)] transition duration-200 hover:shadow-[0_16px_36px_-16px_rgba(20,40,70,0.4)] sm:p-6", className),
		children
	});
}
function formatNumber(value) {
	return new Intl.NumberFormat("ru-RU").format(value);
}
function pointsLabel(value) {
	const abs = Math.abs(value) % 100;
	const digit = abs % 10;
	if (abs > 10 && abs < 20) return "апексов";
	if (digit === 1) return "апекс";
	if (digit >= 2 && digit <= 4) return "апекса";
	return "апексов";
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
	if (init?.body && !(init.body instanceof FormData) && !headers.has("content-type")) headers.set("content-type", "application/json");
	let response;
	try {
		response = await fetch(`/api/apex${path}`, {
			...init,
			headers
		});
	} catch {
		throw new ApexError("Нет связи с сервером. Повторите ещё раз.", 0);
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
	const message = serverMessage(data);
	if (/заблок|is_active|isactive|inactive|деактив/i.test(message)) return BLOCKED_ACCOUNT;
	if (status === 401) return "Неверный email или пароль, либо сессия закончилась.";
	if (status === 403) return "Недостаточно прав для этого действия.";
	if (status === 404) return "На сервере нет таких данных.";
	if (status === 409) return "Данные уже изменились. Обновите и повторите.";
	if (status === 502 || status === 503 || status === 0) return "Сервер не ответил. Повторите ещё раз.";
	return message || `Сервер ответил ошибкой ${status}.`;
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
function listOf(data) {
	return asArray(data);
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
	const has = (pattern) => folded.some((code) => pattern.test(code));
	if (has(/superadmin|super-admin|chief|owner/)) return "chief";
	if (has(/^admin$|administrator/)) return "admin";
	if (has(/humanresources|^hr$/)) return "hr";
	if (has(/merchandiser|^merch$/)) return "merchandiser";
	if (has(/supportoperator|support[-_ ]?operator|^support$|^operator$|helpdesk/)) return "support";
	if (has(/manager|lead|supervisor|руковод/)) return "manager";
	if (canAdmin) return "admin";
	return "employee";
}
var ROLE_TITLE = {
	employee: "Сотрудник",
	manager: "Руководитель",
	hr: "HR",
	merchandiser: "Мерчендайзер",
	support: "Оператор поддержки",
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
		status: inactiveUser(record) ? "blocked" : "active"
	};
}
function inactiveUser(record) {
	if (record.isActive === false || record.isActive === "false" || record.isActive === 0) return true;
	const status = str(record.status).toLowerCase();
	return status === "blocked" || status === "inactive" || status === "disabled";
}
var BLOCKED_ACCOUNT = "Аккаунт заблокирован. Вход недоступен.";
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
	const listPrice = num(record.originalPrice ?? record.price);
	const finalPrice = record.finalPrice == null ? listPrice : num(record.finalPrice);
	const badges = asArray(record.badges).map((item) => {
		const row = obj(item);
		if (!row) return null;
		const name = str(row.name);
		if (!name) return null;
		const color = str(row.color || "#306cc0");
		return {
			name,
			color: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : "#306cc0"
		};
	}).filter((item) => Boolean(item));
	return {
		id: str(id),
		category: categoryId == null ? "" : str(categoryId),
		categoryName,
		title: str(record.name || record.title || "Товар"),
		description: str(record.description),
		price: finalPrice || listPrice,
		originalPrice: listPrice > finalPrice ? listPrice : void 0,
		discountPercent: record.discountPercent == null ? void 0 : num(record.discountPercent),
		badges,
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
	const variant = obj(record.variant) ?? obj(record.productVariant);
	const lineId = record.id ?? record.cartItemId ?? record.itemId;
	const variantId = str(record.variantId ?? record.productVariantId ?? variant?.id ?? "");
	return {
		lineId: lineId == null ? "" : str(lineId),
		productId: str(productId),
		qty: Math.max(1, num(record.quantity ?? record.qty ?? 1)),
		variantId: variantId || void 0,
		variantName: str(variant?.name ?? record.variantName ?? "") || void 0,
		unitPrice: record.unitPrice != null || variant?.price != null || record.price != null ? num(record.unitPrice ?? variant?.price ?? record.price) : void 0,
		image: str(record.variantImageUrl ?? variant?.imageUrl ?? "") || void 0
	};
}
function mapStatus(value) {
	return {
		paid: "paid",
		pending: "pending",
		created: "created",
		new: "created",
		processing: "processing",
		inprogress: "processing",
		ready: "ready",
		completed: "completed",
		issued: "issued",
		done: "issued",
		delivered: "issued",
		cancelled: "cancelled",
		canceled: "cancelled"
	}[value.trim().toLowerCase().replace(/[\s-]/g, "")] ?? (value || "paid");
}
function statusToApi(status) {
	return {
		paid: "Paid",
		pending: "Pending",
		created: "Created",
		processing: "Processing",
		ready: "Ready",
		completed: "Completed",
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
			title: str(line.productName || line.name || line.title || product?.name || "Товар"),
			variantName: str(line.variantName || obj(line.variant)?.name || obj(line.productVariant)?.name || ""),
			price: num(line.priceAtPurchase ?? line.price ?? line.unitPrice ?? product?.price),
			qty: Math.max(1, num(line.quantity ?? line.qty ?? 1))
		};
	}).filter((item) => Boolean(item));
	const computed = items.reduce((sum, item) => sum + item.price * item.qty, 0);
	return {
		id: str(id),
		userId: str(record.userId || fallbackUserId),
		items,
		total: record.totalAmount != null || record.total != null || record.totalPrice != null ? num(record.totalAmount ?? record.total ?? record.totalPrice) : computed,
		status: mapStatus(str(record.status || record.orderStatus || "created")),
		createdAt: str(record.createdAt || (/* @__PURE__ */ new Date()).toISOString())
	};
}
function mapEntryType(amount, hint) {
	const blob = hint.toLowerCase();
	if (/refund|возврат/.test(blob)) return "refund";
	if (/purchase|order|заказ/.test(blob)) return amount < 0 ? "purchase" : "refund";
	if (/manager|bonus|поощр/.test(blob)) return "manager_award";
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
	const owner = str(record.userId || userId);
	return {
		id: str(record.id),
		userId: owner,
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
function mapManagerBonus(raw, userId) {
	const record = obj(raw);
	if (!record || record.id == null) return null;
	if (str(record.relatedEntityType).toLowerCase().replace(/[\s_-]/g, "") !== "managerbonus") return null;
	const amount = num(record.amount);
	if (!amount) return null;
	const owner = str(record.userId || userId);
	const other = str(record.relatedUserId);
	const incoming = amount > 0;
	return {
		id: `bonus-${record.id}`,
		fromId: incoming ? other : owner,
		toId: incoming ? owner : other,
		amount: Math.abs(amount),
		message: str(record.description),
		kind: "manager",
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
		score: num(record.thanksCount ?? record.thanks ?? record.score ?? record.points ?? record.totalPoints ?? record.total ?? record.amount ?? record.value)
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
	if (me.status === "blocked") throw new ApexError(BLOCKED_ACCOUNT, 403);
	const mayReadRoles = me.role === "chief";
	const [usersRes, departmentRes, personalRes, rewardRes, txRes, productsRes, categoriesRes, cartRes, ordersRes, inRes, outRes, boardRes, rolesRes, engagementRes, allTxRes] = await Promise.all([
		optional("/api/users"),
		me.role === "manager" ? optional("/api/users/my-department") : Promise.resolve({
			ok: false,
			error: null
		}),
		optional("/api/balances/me"),
		me.role === "manager" ? optional("/api/admin/balances/me") : Promise.resolve({
			ok: false,
			error: null
		}),
		optional("/api/balances/me/transactions?skip=0&take=50"),
		optional(me.role === "admin" || me.role === "chief" || me.role === "merchandiser" ? "/api/products/all" : "/api/products"),
		optional("/api/categories"),
		optional("/api/cart"),
		optional("/api/orders/history"),
		optional("/api/thanks/for-me"),
		optional("/api/thanks/from-me"),
		optional("/api/leaderboard?limit=50"),
		mayReadRoles ? optional("/api/roles") : Promise.resolve({
			ok: false,
			error: null
		}),
		optional("/api/me/engagement"),
		optional("/api/balances/transactions/all?skip=0&take=500")
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
	const departmentIds = [];
	if (departmentRes.ok) for (const item of asArray(departmentRes.data)) {
		const person = mapUser(item);
		if (!person) continue;
		departmentIds.push(person.id);
		if (!people.has(person.id)) people.set(person.id, person);
	}
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
	if (txRes.ok) for (const item of noteList(txRes.data, "Поощрения", [])) {
		const bonus = mapManagerBonus(item, me.id);
		if (bonus) feedMap.set(bonus.id, bonus);
	}
	const feed = [...feedMap.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	for (const item of feed) {
		if (!item.fromName) item.fromName = people.get(item.fromId)?.name;
		if (!item.toName) item.toName = people.get(item.toId)?.name;
	}
	const thanksBoard = boardRes.ok ? noteList(boardRes.data, "Лидерборд", warnings).map(mapBoard).filter((item) => Boolean(item)) : [];
	if (!boardRes.ok && boardRes.error instanceof ApexError) warnings.push(`Лидерборд: ${boardRes.error.message}`);
	const activityTotals = /* @__PURE__ */ new Map();
	if (allTxRes.ok) {
		for (const item of noteList(allTxRes.data, "Активность", [])) {
			const record = obj(item);
			if (!record) continue;
			const kind = str(record.relatedEntityType).toLowerCase();
			if (![
				"quest",
				"survey",
				"event",
				"achievement"
			].includes(kind)) continue;
			const amount = num(record.amount);
			if (amount <= 0) continue;
			const id = str(record.userId);
			if (!id) continue;
			activityTotals.set(id, (activityTotals.get(id) ?? 0) + amount);
		}
		for (const person of people.values()) if (person.status === "active" && !activityTotals.has(person.id)) activityTotals.set(person.id, 0);
	}
	const leaderboardKind = allTxRes.ok ? "activity" : "thanks";
	const leaderboard = leaderboardKind === "activity" ? [...activityTotals.entries()].map(([id, score]) => ({
		id,
		name: people.get(id)?.name || "Сотрудник",
		score
	})).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "ru")) : thanksBoard;
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
	if (mayReadRoles && !rolesRes.ok && rolesRes.error instanceof ApexError && rolesRes.error.status !== 403 && rolesRes.error.status !== 404) warnings.push(`Роли: ${rolesRes.error.message}`);
	const titled = people.get(me.id);
	if (titled && roleCatalog.length) {
		const names = (titled.roleCodes ?? []).map((code) => roleCatalog.find((role) => role.code === code)?.name).filter((name) => Boolean(name));
		if (names.length) titled.roleTitle = names.join(", ");
	}
	const engagement = engagementRes.ok ? mapEngagement(engagementRes.data) : null;
	const engagementError = engagement ? "" : engagementRes.ok ? "Сервер не прислал уровень активности" : engagementRes.error instanceof Error ? engagementRes.error.message : "Не удалось загрузить уровень активности";
	if (engagementError) warnings.push(`Уровень активности: ${engagementError}`);
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
		leaderboardKind,
		departmentIds,
		rewardBalance,
		mustChangePassword: passwordChangeRequired(meRaw),
		apiWarnings: warnings,
		engagement,
		engagementError
	};
}
async function loadActivitiesBundle(userId) {
	const warnings = [];
	const [questsRes, surveysRes, eventsRes, achievementsRes, mineRes] = await Promise.all([
		optional("/api/quests?page=1&pageSize=50"),
		optional("/api/surveys?page=1&pageSize=50"),
		optional("/api/events?page=1&pageSize=50"),
		optional("/api/achievements"),
		optional(`/api/achievements/users/${userId}`)
	]);
	noteFailure(questsRes, "Квесты", warnings);
	noteFailure(surveysRes, "Опросы", warnings);
	noteFailure(eventsRes, "Мероприятия", warnings);
	noteFailure(achievementsRes, "Достижения", warnings);
	noteFailure(mineRes, "Ваши достижения", warnings);
	const questList = questsRes.ok ? asArray(questsRes.data) : [];
	const surveyList = surveysRes.ok ? asArray(surveysRes.data) : [];
	const eventList = eventsRes.ok ? asArray(eventsRes.data) : [];
	const [questDetails, surveyDetails, eventDetails] = await Promise.all([
		Promise.all(questList.map((item) => detailOf(item, "quests"))),
		Promise.all(surveyList.map((item) => detailOf(item, "surveys"))),
		Promise.all(eventList.map((item) => detailOf(item, "events")))
	]);
	const earnedAt = /* @__PURE__ */ new Map();
	if (mineRes.ok) for (const item of asArray(mineRes.data)) {
		const record = obj(item);
		if (!record) continue;
		const id = str(record.achievementId || obj(record.achievement)?.id);
		if (id) earnedAt.set(id, str(record.earnedAt));
	}
	return {
		quests: questList.map((item, index) => mapQuest(item, questDetails[index])).filter((item) => Boolean(item)),
		surveys: surveyList.map((item, index) => mapSurvey(item, surveyDetails[index])).filter((item) => Boolean(item)),
		events: eventList.map((item, index) => mapEvent(item, eventDetails[index])).filter((item) => Boolean(item)),
		achievements: (achievementsRes.ok ? asArray(achievementsRes.data) : []).map((item) => mapAchievement(item, earnedAt)).filter((item) => Boolean(item)),
		warnings
	};
}
function noteFailure(result, label, warnings) {
	if (result.ok) return;
	if (result.error instanceof ApexError && result.error.status === 401) throw result.error;
	if (result.error instanceof ApexError && result.error.status !== 404) warnings.push(`${label}: ${result.error.message}`);
}
async function detailOf(item, kind) {
	const id = str(obj(item)?.id);
	if (!id) return null;
	const result = await optional(`/api/${kind}/${id}`);
	return result.ok ? result.data : null;
}
function mapQuest(item, details) {
	const record = obj(details) ?? obj(item);
	if (!record || record.id == null) return null;
	const participation = obj(record.participation);
	const steps = asArray(record.steps).map((step) => {
		const row = obj(step);
		if (!row || row.id == null) return null;
		return {
			id: str(row.id),
			title: str(row.title || "Шаг"),
			description: str(row.description),
			completionType: str(row.completionType || "manual"),
			sortOrder: num(row.sortOrder),
			required: row.isRequired !== false,
			completed: Boolean(row.isCompleted),
			proofStatus: str(row.proofStatus).toLowerCase(),
			proofPath: str(row.proofStoragePath),
			proofComment: str(row.proofComment)
		};
	}).filter((step) => Boolean(step)).sort((a, b) => a.sortOrder - b.sortOrder);
	return {
		id: str(record.id),
		title: str(record.title || "Квест"),
		description: str(record.description),
		reward: num(record.rewardAmount),
		startAt: str(record.startAt),
		endAt: str(record.endAt),
		status: str(participation?.status || record.participationStatus),
		rewardClaimed: Boolean(participation?.rewardClaimed),
		steps
	};
}
function mapSurvey(item, details) {
	const list = obj(item);
	const record = obj(details) ?? list;
	if (!record || record.id == null) return null;
	const questions = asArray(record.questions).map((question) => {
		const row = obj(question);
		if (!row || row.id == null) return null;
		return {
			id: str(row.id),
			text: str(row.questionText || "Вопрос"),
			type: str(row.questionType || "text"),
			options: asArray(row.options).map((option) => str(option)).filter(Boolean),
			required: row.isRequired !== false,
			sortOrder: num(row.sortOrder)
		};
	}).filter((question) => Boolean(question)).sort((a, b) => a.sortOrder - b.sortOrder);
	return {
		id: str(record.id),
		title: str(record.title || list?.title || "Опрос"),
		description: str(record.description || list?.description),
		reward: num(record.rewardAmount ?? list?.rewardAmount),
		questionsCount: questions.length || num(list?.questionsCount),
		hasResponded: Boolean(list?.hasResponded) || asArray(record.responses).length > 0,
		canRespond: list?.canRespond != null ? Boolean(list.canRespond) : record.canRespond !== false,
		allowMultiple: Boolean(record.allowMultipleResponses ?? list?.allowMultipleResponses),
		questions
	};
}
function mapEvent(item, details) {
	const list = obj(item);
	const record = obj(details) ?? list;
	if (!record || record.id == null) return null;
	const registration = obj(record.registration);
	const max = record.maxParticipants ?? list?.maxParticipants;
	return {
		id: str(record.id),
		title: str(record.title || "Мероприятие"),
		description: str(record.description),
		startAt: str(record.startAt),
		endAt: str(record.endAt),
		location: str(record.location),
		maxParticipants: max == null || max === "" ? null : num(max),
		registeredCount: num(record.registeredCount),
		reward: num(record.rewardAmount),
		status: str(registration?.status || record.registrationStatus || list?.registrationStatus),
		rewardClaimed: Boolean(registration?.rewardClaimed),
		open: record.isOpen == null ? true : Boolean(record.isOpen)
	};
}
function mapAchievement(item, earnedAt) {
	const record = obj(item);
	if (!record || record.id == null || record.isActive === false) return null;
	const id = str(record.id);
	return {
		id,
		code: str(record.code),
		name: str(record.name || "Достижение"),
		description: str(record.description),
		reward: num(record.rewardAmount),
		conditionType: str(record.conditionType),
		iconUrl: str(record.iconUrl || record.icon),
		earned: earnedAt.has(id),
		earnedAt: earnedAt.get(id) ?? ""
	};
}
function mapEngagement(raw) {
	const record = obj(raw);
	const status = record ? obj(record.status) : null;
	if (!record || !status) return null;
	const next = obj(record.nextLevel);
	const period = obj(record.period);
	const breakdown = asArray(record.breakdown).map((item) => {
		const row = obj(item);
		if (!row) return null;
		return {
			code: str(row.code),
			title: str(row.title || row.code || "Источник"),
			count: num(row.count),
			points: num(row.points),
			maxPoints: num(row.maxPoints)
		};
	}).filter((item) => Boolean(item));
	return {
		title: str(status.title || "Уровень"),
		code: str(status.code),
		rank: Math.min(5, Math.max(1, num(status.rank) || 1)),
		score: num(record.score),
		maxScore: num(record.maxScore) || 100,
		nextTitle: next ? str(next.title) : "",
		pointsToNext: next ? num(next.pointsToNext) : null,
		progress: next ? Math.min(1, Math.max(0, num(next.progress))) : 1,
		periodDays: period ? num(period.days) || 30 : 30,
		breakdown
	};
}
function passwordChangeRequired(data) {
	const record = obj(data);
	if (!record) return false;
	const keys = [
		"mustChangePassword",
		"must_change_password",
		"passwordChangeRequired",
		"requirePasswordChange",
		"isTemporaryPassword"
	];
	if (keys.some((key) => record[key] === true)) return true;
	const meta = obj(record.user_metadata) ?? obj(record.userMetadata);
	return Boolean(meta && keys.some((key) => meta[key] === true));
}
function mapTicket(raw) {
	const record = obj(raw);
	if (!record || record.id == null) return null;
	const messages = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of asArray(record.messages)) {
		const row = obj(item);
		if (!row) continue;
		const text = str(row.message || row.text);
		const createdAt = str(row.createdAt);
		const authorId = str(row.userId);
		const id = str(row.id || `${record.id}-${createdAt}-${text}`);
		const stamp = Date.parse(createdAt);
		const burst = `${authorId}|${text}|${Number.isNaN(stamp) ? createdAt : Math.floor(stamp / 2e3)}`;
		if (seen.has(id) || seen.has(burst)) continue;
		seen.add(id);
		seen.add(burst);
		messages.push({
			id,
			authorId,
			authorName: str(row.userName) || joinName(row),
			text,
			createdAt
		});
	}
	return {
		id: str(record.id),
		userId: str(record.userId),
		userName: str(record.userName) || joinName(record, "user"),
		assignedTo: str(record.assignedTo),
		assignedName: str(record.assignedToName) || joinName(record, "assignedTo"),
		subject: str(record.subject || "Обращение"),
		status: mapTicketStatus(record.status),
		createdAt: str(record.createdAt),
		messages
	};
}
function joinName(record, prefix = "") {
	return [
		str(record[prefix ? `${prefix}LastName` : "lastName"] || record.userLastName),
		str(record[prefix ? `${prefix}FirstName` : "firstName"] || record.userFirstName),
		str(record[prefix ? `${prefix}MiddleName` : "middleName"] || record.userMiddleName)
	].filter(Boolean).join(" ");
}
function mapTicketStatus(value) {
	const raw = str(value).toLowerCase().replace(/[\s_-]/g, "");
	if (raw === "inprogress") return "in_progress";
	if (raw === "resolved") return "resolved";
	if (raw === "closed") return "closed";
	return "open";
}
function ticketStatusToApi(status) {
	if (status === "in_progress") return "InProgress";
	if (status === "resolved") return "Resolved";
	if (status === "closed") return "Closed";
	return "Open";
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
	leaderboardKind: "thanks",
	departmentIds: [],
	rewardBalance: null,
	apiWarnings: [],
	cart: [],
	orders: [],
	allOrders: [],
	ledger: [],
	allLedger: [],
	activities: [],
	activitiesCatalog: {
		status: "idle",
		error: "",
		quests: [],
		surveys: [],
		events: [],
		achievements: [],
		warnings: []
	},
	engagement: null,
	engagementStatus: "idle",
	engagementError: "",
	progress: [],
	feed: [],
	tickets: [],
	ticketsError: "",
	mustChangePassword: false,
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
function canManageActivities(role) {
	return isAdminRole(role) || role === "hr";
}
function canManageShop(role) {
	return isAdminRole(role) || role === "merchandiser";
}
function canManageSupport(role) {
	return isAdminRole(role) || role === "support";
}
function canOpenAdmin(role) {
	return canManageActivities(role) || canManageShop(role) || canManageSupport(role) || role === "manager";
}
function hasWorkBalance(role) {
	return role === "manager";
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
	pushNotice(state, user.id, `«${activity.title}» отмечено на этом устройстве. Апексы на сервере не меняются — активности пока не в базе.`);
	return { ok: true };
}
var MUST_CHANGE_KEY = "apex.must-change-user";
function rememberPasswordChange(userId, required) {
	if (typeof window === "undefined" || !userId) return;
	if (required) window.localStorage.setItem(MUST_CHANGE_KEY, userId);
	else if (window.localStorage.getItem(MUST_CHANGE_KEY) === userId) window.localStorage.removeItem(MUST_CHANGE_KEY);
}
function rememberedPasswordChange(userId) {
	if (typeof window === "undefined" || !userId) return false;
	return window.localStorage.getItem(MUST_CHANGE_KEY) === userId;
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
		const workspace = await loadWorkspace();
		set({
			...workspace,
			engagementStatus: workspace.engagement ? "ready" : "error"
		});
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
async function reloadActivities(set, get, run) {
	const result = await commit(set, async () => {
		await run();
	});
	if (result.ok) {
		await get().loadActivities();
		await get().loadEngagement();
	}
	return result;
}
function thankedThisWeek(feed, fromId, toId) {
	const from = Date.now() - 6048e5;
	return feed.some((item) => item.fromId === fromId && item.toId === toId && item.kind !== "manager" && Date.parse(item.createdAt) >= from);
}
function asTicketList(data) {
	if (Array.isArray(data)) return data;
	if (data && typeof data === "object" && "items" in data && Array.isArray(data.items)) return data.items;
	return [];
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
				const workspace = await loadWorkspace();
				const mustChangePassword = workspace.mustChangePassword || rememberedPasswordChange(workspace.currentUserId);
				set({
					...workspace,
					mustChangePassword,
					session: "ready",
					sessionError: "",
					engagementStatus: workspace.engagement ? "ready" : "error"
				});
			} catch (error) {
				const blocked = error instanceof ApexError && error.message === "Аккаунт заблокирован. Вход недоступен.";
				if (blocked || error instanceof ApexError && error.status === 401) {
					writeToken(null);
					set({
						session: "anon",
						sessionError: blocked ? BLOCKED_ACCOUNT : "Сессия закончилась. Войдите снова."
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
			const workspace = await loadWorkspace();
			const mustChangePassword = passwordChangeRequired(data) || workspace.mustChangePassword;
			rememberPasswordChange(workspace.currentUserId, mustChangePassword);
			set({
				...workspace,
				mustChangePassword,
				session: "ready",
				sessionError: "",
				engagementStatus: workspace.engagement ? "ready" : "error"
			});
			return { ok: true };
		} catch (error) {
			writeToken(null);
			const message = error instanceof ApexError && error.status === 500 ? "Пароль верный, но база падает с ошибкой 500 на любом запросе с токеном. Это сбой сервера, не сайта." : error instanceof Error ? error.message : "Не удалось войти";
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
			leaderboardKind: "thanks",
			rewardBalance: null,
			apiWarnings: [],
			cart: [],
			orders: [],
			allOrders: [],
			ledger: [],
			allLedger: [],
			feed: [],
			tickets: [],
			ticketsError: "",
			mustChangePassword: false,
			engagement: null,
			engagementStatus: "idle",
			engagementError: "",
			activitiesCatalog: {
				status: "idle",
				error: "",
				quests: [],
				surveys: [],
				events: [],
				achievements: [],
				warnings: []
			}
		});
	},
	refresh: async () => {
		const workspace = await loadWorkspace();
		const mustChangePassword = get().mustChangePassword || workspace.mustChangePassword || rememberedPasswordChange(workspace.currentUserId);
		set({
			...workspace,
			mustChangePassword,
			session: "ready",
			sessionError: "",
			engagementStatus: workspace.engagement ? "ready" : "error"
		});
	},
	changePassword: async (password, current) => {
		const next = password.trim();
		if (next.length < 6) return {
			ok: false,
			error: "Пароль должен быть не короче 6 символов"
		};
		if (current != null && next === current.trim()) return {
			ok: false,
			error: "Новый пароль совпадает с текущим"
		};
		try {
			await apex("/api/Auth/change-password", {
				method: "POST",
				body: JSON.stringify({ newPassword: next })
			});
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось сменить пароль"
			};
		}
		rememberPasswordChange(get().currentUserId, false);
		set({ mustChangePassword: false });
		return { ok: true };
	},
	loadTickets: async () => {
		const role = get().people.find((item) => item.id === get().currentUserId)?.role;
		const path = role === "admin" || role === "chief" || role === "support" ? "/api/support/tickets/all?page=1&pageSize=50" : "/api/support/tickets?page=1&pageSize=50";
		try {
			const data = await apex(path);
			const tickets = (Array.isArray(data) ? data : asTicketList(data)).map(mapTicket).filter((item) => Boolean(item));
			set((state) => {
				const previous = new Map(state.tickets.map((item) => [item.id, item]));
				state.tickets = tickets.map((ticket) => {
					if (ticket.messages.length > 0) return ticket;
					const saved = previous.get(ticket.id);
					return saved && saved.messages.length > 0 ? {
						...ticket,
						messages: saved.messages
					} : ticket;
				});
				state.ticketsError = "";
			});
		} catch (error) {
			set({ ticketsError: error instanceof Error ? error.message : "Не удалось загрузить обращения" });
		}
	},
	createEmployee: async (input) => {
		const email = input.email.trim();
		const firstName = input.firstName.trim();
		const lastName = input.lastName.trim();
		const department = input.department.trim();
		const position = input.position.trim();
		if (!email || !firstName || !lastName || !department || !position) return {
			ok: false,
			error: "Заполните почту, имя, фамилию, отдел и должность"
		};
		if (input.password.trim().length < 6) return {
			ok: false,
			error: "Пароль короче 6 символов"
		};
		return commit(set, async () => {
			await apex("/api/users", {
				method: "POST",
				body: JSON.stringify({
					email,
					password: input.password,
					firstName,
					lastName,
					middleName: input.middleName?.trim() || null,
					department,
					position
				})
			});
		});
	},
	loadActivities: async () => {
		const userId = get().currentUserId;
		if (!userId) return;
		const current = get().activitiesCatalog;
		if (current.status === "idle") set({ activitiesCatalog: {
			...current,
			status: "loading",
			error: ""
		} });
		try {
			set({ activitiesCatalog: {
				status: "ready",
				error: "",
				...await loadActivitiesBundle(userId)
			} });
		} catch (error) {
			if (error instanceof ApexError && error.status === 401) {
				writeToken(null);
				set({
					session: "anon",
					sessionError: "Сессия закончилась. Войдите снова."
				});
				return;
			}
			set({ activitiesCatalog: {
				...get().activitiesCatalog,
				status: "error",
				error: error instanceof Error ? error.message : "Не удалось загрузить активности"
			} });
		}
	},
	loadEngagement: async () => {
		if (!get().currentUserId) return;
		if (get().engagementStatus === "idle") set({
			engagementStatus: "loading",
			engagementError: ""
		});
		try {
			const view = mapEngagement(await apex("/api/me/engagement"));
			if (!view) {
				set({
					engagementStatus: "error",
					engagementError: "Сервер не прислал уровень активности"
				});
				return;
			}
			set({
				engagement: view,
				engagementStatus: "ready",
				engagementError: ""
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
				engagementStatus: "error",
				engagementError: error instanceof Error ? error.message : "Не удалось загрузить уровень"
			});
		}
	},
	joinQuest: (questId) => reloadActivities(set, get, () => apex(`/api/quests/${questId}/join`, { method: "POST" })),
	completeQuestStep: (questId, stepId, proof) => reloadActivities(set, get, () => apex(`/api/quests/${questId}/steps/${stepId}/complete`, {
		method: "POST",
		body: JSON.stringify({
			storagePath: proof?.storagePath?.trim() || null,
			comment: proof?.comment?.trim() || null
		})
	})),
	updateQuestProof: (questId, stepId, proof) => reloadActivities(set, get, () => apex(`/api/quests/${questId}/steps/${stepId}/proof`, {
		method: "PUT",
		body: JSON.stringify({
			storagePath: proof.storagePath?.trim() || null,
			comment: proof.comment?.trim() || null
		})
	})),
	finishQuest: (questId) => reloadActivities(set, get, () => apex(`/api/quests/${questId}/complete`, { method: "POST" })),
	submitSurvey: (surveyId, answers) => reloadActivities(set, get, () => apex(`/api/surveys/${surveyId}/responses`, {
		method: "POST",
		body: JSON.stringify({ answers: answers.map((answer) => ({
			questionId: Number(answer.questionId),
			value: answer.value
		})) })
	})),
	registerForEvent: (eventId) => reloadActivities(set, get, () => apex(`/api/events/${eventId}/register`, { method: "POST" })),
	cancelEventRegistration: (eventId) => reloadActivities(set, get, () => apex(`/api/events/${eventId}/registration`, { method: "DELETE" })),
	claimEventReward: (eventId) => reloadActivities(set, get, () => apex(`/api/events/${eventId}/reward`, { method: "POST" })),
	addToCart: async (productId, variantId) => {
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
		const existing = state.cart.find((item) => item.productId === productId && (item.variantId || "") === (variantId || ""));
		const nextQty = (existing?.qty ?? 0) + 1;
		if (nextQty > product.stock) return {
			ok: false,
			error: "Больше, чем есть на складе"
		};
		return commit(set, async () => {
			if (existing?.lineId) await apex(`/api/cart/items/${existing.lineId}`, {
				method: "PUT",
				body: JSON.stringify({
					quantity: nextQty,
					variantId: variantId ? Number(variantId) : null
				})
			});
			else await apex("/api/cart/items", {
				method: "POST",
				body: JSON.stringify({
					productId: Number(productId),
					quantity: 1,
					variantId: variantId ? Number(variantId) : null
				})
			});
		});
	},
	setQty: async (lineId, qty) => {
		const line = get().cart.find((item) => item.lineId === lineId);
		if (!line?.lineId) return {
			ok: false,
			error: "Не нашёл строку корзины на сервере"
		};
		return commit(set, async () => {
			if (qty <= 0) await apex(`/api/cart/items/${line.lineId}`, { method: "DELETE" });
			else await apex(`/api/cart/items/${line.lineId}`, {
				method: "PUT",
				body: JSON.stringify({
					quantity: qty,
					variantId: line.variantId ? Number(line.variantId) : null
				})
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
					error: "Апексы за шаги сегодня уже начислены"
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
		const points = asManager ? amount : 25;
		if (asManager && (!Number.isInteger(points) || points <= 0)) return {
			ok: false,
			error: "Укажите сумму"
		};
		if (!asManager && textMessage.length < 2) return {
			ok: false,
			error: "Напишите пару слов"
		};
		if (!asManager && thankedThisWeek(state.feed, sender.id, recipient.id)) return {
			ok: false,
			error: "Этому коллеге благодарность уже отправлена на этой неделе"
		};
		const body = {
			toUserId: toId,
			amount: points
		};
		if (textMessage) body.message = textMessage;
		if (!asManager) body.isPublic = true;
		const result = await commit(set, async () => {
			await apex(asManager ? "/api/thanks/manager-bonus" : "/api/thanks", {
				method: "POST",
				body: JSON.stringify(body)
			});
		});
		if (result.ok) await get().loadEngagement();
		return result;
	},
	createTicket: async (subject, text) => {
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
		try {
			const ticket = mapTicket(await apex("/api/support/tickets", {
				method: "POST",
				body: JSON.stringify({
					subject: title,
					message: body
				})
			}));
			if (ticket) set((state) => {
				state.tickets = [ticket, ...state.tickets.filter((item) => item.id !== ticket.id)];
				state.ticketsError = "";
			});
			get().loadTickets();
			return { ok: true };
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось отправить"
			};
		}
	},
	replyTicket: async (ticketId, text) => {
		const body = text.trim();
		if (body.length < 2) return {
			ok: false,
			error: "Введите сообщение"
		};
		const current = get().tickets.find((item) => item.id === ticketId);
		if (current?.status === "closed" || current?.status === "resolved") return {
			ok: false,
			error: "Обращение уже закрыто"
		};
		try {
			await apex(`/api/support/tickets/${ticketId}/messages`, {
				method: "POST",
				body: JSON.stringify({ message: body })
			});
			const ticket = mapTicket(await apex(`/api/support/tickets/${ticketId}`));
			if (ticket) set((state) => {
				const index = state.tickets.findIndex((item) => item.id === ticket.id);
				if (index >= 0) state.tickets[index] = ticket;
				else state.tickets.unshift(ticket);
			});
			return { ok: true };
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось отправить"
			};
		}
	},
	openTicket: async (ticketId) => {
		try {
			const ticket = mapTicket(await apex(`/api/support/tickets/${ticketId}`));
			if (!ticket) return;
			set((state) => {
				const index = state.tickets.findIndex((item) => item.id === ticket.id);
				if (index >= 0) state.tickets[index] = ticket;
				else state.tickets.unshift(ticket);
			});
		} catch {}
	},
	setTicketStatus: async (ticketId, status) => {
		try {
			await apex(`/api/support/tickets/${ticketId}/status`, {
				method: "PATCH",
				body: JSON.stringify({ status: ticketStatusToApi(status) })
			});
			set((state) => {
				const ticket = state.tickets.find((item) => item.id === ticketId);
				if (ticket) ticket.status = status;
			});
			return { ok: true };
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось сменить статус"
			};
		}
	},
	assignTicket: async (ticketId, userId) => {
		const current = get().tickets.find((item) => item.id === ticketId);
		const me = get().currentUserId;
		if (userId) {
			if (current?.assignedTo) return {
				ok: false,
				error: "Обращение уже назначено"
			};
		} else if (current?.assignedTo && current.assignedTo !== me) return {
			ok: false,
			error: "Снять назначение может только тот, кто его взял"
		};
		try {
			await apex(`/api/support/tickets/${ticketId}/assigned-to`, {
				method: "PATCH",
				body: JSON.stringify({ userId })
			});
			const ticket = mapTicket(await apex(`/api/support/tickets/${ticketId}`));
			if (ticket) set((state) => {
				const index = state.tickets.findIndex((item) => item.id === ticket.id);
				if (index >= 0) state.tickets[index] = ticket;
			});
			return { ok: true };
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось назначить обращение"
			};
		}
	},
	loadAllOrders: async () => {
		set({ allOrders: listOf(await apex("/api/orders/all")).map((item) => mapOrder(item, "")).filter((item) => Boolean(item)) });
	},
	loadAllLedger: async () => {
		set({ allLedger: listOf(await apex("/api/balances/transactions/all?skip=0&take=200")).map((item) => mapTransaction(item, "")).filter((item) => Boolean(item)) });
	},
	setOrderStatus: async (orderId, status) => {
		try {
			if (status === "cancelled") {
				await apex(`/api/orders/${orderId}/cancel`, { method: "PATCH" });
				set({ ledger: listOf(await apex("/api/balances/me/transactions?skip=0&take=50")).map((item) => mapTransaction(item, get().currentUserId)).filter((item) => Boolean(item)) });
			} else await apex(`/api/orders/${orderId}/status`, {
				method: "PATCH",
				body: JSON.stringify({ status: statusToApi(status) })
			});
			set((state) => {
				for (const order of [...state.orders, ...state.allOrders]) if (order.id === orderId) order.status = status;
			});
			return { ok: true };
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось сменить статус заказа"
			};
		}
	},
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
	uploadAvatar: async (userId, file) => {
		const actorId = get().currentUserId;
		try {
			const body = new FormData();
			body.set("file", file);
			const result = await apex(`/api/users/${userId === actorId ? "me" : userId}/avatar`, {
				method: "POST",
				body
			});
			if (!result.avatarUrl) return {
				ok: false,
				error: "Сервер не вернул ссылку на фото"
			};
			if (get().currentUserId === actorId) set((state) => {
				const target = state.people.find((person) => person.id === userId);
				if (target) target.avatarUrl = result.avatarUrl;
			});
			return { ok: true };
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось загрузить фото"
			};
		}
	},
	uploadImage: async (file, bucket = "products") => {
		try {
			const body = new FormData();
			body.set("file", file);
			body.set("bucket", bucket);
			const result = await apex("/api/media", {
				method: "POST",
				body
			});
			if (!result.url) return {
				ok: false,
				error: "Сервер не вернул ссылку на фото"
			};
			return {
				ok: true,
				url: result.url
			};
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Не удалось загрузить фото"
			};
		}
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
	updateEmployee: async (input) => {
		const firstName = input.firstName.trim();
		const lastName = input.lastName.trim();
		const department = input.department.trim();
		const position = input.position.trim();
		if (!firstName || !lastName || !department || !position) return {
			ok: false,
			error: "Заполните имя, фамилию, отдел и должность"
		};
		const target = get().people.find((item) => item.id === input.id);
		if (!target) return {
			ok: false,
			error: "Сотрудник не найден"
		};
		return commit(set, async () => {
			await apex(`/api/users/${input.id}`, {
				method: "PATCH",
				body: JSON.stringify({
					firstName,
					lastName,
					middleName: input.middleName.trim(),
					avatarUrl: target.avatarUrl ?? "",
					department,
					position,
					isActive: target.status === "active"
				})
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
	name: "apex-device-v3",
	skipHydration: true,
	partialize: (state) => ({
		notices: state.notices,
		seq: state.seq
	})
}));
function SessionGate({ children }) {
	const session = useStore((state) => state.session);
	const sessionError = useStore((state) => state.sessionError);
	const mustChangePassword = useStore((state) => state.mustChangePassword);
	const boot = useStore((state) => state.boot);
	(0, import_react.useEffect)(() => {
		useStore.persist.rehydrate();
		boot();
	}, [boot]);
	if (session === "ready" && mustChangePassword) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForcePassword, {});
	if (session === "ready") return children;
	if (session === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "h-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-6 text-sm text-muted",
		children: "Входим…"
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
					children: pending ? "Входим…" : "Войти"
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "w-full text-sm font-semibold text-brand",
					onClick: () => void boot(),
					children: "Повторить"
				}) : null
			]
		})
	] });
}
function ForcePassword() {
	const changePassword = useStore((state) => state.changePassword);
	const logout = useStore((state) => state.logout);
	const [current, setCurrent] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [again, setAgain] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "h-12" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-6 text-2xl font-bold tracking-tight",
			children: "Смените пароль"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Это первый вход. Придумайте свой пароль, временный больше не подойдёт."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 space-y-3",
			onSubmit: (event) => {
				event.preventDefault();
				if (password.length < 6) {
					setError("Пароль должен быть не короче 6 символов");
					return;
				}
				if (password === current) {
					setError("Новый пароль совпадает с текущим");
					return;
				}
				if (password !== again) {
					setError("Пароли не совпадают");
					return;
				}
				setPending(true);
				setError("");
				changePassword(password, current).then((result) => {
					setPending(false);
					if (!result.ok) setError(result.error);
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
					label: "Ещё раз",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "password",
						autoComplete: "new-password",
						value: again,
						onChange: (event) => setAgain(event.target.value),
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
					children: "Сохранить пароль"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "w-full text-sm font-semibold text-brand",
					onClick: () => logout(),
					children: "Выйти"
				})
			]
		})
	] });
}
var KEY = "apex.theme";
var THEME_BOOT = `(function(){try{var t=localStorage.getItem("${KEY}");if(t==="dark"||t==="light")document.documentElement.classList.add(t);}catch(e){}})();`;
function readChoice() {
	if (typeof window === "undefined") return "system";
	const saved = window.localStorage.getItem(KEY);
	return saved === "light" || saved === "dark" ? saved : "system";
}
function applyChoice(choice) {
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	if (choice === "light" || choice === "dark") root.classList.add(choice);
}
function systemDark() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function resolvedTheme(choice) {
	if (choice === "dark") return "dark";
	if (choice === "light") return "light";
	return systemDark() ? "dark" : "light";
}
var ThemeContext = (0, import_react.createContext)({
	choice: "system",
	resolved: "light",
	setChoice: () => {}
});
function ThemeProvider({ children }) {
	const [choice, setChoiceState] = (0, import_react.useState)("system");
	const [resolved, setResolved] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const stored = readChoice();
		setChoiceState(stored);
		applyChoice(stored);
		setResolved(resolvedTheme(stored));
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			if (readChoice() !== "system") return;
			setResolved(media.matches ? "dark" : "light");
		};
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, []);
	const setChoice = (next) => {
		window.localStorage.setItem(KEY, next);
		applyChoice(next);
		setChoiceState(next);
		setResolved(resolvedTheme(next));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			choice,
			resolved,
			setChoice
		},
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
var MOON = "луна";
var MEME = "пиздец";
function typingTarget(target) {
	if (!(target instanceof HTMLElement)) return false;
	return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}
function EasterEggs() {
	const [moon, setMoon] = (0, import_react.useState)(false);
	const [meme, setMeme] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let buffer = "";
		const onKey = (event) => {
			if (typingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
			if (event.key.length !== 1) return;
			buffer = (buffer + event.key.toLowerCase()).slice(-16);
			if (buffer.endsWith(MOON)) {
				buffer = "";
				setMoon(true);
			} else if (buffer.endsWith(MEME)) {
				buffer = "";
				setMeme(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!moon) return;
		if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.classList.add("egg-tilt");
		const timer = window.setTimeout(() => {
			document.documentElement.classList.remove("egg-tilt");
			setMoon(false);
		}, 2600);
		return () => {
			window.clearTimeout(timer);
			document.documentElement.classList.remove("egg-tilt");
		};
	}, [moon]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [moon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-[70] overflow-hidden",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "egg-moon",
			children: "🌕"
		})
	}) : null, meme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4",
		onClick: () => setMeme(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "egg-card max-w-xs rounded-2xl bg-surface p-3 text-left shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/rewards/note.jpg",
				alt: "",
				className: "aspect-square w-full rounded-xl object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base font-bold",
				children: "пиздец"
			})]
		})
	}) : null] });
}
var styles_default = "/assets/styles-KXua5H1Q.css";
var Route$15 = createRootRoute({
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
				content: "Корпоративная платформа: апексы, благодарности, активности и каталог наград."
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
				href: "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&display=swap"
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
	component: RootDocument
});
function RootDocument() {
	(0, import_react.useEffect)(() => {
		try {
			sessionStorage.removeItem("apex-chunk-reload");
		} catch {}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ru",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT } }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: "window.addEventListener(\"vite:preloadError\",function(event){event.preventDefault();try{if(sessionStorage.getItem(\"apex-chunk-reload\"))return;sessionStorage.setItem(\"apex-chunk-reload\",\"1\")}catch(e){}location.reload()});" } }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemedToaster, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EasterEggs, {})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function ThemedToaster() {
	const { resolved } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "top-center",
		richColors: true,
		closeButton: true,
		theme: resolved
	});
}
var $$splitComponentImporter$14 = () => import("./routes-Dl5RaUlV.mjs");
var Route$14 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./activities-CAXqSV8j.mjs");
var Route$13 = createFileRoute("/activities")({
	validateSearch: (search) => {
		const allowed = [
			"all",
			"quest",
			"survey",
			"event",
			"achievement"
		];
		const kind = search.kind;
		return {
			kind: typeof kind === "string" && allowed.includes(kind) ? kind : void 0,
			focus: typeof search.focus === "string" ? search.focus : void 0
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin-qPejLQJP.mjs");
var Route$12 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./cart-Dp5Ndxc1.mjs");
var Route$11 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./catalog-D0BuFbhT.mjs");
var Route$10 = createFileRoute("/catalog")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./colleagues-ZHRNgzeN.mjs");
var Route$9 = createFileRoute("/colleagues")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./history-D6aAUAJ6.mjs");
var Route$8 = createFileRoute("/history")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./my-activity-D5xs_HRZ.mjs");
var Route$7 = createFileRoute("/my-activity")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./notifications-CE7pcMGa.mjs");
var Route$6 = createFileRoute("/notifications")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./orders-d02WD_dG.mjs");
var Route$5 = createFileRoute("/orders")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./profile-D13-n0rG.mjs");
var Route$4 = createFileRoute("/profile")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./settings-0FJfUVhj.mjs");
var Route$3 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./support-BI7NhHnd.mjs");
var Route$2 = createFileRoute("/support")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./people._userId-D2jBa7K4.mjs");
var Route$1 = createFileRoute("/people/$userId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./surveys._surveyId-CDISyuun.mjs");
var Route = createFileRoute("/surveys/$surveyId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$14.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$15
	}),
	ActivitiesRoute: Route$13.update({
		id: "/activities",
		path: "/activities",
		getParentRoute: () => Route$15
	}),
	AdminRoute: Route$12.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$15
	}),
	CartRoute: Route$11.update({
		id: "/cart",
		path: "/cart",
		getParentRoute: () => Route$15
	}),
	CatalogRoute: Route$10.update({
		id: "/catalog",
		path: "/catalog",
		getParentRoute: () => Route$15
	}),
	ColleaguesRoute: Route$9.update({
		id: "/colleagues",
		path: "/colleagues",
		getParentRoute: () => Route$15
	}),
	HistoryRoute: Route$8.update({
		id: "/history",
		path: "/history",
		getParentRoute: () => Route$15
	}),
	MyActivityRoute: Route$7.update({
		id: "/my-activity",
		path: "/my-activity",
		getParentRoute: () => Route$15
	}),
	NotificationsRoute: Route$6.update({
		id: "/notifications",
		path: "/notifications",
		getParentRoute: () => Route$15
	}),
	OrdersRoute: Route$5.update({
		id: "/orders",
		path: "/orders",
		getParentRoute: () => Route$15
	}),
	ProfileRoute: Route$4.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$15
	}),
	SettingsRoute: Route$3.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$15
	}),
	SupportRoute: Route$2.update({
		id: "/support",
		path: "/support",
		getParentRoute: () => Route$15
	}),
	PeopleUserIdRoute: Route$1.update({
		id: "/people/$userId",
		path: "/people/$userId",
		getParentRoute: () => Route$15
	}),
	SurveysSurveyIdRoute: Route.update({
		id: "/surveys/$surveyId",
		path: "/surveys/$surveyId",
		getParentRoute: () => Route$15
	})
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Field as C, Wordmark as D, TextInput as E, cn as O, Chip as S, TextArea as T, formatNumber as _, useTheme as a, pointsLabel as b, canManageShop as c, hasWorkBalance as d, useStore as f, formatDateTime as g, firstName as h, Route$13 as i, canManageSupport as l, listOf as m, Route as n, awardAmounts as o, apex as p, Route$1 as r, canManageActivities as s, router_exports as t, canOpenAdmin as u, formatPoints as v, Panel as w, Button as x, initials as y };
