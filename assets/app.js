import { adminGroups, businessProfile, cmsDefaults, defaultQuestions, menuItems, pageDefaults, regionCopy, slugify, themes, tourCollections, tourTypes, widgetCatalog } from './content.js';
import { translations } from './i18n.js';

const STORE_KEY = 'mytourguide-state-v1';
const ADMIN_SESSION_KEY = 'mytourguide-admin-session-v1';
const ILCELER_DATA_URL = new URL('../data/ilceler.json', import.meta.url);
const ROOT = document.getElementById('app');
const HOME_SECTION_DEFS = [
  { id: 'homeSearch', label: 'Arama satırı', description: 'Ana arama ve hızlı erişim alanı.' },
  { id: 'homeSlider', label: 'Slider', description: 'Banner vitrin alanı.' },
  { id: 'homeCategories', label: 'Kategoriler', description: 'Tur kategori kartları.' },
  { id: 'homeStats', label: 'İstatistikler', description: 'Sayısal özet kutuları.' },
  { id: 'homeProvinces', label: 'İl blokları', description: 'Öne çıkan il kartları.' },
  { id: 'homeFeatured', label: 'Öne çıkan', description: 'Featured tur kartları.' },
  { id: 'homeTailor', label: 'Tailor-made', description: 'İş akışı ve üretim notları.' },
  { id: 'homeSeo', label: 'SEO / Güvenlik', description: 'Meta ve güvenlik alanları.' },
];
const DEFAULT_HOME_SECTION_ORDER = HOME_SECTION_DEFS.map((item) => item.id);

const fallbackState = {
  locale: 'tr',
  theme: 'auto',
  themePreset: 'aurora',
  themePresetDraft: 'aurora',
  openLanguage: 'tr',
  adminTab: 'account',
  adminPanelSearch: '',
  adminPagesSearch: '',
  adminOpenPlaceKey: '',
  adminOpenPageId: '',
  adminRecentTabs: ['account', 'appearance', 'homepage'],
  adminMessage: '',
  userMessage: '',
  userProfile: {
    firstName: '',
    lastName: '',
    tcNo: '',
    phone: '',
    email: '',
    address: '',
    accommodationAddress: '',
  },
  userAccount: {
    password: '',
  },
  activeWidgets: ['search', 'currency', 'faq', 'support', 'testimonial'],
  provinceStatus: {},
  districtStatus: {},
  routeFilters: {},
  selectedQuestions: defaultQuestions,
  customPages: [],
  cms: structuredClone(cmsDefaults),
  cart: [],
  notes: '',
};

let state = loadState();
let adminSession = false;
let adminSessionSource = null;
let backendConfig = {
  public: {
    home: {
      sectionOrder: DEFAULT_HOME_SECTION_ORDER,
    },
    mediaLibrary: [],
    pageContent: {},
  },
  auth: null,
};
let data = {
  locations: [],
  provinces: [],
  districtsByProvince: new Map(),
  provinceMap: new Map(),
  searchIndex: [],
  tours: [],
  generatedTours: [],
  placeGalleries: new Map(),
  placeGalleryLoading: new Set(),
};

let searchOpen = false;
let searchQuery = '';
let homeOrderDragId = null;

init().catch((error) => {
  console.error(error);
  ROOT.innerHTML = `<main class="app-shell"><section class="error-card"><p class="eyebrow">Hata</p><h1>Site başlatılamadı.</h1><p>${escapeHtml(error.message || 'Bilinmeyen hata')}</p></section></main>`;
});

async function init() {
  data.locations = await fetchJSON(ILCELER_DATA_URL);
  buildLocationData();
  buildGeneratedTours();
  hydrateFromUrl();
  await refreshAdminSession();
  await loadBackendConfig();
  applyThemeImmediately();
  bindGlobalEvents();
  render();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    return {
      ...fallbackState,
      themePresetDraft: saved?.themePresetDraft || saved?.themePreset || fallbackState.themePresetDraft,
      userProfile: {
        ...fallbackState.userProfile,
        ...(saved?.userProfile || {}),
      },
      userAccount: {
        ...fallbackState.userAccount,
        ...(saved?.userAccount || {}),
      },
      ...saved,
      cms: {
        ...structuredClone(cmsDefaults),
        ...(saved?.cms || {}),
        brand: { ...cmsDefaults.brand, ...(saved?.cms?.brand || {}) },
        menu: { ...cmsDefaults.menu, ...(saved?.cms?.menu || {}) },
        hero: { ...cmsDefaults.hero, ...(saved?.cms?.hero || {}) },
        home: {
          ...cmsDefaults.home,
          ...(saved?.cms?.home || {}),
          slides: saved?.cms?.home?.slides || structuredClone(cmsDefaults.home.slides || []),
          categories: saved?.cms?.home?.categories || structuredClone(cmsDefaults.home.categories || []),
          sectionOrder: saved?.cms?.home?.sectionOrder || structuredClone(cmsDefaults.home.sectionOrder || []),
        },
        mediaLibrary: saved?.cms?.mediaLibrary || [],
        footer: { ...cmsDefaults.footer, ...(saved?.cms?.footer || {}) },
        contact: { ...cmsDefaults.contact, ...(saved?.cms?.contact || {}) },
        login: { ...cmsDefaults.login, ...(saved?.cms?.login || {}) },
        auth: { ...cmsDefaults.auth, ...(saved?.cms?.auth || {}) },
        commerce: { ...cmsDefaults.commerce, ...(saved?.cms?.commerce || {}) },
        security: { ...cmsDefaults.security, ...(saved?.cms?.security || {}) },
        publish: { ...cmsDefaults.publish, ...(saved?.cms?.publish || {}) },
        pageContent: saved?.cms?.pageContent || {},
        customCategories: Array.isArray(saved?.cms?.customCategories) ? saved.cms.customCategories : [],
        customPages: Array.isArray(saved?.cms?.customPages) ? saved.cms.customPages : [],
      },
      selectedQuestions: saved?.selectedQuestions || defaultQuestions,
    };
  } catch {
    return structuredClone(fallbackState);
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function setThemePresetDraft(theme) {
  state.themePresetDraft = theme;
  saveState();
}

function getUserProfile() {
  return {
    firstName: String(state.userProfile?.firstName || '').trim(),
    lastName: String(state.userProfile?.lastName || '').trim(),
    tcNo: String(state.userProfile?.tcNo || '').trim(),
    phone: String(state.userProfile?.phone || '').trim(),
    email: String(state.userProfile?.email || '').trim(),
    address: String(state.userProfile?.address || '').trim(),
    accommodationAddress: String(state.userProfile?.accommodationAddress || '').trim(),
  };
}

function getUserAccount() {
  return {
    password: String(state.userAccount?.password || '').trim(),
  };
}

function isAdminAuthenticated() {
  return adminSession;
}

function getAdminCredentials() {
  return {
    username: String(backendConfig.auth?.username || cmsDefaults.auth.username).trim(),
    password: String(backendConfig.auth?.password || '').trim(),
  };
}

function loadLocalAdminSession() {
  try {
    const session = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || 'null');
    if (!session?.username || !session?.exp) return null;
    if (Number(session.exp) < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function saveLocalAdminSession(username) {
  localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      username,
      exp: Date.now() + 8 * 60 * 60 * 1000,
    }),
  );
}

function clearLocalAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

async function refreshAdminSession() {
  try {
    const response = await fetch('/api/auth/session', { credentials: 'include' });
    if (!response.ok) {
      adminSession = false;
      adminSessionSource = null;
      return;
    }
    const payload = await response.json().catch(() => null);
    adminSession = Boolean(payload?.authenticated);
    adminSessionSource = adminSession ? 'backend' : null;
  } catch {
    adminSession = false;
    adminSessionSource = null;
  }
}

function applyBackendConfig(config, authenticated = false) {
  backendConfig = {
    public: {
      home: {
        sectionOrder: Array.isArray(config?.public?.home?.sectionOrder) && config.public.home.sectionOrder.length
          ? config.public.home.sectionOrder
          : DEFAULT_HOME_SECTION_ORDER,
        slideImages: Array.isArray(config?.public?.home?.slideImages) ? config.public.home.slideImages : [],
        categoryImages: Array.isArray(config?.public?.home?.categoryImages) ? config.public.home.categoryImages : [],
      },
      mediaLibrary: Array.isArray(config?.public?.mediaLibrary) ? config.public.mediaLibrary : [],
      pageContent: config?.public?.pageContent && typeof config.public.pageContent === 'object' ? config.public.pageContent : {},
      customCategories: Array.isArray(config?.public?.customCategories) ? config.public.customCategories : [],
      customPages: Array.isArray(config?.public?.customPages) ? config.public.customPages : [],
    },
    auth: authenticated && config?.auth ? config.auth : backendConfig.auth,
  };
  state.cms.home.sectionOrder = backendConfig.public.home.sectionOrder;
  if (Array.isArray(state.cms.home?.slides) && backendConfig.public.home.slideImages.length) {
    state.cms.home.slides = state.cms.home.slides.map((slide, index) => ({
      ...slide,
      image: backendConfig.public.home.slideImages[index] || slide.image,
    }));
  }
  if (Array.isArray(state.cms.home?.categories) && backendConfig.public.home.categoryImages.length) {
    state.cms.home.categories = state.cms.home.categories.map((category, index) => ({
      ...category,
      image: backendConfig.public.home.categoryImages[index] || category.image,
    }));
  }
  state.cms.mediaLibrary = backendConfig.public.mediaLibrary;
  state.cms.pageContent = backendConfig.public.pageContent;
  state.cms.customCategories = backendConfig.public.customCategories;
  state.cms.customPages = backendConfig.public.customPages;
  if (authenticated && config?.auth) {
    backendConfig.auth = {
      username: String(config.auth.username || ''),
      password: String(config.auth.password || ''),
    };
  }
  saveState();
}

async function loadBackendConfig() {
  try {
    const response = await fetch('/api/admin/config', { credentials: 'include' });
    if (!response.ok) return;
    const payload = await response.json().catch(() => null);
    if (!payload) return;
    applyBackendConfig(payload, Boolean(payload.authenticated));
    render();
  } catch {
    // Ignore config loading failures; fallback state stays active.
  }
}

async function saveBackendConfig(payload) {
  const response = await fetch('/api/admin/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Config kaydedilemedi: HTTP ${response.status}`);
  }
  const data = await response.json().catch(() => null);
  if (data?.public) {
    applyBackendConfig(data, true);
  }
  return data;
}

function syncHomeMediaRefsToBackend() {
  const slideImages = (state.cms.home?.slides || []).map((slide) => String(slide?.image || ''));
  const categoryImages = (state.cms.home?.categories || []).map((category) => String(category?.image || ''));
  return saveBackendConfig({
    action: 'updateHomeMediaRefs',
    slideImages,
    categoryImages,
  });
}

function syncCustomContentToBackend() {
  return saveBackendConfig({
    action: 'updateCustomContent',
    customCategories: Array.isArray(state.cms.customCategories) ? state.cms.customCategories : [],
    customPages: Array.isArray(state.cms.customPages) ? state.cms.customPages : [],
  });
}

function cms(path, fallback = '') {
  return getPath(state.cms, path, fallback);
}

function getPath(object, path, fallback = '') {
  return String(path || '').split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), object) ?? fallback;
}

function resolveMediaSource(value) {
  const raw = String(value || '').trim();
  if (!raw.startsWith('media:')) return raw;
  const mediaId = raw.slice(6);
  const item = backendConfig.public.mediaLibrary.find((entry) => entry.id === mediaId);
  return item?.dataUrl || raw;
}

function getMediaItemByRef(ref) {
  const raw = String(ref || '').trim();
  if (!raw.startsWith('media:')) return null;
  const mediaId = raw.slice(6);
  return backendConfig.public.mediaLibrary.find((item) => item.id === mediaId) || null;
}

function getUsedMediaRefs() {
  const slideRefs = (state.cms.home?.slides || []).map((slide) => String(slide?.image || '')).filter((item) => item.startsWith('media:'));
  const categoryRefs = (state.cms.home?.categories || []).map((category) => String(category?.image || '')).filter((item) => item.startsWith('media:'));
  return new Set([...slideRefs, ...categoryRefs]);
}

function renderMediaPreview(ref) {
  const media = getMediaItemByRef(ref);
  if (!media) {
    return `<div class="media-preview empty">Medya seçilmedi</div>`;
  }
  return `
    <div class="media-preview">
      <img src="${escapeAttr(media.dataUrl)}" alt="${escapeAttr(media.name)}">
      <div class="media-preview-copy">
        <strong>${escapeHtml(media.name)}</strong>
        <small>${escapeHtml(media.type)}</small>
      </div>
    </div>
  `;
}

function getPlaceRouteKey(kind, provinceSlug, districtSlug = '') {
  return kind === 'district'
    ? `district:${provinceSlug}/${districtSlug}`
    : `province:${provinceSlug}`;
}

function getPlaceContent(routeKey) {
  return state.cms.pageContent?.[routeKey] || {};
}

function buildPlaceEditorProps(kind, provinceSlug, districtSlug = '') {
  const province = data.provinceMap.get(provinceSlug);
  if (!province) return null;
  const districtList = data.districtsByProvince.get(provinceSlug) || [];
  const district = kind === 'district' ? districtList.find((item) => item.slug === districtSlug) : null;
  if (kind === 'district' && !district) return null;
  const copy = regionCopy[province.region] || regionCopy.Marmara;
  const routeKey = getPlaceRouteKey(kind, provinceSlug, districtSlug);
  const content = getPlaceContent(routeKey);
  const title = content.title || (district ? district.name : province.name);
  const summary = content.summary || copy.intro;
  const facts = content.facts || buildPlaceFacts({ province, district, districtList });
  return { routeKey, title, summary, facts, province, district, districtList };
}

function searchPlaces(rawNeedle) {
  const needle = normalize(rawNeedle || '');
  if (!needle) return [];
  const out = [];
  for (const province of data.provinces) {
    if (normalize(province.name).includes(needle)) {
      out.push({ kind: 'province', provinceSlug: province.slug, districtSlug: '', label: province.name });
    }
    for (const district of province.districts) {
      if (normalize(district.name).includes(needle)) {
        out.push({ kind: 'district', provinceSlug: province.slug, districtSlug: district.slug, label: `${district.name} (${province.name})` });
      }
    }
  }
  return out.slice(0, 15);
}

function buildPlaceSearchTerms(placeName, provinceName = '', districtName = '') {
  const base = String(placeName || '').trim();
  const province = String(provinceName || '').trim();
  const district = String(districtName || '').trim();
  return [
    base,
    `${base} tarihi`,
    `${base} turizm`,
    `${base} gezilecek yerler`,
    province && province !== base ? `${base} ${province}` : '',
    province && province !== base ? `${base} ${province} tarihi` : '',
    district && district !== base ? `${base} ${district}` : '',
    district && district !== base ? `${base} ${district} tarihi` : '',
  ].filter(Boolean);
}

function buildPlaceFacts({ province, district, districtList }) {
  const pieces = [];
  if (district) {
    pieces.push(`${district.name}, ${province.name} ilinin ${province.region} Bölgesi içindeki ilçelerinden biridir.`);
    pieces.push(`Plaka kodu ${province.plate}. Aynı il içinde ${districtList.length} bağlı ilçe ile birlikte listelenir.`);
    pieces.push('Sayfa, ilçe bazlı tur ve rezervasyon akışına bağlı çalışır.');
  } else if (province) {
    pieces.push(`${province.name}, ${province.region} Bölgesi içinde yer alır.`);
    pieces.push(`Plaka kodu ${province.plate} ve toplam ${districtList.length} ilçe ile birlikte gösterilir.`);
    pieces.push('İl sayfasında bağlı ilçeler solda listelenir ve her ilçe kendi alt sayfasına açılır.');
  }
  return pieces.join(' ');
}

function buildPlaceCaption(title, placeName) {
  const safeTitle = String(title || '').replace(/^File:/i, '').trim();
  const safePlace = String(placeName || '').trim();
  return safePlace && safeTitle ? `${safePlace} · ${safeTitle}` : safeTitle || safePlace || 'Wikimedia görseli';
}

function resolvePlaceSlides(contentSlides, fallbackSlides) {
  const combined = [];
  const seen = new Set();
  for (const slide of [...(Array.isArray(contentSlides) ? contentSlides : []), ...(Array.isArray(fallbackSlides) ? fallbackSlides : [])]) {
    const image = resolveMediaSource(slide?.image || '');
    if (!image || seen.has(image)) continue;
    seen.add(image);
    combined.push({
      ...slide,
      image,
    });
    if (combined.length >= 4) break;
  }
  return combined;
}

function normalizeWikimediaPageImage(page) {
  const image = page?.original?.source || page?.thumbnail?.source || page?.imageinfo?.[0]?.url || page?.imageinfo?.[0]?.thumburl || '';
  if (!image) return null;
  return {
    title: String(page?.title || '').trim(),
    image,
    caption: String(page?.pageTitle || page?.title || '').replace(/^File:/i, '').trim(),
    pageUrl: page?.canonicalurl || page?.fullurl || '',
    source: page?.source || 'wikipedia',
  };
}

async function fetchWikimediaPages(term, options = {}) {
  const endpoint = options.endpoint || 'https://tr.wikipedia.org/w/api.php';
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: term,
    gsrnamespace: options.namespace || '0',
    gsrlimit: String(options.limit || 8),
    prop: options.prop || 'pageimages|info',
    piprop: options.piprop || 'thumbnail|original',
    pithumbsize: String(options.thumbSize || 1280),
    inprop: 'url',
  });
  if (options.extra) {
    for (const [key, value] of Object.entries(options.extra)) {
      params.set(key, value);
    }
  }
  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (!response.ok) throw new Error(`Wikimedia API HTTP ${response.status}`);
  const payload = await response.json();
  return Object.values(payload?.query?.pages || {});
}

