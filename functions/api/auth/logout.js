import { clearAuthCookie, cors, json, resolveAuthConfig } from '../_shared.js';

export async function onRequestOptions() {
  return cors();
}

export async function onRequestPost({ request }) {
  const secure = new URL(request.url).protocol === 'https:';
  const auth = resolveAuthConfig();
  return json(
    { ok: true, authenticated: false, message: 'Çıkış yapıldı.' },
    {
      headers: {
        'set-cookie': clearAuthCookie(secure, auth.cookieName),
      },
    },
  );
}
