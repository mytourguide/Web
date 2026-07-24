import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';
import { createMediaItem, deleteMediaFromConfig, mergeConfig, normalizeConfig, renameMediaInConfig } from './functions/api/admin/_config.js';

const DEV_CONFIG_FILE = path.join('/tmp', 'mytourguide-admin-config.json');
const COOKIE_NAME = 'mytourguide_admin_session';
const DEV_AUTH_DEFAULTS = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'tour2026',
  ADMIN_SESSION_SECRET: 'mytourguide-local-session-secret',
};

async function readDevConfig() {
  try {
    const raw = await fs.readFile(DEV_CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeConfig({
      ...parsed,
      auth: {
        username: String(parsed?.auth?.username || DEV_AUTH_DEFAULTS.ADMIN_USERNAME).trim(),
        password: String(parsed?.auth?.password || DEV_AUTH_DEFAULTS.ADMIN_PASSWORD).trim(),
      },
    }, DEV_AUTH_DEFAULTS);
  } catch {
    return normalizeConfig({
      auth: {
        username: DEV_AUTH_DEFAULTS.ADMIN_USERNAME,
        password: DEV_AUTH_DEFAULTS.ADMIN_PASSWORD,
      },
    }, DEV_AUTH_DEFAULTS);
  }
}

async function writeDevConfig(config) {
  const normalized = normalizeConfig({
    ...config,
    auth: {
      username: String(config?.auth?.username || DEV_AUTH_DEFAULTS.ADMIN_USERNAME).trim(),
      password: String(config?.auth?.password || DEV_AUTH_DEFAULTS.ADMIN_PASSWORD).trim(),
    },
  }, DEV_AUTH_DEFAULTS);
  await fs.writeFile(DEV_CONFIG_FILE, JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    String(cookieHeader || '')
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf('=');
        if (index === -1) return [item, ''];
        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      }),
  );
}

function readJson(request) {
  return new Promise((resolve) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    request.on('error', () => resolve({}));
  });
}

function sendJson(res, status, body, headers = {}) {
  const payload = JSON.stringify(body, null, 2);
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'POST, GET, OPTIONS');
  res.setHeader('access-control-allow-headers', 'content-type');
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(payload);
}

function setSessionCookie(value = '') {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax`;
}

function isLoggedIn(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return Boolean(cookies[COOKIE_NAME]);
}

export default defineConfig({
  appType: 'spa',
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  plugins: [
    {
      name: 'mytourguide-dev-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/')) {
            next();
            return;
          }

          const url = new URL(req.url, 'http://localhost');

          if (req.method === 'OPTIONS') {
            sendJson(res, 204, {});
            return;
          }

          if (url.pathname === '/api/auth/session' && req.method === 'GET') {
            sendJson(res, 200, { ok: true, authenticated: isLoggedIn(req), username: null });
            return;
          }

          if (url.pathname === '/api/auth/login' && req.method === 'POST') {
            const body = await readJson(req);
            const config = await readDevConfig();
            const username = String(body.username || '').trim();
            const password = String(body.password || '').trim();
            if (username !== config.auth.username || password !== config.auth.password) {
              sendJson(res, 401, { ok: false, authenticated: false, message: 'Kullanıcı adı veya parola yanlış.' });
              return;
            }
            sendJson(
              res,
              200,
              { ok: true, authenticated: true, username },
              { 'set-cookie': setSessionCookie(username) },
            );
            return;
          }

          if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
            sendJson(
              res,
              200,
              { ok: true, authenticated: false, message: 'Çıkış yapıldı.' },
              { 'set-cookie': `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` },
            );
            return;
          }

          if (url.pathname === '/api/admin/config' && req.method === 'GET') {
            const config = await readDevConfig();
            sendJson(res, 200, {
              ok: true,
              authenticated: isLoggedIn(req),
              public: config.public,
              ...(isLoggedIn(req) ? { auth: { username: config.auth.username, password: config.auth.password } } : {}),
            });
            return;
          }

          if (url.pathname === '/api/admin/config' && req.method === 'POST') {
            if (!isLoggedIn(req)) {
              sendJson(res, 401, { ok: false, authenticated: false, message: 'Yetkisiz istek.' });
              return;
            }

            const body = await readJson(req);
            const current = await readDevConfig();
            let next = current;

            if (body.action === 'updateAuth') {
              next = mergeConfig(current, {
                auth: {
                  username: String(body.auth?.username || '').trim(),
                  password: String(body.auth?.password || '').trim(),
                },
              });
            }

            if (body.action === 'updateHomeOrder') {
              next = mergeConfig(current, {
                public: { home: { sectionOrder: Array.isArray(body.sectionOrder) ? body.sectionOrder : [] } },
              });
            }

            if (body.action === 'updateHomeMediaRefs') {
              next = mergeConfig(current, {
                public: {
                  home: {
                    slideImages: Array.isArray(body.slideImages) ? body.slideImages : [],
                    categoryImages: Array.isArray(body.categoryImages) ? body.categoryImages : [],
                  },
                },
              });
            }

            if (body.action === 'uploadMedia') {
              const media = createMediaItem(body.media || {});
              next = mergeConfig(current, {
                public: {
                  mediaLibrary: [...(current.public?.mediaLibrary || []), media],
                },
              });
              await writeDevConfig(next);
              sendJson(res, 200, { ok: true, authenticated: true, media, public: next.public });
              return;
            }

            if (body.action === 'renameMedia') {
              const mediaId = String(body.mediaId || '').trim();
              next = renameMediaInConfig(current, mediaId, body.name);
            }

            if (body.action === 'deleteMedia') {
              const mediaId = String(body.mediaId || '').trim();
              next = deleteMediaFromConfig(current, mediaId);
            }

            await writeDevConfig(next);
            sendJson(res, 200, {
              ok: true,
              authenticated: true,
              public: next.public,
              auth: { username: next.auth.username, password: next.auth.password },
            });
            return;
          }

          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin/index.html',
      },
    },
  },
});