async function fetchWikimediaGallery(placeName, provinceName = '', districtName = '') {
  const terms = buildPlaceSearchTerms(placeName, provinceName, districtName);
  const slides = [];
  const seen = new Set();

  const appendPages = (pages, source) => {
    for (const page of pages) {
      const item = normalizeWikimediaPageImage(page);
      if (!item || !item.image || seen.has(item.image)) continue;
      seen.add(item.image);
      slides.push({
        title: item.title || placeName,
        image: item.image,
        caption: buildPlaceCaption(item.caption || item.title, placeName),
        source,
        pageUrl: item.pageUrl,
      });
      if (slides.length >= 4) break;
    }
  };

  for (const term of terms) {
    if (slides.length >= 4) break;
    try {
      appendPages(await fetchWikimediaPages(term, { endpoint: 'https://tr.wikipedia.org/w/api.php', limit: 6 }), 'wikipedia');
    } catch (error) {
      console.warn('Wikimedia Wikipedia search failed', term, error);
    }
  }

  if (slides.length < 4) {
    for (const term of terms) {
      if (slides.length >= 4) break;
      try {
        const pages = await fetchWikimediaPages(term, {
          endpoint: 'https://commons.wikimedia.org/w/api.php',
          namespace: 6,
          limit: 6,
          prop: 'imageinfo|info',
          piprop: 'thumbnail|original',
          thumbSize: 1280,
          extra: {
            iiprop: 'url|dimensions',
            iiurlwidth: '1280',
          },
        });
        appendPages(pages, 'commons');
      } catch (error) {
        console.warn('Wikimedia Commons search failed', term, error);
      }
    }
  }

  return slides.slice(0, 4);
}

function ensurePlaceGallery(routeKey, placeName, provinceName = '', districtName = '') {
  if (data.placeGalleries.has(routeKey) || data.placeGalleryLoading.has(routeKey)) return;
  data.placeGalleryLoading.add(routeKey);
  fetchWikimediaGallery(placeName, provinceName, districtName)
    .then((slides) => {
      data.placeGalleries.set(routeKey, slides);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      data.placeGalleryLoading.delete(routeKey);
      if (data.route?.kind === 'province' && routeKey === getPlaceRouteKey('province', data.route.provinceSlug)) render();
      if (data.route?.kind === 'district' && routeKey === getPlaceRouteKey('district', data.route.provinceSlug, data.route.districtSlug)) render();
    });
}

function getPlaceGallery(routeKey) {
  return data.placeGalleries.get(routeKey) || [];
}

function renderPlaceGallery(slides, { loading = false, routeKey = '', title = '' } = {}) {
  const list = Array.isArray(slides) ? slides.slice(0, 4) : [];
  if (!list.length) {
    return `
      <section class="place-gallery glass-card">
        <div class="section-header">
          <div>
            <div class="eyebrow">Banner</div>
            <h2 class="section-title">${escapeHtml(title || 'Görseller yükleniyor')}</h2>
          </div>
          ${loading ? '<span class="pill">Wikimedia aranıyor</span>' : ''}
        </div>
        <div class="place-gallery-empty">${loading ? 'Tarihî ve turistik görseller getiriliyor.' : 'Bu sayfa için görsel bulunamadı.'}</div>
      </section>
    `;
  }
  return `
    <section class="place-gallery glass-card">
      <div class="section-header">
        <div>
          <div class="eyebrow">Banner</div>
          <h2 class="section-title">${escapeHtml(title || 'Yerel görsel galerisi')}</h2>
        </div>
        <div class="toolbar">
          <button class="btn" data-action="scroll-place-slider" data-route-key="${escapeAttr(routeKey)}" data-direction="-1" type="button">←</button>
          <button class="btn" data-action="scroll-place-slider" data-route-key="${escapeAttr(routeKey)}" data-direction="1" type="button">→</button>
        </div>
      </div>
      <div class="place-gallery-track" data-place-gallery="${escapeAttr(routeKey)}">
        ${list.map((slide, index) => `
          <article class="place-gallery-slide">
            <div class="place-gallery-image" style="--cover-image: url('${escapeAttr(resolveMediaSource(slide.image || ''))}')">
              <div class="place-gallery-index">0${index + 1}</div>
            </div>
            <div class="place-gallery-body">
              <div class="eyebrow">${escapeHtml(slide.source || 'wikimedia')}</div>
              <h3>${escapeHtml(slide.caption || slide.title || title || '')}</h3>
              ${slide.pageUrl ? `<a class="btn" href="${escapeAttr(slide.pageUrl)}" target="_blank" rel="noreferrer">Kaynak sayfası</a>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderPlaceFactsSection({ routeKey, title, summary, facts, province, district, districtList }) {
  const hasAdmin = isAdminAuthenticated();
  return `
    <section class="panel glass-card">
      <div class="section-header">
        <div>
          <div class="eyebrow">Künye</div>
          <h2 class="section-title">${escapeHtml(title)}</h2>
        </div>
      </div>
      <div class="split">
        <div class="step">
          <h4>Tanım</h4>
          <p>${escapeHtml(summary)}</p>
        </div>
        <div class="step">
          <h4>Bilgiler</h4>
          <p>${escapeHtml(facts)}</p>
        </div>
      </div>
      ${hasAdmin ? renderPlaceContentEditor({ routeKey, title, summary, facts, province, district, districtList }) : ''}
    </section>
  `;
}

function renderPlaceContentEditor({ routeKey, title, summary, facts, province, district, districtList }) {
  const content = getPlaceContent(routeKey);
  const slideValues = Array.isArray(content.slides) && content.slides.length
    ? content.slides
    : (data.placeGalleries.get(routeKey) || []).map((slide) => slide.image).filter(Boolean);
  return `
    <details class="step" open>
      <summary style="cursor:pointer; font-family: var(--font-title);">Admin düzenleme</summary>
      <form class="builder-steps" data-place-content-form data-route-key="${escapeAttr(routeKey)}">
        <div class="split">
          <label><span class="filter-label">Sayfa başlığı</span><input class="input" name="title" value="${escapeAttr(content.title || title)}"></label>
          <label><span class="filter-label">Künye özeti</span><textarea class="textarea" name="summary" rows="4">${escapeHtml(content.summary || summary)}</textarea></label>
          <label><span class="filter-label">Künye metni</span><textarea class="textarea" name="facts" rows="4">${escapeHtml(content.facts || facts)}</textarea></label>
        </div>
        <div class="split">
          ${[0, 1, 2, 3].map((index) => `
            <label><span class="filter-label">Slayt ${index + 1} görsel URL</span><input class="input" name="slide-${index}" value="${escapeAttr(slideValues[index] || '')}" placeholder="https://..."></label>
          `).join('')}
        </div>
        <div class="meta-row">
          <span class="pill">${province ? escapeHtml(province.name) : ''}</span>
          ${district ? `<span class="pill">${escapeHtml(district.name)}</span>` : ''}
          <span class="pill">${districtList.length} bağlantı</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary" data-action="save-place-content" data-route-key="${escapeAttr(routeKey)}" type="button">Sayfa içeriğini kaydet</button>
        </div>
      </form>
    </details>
  `;
}

function renderCustomPageEditor(page, categories) {
  const images = Array.isArray(page.images) ? page.images : [];
  return `
    <details class="step" open>
      <summary style="cursor:pointer; font-family: var(--font-title);">Sayfa düzenle</summary>
      <form class="builder-steps" data-custom-page-form data-page-id="${escapeAttr(page.id)}">
        <div class="split">
          <label><span class="filter-label">Başlık</span><input class="input" name="title" value="${escapeAttr(page.title)}"></label>
          <label><span class="filter-label">Kategori</span>
            <select class="select" name="categorySlug">
              ${categories.map((category) => `<option value="${escapeAttr(category.slug)}" ${page.categorySlug === category.slug ? 'selected' : ''}>${escapeHtml(category.label)}</option>`).join('')}
            </select>
          </label>
          <label><span class="filter-label">Adres (slug)</span><input class="input" name="slug" value="${escapeAttr(page.slug)}" placeholder="ornek-sayfa"></label>
        </div>
        <div class="split">
          <label><span class="filter-label">Özet</span><textarea class="textarea" name="summary" rows="3">${escapeHtml(page.summary || '')}</textarea></label>
          <label><span class="filter-label">İçerik metni</span><textarea class="textarea" name="body" rows="6">${escapeHtml(page.body || '')}</textarea></label>
        </div>
        <div class="split">
          ${[0, 1, 2, 3].map((index) => `
            <label><span class="filter-label">Görsel ${index + 1} URL</span><input class="input" name="image-${index}" value="${escapeAttr(images[index] || '')}" placeholder="https://..."></label>
          `).join('')}
        </div>
        <label class="card-actions" style="align-items:center;">
          <input type="checkbox" name="published" ${page.published !== false ? 'checked' : ''}> Yayında
        </label>
        <div class="card-actions">
          <button class="btn btn-primary" data-action="save-custom-page" type="button">Sayfayı kaydet</button>
          <button class="btn" data-action="delete-custom-page" data-page-id="${escapeAttr(page.id)}" type="button">Sil</button>
          <a class="btn" href="/kategori/${escapeAttr(page.categorySlug)}/${escapeAttr(page.slug)}" target="_blank" rel="noopener">Sayfayı görüntüle</a>
        </div>
      </form>
    </details>
  `;
}

function setPath(object, path, value) {
  const keys = String(path || '').split('.');
  const last = keys.pop();
  let cursor = object;
  for (const key of keys) {
    if (!cursor[key] || typeof cursor[key] !== 'object') {
      cursor[key] = Number.isInteger(Number(key)) ? [] : {};
    }
    cursor = cursor[key];
  }
  cursor[last] = value;
}

function fetchJSON(url) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Veri yüklenemedi: ${url}`);
    return res.json();
  });
}

function buildLocationData() {
  const provinceMap = new Map();
  for (const row of data.locations) {
    const region = normalizeRegion(row.bolge);
    const provinceSlug = slugify(row.il);
    const districtSlug = slugify(row.ilce);
    if (!provinceMap.has(provinceSlug)) {
      provinceMap.set(provinceSlug, {
        name: row.il,
        slug: provinceSlug,
        region,
        plate: row.plaka,
        districts: [],
      });
    }
    provinceMap.get(provinceSlug).districts.push({
      name: row.ilce,
      slug: districtSlug,
      region,
      plate: row.plaka,
      id: row.id,
      status: state.districtStatus[`${provinceSlug}/${districtSlug}`] ?? true,
    });
  }

  data.provinces = [...provinceMap.values()].map((province) => ({
    ...province,
    status: state.provinceStatus[province.slug] ?? true,
  }));
  data.provinceMap = provinceMap;
  data.districtsByProvince = new Map(data.provinces.map((province) => [province.slug, province.districts]));
}

function buildGeneratedTours() {
  const baseTours = [
    {
      id: 'istanbul-classic',
      title: { tr: 'İstanbul Klasik Şehir Turu', en: 'Istanbul Classic City Tour', ru: 'Классический тур по Стамбулу' },
      city: 'İstanbul',
      provinceSlug: 'istanbul',
      collection: 'turkiye-turlari',
      type: 'sehir',
      price: 12490,
      nights: '2 Gece 3 Gün',
      transport: ['Hava', 'Kara'],
      tags: ['şehir', 'kültür', 'aile'],
      badge: 'VIP',
      summary: 'Tarihi yarımada, boğaz hattı, müze durakları ve seçkin restoranlarla zenginleşen kısa şehir kaçamağı.',
    },
    {
      id: 'antalya-coast',
      title: { tr: 'Antalya Kıyı Kaçamağı', en: 'Antalya Coast Escape', ru: 'Побег на побережье Анталии' },
      city: 'Antalya',
      provinceSlug: 'antalya',
      collection: 'mavi-turlar',
      type: 'deniz',
      price: 16490,
      nights: '4 Gece 5 Gün',
      transport: ['Hava', 'Kara'],
      tags: ['deniz', 'aile', 'balayı'],
      badge: 'Mavi',
      summary: 'Koylar, yat limanı, sahil otelleri ve denize yakın deneyimlerle güçlü bir yaz rotası.',
    },
    {
      id: 'cappadocia-balloon',
      title: { tr: 'Kapadokya Balon ve Vadi Turu', en: 'Cappadocia Balloon and Valley Tour', ru: 'Каппадокия: воздушные шары и долины' },
      city: 'Nevşehir',
      provinceSlug: 'nevsehir',
      collection: 'paket-turlar',
      type: 'kultur',
      price: 13990,
      nights: '2 Gece 3 Gün',
      transport: ['Hava', 'Kara'],
      tags: ['kültür', 'balayı', 'doga'],
      badge: 'Iconic',
      summary: 'Balon uçuşu, yer altı şehirleri ve kaya otelleriyle ikonik bir deneyim.',
    },
    {
      id: 'ege-gastro',
      title: { tr: 'Ege Gastronomi Rotası', en: 'Aegean Gastronomy Route', ru: 'Гастрономический маршрут Эгейского региона' },
      city: 'İzmir',
      provinceSlug: 'izmir',
      collection: 'grup-turlari',
      type: 'alisveris',
      price: 10990,
      nights: '3 Gece 4 Gün',
      transport: ['Kara'],
      tags: ['alışveriş', 'şehir', 'kültür'],
      badge: 'Taste',
      summary: 'Butik sokaklar, pazarlar ve sahil kasabaları ile gurme ağırlıklı grup programı.',
    },
  ];

  const generated = data.provinces.flatMap((province) => {
    const copy = regionCopy[province.region] || regionCopy.Marmara;
    const topDistrict = province.districts[0]?.name || 'Merkez';
    const secondDistrict = province.districts[1]?.name || province.districts[0]?.name || 'Merkez';
    const slug = province.slug;
    const regionType = regionTourType(province.region);
    return [
      {
        id: `${slug}-discover`,
        title: { tr: `${province.name} Keşif Turu`, en: `${province.name} Discovery Tour`, ru: `${province.name} ознакомительный тур` },
        city: province.name,
        provinceSlug: slug,
        districtSlug: slugify(topDistrict),
        collection: provinceCollectionByRegion(province.region),
        type: regionType,
        price: 7990 + province.plate * 95,
        nights: '1 Gece 2 Gün',
        transport: ['Kara', 'Hava'],
        tags: regionTags(province.region),
        badge: province.region,
        summary: `${province.name} için ${copy.tag.toLowerCase()} odağında, ${topDistrict} ve ${secondDistrict} çevresini kapsayan yerel deneyim rotası.`,
      },
      {
        id: `${slug}-tailor`,
        title: { tr: `${province.name} Tailor-Made Programı`, en: `${province.name} Tailor-Made Program`, ru: `${province.name} tailor-made программа` },
        city: province.name,
        provinceSlug: slug,
        districtSlug: slugify(secondDistrict),
        collection: 'paket-turlar',
        type: 'diger',
        price: 11990 + province.plate * 120,
        nights: 'Esnek',
        transport: ['Hava', 'Kara'],
        tags: ['tailor-made', 'özel', 'aile'],
        badge: 'Custom',
        summary: `${province.name} içinde birden fazla ilçe ve tema birleştirilerek oluşturulan esnek seyahat paketi.`,
      }
    ];
  });

  data.tours = [...baseTours, ...generated].map((tour) => ({
    ...tour,
    slug: slugify(tour.title.tr),
  }));

  data.generatedTours = data.tours.filter((tour) => tour.id.includes('discover') || tour.id.includes('tailor'));
  rebuildSearchIndex();
}

function provinceCollectionByRegion(region) {
  if (region === 'Akdeniz') return 'mavi-turlar';
  if (region === 'Karadeniz') return 'grup-turlari';
  if (region === 'Doğu Anadolu') return 'paket-turlar';
  if (region === 'Güneydoğu Anadolu') return 'turkiye-turlari';
  if (region === 'İç Anadolu') return 'paket-turlar';
  if (region === 'Ege') return 'mavi-turlar';
  return 'turkiye-turlari';
}

function regionTourType(region) {
  if (region === 'Akdeniz' || region === 'Ege') return 'deniz';
  if (region === 'Karadeniz') return 'doga';
  if (region === 'Doğu Anadolu') return 'kayak';
  if (region === 'Güneydoğu Anadolu') return 'kultur';
  if (region === 'İç Anadolu') return 'sehir';
  return 'kultur';
}

function normalizeRegion(value) {
  const normalized = normalize(value);
  if (normalized.includes('akdeniz')) return 'Akdeniz';
  if (normalized.includes('ege')) return 'Ege';
  if (normalized.includes('marmara')) return 'Marmara';
  if (normalized.includes('karadeniz')) return 'Karadeniz';
  if (normalized.includes('guneydogu') && normalized.includes('anadolu')) return 'Güneydoğu Anadolu';
  if (normalized.includes('dogu') && normalized.includes('anadolu')) return 'Doğu Anadolu';
  if (normalized.includes('ic') && normalized.includes('anadolu')) return 'İç Anadolu';
  return 'Marmara';
}

function regionTags(region) {
  if (region === 'Akdeniz') return ['deniz', 'balayı', 'aile'];
  if (region === 'Ege') return ['kültür', 'alışveriş', 'şehir'];
  if (region === 'Karadeniz') return ['doğa', 'trekking', 'aile'];
  if (region === 'Doğu Anadolu') return ['kayak', 'doğa', 'kültür'];
  if (region === 'Güneydoğu Anadolu') return ['kültür', 'şehir', 'gastronomi'];
  if (region === 'İç Anadolu') return ['şehir', 'kültür', 'aile'];
  return ['kültür', 'şehir', 'aile'];
}

function rebuildSearchIndex() {
  const items = [];
  for (const province of data.provinces) {
    items.push({
      type: 'province',
      name: province.name,
      slug: `/il/${province.slug}`,
      description: `${province.region} bölgesinde ${province.districts.length} ilçe`,
      keywords: [province.name, province.region, 'il', 'tur', 'tatil', ...province.districts.slice(0, 4).map((d) => d.name)],
    });
    for (const district of province.districts.slice(0, 12)) {
      items.push({
        type: 'district',
        name: `${province.name} / ${district.name}`,
        slug: `/il/${province.slug}/${district.slug}`,
        description: `${province.name} ilçesi, ${province.region}`,
        keywords: [province.name, district.name, province.region, 'ilçe'],
      });
    }
  }
  for (const tour of data.tours) {
    items.push({
      type: 'tour',
      name: tour.title[state.locale] || tour.title.tr,
      slug: `/${tour.collection}`,
      description: `${tour.city} - ${tour.nights} - ${formatMoney(tour.price)}`,
      keywords: [tour.city, tour.type, ...(tour.tags || []), ...Object.values(tour.title)],
    });
  }
  for (const collection of tourCollections) {
    items.push({
      type: 'menu',
      name: collection.title[state.locale] || collection.title.tr,
      slug: `/${collection.slug}`,
      description: 'Tur kategorisi',
      keywords: [collection.slug, collection.title.tr],
    });
  }
  data.searchIndex = items;
}

