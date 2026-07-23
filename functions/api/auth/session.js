import { cors, json, parseCookies, resolveAuthConfig, verifySessionToken } from '../_shared.js';

export async function onRequestOptions() {
  return cors();
}

export async function onRequestGet({ request, env }) {
  const auth = resolveAuthConfig(env);
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const token = cookies[auth.cookieName];
  const session = await verifySessionToken(token, auth.secret);

  if (!session) {
    return json({ ok: true, authenticated: false, username: null });
  }

  return json({
    ok: true,
    authenticated: true,
    username: session.username,
    expiresAt: session.exp,
  });
}
