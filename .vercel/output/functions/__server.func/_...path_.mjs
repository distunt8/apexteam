import { r as defineHandler } from "./_libs/h3+rou3+srvx.mjs";
//#region src/lib/avatar-upload.server.mjs
var API = "https://apexapp-backend.onrender.com";
var STORAGE = "https://hqvphndmvluncjfsqspf.supabase.co";
var KEY = "sb_publishable_R-SkLufMhN9va74MbDAU3w_IEzsEWDF";
var MAX = 2097152;
/** @param {number} status @param {string} message */
var json = (status, message) => Response.json({ message }, { status });
/** @param {Uint8Array} bytes */
function imageType(bytes) {
	if (bytes.length >= 24 && [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	].every((v, i) => bytes[i] === v) && String.fromCharCode(...bytes.slice(12, 16)) === "IHDR") return ["image/png", "png"];
	if (bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return ["image/jpeg", "jpg"];
	if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return ["image/webp", "webp"];
	return null;
}
/** @param {Uint8Array} bytes */
function proofType(bytes) {
	const image = imageType(bytes);
	if (image) return image;
	if (bytes.length >= 4 && String.fromCharCode(...bytes.slice(0, 4)) === "%PDF") return ["application/pdf", "pdf"];
	return null;
}
/**
* Authenticated multipart upload; never uses a privileged Storage key.
* @param {Request} request
* @param {string} target
* @param {typeof fetch} fetcher
*/
async function uploadAvatar(request, target, fetcher = fetch) {
	if (request.method !== "POST") return new Response(null, {
		status: 405,
		headers: { Allow: "POST" }
	});
	const authorization = request.headers.get("authorization");
	if (!authorization?.startsWith("Bearer ")) return json(401, "Войдите в аккаунт.");
	if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return json(415, "Отправьте изображение в поле file.");
	if (Number(request.headers.get("content-length")) > 2162688) return json(413, "Фото должно быть не больше 2 МБ.");
	/** @param {string} url @param {RequestInit} init */
	const call = (url, init = {}) => fetcher(url, {
		...init,
		signal: AbortSignal.timeout(9e4)
	});
	/** @type {string | undefined} */
	let storedPath;
	const storageHeaders = {
		authorization,
		apikey: KEY
	};
	const remove = () => call(`${STORAGE}/storage/v1/object/avatars`, {
		method: "DELETE",
		headers: {
			...storageHeaders,
			"content-type": "application/json"
		},
		body: JSON.stringify({ prefixes: [storedPath] })
	});
	try {
		const current = await call(`${API}/api/users/me`, { headers: { authorization } });
		if (!current.ok) return new Response(current.body, {
			status: current.status,
			headers: { "content-type": "application/json" }
		});
		const actor = await current.json();
		if (!actor.isActive) return json(403, "Аккаунт отключён.");
		if (!/^[0-9a-f-]{36}$/i.test(actor.id)) return json(502, "Сервер вернул некорректный профиль.");
		const own = target === "me" || target === actor.id;
		if (!own && !actor.roles?.some(
			/** @param {string} role */
			(role) => ["admin", "superadmin"].includes(role.toLowerCase())
		)) return json(403, "Недостаточно прав для изменения чужого фото.");
		const profilePath = own ? "/api/users/me" : `/api/users/${target}`;
		let profile = actor;
		if (!own) {
			const other = await call(API + profilePath, { headers: { authorization } });
			if (!other.ok) return new Response(other.body, { status: other.status });
			profile = await other.json();
		}
		const reader = request.body?.getReader();
		if (!reader) return json(400, "Выберите файл.");
		const chunks = [];
		let total = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			total += value.length;
			if (total > 2162688) {
				await reader.cancel();
				return json(413, "Фото должно быть не больше 2 МБ.");
			}
			chunks.push(value);
		}
		let form;
		try {
			form = await new Response(new Blob(chunks), { headers: { "content-type": request.headers.get("content-type") ?? "" } }).formData();
		} catch {
			return json(400, "Не удалось прочитать файл.");
		}
		const file = form.get("file");
		if (!file || typeof file === "string" || file.size === 0) return json(400, "Выберите изображение.");
		if (file.size > MAX) return json(413, "Фото должно быть не больше 2 МБ.");
		const bytes = new Uint8Array(await file.arrayBuffer());
		const type = imageType(bytes);
		if (!type || file.type !== type[0]) return json(415, "Выберите фото в формате JPEG, PNG или WebP.");
		storedPath = `${actor.id}/${profile.id}/${crypto.randomUUID()}.${type[1]}`;
		if (!(await call(`${STORAGE}/storage/v1/object/avatars/${storedPath}`, {
			method: "POST",
			headers: {
				...storageHeaders,
				"content-type": type[0],
				"cache-control": "3600",
				"x-upsert": "false"
			},
			body: bytes
		})).ok) {
			storedPath = void 0;
			return json(502, "Не удалось загрузить фото в хранилище. Повторите ещё раз.");
		}
		const avatarUrl = `${STORAGE}/storage/v1/object/public/avatars/${storedPath}`;
		const body = own ? {
			firstName: profile.firstName,
			lastName: profile.lastName,
			middleName: profile.middleName,
			avatarUrl
		} : {
			firstName: profile.firstName,
			lastName: profile.lastName,
			middleName: profile.middleName,
			department: profile.department,
			position: profile.position,
			avatarUrl
		};
		const updated = await call(API + profilePath, {
			method: "PATCH",
			headers: {
				authorization,
				"content-type": "application/json"
			},
			body: JSON.stringify(body)
		});
		if (!updated.ok) {
			await remove().catch(() => {});
			storedPath = void 0;
			return json(updated.status, "Не удалось сохранить фото в профиле. Повторите ещё раз.");
		}
		return Response.json({ avatarUrl }, { headers: { "cache-control": "no-store" } });
	} catch {
		return json(502, "Сервер не ответил. Обновите профиль перед повторной загрузкой.");
	}
}
/**
* Public image for catalog photos (`products`) or icons (`icons`).
* Never writes into the avatars bucket.
* @param {Request} request
* @param {typeof fetch} fetcher
*/
async function uploadMedia(request, fetcher = fetch) {
	if (request.method !== "POST") return new Response(null, {
		status: 405,
		headers: { Allow: "POST" }
	});
	const authorization = request.headers.get("authorization");
	if (!authorization?.startsWith("Bearer ")) return json(401, "Войдите в аккаунт.");
	if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return json(415, "Отправьте изображение в поле file.");
	if (Number(request.headers.get("content-length")) > 2162688) return json(413, "Фото должно быть не больше 2 МБ.");
	/** @param {string} url @param {RequestInit} init */
	const call = (url, init = {}) => fetcher(url, {
		...init,
		signal: AbortSignal.timeout(9e4)
	});
	try {
		const current = await call(`${API}/api/users/me`, { headers: { authorization } });
		if (!current.ok) return new Response(current.body, {
			status: current.status,
			headers: { "content-type": "application/json" }
		});
		const actor = await current.json();
		if (!actor.isActive) return json(403, "Аккаунт отключён.");
		if (!/^[0-9a-f-]{36}$/i.test(actor.id)) return json(502, "Сервер вернул некорректный профиль.");
		const reader = request.body?.getReader();
		if (!reader) return json(400, "Выберите файл.");
		const chunks = [];
		let total = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			total += value.length;
			if (total > 2162688) {
				await reader.cancel();
				return json(413, "Фото должно быть не больше 2 МБ.");
			}
			chunks.push(value);
		}
		let form;
		try {
			form = await new Response(new Blob(chunks), { headers: { "content-type": request.headers.get("content-type") ?? "" } }).formData();
		} catch {
			return json(400, "Не удалось прочитать файл.");
		}
		const asked = form.get("bucket");
		const bucket = asked === "icons" || asked === "proofs" ? asked : "products";
		const file = form.get("file");
		if (!file || typeof file === "string" || file.size === 0) return json(400, "Выберите файл.");
		if (file.size > MAX) return json(413, "Файл должен быть не больше 2 МБ.");
		const bytes = new Uint8Array(await file.arrayBuffer());
		const type = bucket === "proofs" ? proofType(bytes) : imageType(bytes);
		if (!type || bucket !== "proofs" && file.type !== type[0] || bucket === "proofs" && file.type && file.type !== type[0]) return json(415, bucket === "proofs" ? "Нужен JPEG, PNG, WebP или PDF." : "Выберите фото в формате JPEG, PNG или WebP.");
		const storedPath = `${actor.id}/${crypto.randomUUID()}.${type[1]}`;
		const uploaded = await call(`${STORAGE}/storage/v1/object/${bucket}/${storedPath}`, {
			method: "POST",
			headers: {
				authorization,
				apikey: KEY,
				"content-type": type[0],
				"cache-control": "3600",
				"x-upsert": "false"
			},
			body: bytes
		});
		if (!uploaded.ok) {
			const detail = await uploaded.text();
			if (/Bucket not found|not found/i.test(detail)) return json(502, `Бакета «${bucket}» ещё нет. Создайте его в Supabase и повторите загрузку.`);
			return json(502, "Не удалось загрузить фото в хранилище. Повторите ещё раз.");
		}
		const url = `${STORAGE}/storage/v1/object/public/${bucket}/${storedPath}`;
		return Response.json({
			url,
			bucket
		}, { headers: { "cache-control": "no-store" } });
	} catch {
		return json(502, "Сервер не ответил. Повторите ещё раз.");
	}
}
//#endregion
//#region server/apex-proxy.mjs
var ORIGIN = "https://apexapp-backend.onrender.com";
/** @param {Request} request */
async function proxyApex(request) {
	const url = new URL(request.url);
	const suffix = url.pathname.replace(/^\/api\/apex/, "") + url.search;
	const avatar = url.pathname.match(/^\/api\/apex\/api\/users\/(me|[0-9a-f-]{36})\/avatar$/i);
	if (avatar) return uploadAvatar(request, avatar[1]);
	if (url.pathname === "/api/apex/api/media") return uploadMedia(request);
	const headers = new Headers();
	const auth = request.headers.get("authorization");
	const type = request.headers.get("content-type");
	if (auth) headers.set("authorization", auth);
	if (type) headers.set("content-type", type);
	headers.set("accept", "application/json");
	const method = request.method || "GET";
	const hasBody = method !== "GET" && method !== "HEAD";
	try {
		const upstream = await fetch(ORIGIN + suffix, {
			method,
			headers,
			body: hasBody ? await request.arrayBuffer() : void 0,
			signal: AbortSignal.timeout(9e4)
		});
		const out = new Headers();
		const contentType = upstream.headers.get("content-type");
		if (contentType) out.set("content-type", contentType);
		return new Response(upstream.body, {
			status: upstream.status,
			headers: out
		});
	} catch {
		return new Response(JSON.stringify({ message: "Сервер Апекс не ответил. Если он спал, первый запрос занимает около минуты — попробуйте ещё раз." }), {
			status: 502,
			headers: { "content-type": "application/json" }
		});
	}
}
//#endregion
//#region server/api/apex/[...path].ts
var ____path__default = defineHandler((event) => proxyApex(event.req));
//#endregion
export { ____path__default as default };