function bindGlobalEvents() {
  window.addEventListener('popstate', () => {
    hydrateFromUrl();
    render();
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-nav]');
    if (link) {
      event.preventDefault();
      const href = link.getAttribute('href') || '';
      if (href.endsWith('.html')) {
        window.location.href = href;
        return;
      }
      navigate(href);
      return;
    }
    const action = event.target.closest('[data-action]');
    if (!action) return;
    const name = action.dataset.action;
    if (name === 'toggle-search') toggleSearch();
    if (name === 'toggle-theme') cycleTheme();
    if (name === 'set-locale') setLocale(action.dataset.locale);
    if (name === 'add-cart') addToCart(action.dataset.id);
    if (name === 'buy-now') buyNow(action.dataset.id);
    if (name === 'remove-cart') removeFromCart(action.dataset.id);
    if (name === 'clear-cart') clearCart();
    if (name === 'print-pdf') window.print();
    if (name === 'copy-mail') copyMailSummary();
    if (name === 'save-admin') saveAdminFromDom();
    if (name === 'save-user-profile') submitUserProfile();
    if (name === 'apply-theme') applyThemePreset();
    if (name === 'submit-reservation') submitReservation();
    if (name === 'sync-crm') syncCrm();
    if (name === 'login-demo') submitLogin();
    if (name === 'logout') logoutAdmin();
    if (name === 'quick-plan') navigate('/sepet?tailor=1');
    if (name === 'open-admin') navigate('/admin');
    if (name === 'select-theme') setThemePreset(action.dataset.theme);
    if (name === 'set-admin-tab') setAdminTab(action.dataset.tab);
    if (name === 'toggle-widget') toggleWidget(action.dataset.widget);
    if (name === 'toggle-province') toggleProvince(action.dataset.province);
    if (name === 'toggle-district') toggleDistrict(action.dataset.key);
    if (name === 'set-language') setAdminLanguage(action.dataset.locale);
    if (name === 'toggle-publish') togglePublish(action.dataset.key);
    if (name === 'scroll-slider') scrollHomeSlider(Number(action.dataset.direction || 1));
    if (name === 'scroll-place-slider') scrollPlaceSlider(action.dataset.routeKey, Number(action.dataset.direction || 1));
    if (name === 'open-route') navigate(action.dataset.route);
    if (name === 'save-place-content') savePlaceContentFromDom(action).catch((error) => console.error(error));
    if (name === 'toggle-admin-place') toggleAdminPlace(action.dataset.routeKey);
    if (name === 'toggle-admin-page') toggleAdminPage(action.dataset.pageId);
    if (name === 'delete-custom-category') {
      if (confirm('Bu kategori ve içindeki sayfalar silinsin mi?')) deleteCustomCategory(action.dataset.slug);
    }
    if (name === 'toggle-category-menu') toggleCategoryMenu(action.dataset.slug);
    if (name === 'add-custom-page') addCustomPage(action.dataset.category);
    if (name === 'delete-custom-page') {
      if (confirm('Bu sayfa silinsin mi?')) deleteCustomPage(action.dataset.pageId);
    }
    if (name === 'save-custom-page') saveCustomPageFromDom(action);
    if (name === 'rename-media') {
      const mediaId = action.dataset.mediaId;
      const currentName = action.dataset.mediaName || '';
      const nextName = prompt('Yeni medya adı', currentName);
      if (nextName && nextName.trim()) renameMediaItem(mediaId, nextName.trim()).catch((error) => console.error(error));
    }
    if (name === 'delete-media') {
      const mediaId = action.dataset.mediaId;
      const mediaName = action.dataset.mediaName || 'Bu medya';
      if (confirm(`${mediaName} silinsin mi? Slider ve kategori referansları temizlenecek.`)) {
        deleteMediaItem(mediaId).catch((error) => console.error(error));
      }
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.matches('[data-login-form]')) {
      event.preventDefault();
      submitLogin(form);
      return;
    }
    if (form.matches('[data-admin-auth-form]')) {
      event.preventDefault();
      submitAdminAuth(form);
      return;
    }
    if (form.matches('[data-user-form]')) {
      event.preventDefault();
      submitUserProfile(form);
      return;
    }
    if (form.matches('[data-user-reset-form]')) {
      event.preventDefault();
      resetUserPassword(form);
      return;
    }
    if (form.matches('[data-media-upload-form]')) {
      event.preventDefault();
      submitMediaUpload(form);
    }
    if (form.matches('[data-add-category-form]')) {
      event.preventDefault();
      const formData = new FormData(form);
      addCustomCategory(formData.get('categoryName'));
    }
  });

  document.addEventListener('input', (event) => {
    const el = event.target;
    if (!(el instanceof HTMLElement)) return;
    if (el.matches('[data-search]')) {
      searchQuery = el.value;
      renderSearchOverlay(el.value);
    }
    if (el.matches('[data-home-search]')) {
      searchQuery = el.value;
      if (!searchOpen) {
        searchOpen = true;
        render();
        setTimeout(() => document.querySelector('[data-search]')?.focus(), 0);
        return;
      }
      renderSearchOverlay(el.value);
    }
    if (el.matches('[data-router-filter]')) {
      state.routeFilters[el.dataset.routeKey || 'type'] = el.value;
      saveState();
      render();
    }
    if (el.matches('[data-cms-field]')) {
      setPath(state.cms, el.dataset.cmsField, el.value);
      saveState();
    }
    if (el.matches('[data-admin-question]')) {
      updateQuestionField(el.dataset.id, el.dataset.field, el.value);
    }
    if (el.matches('[data-admin-input]')) {
      saveAdminField(el);
    }
    if (el.matches('[data-theme-preset-draft]')) {
      setThemePresetDraft(el.value);
    }
    if (el.matches('[data-user-input]')) {
      saveUserField(el);
    }
    if (el.matches('[data-admin-rich]')) {
      state.cms.adminRich = el.innerHTML;
      saveState();
    }
    if (el.matches('[data-admin-panel-search]')) {
      state.adminPanelSearch = el.value;
      const caret = el.selectionStart;
      render();
      const next = document.querySelector('[data-admin-panel-search]');
      if (next) {
        next.focus();
        try { next.setSelectionRange(caret, caret); } catch (err) { /* noop */ }
      }
    }
    if (el.matches('[data-admin-pages-search]')) {
      state.adminPagesSearch = el.value;
      const caret = el.selectionStart;
      render();
      const next = document.querySelector('[data-admin-pages-search]');
      if (next) {
        next.focus();
        try { next.setSelectionRange(caret, caret); } catch (err) { /* noop */ }
      }
    }
  });

  document.addEventListener('change', (event) => {
    const el = event.target;
    if (!(el instanceof HTMLElement)) return;
    if (el.matches('[data-router-filter]')) {
      state.routeFilters[el.dataset.routeKey || 'type'] = el.value;
      saveState();
      render();
    }
    if (el.matches('[data-admin-input]')) {
      saveAdminField(el);
    }
    if (el.matches('[data-theme-preset-draft]')) {
      setThemePresetDraft(el.value);
    }
    if (el.matches('[data-user-input]')) {
      saveUserField(el);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/') {
      const target = document.querySelector('[data-search], [data-home-search]');
      if (target && document.activeElement !== target) {
        event.preventDefault();
        target.focus();
      }
    }
    if (event.key === 'Escape') closeSearch();
  });

  document.addEventListener('dragstart', (event) => {
    const item = event.target.closest?.('[data-home-order-item]');
    if (!item) return;
    homeOrderDragId = item.dataset.homeSection || null;
    item.classList.add('is-dragging');
    event.dataTransfer?.setData('text/plain', homeOrderDragId || '');
    event.dataTransfer?.setDragImage?.(item, 20, 20);
  });

  document.addEventListener('dragover', (event) => {
    const list = event.target.closest?.('[data-home-order-list]');
    if (!homeOrderDragId || !list) return;
    event.preventDefault();
    const item = event.target.closest?.('[data-home-order-item]');
    if (item) item.classList.add('is-drop-target');
  });

  document.addEventListener('dragleave', (event) => {
    const item = event.target.closest?.('[data-home-order-item]');
    if (item) item.classList.remove('is-drop-target');
  });

  document.addEventListener('drop', (event) => {
    const list = event.target.closest?.('[data-home-order-list]');
    if (!homeOrderDragId || !list) return;
    event.preventDefault();
    const item = event.target.closest?.('[data-home-order-item]');
    if (item?.dataset.homeSection) {
      moveHomeSection(homeOrderDragId, item.dataset.homeSection, 'before');
    } else {
      const order = getHomeSectionOrder().filter((id) => id !== homeOrderDragId);
      order.push(homeOrderDragId);
      setHomeSectionOrder(order);
    }
    clearHomeOrderDragState();
  });

  document.addEventListener('dragend', () => {
    clearHomeOrderDragState();
  });
}

function navigate(url) {
  history.pushState({}, '', url);
  hydrateFromUrl();
  render();
  closeSearch();
}

function hydrateFromUrl() {
  const url = new URL(location.href);
  data.route = parseRoute(url.pathname, url.searchParams);
  searchQuery = url.searchParams.get('search') || searchQuery || '';
  searchOpen = data.route?.kind === 'home' && Boolean(searchQuery);
  state.routeFilters = {};
}

function parseRoute(pathname, params) {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (parts.length === 0) return { kind: 'home' };
  if (parts[0] === 'admin') return { kind: 'admin' };
  if (parts[0] === 'user') return { kind: 'user' };
  if (parts[0] === 'sepet' || parts[0] === 'odeme') return { kind: 'checkout', tailor: params.get('tailor') === '1' };
  if (parts[0] === 'iletisim') return { kind: 'contact' };
  if (parts[0] === 'blog') return { kind: 'blog' };
  if (parts[0] === 'il' && parts[1]) {
    if (parts[2]) return { kind: 'district', provinceSlug: parts[1], districtSlug: parts[2] };
    return { kind: 'province', provinceSlug: parts[1] };
  }
  if (parts[0] === 'kategori' && parts[1]) {
    if (parts[2]) return { kind: 'customPage', categorySlug: parts[1], pageSlug: parts[2] };
    return { kind: 'customCategory', categorySlug: parts[1] };
  }
  const collection = tourCollections.find((item) => item.slug === parts[0]);
  if (collection) return { kind: 'collection', collectionSlug: collection.slug };
  return { kind: 'page', slug: parts[0] };
}

function render() {
  updateDocumentMeta();
  ROOT.innerHTML = `
    ${renderTopbar()}
    ${renderMenuStrip()}
    ${searchOpen ? renderSearchOverlayMarkup() : ''}
    <main class="app-shell">
      ${renderRoute()}
      ${renderFooter()}
    </main>
  `;
  bindRichEditors();
  bindForms();
}

