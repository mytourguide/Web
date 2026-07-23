import { cors, json, parseCookies, resolveAuthConfig, verifySessionToken } from '../_shared.js';
import { createMediaItem, deleteMediaFromConfig, mergeConfig, readAdminConfig, renameMediaInConfig, writeAdminConfig } from './_config.js';

function isAuthenticated(request, env) {
  const auth = resolveAuthConfig(env);
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const token = cookies[auth.cookieName];
  return verifySessionToken(token, auth.secret);
}

export async function onRequestOptions() {
  return cors();
}

export async function onRequestGet({ request, env }) {
  const auth = await isAuthenticated(request, env);
  const config = await readAdminConfig(env);
  const response = {
    ok: true,
    public: config.public,
  };
  if (auth) {
    response.auth = {
      username: config.auth.username,
      password: config.auth.password,
    };
    response.authenticated = true;
  } else {
    response.authenticated = false;
  }
  return json(response);
}

export async function onRequestPost({ request, env }) {
  const authenticated = await isAuthenticated(request, env);
  if (!authenticated) {
    return json({ ok: false, authenticated: false, message: 'Yetkisiz istek.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const current = await readAdminConfig(env);
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
      public: {
        home: {
          sectionOrder: Array.isArray(body.sectionOrder) ? body.sectionOrder : [],
        },
      },
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
    await writeAdminConfig(next, env);
    return json({ ok: true, authenticated: true, media, public: next.public });
  }

  if (body.action === 'renameMedia') {
    const mediaId = String(body.mediaId || '').trim();
    if (!mediaId) {
      return json({ ok: false, message: 'Medya bulunamadı.' }, { status: 400 });
    }
    next = renameMediaInConfig(current, mediaId, body.name);
  }

  if (body.action === 'deleteMedia') {
    const mediaId = String(body.mediaId || '').trim();
    if (!mediaId) {
      return json({ ok: false, message: 'Medya bulunamadı.' }, { status: 400 });
    }
    next = deleteMediaFromConfig(current, mediaId);
  }

  await writeAdminConfig(next, env);
  return json({
    ok: true,
    authenticated: true,
    public: next.public,
    auth: {
      username: next.auth.username,
      password: next.auth.password,
    },
  });
}
