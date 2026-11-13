import { test } from "node:test";
import assert from "node:assert/strict";
import { uploadAvatar } from "../src/lib/avatar-upload.server.mjs";
const id = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
const profile = {
  id,
  isActive: true,
  roles: ["employee"],
  firstName: "Имя",
  lastName: "Фамилия",
  department: "Отдел",
  position: "Должность",
};
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6H0sAAAAASUVORK5CYII=",
  "base64",
);
function request(bytes = png, type = "image/png") {
  const body = new FormData();
  body.set("file", new Blob([bytes], { type }), "photo");
  return new Request("http://test/api/apex/api/users/me/avatar", {
    method: "POST",
    headers: { authorization: "Bearer token" },
    body,
  });
}
function mock({ actor = profile, patchStatus = 200, uploadStatus = 200 } = {}) {
  const calls = [];
  return {
    calls,
    fetcher: async (url, init = {}) => {
      calls.push({ url, ...init });
      if (url.endsWith("/api/users/me") && !init.method) return Response.json(actor);
      if (url.endsWith(`/api/users/${other}`) && !init.method)
        return Response.json({ ...profile, id: other });
      if (init.method === "PATCH") return Response.json({}, { status: patchStatus });
      return Response.json({}, { status: init.method === "POST" ? uploadStatus : 200 });
    },
  };
}
test("requires authentication before any upstream call", async () => {
  assert.equal(
    (
      await uploadAvatar(new Request("http://test", { method: "POST" }), "me", () => {
        throw Error();
      })
    ).status,
    401,
  );
});
test("employee cannot edit another user or upload their file", async () => {
  const m = mock();
  assert.equal((await uploadAvatar(request(), other, m.fetcher)).status, 403);
  assert.equal(m.calls.length, 1);
});
test("inactive account cannot upload", async () => {
  const m = mock({ actor: { ...profile, isActive: false } });
  assert.equal((await uploadAvatar(request(), "me", m.fetcher)).status, 403);
});
test("rejects forged MIME, oversized and empty files before Storage", async () => {
  for (const [bytes, type, status] of [
    [Buffer.from("<svg/>"), "image/png", 415],
    [png, "image/jpeg", 415],
    [Buffer.alloc(2097153), "image/png", 413],
    [Buffer.alloc(0), "image/png", 400],
  ]) {
    const m = mock();
    assert.equal((await uploadAvatar(request(bytes, type), "me", m.fetcher)).status, status);
    assert.equal(m.calls.length, 1);
  }
});
test("stores unique file with user token and preserves profile fields in PATCH", async () => {
  const m = mock();
  const response = await uploadAvatar(request(), "me", m.fetcher);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.match(data.avatarUrl, new RegExp(`/avatars/${id}/${id}/.+\\.png$`));
  assert.equal(m.calls[1].headers.authorization, "Bearer token");
  const body = JSON.parse(m.calls[2].body);
  assert.equal(body.firstName, profile.firstName);
  assert.equal(body.avatarUrl, data.avatarUrl);
  assert.equal(body.isActive, undefined);
});
test("admin can upload for colleague but file remains under uploader folder", async () => {
  const m = mock({ actor: { ...profile, roles: ["admin"] } });
  const response = await uploadAvatar(request(), other, m.fetcher);
  assert.equal(response.status, 200);
  assert.match((await response.json()).avatarUrl, new RegExp(`/avatars/${id}/${other}/`));
  assert.equal(m.calls.at(-1).url, `https://apexapp-backend.onrender.com/api/users/${other}`);
});
test("failed profile save cleans up only the newly uploaded file", async () => {
  const m = mock({ patchStatus: 403 });
  assert.equal((await uploadAvatar(request(), "me", m.fetcher)).status, 403);
  assert.equal(m.calls.at(-1).method, "DELETE");
  assert.equal(JSON.parse(m.calls.at(-1).body).prefixes.length, 1);
});
test("failed Storage upload never patches profile", async () => {
  const m = mock({ uploadStatus: 403 });
  assert.equal((await uploadAvatar(request(), "me", m.fetcher)).status, 502);
  assert.ok(!m.calls.some((c) => c.method === "PATCH"));
});