function renderTopbar() {
  const locale = getLocale();
  const t = translations[locale];
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeTheme = getTheme();
  const brand = publishSection('homeBrand') ? cms('brand.title', businessProfile.domain || 'Mytourguide.com.tr') : '';
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="/" data-nav aria-label="My Tour Guide">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>
            <span class="brand-name">${escapeHtml(brand)}</span>
          </span>
        </a>
        <div class="top-actions">
          <button class="icon-btn" data-action="toggle-search" type="button" aria-label="Search">⌕</button>
          <button class="icon-btn theme-toggle" data-action="toggle-theme" type="button" aria-label="${t.theme}">${themeLabel(activeTheme)}</button>
          <button class="icon-btn lang-toggle" data-action="set-locale" data-locale="tr" type="button">TR</button>
          <button class="icon-btn lang-toggle" data-action="set-locale" data-locale="en" type="button">EN</button>
          <button class="icon-btn lang-toggle" data-action="set-locale" data-locale="ru" type="button">RU</button>
          <a class="icon-btn" data-nav href="/sepet" aria-label="${t.cart}">🛒 <span class="badge">${cartCount}</span></a>
          <a class="icon-btn" data-nav href="${isAdminAuthenticated() ? '/admin' : '/login'}" aria-label="${t.login}">${isAdminAuthenticated() ? '⚙' : '👤'}</a>
          <a class="icon-btn" data-nav href="/user" aria-label="${t.user}">☻</a>
        </div>
      </div>
    </header>
  `;
}

function renderMenuStrip() {
  if (!publishSection('homeMenu')) return '';
  const locale = getLocale();
  const customNavItems = (Array.isArray(state.cms.customCategories) ? state.cms.customCategories : [])
    .filter((category) => category.showInMenu !== false);
  return `
    <div class="site-nav-bar">
      <nav class="site-nav" aria-label="Main">
        ${menuItems.map((item) => `<a data-nav href="/${item.slug}" class="${isActiveRoute(`/${item.slug}`) ? 'active' : ''}">${cms(`menu.${item.slug === 'turkiye-turlari' ? 'turkiye' : item.slug === 'mavi-turlar' ? 'mavi' : item.slug === 'grup-turlari' ? 'grup' : item.slug === 'paket-turlar' ? 'paket' : 'yurtdisi'}`, translateKey(locale, item.key))}</a>`).join('')}
        ${customNavItems.map((category) => `<a data-nav href="/kategori/${escapeAttr(category.slug)}" class="${isActiveRoute(`/kategori/${category.slug}`) ? 'active' : ''}">${escapeHtml(category.label)}</a>`).join('')}
      </nav>
    </div>
  `;
}

function renderRoute() {
  switch (data.route?.kind) {
    case 'home':
      return renderHome();
    case 'collection':
      return renderCollectionPage(data.route.collectionSlug);
    case 'province':
      return renderProvincePage(data.route.provinceSlug);
    case 'district':
      return renderDistrictPage(data.route.provinceSlug, data.route.districtSlug);
    case 'customCategory':
      return renderCustomCategoryPage(data.route.categorySlug);
    case 'customPage':
      return renderCustomPage(data.route.categorySlug, data.route.pageSlug);
    case 'checkout':
      return renderCheckoutPage(data.route.tailor);
    case 'admin':
      return isAdminAuthenticated() ? renderAdminPage() : renderLoginPage();
    case 'user':
      return renderUserPage();
    case 'contact':
      return renderContactPage();
    case 'blog':
      return renderBlogPage();
    case 'login':
      return renderLoginPage();
    case 'page':
      return renderGenericPage(data.route.slug);
    default:
      return renderHome();
  }
}

function getHomeSectionOrder() {
  const savedOrder = Array.isArray(state.cms.home?.sectionOrder) ? state.cms.home.sectionOrder : [];
  const fallbackOrder = HOME_SECTION_DEFS.map((item) => item.id);
  return [...new Set([...savedOrder, ...fallbackOrder])].filter((id) => HOME_SECTION_DEFS.some((item) => item.id === id));
}

function setHomeSectionOrder(order) {
  const sanitized = [...new Set(order)].filter((id) => HOME_SECTION_DEFS.some((item) => item.id === id));
  const nextOrder = [...sanitized, ...DEFAULT_HOME_SECTION_ORDER.filter((id) => !sanitized.includes(id))];
  state.cms.home.sectionOrder = nextOrder;
  backendConfig.public.home.sectionOrder = nextOrder;
  saveState();
  saveBackendConfig({
    action: 'updateHomeOrder',
    sectionOrder: nextOrder,
  }).catch((error) => {
    console.error(error);
  });
  render();
}

function moveHomeSection(draggedId, targetId, position = 'before') {
  const order = getHomeSectionOrder();
  const fromIndex = order.indexOf(draggedId);
  const targetIndex = order.indexOf(targetId);
  if (fromIndex === -1 || targetIndex === -1 || fromIndex === targetIndex) return;
  order.splice(fromIndex, 1);
  const adjustedTargetIndex = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
  const insertIndex = position === 'after' ? adjustedTargetIndex + 1 : adjustedTargetIndex;
  order.splice(insertIndex, 0, draggedId);
  setHomeSectionOrder(order);
}

function clearHomeOrderDragState() {
  homeOrderDragId = null;
  document.querySelectorAll('[data-home-order-item]').forEach((item) => {
    item.classList.remove('is-dragging', 'is-drop-target');
  });
}

function renderHomeSection(sectionId, { locale, t, slides, categories }) {
  switch (sectionId) {
    case 'homeSearch':
      return publishSection('homeSearch') ? `
        <section class="home-search-strip glass-card">
          <div class="home-search-copy">
            <div class="eyebrow">${cms('home.searchTitle', 'Türkiye genelinde il, ilçe veya tur arayın')}</div>
            <p>${cms('home.searchCopy', 'Arama, kategori ve hızlı bağlantılar tek satırda çalışır.')}</p>
          </div>
          <div class="home-search-row">
            <input class="search-input" data-home-search value="${escapeAttr(searchQuery)}" placeholder="${cms('home.searchPlaceholder', t.searchPlaceholder)}" autocomplete="off">
            <button class="btn btn-primary" data-action="toggle-search" type="button">Ara</button>
          </div>
        </section>
      ` : '';
    case 'homeSlider':
      return publishSection('homeSlider') ? `
        <section class="home-section">
          <div class="section-header">
            <div>
              <div class="eyebrow">Vitrin</div>
              <h2 class="section-title">${cms('home.sliderTitle', 'Seçili rotalar')}</h2>
            </div>
            <div class="toolbar">
              <button class="btn" data-action="scroll-slider" data-direction="-1" type="button">←</button>
              <button class="btn" data-action="scroll-slider" data-direction="1" type="button">→</button>
            </div>
          </div>
          <div class="home-slider" data-home-slider>
            ${slides.map(renderHomeSlideCard).join('')}
          </div>
        </section>
      ` : '';
    case 'homeCategories':
      return publishSection('homeCategories') ? `
        <section class="home-section">
          <div class="section-header">
            <div>
              <div class="eyebrow">Kategoriler</div>
              <h2 class="section-title">${cms('home.categoriesTitle', 'Tur kategorileri')}</h2>
            </div>
          </div>
          <div class="category-grid">
            ${categories.map(renderHomeCategoryCard).join('')}
          </div>
        </section>
      ` : '';
    case 'homeStats':
      return publishSection('homeStats') ? `<section class="kpi-grid">
        <article class="stat-card"><div class="value">${data.tours.length}</div><div class="label">${t.statsTours}</div></article>
        <article class="stat-card"><div class="value">${data.provinces.length}</div><div class="label">${t.statsCities}</div></article>
        <article class="stat-card"><div class="value">${data.locations.length}</div><div class="label">${t.statsDistricts}</div></article>
        <article class="stat-card"><div class="value">${state.activeWidgets.length}</div><div class="label">${t.statsWidgets}</div></article>
      </section>` : '';
    case 'homeProvinces':
      return publishSection('homeProvinces') ? `
        <section class="home-section">
          <div class="section-header">
            <div>
              <div class="eyebrow">İller</div>
              <h2 class="section-title">${cms('home.provincesTitle', 'İl sayfaları')}</h2>
            </div>
            <a class="btn" data-nav href="/il/istanbul">Tüm iller</a>
          </div>
          <div class="grid-cards">
            ${data.provinces.filter((province) => province.status).slice(0, 6).map(renderProvincePreviewCard).join('')}
          </div>
        </section>
      ` : '';
    case 'homeFeatured':
      return publishSection('homeFeatured') ? `<section class="home-section">
        <div class="section-header">
          <div>
            <div class="eyebrow">${t.featured}</div>
            <h2 class="section-title">${cms('home.featuredTitle', t.categories)}</h2>
          </div>
          <a class="btn" data-nav href="/turkiye-turlari">${t.view}</a>
        </div>
        <div class="grid-cards">${renderTourCards(data.tours.filter(isFeaturedTour).slice(0, 6))}</div>
      </section>` : '';
    case 'homeTailor':
      return publishSection('homeTailor') ? `<section class="home-section">
        <div class="section-header">
          <div>
            <div class="eyebrow">${t.tailor}</div>
            <h2 class="section-title">${cms('home.tailorTitle', 'Birden fazla ili ve tarihi tek siparişte birleştirin')}</h2>
          </div>
        </div>
        <div class="page-layout">
          <aside class="sidebar glass-card">
            <h3>${cms('home.workflowTitle', 'İş akışı')}</h3>
            <div class="stack">
              <div class="list-item"><strong>1. Arama</strong><small>İl, ilçe, tur, tema</small></div>
              <div class="list-item"><strong>2. Sepet</strong><small>Aynı müşteride birleştirme</small></div>
              <div class="list-item"><strong>3. Rezervasyon</strong><small>PDF özeti ve mail akışı</small></div>
              <div class="list-item"><strong>4. Admin</strong><small>Sayfa, widget, soru yönetimi</small></div>
            </div>
          </aside>
          <div class="content-area">
            <article class="panel glass-card">
              <h3>SEO ve güvenlik altyapısı</h3>
              <div class="split">
                <div>
                  <p>${cms('home.seoCopy', 'Sayfa başlıkları, açıklamalar, keyword alanları, JSON-LD, canonical link ve dinamik meta alanları hazırdır.')}</p>
                  <p>${cms('home.securityCopy', 'Form alanları doğrulama, maskeleme, KVKK onayı, 3D Secure yönlendirme ve rate-limit entegrasyonu için ayrılmıştır.')}</p>
                </div>
                <div>
                  <p>${cms('home.cloudCopy', 'Cloudflare Pages, CDN, WAF, bot management ve edge cache ile yayın için uygundur.')}</p>
                  <p>${cms('home.adminCopy', 'Admin paneli ile tema, dil, widget ve içerik açık/kapalı durumu yönetilebilir.')}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>` : '';
    case 'homeSeo':
      return publishSection('homeSeo') ? `<section class="home-section">
        <div class="section-header">
          <div>
            <div class="eyebrow">${cms('home.seoTitle', t.seo)}</div>
            <h2 class="section-title">SEO, güvenlik ve yayın düzeni</h2>
          </div>
        </div>
        <div class="grid-cards">
          <article class="panel glass-card">
            <h3>Meta ve keyword</h3>
            <p>${cms('home.seoCopy', 'Sayfa başlıkları, açıklamalar, keyword alanları, JSON-LD, canonical link ve dinamik meta alanları hazırdır.')}</p>
          </article>
          <article class="panel glass-card">
            <h3>KVKK ve ödeme</h3>
            <p>${cms('home.securityCopy', 'Form alanları doğrulama, maskeleme, KVKK onayı, 3D Secure yönlendirme ve rate-limit entegrasyonu için ayrılmıştır.')}</p>
          </article>
          <article class="panel glass-card">
            <h3>Cloudflare yayın</h3>
            <p>${cms('home.cloudCopy', 'Cloudflare Pages, CDN, WAF, bot management ve edge cache ile yayın için uygundur.')}</p>
          </article>
        </div>
      </section>` : '';
    default:
      return '';
  }
}

function renderHome() {
  const locale = getLocale();
  const t = translations[locale];
  const slides = Array.isArray(state.cms.home?.slides) ? state.cms.home.slides : [];
  const categories = Array.isArray(state.cms.home?.categories) ? state.cms.home.categories : [];
  const order = getHomeSectionOrder();
  return `
    <section class="home-shell">
      ${order.map((sectionId) => renderHomeSection(sectionId, { locale, t, slides, categories })).join('')}
    </section>
  `;
}

function isFeaturedTour(tour) {
  return ['istanbul-classic', 'antalya-coast', 'cappadocia-balloon', 'ege-gastro'].includes(tour.id) || tour.id.endsWith('-discover');
}

function renderProvincePreviewCard(province) {
  const copy = regionCopy[province.region] || regionCopy.Marmara;
  return `
    <article class="province-card">
      <div class="body">
        <div class="eyebrow">${province.region}</div>
        <h3>${province.name}</h3>
        <p>${copy.intro}</p>
        <div class="meta-row"><span class="pill">${province.districts.length} ilçe</span><span class="pill">Plaka ${province.plate}</span></div>
        <div class="card-actions">
          <a class="btn btn-primary" data-nav href="/il/${province.slug}">İl sayfası</a>
          <a class="btn" data-nav href="/il/${province.slug}/${province.districts[0]?.slug || 'merkez'}">İlk ilçe</a>
        </div>
      </div>
    </article>
  `;
}

function renderCollectionPage(collectionSlug) {
  const locale = getLocale();
  const collection = tourCollections.find((item) => item.slug === collectionSlug);
  const title = collection?.title[locale] || collection?.title.tr || collectionSlug;
  const filteredTours = data.tours.filter((tour) => tour.collection === collectionSlug);
  return renderCataloguePage({
    title,
    eyebrow: translate(locale, `menu.${collectionSlug === 'turkiye-turlari' ? 'turkiye' : collectionSlug === 'mavi-turlar' ? 'mavi' : collectionSlug === 'grup-turlari' ? 'grup' : collectionSlug === 'paket-turlar' ? 'paket' : 'yurtdisi'}`),
    description: `Bu sayfada ${title.toLowerCase()} için filtreleme, il seçimi ve sepete ekleme akışı bulunur.`,
    banner: `var(--banner-${collectionSlug})`,
    tours: filteredTours,
    scope: collectionSlug,
  });
}

function renderProvincePage(provinceSlug) {
  const province = data.provinceMap.get(provinceSlug);
  if (!province) return renderNotFound('İl bulunamadı');
  const locale = getLocale();
  const copy = regionCopy[province.region] || regionCopy.Marmara;
  const tours = data.tours.filter((tour) => tour.provinceSlug === provinceSlug);
  const districtList = data.districtsByProvince.get(provinceSlug) || [];
  const filters = state.routeFilters;
  const filteredTours = tours.filter((tour) => matchProvinceFilters(tour, province, filters));
  const routeKey = getPlaceRouteKey('province', provinceSlug);
  const content = getPlaceContent(routeKey);
  const title = content.title || province.name;
  const summary = content.summary || copy.intro;
  const facts = content.facts || buildPlaceFacts({ province, district: null, districtList });
  const slides = resolvePlaceSlides(content.slides, getPlaceGallery(routeKey));
  if (slides.length < 4 && !data.placeGalleries.has(routeKey)) {
    ensurePlaceGallery(routeKey, province.name, province.name);
  }
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, ${copy.accent}, #0b1220)">
        <div class="hero-copy">
          <div class="eyebrow">${province.region}</div>
          <h1 class="page-title">${escapeHtml(title)}</h1>
          <p>${escapeHtml(summary)}</p>
          <div class="meta-row">
            <span class="pill">${districtList.length} ${translations[locale].districts}</span>
            <span class="pill">SEO keyword: ${province.name} turu</span>
            <span class="pill">${province.status ? translations[locale].active : translations[locale].passive}</span>
          </div>
        </div>
      </div>
      ${renderRouteSearchStrip()}
      ${renderPlaceGallery(slides, { loading: !content.slides?.length && !data.placeGalleries.has(routeKey), routeKey, title: `${province.name} görsel galerisi` })}
      <div class="page-layout">
        <aside class="sticky-stack">
          <section class="sidebar glass-card">
            <h3>${translations[locale].filters}</h3>
            <div class="filter-group">
              <label><span class="filter-label">İl</span><input class="input" value="${province.name}" readonly></label>
              <label><span class="filter-label">İlçe</span>
                <select class="select" data-router-filter data-route-key="district">
                  <option value="">Tüm ilçeler</option>
                  ${districtList.map((district) => `<option value="${district.slug}" ${filters.district === district.slug ? 'selected' : ''}>${district.name}</option>`).join('')}
                </select>
              </label>
              <label><span class="filter-label">Tur tipi</span>
                <select class="select" data-router-filter data-route-key="type">
                  <option value="">Tüm turlar</option>
                  ${tourTypes.map((item) => `<option value="${item.slug}" ${filters.type === item.slug ? 'selected' : ''}>${translate(locale, item.key)}</option>`).join('')}
                </select>
              </label>
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>${translations[locale].districts}</h3>
            <div class="list">
              ${districtList.map((district) => `
                <a class="list-item" data-nav href="/il/${province.slug}/${district.slug}">
                  <strong>${district.name}</strong>
                  <small>${district.status ? translations[locale].active : translations[locale].passive}</small>
                </a>
              `).join('')}
            </div>
          </section>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <div class="section-header">
              <div>
                <div class="eyebrow">Banner</div>
                <h2 class="section-title">${escapeHtml(title)} için yayınlanan turlar</h2>
              </div>
              <div class="toolbar">
                <a class="btn btn-primary" data-nav href="/sepet?tailor=1">${translations[locale].combine}</a>
                <button class="btn" data-action="toggle-search" type="button">Ara</button>
              </div>
            </div>
            <div class="grid-cards">${renderTourCards(filteredTours)}</div>
          </article>
          ${renderPlaceFactsSection({ routeKey, title, summary, facts, province, district: null, districtList })}
        </section>
      </div>
    </section>
  `;
}

function renderDistrictPage(provinceSlug, districtSlug) {
  const province = data.provinceMap.get(provinceSlug);
  const district = (data.districtsByProvince.get(provinceSlug) || []).find((item) => item.slug === districtSlug);
  if (!province || !district) return renderNotFound('İlçe bulunamadı');
  const locale = getLocale();
  const tours = data.tours.filter((tour) => tour.provinceSlug === provinceSlug && (tour.districtSlug === districtSlug || tour.id.includes(provinceSlug)));
  const filters = state.routeFilters;
  const filteredTours = tours.filter((tour) => !filters.type || tour.type === filters.type);
  const copy = regionCopy[province.region] || regionCopy.Marmara;
  const routeKey = getPlaceRouteKey('district', provinceSlug, districtSlug);
  const content = getPlaceContent(routeKey);
  const title = content.title || district.name;
  const summary = content.summary || `${province.name} ilinin ${district.name} ilçesi için açılmış hazır görünüm. Tailor-made, filtre ve sepet akışları aktif.`;
  const facts = content.facts || buildPlaceFacts({ province, district, districtList: data.districtsByProvince.get(provinceSlug) || [] });
  const slides = resolvePlaceSlides(content.slides, getPlaceGallery(routeKey));
  if (slides.length < 4 && !data.placeGalleries.has(routeKey)) {
    ensurePlaceGallery(routeKey, district.name, province.name, district.name);
  }
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, ${copy.accent}, #0b1220)">
        <div class="hero-copy">
          <div class="eyebrow">${province.name}</div>
          <h1 class="page-title">${escapeHtml(title)}</h1>
          <p>${escapeHtml(summary)}</p>
          <div class="meta-row">
            <span class="pill">${province.region}</span>
            <span class="pill">Plaka ${province.plate}</span>
            <span class="pill">${district.status ? translations[locale].active : translations[locale].passive}</span>
          </div>
        </div>
      </div>
      ${renderRouteSearchStrip()}
      ${renderPlaceGallery(slides, { loading: !content.slides?.length && !data.placeGalleries.has(routeKey), routeKey, title: `${province.name} / ${district.name} görsel galerisi` })}
      <div class="page-layout">
        <aside class="sticky-stack">
          <section class="sidebar glass-card">
            <h3>${translations[locale].filters}</h3>
            <div class="filter-group">
              <label><span class="filter-label">İl</span><input class="input" value="${province.name}" readonly></label>
              <label><span class="filter-label">İlçe</span><input class="input" value="${district.name}" readonly></label>
              <label><span class="filter-label">Tur tipi</span>
                <select class="select" data-router-filter data-route-key="type">
                  <option value="">Tüm turlar</option>
                  ${tourTypes.map((item) => `<option value="${item.slug}" ${filters.type === item.slug ? 'selected' : ''}>${translate(locale, item.key)}</option>`).join('')}
                </select>
              </label>
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>İlçe listesi</h3>
            <div class="list">
              ${ (data.districtsByProvince.get(provinceSlug) || []).map((item) => `
                <a class="list-item" data-nav href="/il/${province.slug}/${item.slug}">
                  <strong>${item.name}</strong>
                  <small>${item.slug === district.slug ? 'Aktif' : 'İlçe sayfası'}</small>
                </a>
              `).join('')}
            </div>
          </section>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <div class="section-header">
              <div>
                <div class="eyebrow">Hazır içerik</div>
                <h2 class="section-title">${escapeHtml(title)} turları</h2>
              </div>
              <a class="btn btn-primary" data-nav href="/sepet?tailor=1">${translations[locale].addCart}</a>
            </div>
            <div class="grid-cards">${renderTourCards(filteredTours)}</div>
          </article>
          ${renderPlaceFactsSection({ routeKey, title, summary, facts, province, district, districtList: data.districtsByProvince.get(provinceSlug) || [] })}
        </section>
      </div>
    </section>
  `;
}

function renderCataloguePage({ title, eyebrow, description, tours, scope }) {
  const locale = getLocale();
  const filters = state.routeFilters;
  const filteredTours = tours.filter((tour) => matchCatalogueFilters(tour, filters));
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, #2b72ff, #1dd8c5)">
        <div class="hero-copy">
          <div class="eyebrow">${eyebrow}</div>
          <h1 class="page-title">${title}</h1>
          <p>${description}</p>
          <div class="meta-row">
            <span class="pill">Collection</span>
            <span class="pill">${scope}</span>
            <span class="pill">${translations[locale].searchPlaceholder}</span>
          </div>
        </div>
      </div>
      <div class="page-layout">
        <aside class="sticky-stack">
          <section class="sidebar glass-card">
            <h3>${translations[locale].filters}</h3>
            <div class="filter-group">
              <label><span class="filter-label">İl seçin</span><input class="input" data-router-filter data-route-key="province" value="${escapeAttr(filters.province || '')}" placeholder="İstanbul, Antalya, Ankara"></label>
              <label><span class="filter-label">İlçe seçin</span><input class="input" data-router-filter data-route-key="district" value="${escapeAttr(filters.district || '')}" placeholder="Beşiktaş, Konyaaltı, Çankaya"></label>
              <label><span class="filter-label">Tur tipi</span>
                <select class="select" data-router-filter data-route-key="type">
                  <option value="">Tüm kategoriler</option>
                  ${tourTypes.map((item) => `<option value="${item.slug}" ${filters.type === item.slug ? 'selected' : ''}>${translate(locale, item.key)}</option>`).join('')}
                </select>
              </label>
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>${translations[locale].seo}</h3>
            <div class="list">
              <div class="list-item"><strong>Meta keywords</strong><small>Otomatik üretim</small></div>
              <div class="list-item"><strong>JSON-LD</strong><small>Schema.org</small></div>
              <div class="list-item"><strong>Canonical</strong><small>Her sayfada</small></div>
            </div>
          </section>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <div class="section-header">
              <div>
                <div class="eyebrow">Arama sonuçları</div>
                <h2 class="section-title">${title}</h2>
              </div>
              <button class="btn btn-primary" data-action="toggle-search" type="button">Ara</button>
            </div>
            <div class="grid-cards">${renderTourCards(filteredTours)}</div>
          </article>
        </section>
      </div>
    </section>
  `;
}

