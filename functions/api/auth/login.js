import { buildAuthCookie, cors, createSessionToken, json, resolveAuthConfig } from '../_shared.js';
import { readAdminConfig } from '../admin/_config.js';

export async function onRequestOptions() {
  return cors();
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const config = await readAdminConfig(env);
  const auth = resolveAuthConfig(env, config.auth);
  const secure = new URL(request.url).protocol === 'https:';
  const username = String(body.username || '').trim();
  const password = String(body.password || '').trim();

  if (username !== auth.username || password !== auth.password) {
    return json({ ok: false, authenticated: false, message: 'Kullanıcı adı veya parola yanlış.' }, { status: 401 });
  }

  const token = await createSessionToken(username, auth.secret, auth.ttlSeconds);
  return json(
    {
      ok: true,
      authenticated: true,
      username,
      expiresIn: auth.ttlSeconds,
    },
    {
      headers: {
        'set-cookie': buildAuthCookie(token, auth.ttlSeconds, secure, auth.cookieName),
      },
    },
  );
}
