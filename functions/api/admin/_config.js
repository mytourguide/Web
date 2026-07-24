import { buildId, resolveAuthConfig } from '../_shared.js';

const CONFIG_TABLE = 'admin_config';
const HOME_SECTION_IDS = ['homeSearch', 'homeSlider', 'homeCategories', 'homeStats', 'homeProvinces', 'homeFeatured', 'homeTailor', 'homeSeo'];

const fallbackConfig = {
  public: {
    home: {
      sectionOrder: HOME_SECTION_IDS,
      slideImages: [],
      categoryImages: [],
    },
    mediaLibrary: [],
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getDatabase(env = {}) {
  return env.ADMIN_CONFIG_DB || env.DB || null;
}

async function ensureSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ${CONFIG_TABLE} (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      config_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();
}

function sanitizeSectionOrder(order) {
  const unique = [];
  for (const id of Array.isArray(order) ? order : []) {
    if (HOME_SECTION_IDS.includes(id) && !unique.includes(id)) unique.push(id);
  }
  for (const id of HOME_SECTION_IDS) {
    if (!unique.includes(id)) unique.push(id);
  }
  return unique;
}

function sanitizeMediaLibrary(library) {
  return (Array.isArray(library) ? library : [])
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: String(item.id || buildId('media')),
      name: String(item.name || 'Medya'),
      type: String(item.type || 'image/png'),
      dataUrl: String(item.dataUrl || ''),
      createdAt: String(item.createdAt || new Date().toISOString()),
    }))
    .filter((item) => item.dataUrl);
}

function normalizeConfig(input = {}, env = {}) {
  const defaults = {
    auth: resolveAuthConfig(env),
    public: clone(fallbackConfig.public),
  };
  const inputUsername = String(input.auth?.username || '').trim();
  const inputPassword = String(input.auth?.password || '').trim();
  const merged = {
    auth: {
      ...defaults.auth,
      ...(input.auth || {}),
      username: inputUsername || defaults.auth.username,
      password: inputPassword || defaults.auth.password,
    },
    public: {
      home: {
        sectionOrder: sanitizeSectionOrder(input.public?.home?.sectionOrder || defaults.public.home.sectionOrder),
        slideImages: Array.isArray(input.public?.home?.slideImages) ? input.public.home.slideImages.map((item) => String(item || '')) : defaults.public.home.slideImages,
        categoryImages: Array.isArray(input.public?.home?.categoryImages) ? input.public.home.categoryImages.map((item) => String(item || '')) : defaults.public.home.categoryImages,
      },
      mediaLibrary: sanitizeMediaLibrary(input.public?.mediaLibrary || defaults.public.mediaLibrary),
    },
  };
  return merged;
}

function mergeConfig(base, patch) {
  const next = clone(base);
  if (patch?.auth) {
    next.auth = {
      ...next.auth,
      ...patch.auth,
    };
  }
  if (patch?.public) {
    next.public = next.public || {};
    if (patch.public.home?.sectionOrder) {
      next.public.home = next.public.home || {};
      next.public.home.sectionOrder = sanitizeSectionOrder(patch.public.home.sectionOrder);
    }
    if (patch.public.home?.slideImages) {
      next.public.home = next.public.home || {};
      next.public.home.slideImages = Array.isArray(patch.public.home.slideImages)
        ? patch.public.home.slideImages.map((item) => String(item || ''))
        : [];
    }
    if (patch.public.home?.categoryImages) {
      next.public.home = next.public.home || {};
      next.public.home.categoryImages = Array.isArray(patch.public.home.categoryImages)
        ? patch.public.home.categoryImages.map((item) => String(item || ''))
        : [];
    }
    if (patch.public.mediaLibrary) {
      next.public.mediaLibrary = sanitizeMediaLibrary(patch.public.mediaLibrary);
    }
  }
  return next;
}

function renameMediaInConfig(base, mediaId, name) {
  const next = clone(base);
  next.public = next.public || {};
  next.public.mediaLibrary = sanitizeMediaLibrary(next.public.mediaLibrary || []).map((item) => (
    item.id === mediaId ? { ...item, name: String(name || item.name || 'Medya') } : item
  ));
  return next;
}

function deleteMediaFromConfig(base, mediaId) {
  const next = clone(base);
  next.public = next.public || {};
  next.public.mediaLibrary = sanitizeMediaLibrary(next.public.mediaLibrary || []).filter((item) => item.id !== mediaId);
  next.public.home = next.public.home || {};
  next.public.home.slideImages = Array.isArray(next.public.home.slideImages)
    ? next.public.home.slideImages.map((item) => (item === `media:${mediaId}` ? '' : item))
    : [];
  next.public.home.categoryImages = Array.isArray(next.public.home.categoryImages)
    ? next.public.home.categoryImages.map((item) => (item === `media:${mediaId}` ? '' : item))
    : [];
  return next;
}

async function readAdminConfig(env = {}) {
  const db = getDatabase(env);
  let stored = null;

  if (db?.prepare) {
    await ensureSchema(db);
    const result = await db.prepare(`SELECT config_json FROM ${CONFIG_TABLE} WHERE id = 1`).all();
    try {
      stored = result?.results?.[0]?.config_json ? JSON.parse(result.results[0].config_json) : null;
    } catch {
      stored = null;
    }
  } else if (globalThis.__mytourguideAdminConfig) {
    stored = clone(globalThis.__mytourguideAdminConfig);
  }

  const normalized = normalizeConfig(stored || {}, env);
  globalThis.__mytourguideAdminConfig = clone(normalized);
  return normalized;
}

async function writeAdminConfig(nextConfig, env = {}) {
  const normalized = normalizeConfig(nextConfig, env);
  globalThis.__mytourguideAdminConfig = clone(normalized);
  const db = getDatabase(env);
  if (db?.prepare) {
    await ensureSchema(db);
    await db.prepare(`
      INSERT INTO ${CONFIG_TABLE} (id, config_json, updated_at)
      VALUES (1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        config_json = excluded.config_json,
        updated_at = excluded.updated_at
    `).bind(JSON.stringify(normalized), new Date().toISOString()).run();
  }
  return normalized;
}

function createMediaItem(media = {}) {
  return {
    id: String(media.id || buildId('media')),
    name: String(media.name || 'Medya'),
    type: String(media.type || 'image/png'),
    dataUrl: String(media.dataUrl || ''),
    createdAt: String(media.createdAt || new Date().toISOString()),
  };
}

export {
  deleteMediaFromConfig,
  createMediaItem,
  mergeConfig,
  normalizeConfig,
  readAdminConfig,
  renameMediaInConfig,
  sanitizeMediaLibrary,
  sanitizeSectionOrder,
  writeAdminConfig,
};