function renderCheckoutPage(tailorMode) {
  const locale = getLocale();
  const t = translations[locale];
  const cartItems = state.cart.map((item) => {
    const tour = data.tours.find((row) => row.id === item.id);
    return { ...item, tour };
  });
  const subtotal = cartItems.reduce((sum, item) => sum + (item.tour?.price || 0) * item.quantity, 0);
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, #18c9c0, #636dff)">
        <div class="hero-copy">
          <div class="eyebrow">Checkout</div>
          <h1 class="page-title">${tailorMode ? 'Tailor-made rezervasyon' : 'Sepet ve ödeme'}</h1>
          <p>Farklı illerdeki turları birleştir, tarih seçimini yap, ulaşımı belirle ve rezervasyon özeti oluştur.</p>
        </div>
      </div>
      <div class="page-layout">
        <aside class="sticky-stack">
          <section class="sidebar glass-card">
            <h3>Sepet</h3>
            <div class="list">
              ${cartItems.length ? cartItems.map((item) => `
                <div class="list-item">
                  <div>
                    <strong>${item.tour?.title[state.locale] || item.tour?.title.tr}</strong>
                    <small>${item.quantity} x ${formatMoney(item.tour?.price || 0)}</small>
                  </div>
                  <button class="btn" data-action="remove-cart" data-id="${item.id}" type="button">-</button>
                </div>
              `).join('') : '<div class="list-item"><strong>Sepet boş</strong><small>Tour ekleyin</small></div>'}
            </div>
            <div class="meta-row"><span class="pill">Toplam ${formatMoney(subtotal)}</span></div>
            <div class="card-actions">
              <button class="btn btn-primary" data-action="print-pdf" type="button">${t.pdf}</button>
              <button class="btn" data-action="copy-mail" type="button">${t.send}</button>
              <button class="btn btn-danger" data-action="clear-cart" type="button">Temizle</button>
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>Tailor-made soru seti</h3>
            <div class="list">
              ${state.selectedQuestions.map((q) => `
                <div class="list-item"><strong>${q.label}</strong><small>${q.options.join(' / ')}</small></div>
              `).join('')}
            </div>
          </section>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <h3>Rezervasyon formu</h3>
            <div class="split">
              <label><span class="filter-label">Ad Soyad</span><input class="input" data-admin-input data-admin-field="name" placeholder="Ad Soyad"></label>
              <label><span class="filter-label">E-posta</span><input class="input" data-admin-input data-admin-field="email" type="email" placeholder="mail@domain.com"></label>
              <label><span class="filter-label">Telefon</span><input class="input" data-admin-input data-admin-field="phone" placeholder="+90 ..."></label>
              <label><span class="filter-label">Tarih</span><input class="input" type="date" data-admin-input data-admin-field="date"></label>
              <label><span class="filter-label">${t.transport}</span>
                <select class="select" data-admin-input data-admin-field="transport">
                  <option>Hava</option><option>Kara</option>
                </select>
              </label>
              <label><span class="filter-label">Kendi ulaşımım</span>
                <select class="select" data-admin-input data-admin-field="selfTransport">
                  <option>Ben kendim ayarlayacağım</option><option>Siz sağlayın</option>
                </select>
              </label>
            </div>
            <div class="builder-steps">
              <div class="step">
                <h4>PDF özeti ve mail yönlendirme</h4>
                <p>Bu draft, şirket logosu ve iletişim bilgileriyle printable bir özet üretir. Sunucu tarafında bir mail servisi bağlandığında rezervation@mytourguide.com.tr adresine otomatik gönderilebilir.</p>
                <div class="card-actions">
                  <button class="btn btn-primary" data-action="print-pdf" type="button">${t.pdf}</button>
                  <a class="btn" href="mailto:${businessProfile.email}?subject=Tailor-made%20Reservation&body=Rezervasyon%20özeti%20hazır." target="_blank" rel="noreferrer">${t.send}</a>
                </div>
              </div>
              <div class="step">
                <h4>Ödeme</h4>
                <div class="split">
                  <label><span class="filter-label">Kart üzerindeki ad</span><input class="input" placeholder="Kart sahibi"></label>
                  <label><span class="filter-label">Kart numarası</span><input class="input" inputmode="numeric" placeholder="1234 5678 9012 3456"></label>
                  <label><span class="filter-label">Son kullanma</span><input class="input" placeholder="AA/YY"></label>
                  <label><span class="filter-label">CVV</span><input class="input" inputmode="numeric" placeholder="123"></label>
                </div>
                <p class="meta-row"><span class="pill">3D Secure</span><span class="pill">KVKK</span><span class="pill">PCI-ready UI</span></p>
                <button class="btn btn-primary" data-action="submit-reservation" type="button">Ödeme akışını başlat</button>
              </div>
            </div>
          </article>
          <article class="panel glass-card">
            <h3>Müşteri hesabı</h3>
            <p>İsim, soyisim, TC no, telefon, e-posta, adres ve konaklama adresi bilgileri kayıt aşamasında toplanır.</p>
            <div class="split">
              <label><span class="filter-label">İsim</span><input class="input" data-user-input data-user-field="firstName" placeholder="İsim" value="${escapeAttr(getUserProfile().firstName)}"></label>
              <label><span class="filter-label">Soyisim</span><input class="input" data-user-input data-user-field="lastName" placeholder="Soyisim" value="${escapeAttr(getUserProfile().lastName)}"></label>
              <label><span class="filter-label">TC No</span><input class="input" data-user-input data-user-field="tcNo" inputmode="numeric" maxlength="11" placeholder="11 haneli TC" value="${escapeAttr(getUserProfile().tcNo)}"></label>
              <label><span class="filter-label">Telefon</span><input class="input" data-user-input data-user-field="phone" placeholder="+90 ..." value="${escapeAttr(getUserProfile().phone)}"></label>
              <label><span class="filter-label">E-posta</span><input class="input" data-user-input data-user-field="email" type="email" placeholder="mail@domain.com" value="${escapeAttr(getUserProfile().email)}"></label>
              <label><span class="filter-label">Konaklama adresi</span><input class="input" data-user-input data-user-field="accommodationAddress" placeholder="Otel / apart / adres" value="${escapeAttr(getUserProfile().accommodationAddress)}"></label>
            </div>
            <label><span class="filter-label">Adres</span><textarea class="textarea" data-user-input data-user-field="address" rows="3" placeholder="Fatura veya ikamet adresi">${escapeHtml(getUserProfile().address)}</textarea></label>
            <div class="card-actions">
              <button class="btn btn-primary" data-action="save-user-profile" type="button">Bilgileri kaydet</button>
              <a class="btn" data-nav href="/user">Hesap ekranı</a>
            </div>
          </article>
          <article class="panel glass-card">
            <h3>Not</h3>
            <p>Bu tek dosyalı sürüm, frontend deneyimini tamamlar. Gerçek ödeme, PDF üretimi, CRM aktarımı ve e-posta gönderimi için backend veya serverless fonksiyon katmanı bağlanmalıdır.</p>
          </article>
        </section>
      </div>
    </section>
  `;
}

function renderAdminPage() {
  const locale = getLocale();
  const t = translations[locale];
  const activeTab = state.adminTab || 'account';
  const activeGroup = adminGroups.find((group) => group.id === activeTab);
  const publishCount = Object.values(state.cms.publish || {}).filter(Boolean).length;
  const adminStatus = adminSessionSource === 'backend' ? 'Backend session aktif' : adminSessionSource === 'local' ? 'Yerel oturum aktif' : 'Oturum kapalı';
  const breadcrumb = ['Admin', activeGroup?.label || 'Hesap ve Giriş'];
  const recentTabs = Array.isArray(state.adminRecentTabs) ? state.adminRecentTabs : [];
  const recentGroups = recentTabs
    .map((tab) => adminGroups.find((group) => group.id === tab))
    .filter(Boolean)
    .slice(0, 4);
  const searchNeedle = normalize(state.adminPanelSearch || '');
  const filteredGroups = adminGroups.filter((group) => {
    if (!searchNeedle) return true;
    return normalize(`${group.label} ${group.description} ${group.id}`).includes(searchNeedle);
  });
  return `
    <section class="page admin-shell">
      <div class="page-hero admin-hero" style="--page-gradient: linear-gradient(135deg, #ffcf8a, #8ad7ff)">
        <div class="hero-copy">
          <div class="eyebrow">${t.admin}</div>
          <h1 class="page-title">CMS yönetim merkezi</h1>
          <p>${cms('adminNotes', 'Admin paneldeki tüm alanlar kaydedilebilir; frontend ayarları localStorage üzerinde, oturum ise backend cookie ile tutulur.')}</p>
          <div class="admin-breadcrumb">
            ${breadcrumb.map((item, index) => {
              if (index === breadcrumb.length - 1) return `<span class="admin-breadcrumb-current">${escapeHtml(item)}</span>`;
              if (index === 0) return `<button class="admin-breadcrumb-root" data-action="set-admin-tab" data-tab="account" type="button">${escapeHtml(item)}</button>`;
              return `<span>${escapeHtml(item)}</span>`;
            }).join('<span class="admin-breadcrumb-sep">/</span>')}
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" data-action="logout" type="button">Çıkış yap</button>
            <a class="btn" data-nav href="/">Siteyi aç</a>
            <a class="btn" data-nav href="/login">Giriş ekranı</a>
          </div>
          <div class="admin-hero-strip">
            <div class="admin-hero-chip"><strong>${adminStatus}</strong><small>Oturum</small></div>
            <div class="admin-hero-chip"><strong>${activeGroup?.label || 'Panel'}</strong><small>Aktif bölüm</small></div>
            <div class="admin-hero-chip"><strong>${state.themePreset}</strong><small>Palet</small></div>
            <div class="admin-hero-chip"><strong>${publishCount}</strong><small>Yayınlanan blok</small></div>
          </div>
        </div>
      </div>
      <div class="page-layout admin-layout">
        <aside class="sticky-stack admin-sidebar">
          <section class="sidebar glass-card">
            <div class="admin-brand admin-brand-compact">
              <div class="admin-brand-mark">MT</div>
              <div>
                <strong>My Tour Guide CMS</strong>
                <small>${adminSessionSource === 'backend' ? 'Backend session aktif' : adminSessionSource === 'local' ? 'Yerel oturum aktif' : 'Oturum kapalı'}</small>
              </div>
            </div>
            <div class="admin-rail-note">
              <span>Kontrol paneli</span>
              <strong>${activeGroup?.label || 'Hesap ve Giriş'}</strong>
              <small>${activeGroup?.description || 'Panel bölümü'}</small>
            </div>
            <div class="admin-summary-grid">
              <div class="admin-metric"><strong>${publishCount}</strong><small>Yayın blokları</small></div>
              <div class="admin-metric"><strong>${state.activeWidgets.length}</strong><small>Widget</small></div>
              <div class="admin-metric"><strong>${state.openLanguage.toUpperCase()}</strong><small>Dil</small></div>
              <div class="admin-metric"><strong>${state.themePreset}</strong><small>Tema</small></div>
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>Kontrol menüsü</h3>
            <label class="admin-search">
              <span class="filter-label">Menüde ara</span>
              <input class="input" data-admin-panel-search value="${escapeAttr(state.adminPanelSearch || '')}" placeholder="Hesap, görünüm, yayın...">
            </label>
            <div class="admin-nav-list">
              ${filteredGroups.map((group) => `
                <button class="admin-nav-button ${activeTab === group.id ? 'active' : ''}" data-action="set-admin-tab" data-tab="${group.id}" type="button">
                  <div class="admin-nav-icon" aria-hidden="true">${group.icon || '•'}</div>
                  <div class="admin-nav-copy">
                    <strong>${group.label}</strong>
                    <small>${group.description}</small>
                  </div>
                  <span class="admin-nav-pill">${activeTab === group.id ? 'Açık' : 'Aç'}</span>
                </button>
              `).join('')}
              ${filteredGroups.length ? '' : '<div class="admin-empty-state">Sonuç yok. Farklı bir kelime deneyin.</div>'}
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>Hızlı işlemler</h3>
            <div class="admin-quick-actions">
              <button class="admin-quick-button" data-action="set-admin-tab" data-tab="publish" type="button"><strong>Yayın kontrolü</strong><small>Bölüm görünürlüğü</small></button>
              <button class="admin-quick-button" data-action="set-admin-tab" data-tab="commerce" type="button"><strong>Rezervasyon</strong><small>Ödeme, PDF, CRM</small></button>
              <button class="admin-quick-button" data-action="set-admin-tab" data-tab="security" type="button"><strong>Güvenlik</strong><small>KVKK ve session</small></button>
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>Son açılanlar</h3>
            <div class="admin-recent-list">
              ${recentGroups.length ? recentGroups.map((group) => `
                <button class="admin-recent-item" data-action="set-admin-tab" data-tab="${group.id}" type="button">
                  <span class="admin-nav-icon" aria-hidden="true">${group.icon || '•'}</span>
                  <span>
                    <strong>${group.label}</strong>
                    <small>${group.description}</small>
                  </span>
                </button>
              `).join('') : '<div class="admin-empty-state">Henüz geçmiş yok.</div>'}
            </div>
          </section>
        </aside>
        <section class="content-area admin-content">
          <section class="admin-status-grid">
            <article class="admin-status-card glass-card">
              <span class="eyebrow">Çalışma alanı</span>
              <strong>${activeGroup?.label || 'Hesap ve Giriş'}</strong>
              <p>${activeGroup?.description || 'Aktif admin bölümü.'}</p>
            </article>
            <article class="admin-status-card glass-card">
              <span class="eyebrow">Durum</span>
              <strong>${adminStatus}</strong>
              <p>CMS oturumu ve tema önizlemesi bu panelden yönetilir.</p>
            </article>
            <article class="admin-status-card glass-card">
              <span class="eyebrow">Hızlı erişim</span>
              <strong>${state.themePreset}</strong>
              <p>Açık tonlar, tatil paletleri ve live preview</p>
            </article>
          </section>
          ${renderAdminTab(activeTab)}
        </section>
      </div>
    </section>
  `;
}

function renderContactPage() {
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, #7c8cff, #12d6c5)">
        <div class="hero-copy">
          <div class="eyebrow">İletişim</div>
          <h1 class="page-title">${cms('contact.title', 'Bize ulaşın')}</h1>
          <p>${cms('contact.intro', businessProfile.address)}</p>
        </div>
      </div>
      <div class="page-layout">
        <aside class="sidebar glass-card">
          <h3>İletişim</h3>
          <div class="list">
            <div class="list-item"><strong>Telefon</strong><small>${businessProfile.phone}</small></div>
            <div class="list-item"><strong>Telefon 2</strong><small>${businessProfile.phoneSecondary}</small></div>
            <div class="list-item"><strong>E-posta</strong><small>${businessProfile.email}</small></div>
            <div class="list-item"><strong>Çalışma saatleri</strong><small>${businessProfile.hours}</small></div>
          </div>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <h3>Kurumsal not</h3>
            <p>${cms('contact.corporateNote', 'Şirket sahibi yalnızca gerekli bilgileri girerek sistemi çalışır hale getirebilir; tema, dil, widget, tur ve sayfa içerikleri yönetim panelinden düzenlenebilir.')}</p>
            <div class="meta-row"><span class="pill">KVKK</span><span class="pill">WAF</span><span class="pill">SEO</span><span class="pill">CRM</span></div>
          </article>
        </section>
      </div>
    </section>
  `;
}

