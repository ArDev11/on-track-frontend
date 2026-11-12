// API TIRUAN khusus untuk melihat alur UI di komputer sendiri.
// Jangan disalin ke repository dan jangan dipakai saat Gate Review atau Sidang.
// Data hanya tersimpan di memori; menutup server mengembalikan semuanya.

const http = require("http");
const crypto = require("crypto");

const PORT = 8080;
const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 15 * 60;
const TOKEN_SECONDS = 15 * 60;

const accounts = new Map([
  ["hrd@contoh.test", { password: "Coba12345", role: "hrd" }],
  ["owner@contoh.test", { password: "Coba12345", role: "owner" }],
  ["karyawan@contoh.test", { password: "Coba12345", role: "karyawan" }],
]);
const failures = new Map();
const resetTokens = new Map();

const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

function createJwt(email, role) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_SECONDS;
  return `${b64({ alg: "none", typ: "JWT" })}.${b64({ sub: email, tid: "tenant-tiruan", role, exp })}.tiruan`;
}

function send(res, status, body) {
  if (body === undefined) {
    res.writeHead(status);
    return res.end();
  }
  res.writeHead(status, {
    "Content-Type": status >= 400 ? "application/problem+json" : "application/json",
  });
  res.end(JSON.stringify(body));
}

function login(res, { email, password }) {
  const key = String(email).toLowerCase();
  const state = failures.get(key) ?? { count: 0, lockedUntil: 0 };
  const now = Date.now();

  if (state.lockedUntil > now) {
    const retry_after = Math.ceil((state.lockedUntil - now) / 1000);
    return send(res, 423, { title: "Akun dikunci sementara", status: 423, detail: "Coba lagi nanti.", retry_after });
  }

  const account = accounts.get(key);
  if (account && account.password === password) {
    failures.delete(key);
    return send(res, 200, { access_token: createJwt(key, account.role) });
  }

  state.count = state.lockedUntil ? 1 : state.count + 1;
  state.lockedUntil = 0;
  if (state.count >= MAX_ATTEMPTS) {
    state.lockedUntil = now + LOCK_SECONDS * 1000;
    failures.set(key, state);
    return send(res, 423, { title: "Akun dikunci sementara", status: 423, detail: "Coba lagi nanti.", retry_after: LOCK_SECONDS });
  }
  failures.set(key, state);
  return send(res, 401, {
    title: "Email atau kata sandi salah",
    status: 401,
    detail: "Periksa kembali data Anda.",
    remaining_attempts: MAX_ATTEMPTS - state.count,
  });
}

function forgot(res, { email }) {
  const key = String(email).toLowerCase();
  if (accounts.has(key)) {
    const token = crypto.randomBytes(16).toString("hex");
    resetTokens.set(token, key);
    console.log(`\nTautan reset untuk ${key}:\nhttp://localhost:3000/atur-ulang-kata-sandi?token=${token}\n`);
  }
  return send(res, 202);
}

function reset(res, { token, new_password }) {
  const email = resetTokens.get(token);
  if (!email) {
    return send(res, 400, { title: "Tautan tidak valid", status: 400, detail: "Tautan salah atau sudah dipakai. Minta tautan baru." });
  }
  accounts.get(email).password = new_password;
  resetTokens.delete(token);
  failures.delete(email);
  return send(res, 204);
}

const routes = {
  "/auth/login": login,
  "/auth/password/forgot": forgot,
  "/auth/password/reset": reset,
  "/auth/logout": (res) => send(res, 204),
};

http
  .createServer((req, res) => {
    const handler = req.method === "POST" ? routes[req.url] : undefined;
    if (!handler) return send(res, 404, { title: "Tidak ditemukan", status: 404 });

    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      let body = {};
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        return send(res, 400, { title: "JSON tidak valid", status: 400 });
      }
      handler(res, body);
    });
  })
  .listen(PORT, () => console.log(`API tiruan berjalan di http://localhost:${PORT}`));