function renderBlogPage() {
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, #ffb86b, #7c8cff)">
        <div class="hero-copy">
          <div class="eyebrow">Blog</div>
          <h1 class="page-title">Seyahat rehberi ve içerik alanı</h1>
          <p>Bu bölüm, her içerik türünde zengin metin, görsel ve fiyat bloklarını desteklemek üzere hazırlanmıştır.</p>
        </div>
      </div>
      <div class="grid-cards">
        ${['SEO içerik', 'Tur ipuçları', 'Vize notları', 'Tailor-made rehber'].map((item) => `
          <article class="widget-card">
            <div class="body">
              <div class="eyebrow">Blog</div>
              <h3>${item}</h3>
              <p>Admin panelden açılıp kapatılabilen, zengin metin editörü ile yönetilen içerik kartı.</p>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderLoginPage() {
  const locale = getLocale();
  const t = translations[locale];
  const isLocalHost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, #0d9e9d, #7c8cff)">
        <div class="hero-copy">
          <div class="eyebrow">${cms('login.title', 'Admin Girişi')}</div>
          <h1 class="page-title">${cms('login.title', 'Admin Girişi')}</h1>
          <p>${cms('login.subtitle', 'Yönetim paneli erişimi için kimlik doğrulama.')}</p>
        </div>
      </div>
      <div class="page-layout">
        <section class="content-area">
          <article class="panel glass-card">
            <h3>Giriş yap</h3>
            <form class="builder-steps" data-login-form>
              <label><span class="filter-label">Kullanıcı adı</span><input class="input" name="username" autocomplete="username" placeholder="${escapeAttr(cmsDefaults.auth.username)}"></label>
              <label><span class="filter-label">Parola</span><input class="input" name="password" type="password" autocomplete="current-password" placeholder="Parolanızı girin"></label>
              <div class="card-actions">
                <button class="btn btn-primary" type="submit">Giriş yap</button>
                <a class="btn" data-nav href="/">Ana sayfa</a>
              </div>
              ${isLocalHost ? '<div class="step"><strong>Yerel giriş</strong><p>Varsayılan bilgiler: <code>admin</code> / <code>tour2026</code></p></div>' : ''}
              ${state.adminMessage ? `<div class="step"><strong>Not</strong><p>${escapeHtml(state.adminMessage)}</p></div>` : ''}
            </form>
          </article>
        </section>
      </div>
    </section>
  `;
}

function renderUserPage() {
  const profile = getUserProfile();
  const account = getUserAccount();
  const hasProfile = Boolean(profile.firstName || profile.lastName || profile.email || profile.tcNo);
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, #1dd8c5, #2b72ff)">
        <div class="hero-copy">
          <div class="eyebrow">Kullanıcı</div>
          <h1 class="page-title">Hesap oluşturma ve profil</h1>
          <p>İsim, soyisim, TC no, telefon, e-posta, adres ve konaklama adresi bilgilerini burada topla. Şifre sıfırlama da aynı ekranda yapılır.</p>
        </div>
      </div>
      <div class="page-layout">
        <aside class="sticky-stack">
          <section class="sidebar glass-card">
            <h3>Durum</h3>
            <div class="list">
              <div class="list-item"><strong>Profil</strong><small>${hasProfile ? 'Dolu' : 'Boş'}</small></div>
              <div class="list-item"><strong>E-posta</strong><small>${escapeHtml(profile.email || 'Tanımlı değil')}</small></div>
              <div class="list-item"><strong>Telefon</strong><small>${escapeHtml(profile.phone || 'Tanımlı değil')}</small></div>
            </div>
          </section>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <h3>Kayıt / profil düzenleme</h3>
            <form class="builder-steps" data-user-form>
              <div class="split">
                <label><span class="filter-label">İsim</span><input class="input" name="firstName" autocomplete="given-name" value="${escapeAttr(profile.firstName)}"></label>
                <label><span class="filter-label">Soyisim</span><input class="input" name="lastName" autocomplete="family-name" value="${escapeAttr(profile.lastName)}"></label>
                <label><span class="filter-label">TC No</span><input class="input" name="tcNo" inputmode="numeric" maxlength="11" autocomplete="off" value="${escapeAttr(profile.tcNo)}"></label>
                <label><span class="filter-label">Telefon</span><input class="input" name="phone" autocomplete="tel" value="${escapeAttr(profile.phone)}"></label>
                <label><span class="filter-label">E-posta</span><input class="input" name="email" type="email" autocomplete="email" value="${escapeAttr(profile.email)}"></label>
                <label><span class="filter-label">Konaklama adresi</span><input class="input" name="accommodationAddress" autocomplete="street-address" value="${escapeAttr(profile.accommodationAddress)}"></label>
              </div>
              <label><span class="filter-label">Adres</span><textarea class="textarea" name="address" rows="3" autocomplete="street-address">${escapeHtml(profile.address)}</textarea></label>
              <div class="card-actions">
                <button class="btn btn-primary" type="submit">Profili kaydet</button>
                <a class="btn" data-nav href="/sepet">Rezervasyona git</a>
              </div>
              ${state.userMessage ? `<div class="step"><strong>Not</strong><p>${escapeHtml(state.userMessage)}</p></div>` : ''}
            </form>
          </article>
          <article class="panel glass-card">
            <h3>Şifre sıfırlama</h3>
            <form class="builder-steps" data-user-reset-form>
              <div class="split">
                <label><span class="filter-label">Yeni şifre</span><input class="input" name="password" type="password" autocomplete="new-password" value="${escapeAttr(account.password)}"></label>
                <label><span class="filter-label">Yeni şifre tekrar</span><input class="input" name="passwordConfirm" type="password" autocomplete="new-password"></label>
              </div>
              <div class="card-actions">
                <button class="btn btn-primary" type="submit">Şifreyi sıfırla</button>
              </div>
            </form>
          </article>
        </section>
      </div>
    </section>
  `;
}

function getAllCategories() {
  const builtin = tourCollections.map((item) => ({ slug: item.slug, label: item.title.tr, builtin: true }));
  const custom = Array.isArray(state.cms.customCategories) ? state.cms.customCategories : [];
  return [...builtin, ...custom];
}

function getCustomPagesByCategory(categorySlug) {
  return (Array.isArray(state.cms.customPages) ? state.cms.customPages : [])
    .filter((page) => page.categorySlug === categorySlug);
}

function findCustomPage(categorySlug, pageSlug) {
  return (Array.isArray(state.cms.customPages) ? state.cms.customPages : [])
    .find((page) => page.categorySlug === categorySlug && page.slug === pageSlug);
}

function renderCustomCategoryPage(categorySlug) {
  const category = getAllCategories().find((item) => item.slug === categorySlug);
  if (!category) return renderNotFound('Kategori bulunamadı');
  const admin = isAdminAuthenticated();
  const pages = getCustomPagesByCategory(categorySlug).filter((page) => page.published !== false || admin);
  return `
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, #ffcf8a, #8ad7ff)">
        <div class="hero-copy">
          <div class="eyebrow">Kategori</div>
          <h1 class="page-title">${escapeHtml(category.label)}</h1>
          <p>${pages.length} sayfa bu kategoride ${admin ? 'listeleniyor' : 'yayında'}.</p>
        </div>
      </div>
      <div class="grid-cards">
        ${pages.length ? pages.map(renderCustomPageCard).join('') : '<div class="admin-empty-state">Bu kategoride henüz sayfa yok.</div>'}
      </div>
    </section>
  `;
}

function renderCustomPageCard(page) {
  const cover = (page.images || []).find(Boolean) || '';
  const visualStyle = cover ? ` style="background-image:linear-gradient(180deg, rgba(10,14,24,0.05), rgba(10,14,24,0.55)), url('${escapeAttr(cover)}'); background-size:cover; background-position:center;"` : '';
  return `
    <a class="tour-card" data-nav href="/kategori/${escapeAttr(page.categorySlug)}/${escapeAttr(page.slug)}">
      <div class="tour-visual"${visualStyle} data-badge="${page.published === false ? 'Taslak' : 'Sayfa'}">
        <div>
          <h3>${escapeHtml(page.title)}</h3>
        </div>
      </div>
      <div class="body">
        <p>${escapeHtml(page.summary || '')}</p>
      </div>
    </a>
  `;
}

function renderCustomPage(categorySlug, pageSlug) {
  const page = findCustomPage(categorySlug, pageSlug);
  const admin = isAdminAuthenticated();
  if (!page || (page.published === false && !admin)) return renderNotFound('Sayfa bulunamadı');
  const category = getAllCategories().find((item) => item.slug === categorySlug);
  const images = (page.images || []).filter(Boolean);
  return `
    <section class="page">
      <div class="page-hero">
        <div class="hero-copy">
          <div class="eyebrow">${escapeHtml(category?.label || 'Kategori')}</div>
          <h1 class="page-title">${escapeHtml(page.title)}</h1>
          <p>${escapeHtml(page.summary || '')}</p>
          ${page.published === false ? '<span class="pill">Taslak — yalnızca admin görüyor</span>' : ''}
        </div>
      </div>
      ${images.length ? `
        <section class="place-gallery glass-card">
          <div class="section-header">
            <div>
              <div class="eyebrow">Galeri</div>
              <h2 class="section-title">${escapeHtml(page.title)} görselleri</h2>
            </div>
          </div>
          <div class="place-gallery-track">
            ${images.map((src, index) => `
              <article class="place-gallery-slide">
                <div class="place-gallery-image" style="--cover-image: url('${escapeAttr(src)}')">
                  <div class="place-gallery-index">0${index + 1}</div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      ` : ''}
      <article class="panel glass-card">
        ${page.body ? `<p>${escapeHtml(page.body).replaceAll('\n', '</p><p>')}</p>` : '<p>İçerik henüz eklenmedi.</p>'}
      </article>
    </section>
  `;
}

function renderGenericPage(slug) {
  return `
    <section class="page">
      <div class="page-hero">
        <div class="hero-copy">
          <div class="eyebrow">Sayfa</div>
          <h1 class="page-title">${slug}</h1>
          <p>Bu rota için içerik, admin panelden oluşturulabilir veya yayınlanabilir.</p>
        </div>
      </div>
    </section>
  `;
}

function renderNotFound(message) {
  return `<section class="error-card"><p class="eyebrow">404</p><h1>${message}</h1><p>İçerik bulunamadı.</p><a class="btn btn-primary" data-nav href="/">Ana sayfa</a></section>`;
}

function renderTourCards(tours) {
  const locale = getLocale();
  const list = tours || [];
  if (!list.length) {
    return `
      <article class="tour-card">
        <div class="tour-visual" data-badge="Empty">
          <div>
            <div class="eyebrow">Sonuç yok</div>
            <h3>Filtreler sonucu daralttı</h3>
          </div>
        </div>
        <div class="body">
          <p>Filtreleri gevşeterek daha fazla tur görüntüleyin veya arama kutusunu kullanın.</p>
        </div>
      </article>
    `;
  }
  return list.map((tour) => `
    <article class="tour-card">
      <div class="tour-visual" data-badge="${tour.badge}">
        <div>
          <div class="eyebrow">${tour.city}</div>
          <h3>${tour.title[locale] || tour.title.tr}</h3>
        </div>
        <div class="meta-row">
          <span class="pill">${tour.nights}</span>
          <span class="pill">${formatMoney(tour.price)}</span>
        </div>
      </div>
      <div class="body">
        <p>${tour.summary}</p>
        <div class="meta-row">
          ${tour.tags.map((tag) => `<span class="pill">${tag}</span>`).join('')}
        </div>
        <div class="tour-actions">
          <a class="btn btn-primary" data-nav href="/${tour.collection}">${translations[locale].view}</a>
          <button class="btn" data-action="add-cart" data-id="${tour.id}" type="button">${translations[locale].addCart}</button>
          <button class="btn btn-ghost" data-action="buy-now" data-id="${tour.id}" type="button">${translations[locale].payNow}</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderWidgetStrip() {
  const active = widgetCatalog.filter((widget) => state.activeWidgets.includes(widget.id));
  if (!active.length) {
    return `
      <article class="widget-card">
        <div class="body">
          <div class="eyebrow">Widget</div>
          <h3>Aktif araç yok</h3>
          <p>Admin panelden widgetleri açtığınızda burada listelenecek.</p>
        </div>
      </article>
    `;
  }
  return active.map((widget) => `
    <article class="widget-card">
      <div class="body">
        <div class="eyebrow">Aktif</div>
        <h3>${widget.title}</h3>
        <p>${widget.description}</p>
      </div>
    </article>
  `).join('');
}

function renderHomeSlideCard(slide, index) {
  const item = slide || {};
  return `
    <article class="home-slide">
      <div class="home-slide-cover" style="--cover-image: url('${escapeAttr(resolveMediaSource(item.image || ''))}')">
        <div class="home-slide-index">0${index + 1}</div>
      </div>
      <div class="home-slide-body">
        <div class="eyebrow">${item.eyebrow || 'Mytourguide'}</div>
        <h3>${escapeHtml(item.title || '')}</h3>
        <p>${escapeHtml(item.copy || '')}</p>
        <div class="card-actions">
          <a class="btn btn-primary" data-nav href="${escapeAttr(item.href || '/')}">${escapeHtml(item.cta || 'İncele')}</a>
        </div>
      </div>
    </article>
  `;
}

function renderHomeCategoryCard(category) {
  const item = category || {};
  return `
    <article class="category-card">
      <div class="category-cover" style="--cover-image: url('${escapeAttr(resolveMediaSource(item.image || ''))}')"></div>
      <div class="category-body">
        <div class="eyebrow">${escapeHtml(item.title || '')}</div>
        <p>${escapeHtml(item.copy || '')}</p>
        <a class="btn btn-primary" data-nav href="${escapeAttr(item.href || '/')}">${translations[getLocale()].view}</a>
      </div>
    </article>
  `;
}

function renderProvinceResults() {
  return data.provinces.filter((province) => province.status);
}

function buildKeywords(parts) {
  return [...new Set(parts.flatMap((item) => [
    item,
    `${item} turu`,
    `${item} otel`,
    `${item} seyahat`,
  ]).map((value) => String(value || '').trim()).filter(Boolean))];
}

function updateDocumentMeta() {
  const locale = getLocale();
  const routeTitle = routeTitleByState();
  const description = routeDescriptionByState();
  const keywords = routeKeywordsByState().join(', ');
  document.documentElement.lang = locale;
  document.title = routeTitle;
  setMeta('description', description);
  setMeta('keywords', keywords);
  setMetaProperty('og:title', routeTitle);
  setMetaProperty('og:description', description);
  setMetaProperty('og:url', new URL(location.pathname + location.search, location.origin).href);
  setCanonical(location.pathname + location.search);
}

function routeTitleByState() {
  const locale = getLocale();
  switch (data.route?.kind) {
    case 'home': return pageDefaults.home.title;
    case 'collection': return `${getCollectionTitle(data.route.collectionSlug, locale)} | My Tour Guide`;
    case 'province': {
      const province = data.provinceMap.get(data.route.provinceSlug);
      const content = province ? getPlaceContent(getPlaceRouteKey('province', data.route.provinceSlug)) : null;
      return province ? `${content?.title || province.name} | My Tour Guide` : 'My Tour Guide';
    }
    case 'district': {
      const province = data.provinceMap.get(data.route.provinceSlug);
      const district = (data.districtsByProvince.get(data.route.provinceSlug) || []).find((item) => item.slug === data.route.districtSlug);
      const content = province && district ? getPlaceContent(getPlaceRouteKey('district', data.route.provinceSlug, data.route.districtSlug)) : null;
      return province && district ? `${content?.title || district.name} | My Tour Guide` : 'My Tour Guide';
    }
    case 'checkout': return `Sepet ve Ödeme | My Tour Guide`;
    case 'admin': return `Admin Panel | My Tour Guide`;
    case 'contact': return `İletişim | My Tour Guide`;
    case 'blog': return `Blog | My Tour Guide`;
    default: return `My Tour Guide`;
  }
}

function routeDescriptionByState() {
  const locale = getLocale();
  switch (data.route?.kind) {
    case 'home': return pageDefaults.home.description;
    case 'collection': return `${getCollectionTitle(data.route.collectionSlug, locale)} için filtrelenmiş modern rezervasyon sayfası.`;
    case 'province': {
      const province = data.provinceMap.get(data.route.provinceSlug);
      const content = province ? getPlaceContent(getPlaceRouteKey('province', data.route.provinceSlug)) : null;
      return province ? (content?.summary || `${province.name} için il, ilçe ve tur bazlı SEO hazır sayfa.`) : pageDefaults.home.description;
    }
    case 'district': {
      const province = data.provinceMap.get(data.route.provinceSlug);
      const district = (data.districtsByProvince.get(data.route.provinceSlug) || []).find((item) => item.slug === data.route.districtSlug);
      const content = province && district ? getPlaceContent(getPlaceRouteKey('district', data.route.provinceSlug, data.route.districtSlug)) : null;
      return province && district ? (content?.summary || `${province.name} ${district.name} için tailored tur ve rezervasyon akışı.`) : pageDefaults.home.description;
    }
    case 'checkout': return 'Sepet, tailor-made ve ödeme akışları.';
    case 'admin': return 'Admin paneli, tema ve içerik yönetimi.';
    default: return pageDefaults.home.description;
  }
}

function routeKeywordsByState() {
  const province = data.route?.kind === 'province' ? data.provinceMap.get(data.route.provinceSlug) : null;
  const district = data.route?.kind === 'district' ? (data.districtsByProvince.get(data.route.provinceSlug) || []).find((item) => item.slug === data.route.districtSlug) : null;
  const words = ['mytourguide', 'seyahat', 'tur', 'rezervasyon', 'tailor-made'];
  if (province) {
    const content = getPlaceContent(getPlaceRouteKey('province', data.route.provinceSlug));
    if (content?.title) words.push(content.title);
    if (content?.facts) words.push(content.facts);
  }
  if (district) {
    const content = getPlaceContent(getPlaceRouteKey('district', data.route.provinceSlug, data.route.districtSlug));
    if (content?.title) words.push(content.title);
    if (content?.facts) words.push(content.facts);
  }
  if (province) words.push(province.name, province.region, ...province.districts.slice(0, 4).map((d) => d.name));
  if (district) words.push(district.name);
  if (data.route?.kind === 'collection') words.push(data.route.collectionSlug);
  return buildKeywords(words);
}

function updateQuestionField(id, field, value) {
  const question = state.selectedQuestions.find((item) => item.id === id);
  if (!question) return;
  if (field === 'label') question.label = value;
  if (field === 'options') question.options = value.split('|').map((item) => item.trim()).filter(Boolean);
  saveState();
}

function saveAdminLive(el) {
  state[el.dataset.adminField] = el.value;
  if (el.dataset.adminField === 'openLanguage') {
    state.openLanguage = el.value;
    setLocale(el.value);
    return;
  }
  saveState();
  applyThemeImmediately();
}

function saveAdminFromDom() {
  saveState();
  render();
}

function toggleWidget(widget) {
  state.activeWidgets = state.activeWidgets.includes(widget)
    ? state.activeWidgets.filter((item) => item !== widget)
    : [...state.activeWidgets, widget];
  saveState();
  render();
}

function toggleProvince(slug) {
  state.provinceStatus[slug] = !((state.provinceStatus[slug] ?? true));
  saveState();
  render();
}

function toggleDistrict(key) {
  state.districtStatus[key] = !((state.districtStatus[key] ?? true));
  saveState();
  render();
}

function setLocale(locale) {
  state.locale = locale;
  saveState();
  rebuildSearchIndex();
  render();
}

function setAdminLanguage(locale) {
  state.openLanguage = locale;
  setLocale(locale);
}

function addToCart(id) {
  const existing = state.cart.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else state.cart.push({ id, quantity: 1 });
  saveState();
  render();
}

function buyNow(id) {
  state.cart = [{ id, quantity: 1 }];
  saveState();
  navigate('/sepet?tailor=1');
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  saveState();
  render();
}

function clearCart() {
  state.cart = [];
  saveState();
  render();
}

function copyMailSummary() {
  const lines = [
    `Rezervasyon: ${businessProfile.name}`,
    `E-posta: ${businessProfile.email}`,
    `Telefon: ${businessProfile.phone}`,
    `Adres: ${businessProfile.address}`,
  ];
  navigator.clipboard?.writeText(lines.join('\n')).catch(() => {});
}

async function submitReservation() {
  const payload = buildReservationPayload();
  try {
    const [reservation, payment] = await Promise.all([
      postJSON('/api/reservation', payload),
      postJSON('/api/payment-intent', payload),
    ]);
    const pdfResponse = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!pdfResponse.ok) throw new Error(`PDF HTTP ${pdfResponse.status}`);
    const pdfBlob = await pdfResponse.blob();
    const pdfUrl = URL.createObjectURL(pdfBlob);
    state.notes = JSON.stringify({ reservation, payment, pdfUrl });
    saveState();
    alert(`Rezervasyon alındı: ${reservation?.reservationId || 'OK'}`);
    if (payment?.checkoutUrl) window.open(payment.checkoutUrl, '_blank', 'noreferrer');
    window.open(pdfUrl, '_blank', 'noreferrer');
  } catch (error) {
    console.error(error);
    alert('Rezervasyon akışı başarısız. Backend endpointlerini kontrol edin.');
  }
}

async function syncCrm() {
  const payload = {
    profile: businessProfile,
    locale: state.locale,
    theme: state.theme,
    widgets: state.activeWidgets,
    questions: state.selectedQuestions,
  };
  try {
    await postJSON('/api/crm', payload);
    alert('CRM senkronizasyonu tamamlandı.');
  } catch (error) {
    console.error(error);
    alert('CRM senkronizasyonu başarısız.');
  }
}

function buildReservationPayload() {
  return {
    customer: {
      name: state.name || '',
      email: state.email || '',
      phone: state.phone || '',
      date: state.date || '',
      transport: state.transport || '',
      selfTransport: state.selfTransport || '',
    },
    profile: getUserProfile(),
    cart: state.cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      tour: data.tours.find((tour) => tour.id === item.id),
    })),
    locale: state.locale,
    questions: state.selectedQuestions,
    company: businessProfile,
  };
}

async function postJSON(path, payload) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`);
  }
  return response.json();
}

function bindRichEditors() {
  document.querySelectorAll('[data-rich-editor]').forEach((editor) => {
    editor.querySelectorAll('[data-command]').forEach((button) => {
      button.addEventListener('click', () => {
        const command = button.dataset.command;
        if (command === 'createLink') {
          const url = prompt('Bağlantı adresi');
          if (url) document.execCommand(command, false, url);
          return;
        }
        document.execCommand(command, false, null);
        editor.querySelector('[data-admin-rich]')?.focus();
      });
    });
  });
}

function bindForms() {
  document.querySelectorAll('[data-admin-input]').forEach((el) => {
    if (el.dataset.adminField && state[el.dataset.adminField] !== undefined && el.value !== String(state[el.dataset.adminField])) {
      el.value = state[el.dataset.adminField];
    }
  });
}

function renderFooter() {
  if (!publishSection('footer')) return '';
  return `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <h3>${businessProfile.name}</h3>
          <p>${cms('footer.note', 'Modern seyahat acentesi web vitrini. Reservations, CRM ve desktop entegrasyonu için hazır mimari.')}</p>
        </div>
        <div>
          <h4>İletişim</h4>
          <p>${businessProfile.phone}<br>${businessProfile.email}<br>${businessProfile.address}</p>
        </div>
        <div>
          <h4>Güvenlik</h4>
          <p>${cms('footer.security', 'HTTPS, CSP, KVKK, maskeli ödeme formu, audit log, 3D Secure ve WAF entegrasyonu için ayrılmış alanlar mevcuttur.')}</p>
        </div>
      </div>
    </footer>
  `;
}

function publishSection(key) {
  return state.cms.publish?.[key] !== false;
}

function publishBadge(label, key) {
  return `<span class="pill">${label} • ${publishSection(key) ? 'Yayında' : 'Pasif'}</span>`;
}

function setAdminTab(tab) {
  state.adminTab = tab;
  const prevRecent = Array.isArray(state.adminRecentTabs) ? state.adminRecentTabs : [];
  state.adminRecentTabs = [tab, ...prevRecent.filter((item) => item !== tab)].slice(0, 6);
  saveState();
  render();
}

function togglePublish(key) {
  state.cms.publish = state.cms.publish || {};
  state.cms.publish[key] = !(state.cms.publish[key] !== false);
  saveState();
  render();
}

function saveAdminField(el) {
  const path = el.dataset.adminPath || el.dataset.adminField;
  if (!path) return;
  const nextValue = el.dataset.adminType === 'boolean' ? el.checked : el.value;
  if (path === 'openLanguage') {
    state.openLanguage = nextValue;
    state.locale = nextValue;
  } else if (path === 'theme') {
    state.theme = nextValue;
  } else if (path === 'themePreset') {
    state.themePreset = nextValue;
  } else {
    setPath(state, path, nextValue);
  }
  saveState();
  applyThemeImmediately();
  rebuildSearchIndex();
  if (/^home\.(slides|categories)\.\d+\.image$/.test(path)) {
    syncHomeMediaRefsToBackend().catch((error) => console.error(error));
  }
}

function saveUserField(el) {
  const field = el.dataset.userField;
  if (!field) return;
  state.userProfile = state.userProfile || {};
  state.userProfile[field] = el.value;
  saveState();
}

function submitUserProfile(form = document.querySelector('[data-user-form]')) {
  if (!form) return;
  const formData = new FormData(form);
  state.userProfile = {
    firstName: String(formData.get('firstName') || '').trim(),
    lastName: String(formData.get('lastName') || '').trim(),
    tcNo: String(formData.get('tcNo') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    address: String(formData.get('address') || '').trim(),
    accommodationAddress: String(formData.get('accommodationAddress') || '').trim(),
  };
  state.userMessage = 'Kullanıcı bilgileri kaydedildi.';
  saveState();
  render();
}

function resetUserPassword(form = document.querySelector('[data-user-reset-form]')) {
  if (!form) return;
  const formData = new FormData(form);
  const password = String(formData.get('password') || '').trim();
  const passwordConfirm = String(formData.get('passwordConfirm') || '').trim();
  if (!password) {
    state.userMessage = 'Şifre boş bırakılamaz.';
    saveState();
    render();
    return;
  }
  if (password !== passwordConfirm) {
    state.userMessage = 'Şifreler eşleşmiyor.';
    saveState();
    render();
    return;
  }
  state.userAccount = { password };
  state.userMessage = 'Şifre sıfırlandı.';
  saveState();
  render();
}

function submitLogin(form = document.querySelector('[data-login-form]')) {
  if (!form) return;
  const formData = new FormData(form);
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();
  postJSON('/api/auth/login', { username, password })
    .then((response) => {
      if (!response?.authenticated) throw new Error(response?.message || 'Giriş başarısız.');
      adminSession = true;
      adminSessionSource = 'backend';
      state.adminMessage = '';
      clearLocalAdminSession();
      saveState();
      navigate('/admin');
      loadBackendConfig();
    })
    .catch((error) => {
      console.error(error);
      adminSession = false;
      adminSessionSource = null;
      state.adminMessage = 'Kullanıcı adı veya parola yanlış.';
      saveState();
      render();
    });
}

function logoutAdmin() {
  fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    .catch(() => null)
    .finally(() => {
      adminSession = false;
      adminSessionSource = null;
      backendConfig.auth = null;
      clearLocalAdminSession();
      navigate('/login');
    });
}

async function submitAdminAuth(form) {
  const formData = new FormData(form);
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();
  try {
    await saveBackendConfig({
      action: 'updateAuth',
      auth: { username, password },
    });
    backendConfig.auth = { username, password };
    render();
  } catch (error) {
    console.error(error);
    state.adminMessage = 'Admin bilgileri kaydedilemedi.';
    saveState();
    render();
  }
}

async function submitMediaUpload(form) {
  const formData = new FormData(form);
  const file = formData.get('file');
  const name = String(formData.get('name') || '').trim() || String(file?.name || 'Medya');
  if (!(file instanceof File)) return;
  try {
    const dataUrl = await fileToDataUrl(file);
    await saveBackendConfig({
      action: 'uploadMedia',
      media: {
        name,
        type: file.type || 'image/png',
        dataUrl,
      },
    });
    await loadBackendConfig();
    render();
  } catch (error) {
    console.error(error);
    state.adminMessage = 'Medya yüklenemedi.';
    saveState();
    render();
  }
}

async function renameMediaItem(mediaId, name) {
  const nextName = String(name || '').trim();
  if (!mediaId || !nextName) return;
  await saveBackendConfig({
    action: 'renameMedia',
    mediaId,
    name: nextName,
  });
  await loadBackendConfig();
  render();
}

async function deleteMediaItem(mediaId) {
  if (!mediaId) return;
  await saveBackendConfig({
    action: 'deleteMedia',
    mediaId,
  });
  await loadBackendConfig();
  render();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Dosya okunamadı.'));
    reader.readAsDataURL(file);
  });
}

function renderAdminTab(tab) {
  switch (tab) {
    case 'account':
      return `
        <article class="panel glass-card">
          <h3>Hesap ve Giriş</h3>
          <form class="builder-steps" data-admin-auth-form>
            <div class="split">
              <label><span class="filter-label">Kullanıcı adı</span><input class="input" name="username" autocomplete="username" value="${escapeAttr(getAdminCredentials().username)}"></label>
              <label><span class="filter-label">Parola</span><input class="input" name="password" type="password" autocomplete="new-password" value="${escapeAttr(getAdminCredentials().password)}"></label>
            </div>
            <div class="card-actions">
              <button class="btn btn-primary" type="submit">Bilgileri kaydet</button>
              <button class="btn" data-action="logout" type="button">Çıkış yap</button>
              <a class="btn" data-nav href="/login">Giriş ekranı</a>
              <span class="pill">${adminSessionSource === 'backend' ? 'Backend config' : 'Yerel önizleme'}</span>
            </div>
          </form>
        </article>
      `;
    case 'appearance':
      return `
        <article class="panel glass-card">
          <h3>Görünüm</h3>
          <div class="split">
            <label><span class="filter-label">Açılış dili</span>
              <select class="select" data-admin-input data-admin-path="openLanguage">
                <option value="tr" ${state.openLanguage === 'tr' ? 'selected' : ''}>Türkçe</option>
                <option value="en" ${state.openLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="ru" ${state.openLanguage === 'ru' ? 'selected' : ''}>Русский</option>
              </select>
            </label>
            <label><span class="filter-label">Tema modu</span>
              <select class="select" data-admin-input data-admin-path="theme">
                <option value="auto" ${state.theme === 'auto' ? 'selected' : ''}>Auto</option>
                <option value="light" ${state.theme === 'light' ? 'selected' : ''}>Light</option>
                <option value="aurora" ${state.theme === 'aurora' ? 'selected' : ''}>Aurora</option>
                <option value="coastal" ${state.theme === 'coastal' ? 'selected' : ''}>Coastal</option>
                <option value="lagoon" ${state.theme === 'lagoon' ? 'selected' : ''}>Lagoon</option>
                <option value="sunrise" ${state.theme === 'sunrise' ? 'selected' : ''}>Sunrise</option>
                <option value="mint" ${state.theme === 'mint' ? 'selected' : ''}>Mint</option>
                <option value="sky" ${state.theme === 'sky' ? 'selected' : ''}>Sky</option>
                <option value="peach" ${state.theme === 'peach' ? 'selected' : ''}>Peach</option>
                <option value="sage" ${state.theme === 'sage' ? 'selected' : ''}>Sage</option>
                <option value="sunset" ${state.theme === 'sunset' ? 'selected' : ''}>Sunset</option>
              </select>
            </label>
          </div>
          <div class="step">
            <strong>Varsayılan tema</strong>
            <p class="step-copy">Panel ve site renkleri için daha açık, tatil havası veren paletlerden birini seçin.</p>
            <div class="theme-grid">
              ${themes.map((item) => {
                const active = (state.themePresetDraft || state.themePreset) === item.id;
                return `
                  <button class="theme-card ${active ? 'active' : ''}" data-theme-preset-draft="${item.id}" data-action="select-theme" data-theme="${item.id}" type="button">
                    <span class="theme-swatch" style="--theme-swatch:${item.sample}"></span>
                    <span class="theme-card-copy">
                      <strong>${item.label}</strong>
                      <small>${active ? 'Seçili' : 'Uygula'}</small>
                    </span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="card-actions" style="margin-top:14px;">
              <button class="btn btn-primary" data-action="apply-theme" type="button">Temayı uygula</button>
              <span class="pill">Aktif: ${state.themePreset}</span>
            </div>
          </div>
          <div class="step">
            <strong>Menü etiketleri</strong>
            <div class="split">
              ${renderCmsInput('menu.turkiye', 'Türkiye Turları')}
              ${renderCmsInput('menu.mavi', 'Mavi Turlar')}
              ${renderCmsInput('menu.grup', 'Grup Turları')}
              ${renderCmsInput('menu.paket', 'Paket Turlar')}
              ${renderCmsInput('menu.yurtdisi', 'Yurtdışı Turlar')}
            </div>
          </div>
        </article>
      `;
    case 'homepage':
      return `
        <article class="panel glass-card">
          <h3>Ana Sayfa</h3>
          <div class="builder-steps">
            <div class="step">
              <h4>Blok sırası</h4>
              <p>Ana sayfadaki yeni blokları sürükleyip bırakın. Sıra anında kaydedilir.</p>
              <div class="home-order-list" data-home-order-list>
                ${getHomeSectionOrder().map((sectionId, index) => {
                  const def = HOME_SECTION_DEFS.find((item) => item.id === sectionId);
                  if (!def) return '';
                  return `
                    <article class="home-order-item" draggable="true" data-home-order-item data-home-section="${sectionId}">
                      <span class="drag-handle" aria-hidden="true">⋮⋮</span>
                      <div class="home-order-copy">
                        <strong>${def.label}</strong>
                        <small>${def.description}</small>
                      </div>
                      <span class="pill">${index + 1}</span>
                    </article>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="step">
              <h4>Marka ve menü</h4>
              <div class="split">
                ${renderCmsInput('brand.title', 'Marka metni')}
                ${renderCmsInput('home.searchTitle', 'Arama üst başlığı')}
                ${renderCmsTextarea('home.searchCopy', 'Arama açıklaması')}
                ${renderCmsInput('home.searchPlaceholder', 'Arama placeholder')}
                ${renderCmsInput('home.sliderTitle', 'Slider başlığı')}
                ${renderCmsInput('home.categoriesTitle', 'Kategoriler başlığı')}
              </div>
            </div>
            <div class="step">
              <h4>Slider görselleri</h4>
              <div class="split">
                ${[0, 1, 2].map((index) => `
                  <div class="step">
                    <h4>Slide ${index + 1}</h4>
                    <div class="stack">
                      ${renderCmsInput(`home.slides.${index}.title`, 'Başlık')}
                      ${renderCmsTextarea(`home.slides.${index}.copy`, 'Açıklama')}
                      ${renderCmsInput(`home.slides.${index}.image`, 'Görsel')}
                      <label><span class="filter-label">Medya kütüphanesi</span>
                        <select class="select" data-admin-input data-admin-path="home.slides.${index}.image">
                          <option value="">Seçin</option>
                          ${backendConfig.public.mediaLibrary.map((item) => `<option value="media:${item.id}" ${getPath(state.cms, `home.slides.${index}.image`, '') === `media:${item.id}` ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}
                        </select>
                      </label>
                      ${renderMediaPreview(getPath(state.cms, `home.slides.${index}.image`, ''))}
                      ${renderCmsInput(`home.slides.${index}.cta`, 'Buton metni')}
                      ${renderCmsInput(`home.slides.${index}.href`, 'Link')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="step">
              <h4>Kategori kartları</h4>
              <div class="split">
                ${[0, 1, 2, 3, 4, 5].map((index) => `
                  <div class="step">
                    <h4>Kategori ${index + 1}</h4>
                    <div class="stack">
                      ${renderCmsInput(`home.categories.${index}.title`, 'Başlık')}
                      ${renderCmsTextarea(`home.categories.${index}.copy`, 'Açıklama')}
                      ${renderCmsInput(`home.categories.${index}.image`, 'Kapak görseli')}
                      <label><span class="filter-label">Medya kütüphanesi</span>
                        <select class="select" data-admin-input data-admin-path="home.categories.${index}.image">
                          <option value="">Seçin</option>
                          ${backendConfig.public.mediaLibrary.map((item) => `<option value="media:${item.id}" ${getPath(state.cms, `home.categories.${index}.image`, '') === `media:${item.id}` ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}
                        </select>
                      </label>
                      ${renderMediaPreview(getPath(state.cms, `home.categories.${index}.image`, ''))}
                      ${renderCmsInput(`home.categories.${index}.href`, 'Link')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="step">
              <h4>Medya kütüphanesi</h4>
              <form class="builder-steps" data-media-upload-form>
                <div class="split">
                  <label><span class="filter-label">Dosya adı</span><input class="input" name="name" placeholder="hero-cover.png"></label>
                  <label><span class="filter-label">Görsel dosyası</span><input class="input" name="file" type="file" accept="image/*,image/svg+xml"></label>
                </div>
                <div class="card-actions">
                  <button class="btn btn-primary" type="submit">Kütüphaneye yükle</button>
                  <span class="pill">${backendConfig.public.mediaLibrary.length} medya</span>
                </div>
              </form>
              <div class="grid-cards" style="margin-top: 14px;">
                ${backendConfig.public.mediaLibrary.map((item) => {
                  const used = getUsedMediaRefs().has(`media:${item.id}`);
                  return `
                  <article class="widget-card">
                    <div class="body">
                      <div class="eyebrow">Medya</div>
                      <div class="media-library-thumb">
                        <img src="${escapeAttr(item.dataUrl)}" alt="${escapeAttr(item.name)}">
                      </div>
                      <h3>${escapeHtml(item.name)}</h3>
                      <p>${escapeHtml(item.type)}</p>
                      <div class="meta-row">
                        <span class="pill">${item.id}</span>
                        <span class="pill">${used ? 'Kullanılıyor' : 'Boşta'}</span>
                      </div>
                      <div class="card-actions">
                        <button class="btn" data-action="rename-media" data-media-id="${item.id}" data-media-name="${escapeAttr(item.name)}" type="button">Yeniden adlandır</button>
                        <button class="btn" data-action="delete-media" data-media-id="${item.id}" data-media-name="${escapeAttr(item.name)}" type="button">Sil</button>
                      </div>
                    </div>
                  </article>
                `; }).join('')}
              </div>
            </div>
          </div>
        </article>
      `;
    case 'content':
      return `
        <article class="panel glass-card">
          <h3>İçerik</h3>
          <div class="builder-steps">
            <div class="step">
              <h4>İletişim</h4>
              <div class="split">
                ${renderCmsInput('contact.title', 'Sayfa başlığı')}
                ${renderCmsTextarea('contact.intro', 'Intro')}
                ${renderCmsTextarea('contact.corporateNote', 'Kurumsal not')}
              </div>
            </div>
            <div class="step">
              <h4>Footer</h4>
              <div class="split">
                ${renderCmsTextarea('footer.note', 'Footer notu')}
                ${renderCmsTextarea('footer.security', 'Güvenlik notu')}
                ${renderCmsTextarea('adminNotes', 'Admin notu')}
              </div>
            </div>
            <div class="step">
              <h4>Rich text</h4>
              <div class="rich-editor" data-rich-editor>
                <div class="rich-toolbar">
                  <button class="btn" type="button" data-command="bold"><strong>B</strong></button>
                  <button class="btn" type="button" data-command="italic"><em>I</em></button>
                  <button class="btn" type="button" data-command="insertUnorderedList">• List</button>
                  <button class="btn" type="button" data-command="createLink">Link</button>
                  <button class="btn" type="button" data-command="undo">Undo</button>
                </div>
                <div class="rich-area" contenteditable="true" data-admin-rich>${state.cms.adminRich || '<h4>Sayfa içeriği</h4><p>Bu alan zengin metin, resim ve bağlantı eklemek için kullanılabilir.</p>'}</div>
              </div>
            </div>
          </div>
        </article>
      `;
    case 'pages': {
      const categories = getAllCategories();
      const placeMatches = searchPlaces(state.adminPagesSearch);
      const customPages = Array.isArray(state.cms.customPages) ? state.cms.customPages : [];
      return `
        <article class="panel glass-card">
          <h3>Kategoriler</h3>
          <div class="category-chip-row">
            ${categories.map((category) => `
              <span class="category-chip">
                <strong>${escapeHtml(category.label)}</strong>
                ${category.builtin ? '<small>Sabit menü</small>' : `
                  <button class="chip-action" data-action="toggle-category-menu" data-slug="${escapeAttr(category.slug)}" type="button" title="Menüde göster/gizle">${category.showInMenu !== false ? '👁️' : '🚫'}</button>
                  <button class="chip-action" data-action="delete-custom-category" data-slug="${escapeAttr(category.slug)}" type="button" title="Kategoriyi sil">✕</button>
                `}
              </span>
            `).join('')}
          </div>
          <form class="card-actions" data-add-category-form>
            <input class="input" name="categoryName" placeholder="Yeni kategori adı (örn. Blog, Kampanyalar)">
            <button class="btn btn-primary" type="submit">Kategori ekle</button>
          </form>
        </article>

        <article class="panel glass-card" style="margin-top:16px;">
          <h3>İl / ilçe sayfalarını düzenle</h3>
          <p class="step-copy">Yayındaki il ve ilçe sayfalarını buradan arayıp içeriğini değiştirebilirsin.</p>
          <label class="admin-search">
            <span class="filter-label">İl veya ilçe ara</span>
            <input class="input" data-admin-pages-search value="${escapeAttr(state.adminPagesSearch || '')}" placeholder="Örn. Fethiye, Muğla...">
          </label>
          <div class="admin-nav-list">
            ${placeMatches.length ? placeMatches.map((match) => {
              const props = buildPlaceEditorProps(match.kind, match.provinceSlug, match.districtSlug);
              if (!props) return '';
              const isOpen = state.adminOpenPlaceKey === props.routeKey;
              return `
                <button class="admin-nav-button ${isOpen ? 'active' : ''}" data-action="toggle-admin-place" data-route-key="${escapeAttr(props.routeKey)}" type="button">
                  <div class="admin-nav-icon" aria-hidden="true">${match.kind === 'district' ? '🏘️' : '🏙️'}</div>
                  <div class="admin-nav-copy">
                    <strong>${escapeHtml(match.label)}</strong>
                    <small>${match.kind === 'district' ? 'İlçe sayfası' : 'İl sayfası'}</small>
                  </div>
                  <span class="admin-nav-pill">${isOpen ? 'Kapat' : 'Düzenle'}</span>
                </button>
                ${isOpen ? renderPlaceContentEditor(props) : ''}
              `;
            }).join('') : `<div class="admin-empty-state">${state.adminPagesSearch ? 'Eşleşen il/ilçe yok.' : 'Aramaya başlamak için il veya ilçe adı yazın.'}</div>`}
          </div>
        </article>

        <article class="panel glass-card" style="margin-top:16px;">
          <div class="section-header">
            <div>
              <h3>Özel sayfalar</h3>
              <p class="step-copy">Kategoriler altına elle sayfa ekle: başlık, özet, metin ve görseller.</p>
            </div>
            <button class="btn btn-primary" data-action="add-custom-page" data-category="${escapeAttr(categories[0]?.slug || '')}" type="button">+ Yeni sayfa ekle</button>
          </div>
          <div class="admin-nav-list">
            ${customPages.length ? customPages.map((page) => {
              const isOpen = state.adminOpenPageId === page.id;
              const categoryLabel = categories.find((item) => item.slug === page.categorySlug)?.label || page.categorySlug;
              return `
                <button class="admin-nav-button ${isOpen ? 'active' : ''}" data-action="toggle-admin-page" data-page-id="${escapeAttr(page.id)}" type="button">
                  <div class="admin-nav-icon" aria-hidden="true">📄</div>
                  <div class="admin-nav-copy">
                    <strong>${escapeHtml(page.title)}</strong>
                    <small>${escapeHtml(categoryLabel)} · ${page.published === false ? 'Taslak' : 'Yayında'}</small>
                  </div>
                  <span class="admin-nav-pill">${isOpen ? 'Kapat' : 'Düzenle'}</span>
                </button>
                ${isOpen ? renderCustomPageEditor(page, categories) : ''}
              `;
            }).join('') : '<div class="admin-empty-state">Henüz özel sayfa yok. "Yeni sayfa ekle" ile başlayın.</div>'}
          </div>
        </article>
      `;
    }
    case 'publish':
      return `
        <article class="panel glass-card">
          <h3>Yayın</h3>
          <div class="grid-cards">
            ${renderPublishToggle('homeBrand', 'Marka')}
            ${renderPublishToggle('homeMenu', 'Menü satırı')}
            ${renderPublishToggle('homeSearch', 'Arama satırı')}
            ${renderPublishToggle('homeSlider', 'Slider')}
            ${renderPublishToggle('homeCategories', 'Kategoriler')}
            ${renderPublishToggle('homeHero', 'Hero')}
            ${renderPublishToggle('homeStats', 'İstatistikler')}
            ${renderPublishToggle('homeFeatured', 'Öne çıkan')}
            ${renderPublishToggle('homeProvinces', 'İller')}
            ${renderPublishToggle('homeTailor', 'Tailor-made')}
            ${renderPublishToggle('homeSeo', 'SEO / Güvenlik')}
            ${renderPublishToggle('seo', 'Genel SEO')}
            ${renderPublishToggle('footer', 'Footer')}
            ${renderPublishToggle('contact', 'İletişim')}
            ${renderPublishToggle('checkout', 'Checkout')}
            ${renderPublishToggle('widgets', 'Widget alanları')}
          </div>
          <article class="panel glass-card" style="margin-top:16px;">
            <h4>Widgetler</h4>
            <div class="list">
              ${widgetCatalog.map((widget) => `
                <button class="list-item" data-action="toggle-widget" data-widget="${widget.id}" type="button">
                  <div><strong>${widget.title}</strong><small>${widget.description}</small></div>
                  <span class="pill">${state.activeWidgets.includes(widget.id) ? 'Yayında' : 'Pasif'}</span>
                </button>
              `).join('')}
            </div>
          </article>
        </article>
      `;
    case 'commerce':
      return `
        <article class="panel glass-card">
          <h3>Rezervasyon ve CRM</h3>
          <div class="builder-steps">
            <div class="step">
              <h4>Checkout metinleri</h4>
              <div class="split">
                ${renderCmsInput('commerce.checkoutTitle', 'Ödeme başlığı')}
                ${renderCmsTextarea('commerce.checkoutNote', 'Ödeme notu')}
                ${renderCmsInput('commerce.pdfMail', 'PDF e-posta')}
                ${renderCmsInput('commerce.crmWebhook', 'CRM webhook')}
              </div>
            </div>
            <div class="step">
              <h4>Test oturumu</h4>
              <button class="btn btn-primary" data-action="sync-crm" type="button">CRM ile senkronize et</button>
              <button class="btn" data-action="save-admin" type="button">${translations[getLocale()].save}</button>
            </div>
          </div>
        </article>
      `;
    case 'security':
      return `
        <article class="panel glass-card">
          <h3>Güvenlik</h3>
          <div class="builder-steps">
            <div class="step">
              <h4>Login politikası</h4>
              <div class="split">
                ${renderCmsTextarea('security.loginPolicy', 'Login politikası')}
                ${renderCmsTextarea('security.kvkk', 'KVKK metni')}
                ${renderCmsTextarea('security.payment', 'Ödeme güvenliği')}
              </div>
            </div>
            <div class="step">
              <h4>Oturum</h4>
              <div class="meta-row">
                <span class="pill">Durum: ${isAdminAuthenticated() ? 'Açık' : 'Kapalı'}</span>
                <span class="pill">Kullanıcı: ${escapeHtml(cms('auth.username', cmsDefaults.auth.username))}</span>
                <span class="pill">HttpOnly cookie</span>
              </div>
            </div>
          </div>
        </article>
      `;
    default:
      return renderAdminTab('account');
  }
}

function renderCmsInput(path, label) {
  return `<label><span class="filter-label">${label}</span><input class="input" data-admin-input data-admin-path="${path}" value="${escapeAttr(String(getPath(state.cms, path, '')))}"></label>`;
}

function renderCmsTextarea(path, label) {
  return `<label><span class="filter-label">${label}</span><textarea class="textarea" rows="4" data-admin-input data-admin-path="${path}">${escapeHtml(String(getPath(state.cms, path, '')))}</textarea></label>`;
}

function renderPublishToggle(key, label) {
  return `
    <div class="province-card">
      <div class="body">
        <h4>${label}</h4>
        <p>${state.cms.publish?.[key] !== false ? 'Yayınlanıyor' : 'Pasif'}</p>
        <div class="card-actions">
          <button class="btn" data-action="toggle-publish" data-key="${key}" type="button">${state.cms.publish?.[key] !== false ? 'Pasife al' : 'Yayına al'}</button>
        </div>
      </div>
    </div>
  `;
}

function updateQuestionFieldFromState() {
  state.selectedQuestions = state.selectedQuestions.map((q) => ({ ...q, options: Array.isArray(q.options) ? q.options : String(q.options || '').split('|').map((x) => x.trim()) }));
}

function applyThemeImmediately() {
  const theme = getTheme();
  document.documentElement.dataset.theme = theme === 'auto'
    ? window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'aurora'
    : theme;
}

function cycleTheme() {
  const order = ['auto', 'light', 'coastal', 'lagoon', 'sunrise', 'mint', 'sky', 'peach', 'sage', 'aurora', 'sunset'];
  const index = order.indexOf(state.theme);
  state.theme = order[(index + 1) % order.length];
  saveState();
  applyThemeImmediately();
  render();
}

function setThemePreset(theme) {
  state.themePresetDraft = theme;
  state.themePreset = theme;
  state.theme = theme;
  saveState();
  applyThemeImmediately();
  render();
}

function applyThemePreset() {
  setThemePreset(state.themePresetDraft || state.themePreset || 'aurora');
}

function getTheme() {
  return state.theme || 'auto';
}

function themeLabel(theme) {
  return theme === 'auto' ? 'AUTO' : theme.toUpperCase().slice(0, 4);
}

function getLocale() {
  return state.locale || 'tr';
}

function translate(locale, key) {
  return key.split('.').reduce((acc, part) => acc?.[part], translations[locale]) || key;
}

function translateKey(locale, key) {
  return translate(locale, key);
}

function isActiveRoute(route) {
  return location.pathname === route || location.pathname.startsWith(route + '/');
}

function getCollectionTitle(slug, locale) {
  return tourCollections.find((item) => item.slug === slug)?.title[locale] || slug;
}

function setMeta(name, content) {
  let meta = document.head.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setMetaProperty(property, content) {
  let meta = document.head.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setCanonical(path) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = new URL(path, location.origin).href;
}

function updateFromSearchInput() {
  const el = document.querySelector('[data-search]');
  if (el && searchOpen) renderSearchOverlay(el.value);
}

function toggleSearch() {
  searchOpen = !searchOpen;
  render();
  if (searchOpen) {
    setTimeout(() => document.querySelector('[data-search]')?.focus(), 0);
    updateFromSearchInput();
  }
}

function closeSearch() {
  if (!searchOpen) return;
  searchOpen = false;
  render();
}

function scrollHomeSlider(direction) {
  const slider = document.querySelector('[data-home-slider]');
  if (!slider) return;
  const amount = slider.clientWidth * 0.85 * (direction < 0 ? -1 : 1);
  slider.scrollBy({ left: amount, behavior: 'smooth' });
}

function scrollPlaceSlider(routeKey, direction) {
  if (!routeKey) return;
  const selector = `[data-place-gallery="${(window.CSS?.escape ? window.CSS.escape(routeKey) : routeKey.replace(/"/g, '\\"'))}"]`;
  const slider = document.querySelector(selector);
  if (!slider) return;
  const amount = slider.clientWidth * 0.85 * (direction < 0 ? -1 : 1);
  slider.scrollBy({ left: amount, behavior: 'smooth' });
}

async function savePlaceContentFromDom(action) {
  const form = action?.closest?.('form[data-place-content-form]');
  if (!form) return;
  const routeKey = String(form.dataset.routeKey || action.dataset.routeKey || '').trim();
  if (!routeKey) return;
  const formData = new FormData(form);
  const slides = [0, 1, 2, 3]
    .map((index) => String(formData.get(`slide-${index}`) || '').trim())
    .filter(Boolean)
    .slice(0, 4);
  await saveBackendConfig({
    action: 'updatePageContent',
    routeKey,
    pageContent: {
      title: String(formData.get('title') || '').trim(),
      summary: String(formData.get('summary') || '').trim(),
      facts: String(formData.get('facts') || '').trim(),
      slides,
    },
  });
  state.adminMessage = 'Sayfa içeriği kaydedildi.';
  await loadBackendConfig();
  render();
}

function toggleAdminPlace(routeKey) {
  state.adminOpenPlaceKey = state.adminOpenPlaceKey === routeKey ? '' : routeKey;
  render();
}

function toggleAdminPage(pageId) {
  state.adminOpenPageId = state.adminOpenPageId === pageId ? '' : pageId;
  render();
}

function addCustomCategory(rawLabel) {
  const label = String(rawLabel || '').trim();
  if (!label) return;
  const slug = slugify(label);
  if (!slug) return;
  state.cms.customCategories = Array.isArray(state.cms.customCategories) ? state.cms.customCategories : [];
  const exists = state.cms.customCategories.some((item) => item.slug === slug) || tourCollections.some((item) => item.slug === slug);
  if (exists) {
    state.adminMessage = 'Bu isimde bir kategori zaten var.';
  } else {
    state.cms.customCategories.push({ slug, label, showInMenu: true });
    state.adminMessage = 'Kategori eklendi.';
    syncCustomContentToBackend().catch((error) => console.error(error));
  }
  saveState();
  render();
}

function deleteCustomCategory(slug) {
  state.cms.customCategories = (state.cms.customCategories || []).filter((item) => item.slug !== slug);
  state.cms.customPages = (state.cms.customPages || []).filter((page) => page.categorySlug !== slug);
  syncCustomContentToBackend().catch((error) => console.error(error));
  saveState();
  render();
}

function toggleCategoryMenu(slug) {
  const category = (state.cms.customCategories || []).find((item) => item.slug === slug);
  if (!category) return;
  category.showInMenu = category.showInMenu === false;
  syncCustomContentToBackend().catch((error) => console.error(error));
  saveState();
  render();
}

function addCustomPage(categorySlug) {
  state.cms.customPages = Array.isArray(state.cms.customPages) ? state.cms.customPages : [];
  const id = `page-${Date.now().toString(36)}`;
  const fallbackCategory = getAllCategories()[0]?.slug || '';
  state.cms.customPages.push({
    id,
    slug: `yeni-sayfa-${state.cms.customPages.length + 1}`,
    categorySlug: categorySlug || fallbackCategory,
    title: 'Yeni sayfa',
    summary: '',
    body: '',
    images: ['', '', '', ''],
    published: false,
    updatedAt: new Date().toISOString(),
  });
  state.adminOpenPageId = id;
  state.adminMessage = 'Yeni sayfa taslağı oluşturuldu.';
  syncCustomContentToBackend().catch((error) => console.error(error));
  saveState();
  render();
}

function deleteCustomPage(id) {
  state.cms.customPages = (state.cms.customPages || []).filter((page) => page.id !== id);
  if (state.adminOpenPageId === id) state.adminOpenPageId = '';
  syncCustomContentToBackend().catch((error) => console.error(error));
  saveState();
  render();
}

function saveCustomPageFromDom(action) {
  const form = action?.closest?.('form[data-custom-page-form]');
  if (!form) return;
  const id = form.dataset.pageId;
  const page = (state.cms.customPages || []).find((item) => item.id === id);
  if (!page) return;
  const formData = new FormData(form);
  const title = String(formData.get('title') || '').trim() || 'Yeni sayfa';
  const slugInput = String(formData.get('slug') || '').trim();
  page.title = title;
  page.categorySlug = String(formData.get('categorySlug') || '').trim() || page.categorySlug;
  page.slug = slugify(slugInput || title) || page.id;
  page.summary = String(formData.get('summary') || '').trim();
  page.body = String(formData.get('body') || '').trim();
  page.images = [0, 1, 2, 3].map((index) => String(formData.get(`image-${index}`) || '').trim());
  page.published = formData.get('published') === 'on';
  page.updatedAt = new Date().toISOString();
  state.adminMessage = 'Sayfa kaydedildi.';
  syncCustomContentToBackend().catch((error) => console.error(error));
  saveState();
  render();
}

function renderSearchOverlay(query) {
  searchQuery = String(query || '');
  const overlay = document.querySelector('[data-search-overlay]');
  if (!overlay) return;
  const results = overlay.querySelector('[data-search-results]');
  if (results) results.innerHTML = renderSearchResults(searchQuery);
}

function renderSearchOverlayMarkup() {
  return `
    <div class="search-overlay" data-search-overlay>
      <label>
        <span class="filter-label">Gelişmiş arama</span>
        <input class="search-input" data-search value="${escapeAttr(searchQuery)}" placeholder="${translations[getLocale()].searchPlaceholder}" autocomplete="off">
      </label>
      <div class="search-results" data-search-results>${renderSearchResults(searchQuery)}</div>
    </div>
  `;
}

function renderSearchResults(query) {
  const locale = getLocale();
  const normalized = normalize(query);
  if (!normalized) {
    return `<div class="search-hit"><strong>Aramaya başlayın</strong><small>İl, ilçe veya tur yazdığınızda sonuçlar listelenecek.</small></div>`;
  }
  const hits = data.searchIndex
    .filter((item) => normalize([item.name, item.description, ...(item.keywords || [])].join(' ')).includes(normalized))
    .slice(0, 24);
  if (!hits.length) return `<div class="search-hit"><strong>Sonuç bulunamadı</strong><small>Farklı il, ilçe veya tur adı deneyin.</small></div>`;
  return hits.map((hit) => `
    <a class="search-hit" data-nav href="${hit.slug}">
      <strong>${hit.name}</strong>
      <small>${hit.description}</small>
    </a>
  `).join('');
}

function renderRouteSearchStrip() {
  const locale = getLocale();
  const t = translations[locale];
  return `
    <section class="home-search-strip glass-card">
      <div class="home-search-copy">
        <div class="eyebrow">${cms('home.searchTitle', 'Türkiye genelinde il, ilçe veya tur arayın')}</div>
        <p>${cms('home.searchCopy', 'Arama, kategori ve hızlı bağlantılar tek satırda çalışır.')}</p>
      </div>
      <div class="home-search-row">
        <input class="search-input" data-home-search value="${escapeAttr(searchQuery)}" placeholder="${cms('home.searchPlaceholder', t.searchPlaceholder)}" autocomplete="off">
        <button class="btn btn-primary" data-action="toggle-search" type="button">Ara</button>
      </div>
    </section>
  `;
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function matchProvinceFilters(tour, province, filters) {
  if (filters.type && tour.type !== filters.type) return false;
  if (filters.province && !normalize(province.name).includes(normalize(filters.province))) return false;
  if (filters.district) {
    const needle = normalize(filters.district);
    const districtMatch = province.districts.some((item) => slugify(item.slug) === slugify(filters.district) || normalize(item.name).includes(needle));
    if (districtMatch) {
      const haystack = normalize([tour.summary, tour.city, tour.districtSlug || ''].join(' '));
      if (!haystack.includes(needle) && slugify(tour.districtSlug || '') !== slugify(filters.district)) return false;
    }
  }
  return true;
}

function matchCatalogueFilters(tour, filters) {
  if (filters.type && tour.type !== filters.type) return false;
  if (filters.province && !normalize(tour.city).includes(normalize(filters.province))) return false;
  if (filters.district) {
    const needle = normalize(filters.district);
    const haystack = normalize([tour.summary, tour.city, tour.districtSlug || ''].join(' '));
    if (!haystack.includes(needle) && slugify(tour.districtSlug || '') !== slugify(filters.district)) return false;
  }
  return true;
}

function formatMoney(value) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value || 0);
}

function deviceLabel() {
  const width = window.innerWidth;
  if (width < 768) return 'Mobile';
  if (width < 1160) return 'Tablet';
  return 'Desktop';
}

function escapeHtml(value) {
  return String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function isFeaturedRoute() {
  return ['home', 'collection', 'province', 'district'].includes(data.route?.kind);
}
