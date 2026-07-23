import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { businessProfile, regionCopy, slugify, tourCollections, tourTypes } from '../assets/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dataFile = path.join(root, 'data', 'ilceler.json');
const outDir = path.join(root, 'public', 'il');
const bannerDir = path.join(root, 'public', 'banners');
const districtBannerDir = path.join(root, 'public', 'district-banners');

const provincePageTitles = {
  tr: (name) => `${name} İl Rehberi | My Tour Guide`,
  en: (name) => `${name} Province Guide | My Tour Guide`,
  ru: (name) => `Гид по провинции ${name} | My Tour Guide`,
};

const provincePageDescriptions = {
  tr: (name, region) => `${name} için ${region} bölgesi odaklı il tanıtımı, ilçe listesi, tur seçenekleri ve rezervasyon akışı.`,
  en: (name, region) => `${name} province page with ${region} region focus, district list, tour options and booking flow.`,
  ru: (name, region) => `Страница провинции ${name} с акцентом на регион ${region}, список районов, туры и бронирование.`,
};

const districtPageTitles = {
  tr: (district, province) => `${district} / ${province} İlçe Rehberi | My Tour Guide`,
  en: (district, province) => `${district} / ${province} District Guide | My Tour Guide`,
  ru: (district, province) => `Гид по району ${district} / ${province} | My Tour Guide`,
};

const districtPageDescriptions = {
  tr: (district, province, region) => `${province} ${district} için ${region} bölgesindeki ilçe tanıtımı, yakın çevre rotaları, tur seçenekleri ve rezervasyon akışı.`,
  en: (district, province, region) => `${district} in ${province} with ${region} region focus, nearby routes, tour options and booking flow.`,
  ru: (district, province, region) => `${district} в ${province} с акцентом на регион ${region}, маршруты поблизости, туры и бронирование.`,
};

const regionThemes = {
  Akdeniz: ['deniz', 'balayi', 'aile'],
  Ege: ['kultur', 'sehir', 'alisveris'],
  Marmara: ['sehir', 'kultur', 'aile'],
  'İç Anadolu': ['kultur', 'sehir', 'aile'],
  Karadeniz: ['doga', 'trekking', 'aile'],
  'Doğu Anadolu': ['kayak', 'doga', 'kultur'],
  'Güneydoğu Anadolu': ['kultur', 'sehir', 'gastronomi'],
};

const data = JSON.parse(await readFile(dataFile, 'utf8'));
await mkdir(outDir, { recursive: true });
await mkdir(bannerDir, { recursive: true });
await mkdir(districtBannerDir, { recursive: true });

const provinces = [];
const provinceMap = new Map();
for (const row of data) {
  const region = normalizeRegion(row.bolge);
  const slug = slugify(row.il);
  if (!provinceMap.has(slug)) {
    provinceMap.set(slug, {
      name: row.il,
      slug,
      region,
      plate: row.plaka,
      districts: [],
    });
  }
  provinceMap.get(slug).districts.push({
    name: row.ilce,
    slug: slugify(row.ilce),
  });
}
for (const province of provinceMap.values()) provinces.push(province);

for (const province of provinces) {
  const copy = regionCopy[province.region] || regionCopy.Marmara;
  const bannerPath = path.join(bannerDir, `${province.slug}.svg`);
  const htmlPath = path.join(outDir, `${province.slug}.html`);
  const districts = province.districts;
  const topDistricts = districts.slice(0, 8);

  await writeFile(bannerPath, buildBannerSvg(province, copy), 'utf8');
  await writeFile(htmlPath, buildHtml({
    province,
    copy,
    districts,
    topDistricts,
  }), 'utf8');

  await mkdir(path.join(outDir, province.slug), { recursive: true });
  await mkdir(path.join(districtBannerDir, province.slug), { recursive: true });

  for (const district of districts) {
    const districtHtmlPath = path.join(outDir, province.slug, `${district.slug}.html`);
    const districtBannerPath = path.join(districtBannerDir, province.slug, `${district.slug}.svg`);
    await writeFile(districtBannerPath, buildDistrictBannerSvg(province, district, copy), 'utf8');
    await writeFile(districtHtmlPath, buildDistrictHtml({
      province,
      district,
      copy,
      districts,
    }), 'utf8');
  }
}

console.log(`Generated ${provinces.length} province pages and district pages in ${outDir}`);

function normalizeRegion(value) {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('akdeniz')) return 'Akdeniz';
  if (normalized.includes('ege')) return 'Ege';
  if (normalized.includes('marmara')) return 'Marmara';
  if (normalized.includes('karadeniz')) return 'Karadeniz';
  if (normalized.includes('guneydogu')) return 'Güneydoğu Anadolu';
  if (normalized.includes('dogu') && normalized.includes('anadolu')) return 'Doğu Anadolu';
  if (normalized.includes('ic') && normalized.includes('anadolu')) return 'İç Anadolu';
  return 'Marmara';
}

function buildBannerSvg(province, copy) {
  const accent = copy.accent;
  const secondary = blendHex(accent, '#0b1220', 0.35);
  const tertiary = blendHex(accent, '#ffffff', 0.18);
  const safeName = escapeXml(province.name);
  const safeRegion = escapeXml(province.region);
  const districts = escapeXml(String(province.districts.length));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${safeName} banner">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="60%" stop-color="${secondary}" />
      <stop offset="100%" stop-color="#0b1220" />
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="22%" r="80%">
      <stop offset="0%" stop-color="${tertiary}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="18" /></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <rect width="1600" height="900" fill="url(#glow)" opacity="0.8"/>
  <circle cx="1200" cy="180" r="170" fill="${tertiary}" opacity="0.22" filter="url(#blur)"/>
  <circle cx="260" cy="720" r="220" fill="#ffffff" opacity="0.09" filter="url(#blur)"/>
  <path d="M0 680 C 280 600, 520 840, 800 760 C 1100 680, 1290 520, 1600 610 L 1600 900 L 0 900 Z" fill="#08111f" opacity="0.55"/>
  <path d="M120 640 L 180 520 L 240 640 Z" fill="#ffffff" opacity="0.22"/>
  <path d="M212 640 L 260 560 L 310 640 Z" fill="#ffffff" opacity="0.18"/>
  <path d="M430 650 C 490 590, 560 590, 620 650" stroke="#ffffff" stroke-opacity="0.22" stroke-width="10" fill="none" stroke-linecap="round"/>
  <text x="92" y="160" fill="#f2f7ff" font-family="Arial, sans-serif" font-size="58" font-weight="700" letter-spacing="6">MY TOUR GUIDE</text>
  <text x="92" y="270" fill="#ffffff" font-family="Arial, sans-serif" font-size="112" font-weight="800">${safeName}</text>
  <text x="92" y="340" fill="#e3ecff" font-family="Arial, sans-serif" font-size="38" font-weight="500">${safeRegion} • ${districts} ilçe</text>
  <text x="92" y="780" fill="#ffffff" font-family="Arial, sans-serif" font-size="30" font-weight="500">Tailor-made tur planlama • Çok dilli rezervasyon • SEO hazır sayfa</text>
</svg>`;
}

function buildHtml({ province, copy, districts, topDistricts }) {
  const banner = `/banners/${province.slug}.svg`;
  const pageTitle = provincePageTitles.tr(province.name);
  const pageDescription = provincePageDescriptions.tr(province.name, province.region);
  const keywordList = buildKeywords([province.name, province.region, ...districts.slice(0, 5).map((item) => item.name)]);
  const relatedTours = buildTourCards(province, copy);
  return `<!doctype html>
<html lang="tr" data-theme="aurora">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0c1220">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="keywords" content="${escapeHtml(keywordList.join(', '))}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:image" content="${banner}">
  <link rel="canonical" href="/il/${province.slug}.html">
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${province.name} İl Sayfası`,
    description: pageDescription,
    url: `/il/${province.slug}.html`,
    isPartOf: {
      '@type': 'WebSite',
      name: businessProfile.name,
      url: '/',
    },
  })}</script>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/" aria-label="My Tour Guide">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>
          <span class="brand-name">My Tour Guide</span>
          <span class="brand-sub">${escapeHtml(copy.tag)}</span>
        </span>
      </a>
      <nav class="nav" aria-label="Main">
        ${tourCollections.map((item) => `<a href="/${item.slug}">${escapeHtml(item.title.tr)}</a>`).join('')}
        <a href="/admin">Admin Panel</a>
        <a href="/">Ana Sayfa</a>
      </nav>
      <div class="top-actions">
        <a class="icon-btn" href="/?search=${encodeURIComponent(province.name)}">⌕</a>
        <a class="icon-btn" href="/sepet?tailor=1">🛒</a>
      </div>
    </div>
  </header>
  <main class="app-shell">
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, ${copy.accent}, #0b1220)">
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">${escapeHtml(province.region)}</div>
            <h1 class="page-title">${escapeHtml(province.name)}</h1>
            <p>${escapeHtml(copy.intro)} Bu sayfa ayrı bir HTML dosyası olarak üretildi ve arama sonuçları doğrudan buraya yönlenir.</p>
            <div class="meta-row">
              <span class="pill">${districts.length} ilçe</span>
              <span class="pill">Plaka ${province.plate}</span>
              <span class="pill">SEO ready</span>
            </div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="/sepet?tailor=1">Satın al</a>
              <a class="btn" href="/#">Ana sayfa</a>
            </div>
          </div>
          <div class="glass-card" style="overflow:hidden;">
            <img src="${banner}" alt="${escapeHtml(province.name)} banner" style="display:block;width:100%;height:100%;min-height:280px;object-fit:cover;">
          </div>
        </div>
      </div>

      <div class="page-layout">
        <aside class="sticky-stack">
          <section class="sidebar glass-card">
            <h3>İlçe listesi</h3>
            <div class="list">
              ${districts.map((district) => `
                <a class="list-item" id="district-${district.slug}" href="/il/${province.slug}/${district.slug}.html">
                  <strong>${escapeHtml(district.name)}</strong>
                  <small>İlçe sayfası</small>
                </a>
              `).join('')}
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>Filtreler</h3>
            <div class="filter-group">
              <div class="list-item"><strong>İl</strong><small>${escapeHtml(province.name)}</small></div>
              <div class="list-item"><strong>Bölge</strong><small>${escapeHtml(province.region)}</small></div>
              <div class="list-item"><strong>Tur odağı</strong><small>${escapeHtml(regionThemes[province.region]?.join(', ') || 'kultur')}</small></div>
            </div>
          </section>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <div class="section-header">
              <div>
                <div class="eyebrow">Banner</div>
                <h2 class="section-title">${escapeHtml(province.name)} için tanıtım</h2>
              </div>
              <a class="btn btn-primary" href="/sepet?tailor=1">Turları birleştir</a>
            </div>
            <div class="split">
              <div>
                <p>${escapeHtml(copy.intro)} Bu sayfada il bazlı içerik, SEO metinleri ve ilçe bağlantıları hazırdır.</p>
                <p>İçerik blokları, admin panelden sonradan genişletilebilir. JSON-LD, canonical ve meta etiketleri her sayfada bulunur.</p>
              </div>
              <div>
                <p><strong>Arama dostu etiketler:</strong> ${escapeHtml(keywordList.join(', '))}</p>
                <p><strong>Ulaşım / transfer:</strong> Otogar, havaalanı, şehir merkezi ve paket tur bilgileri için ek alan ayrılmıştır.</p>
              </div>
            </div>
          </article>
          <article class="panel glass-card">
            <div class="section-header">
              <div>
                <div class="eyebrow">Öne çıkan</div>
                <h2 class="section-title">${escapeHtml(province.name)} turları</h2>
              </div>
            </div>
            <div class="grid-cards">
              ${relatedTours.map((tour) => `
                <article class="tour-card">
                  <div class="tour-visual" data-badge="${escapeHtml(tour.badge)}">
                    <div>
                      <div class="eyebrow">${escapeHtml(tour.city)}</div>
                      <h3>${escapeHtml(tour.title)}</h3>
                    </div>
                    <div class="meta-row">
                      <span class="pill">${escapeHtml(tour.nights)}</span>
                      <span class="pill">${escapeHtml(tour.price)}</span>
                    </div>
                  </div>
                  <div class="body">
                    <p>${escapeHtml(tour.summary)}</p>
                    <div class="meta-row">${tour.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join('')}</div>
                    <div class="tour-actions">
                      <a class="btn btn-primary" href="/${tour.collection}">İncele</a>
                      <a class="btn" href="/sepet?tailor=1">Sepete ekle</a>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </article>
          <article class="panel glass-card">
            <h3>İlçe açılır yapısı</h3>
            <p>Her ilçe için ayrı açılış akışı, bu il sayfasındaki ankora bağlanarak tek dosya altında sunuluyor. Arama sonucu tıklaması doğrudan bu sayfayı açar.</p>
            <div class="meta-row">
              ${topDistricts.map((district) => `<a class="pill" href="/il/${province.slug}/${district.slug}.html">${escapeHtml(district.name)}</a>`).join('')}
            </div>
          </article>
        </section>
      </div>
    </section>
  </main>
</body>
</html>`;
}

function buildDistrictBannerSvg(province, district, copy) {
  const accent = copy.accent;
  const secondary = blendHex(accent, '#0b1220', 0.28);
  const tertiary = blendHex(accent, '#ffffff', 0.28);
  const name = escapeXml(district.name);
  const provinceName = escapeXml(province.name);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${name} banner">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="48%" stop-color="${secondary}" />
      <stop offset="100%" stop-color="#0b1220" />
    </linearGradient>
    <radialGradient id="r1" cx="20%" cy="18%" r="85%">
      <stop offset="0%" stop-color="${tertiary}" stop-opacity="0.82" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="20" /></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <rect width="1600" height="900" fill="url(#r1)" opacity="0.8"/>
  <path d="M0 640 C 190 540, 360 680, 540 620 C 720 560, 860 420, 1040 500 C 1220 580, 1390 560, 1600 450 L 1600 900 L 0 900 Z" fill="#08111f" opacity="0.52"/>
  <path d="M180 650 C 260 580, 360 580, 440 650" stroke="#fff" stroke-opacity="0.22" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M540 610 C 620 560, 700 560, 780 610" stroke="#fff" stroke-opacity="0.16" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="1230" cy="210" r="165" fill="${tertiary}" opacity="0.18" filter="url(#blur)"/>
  <circle cx="360" cy="760" r="210" fill="#fff" opacity="0.06" filter="url(#blur)"/>
  <text x="92" y="150" fill="#f2f7ff" font-family="Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="5">MY TOUR GUIDE</text>
  <text x="92" y="260" fill="#ffffff" font-family="Arial, sans-serif" font-size="104" font-weight="800">${name}</text>
  <text x="92" y="332" fill="#e3ecff" font-family="Arial, sans-serif" font-size="34" font-weight="500">${provinceName} • ${escapeXml(province.region)}</text>
  <text x="92" y="780" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="500">District guide • Tailor-made routes • SEO ready</text>
</svg>`;
}

function buildDistrictHtml({ province, district, copy, districts }) {
  const banner = `/district-banners/${province.slug}/${district.slug}.svg`;
  const pageTitle = districtPageTitles.tr(district.name, province.name);
  const pageDescription = districtPageDescriptions.tr(district.name, province.name, province.region);
  const keywordList = buildKeywords([district.name, province.name, province.region, ...districts.slice(0, 4).map((item) => item.name)]);
  const relatedTours = buildDistrictTours(province, district);
  const nearbyDistricts = districts
    .filter((item) => item.slug !== district.slug)
    .slice(0, 8);

  return `<!doctype html>
<html lang="tr" data-theme="aurora">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0c1220">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta name="keywords" content="${escapeHtml(keywordList.join(', '))}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:image" content="${banner}">
  <link rel="canonical" href="/il/${province.slug}/${district.slug}.html">
  <link rel="stylesheet" href="/assets/styles.css">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${district.name} İlçe Sayfası`,
    description: pageDescription,
    url: `/il/${province.slug}/${district.slug}.html`,
    isPartOf: {
      '@type': 'WebSite',
      name: businessProfile.name,
      url: '/',
    },
  })}</script>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/" aria-label="My Tour Guide">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>
          <span class="brand-name">My Tour Guide</span>
          <span class="brand-sub">${escapeHtml(copy.tag)}</span>
        </span>
      </a>
      <nav class="nav" aria-label="Main">
        ${tourCollections.map((item) => `<a href="/${item.slug}">${escapeHtml(item.title.tr)}</a>`).join('')}
        <a href="/il/${province.slug}.html">${escapeHtml(province.name)}</a>
        <a href="/admin">Admin Panel</a>
        <a href="/">Ana Sayfa</a>
      </nav>
      <div class="top-actions">
        <a class="icon-btn" href="/?search=${encodeURIComponent(district.name)}">⌕</a>
        <a class="icon-btn" href="/sepet?tailor=1">🛒</a>
      </div>
    </div>
  </header>
  <main class="app-shell">
    <section class="page">
      <div class="page-hero" style="--page-gradient: linear-gradient(135deg, ${copy.accent}, #0b1220)">
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">${escapeHtml(province.name)}</div>
            <h1 class="page-title">${escapeHtml(district.name)}</h1>
            <p>${escapeHtml(pageDescription)} İlçe bazlı rota, yakın çevre alternatifleri ve tailormade planlama tek sayfada sunulur.</p>
            <div class="meta-row">
              <span class="pill">${escapeHtml(province.region)}</span>
              <span class="pill">Plaka ${province.plate}</span>
              <span class="pill">SEO ready</span>
            </div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="/il/${province.slug}.html">İl sayfası</a>
              <a class="btn" href="/sepet?tailor=1">Satın al</a>
            </div>
          </div>
          <div class="glass-card" style="overflow:hidden;">
            <img src="${banner}" alt="${escapeHtml(district.name)} banner" style="display:block;width:100%;height:100%;min-height:280px;object-fit:cover;">
          </div>
        </div>
      </div>

      <div class="page-layout">
        <aside class="sticky-stack">
          <section class="sidebar glass-card">
            <h3>İlçe listesi</h3>
            <div class="list">
              ${districts.map((item) => `
                <a class="list-item" id="district-${item.slug}" href="/il/${province.slug}/${item.slug}.html">
                  <strong>${escapeHtml(item.name)}</strong>
                  <small>${item.slug === district.slug ? 'Aktif' : 'İlçe sayfası'}</small>
                </a>
              `).join('')}
            </div>
          </section>
          <section class="sidebar glass-card">
            <h3>Yakın çevre</h3>
            <div class="list">
              ${nearbyDistricts.map((item) => `<div class="list-item"><strong>${escapeHtml(item.name)}</strong><small>Komşu rota</small></div>`).join('')}
            </div>
          </section>
        </aside>
        <section class="content-area">
          <article class="panel glass-card">
            <div class="section-header">
              <div>
                <div class="eyebrow">Banner</div>
                <h2 class="section-title">${escapeHtml(district.name)} için tanıtım</h2>
              </div>
              <a class="btn btn-primary" href="/sepet?tailor=1">Turları birleştir</a>
            </div>
            <div class="split">
              <div>
                <p>${escapeHtml(buildDistrictIntro(province, district))}</p>
                <p>Bu sayfa ayrı bir HTML dosyası olarak üretildi. İlçe düzeyinde SEO başlığı, açıklama, keyword ve schema hazırdır.</p>
              </div>
              <div>
                <p><strong>Arama dostu etiketler:</strong> ${escapeHtml(keywordList.join(', '))}</p>
                <p><strong>Ulaşım / transfer:</strong> Bölgeye göre otogar, havaalanı ve yerel erişim notları admin tarafından eklenebilir.</p>
              </div>
            </div>
          </article>
          <article class="panel glass-card">
            <div class="section-header">
              <div>
                <div class="eyebrow">Öne çıkan</div>
                <h2 class="section-title">${escapeHtml(district.name)} turları</h2>
              </div>
            </div>
            <div class="grid-cards">
              ${relatedTours.map((tour) => `
                <article class="tour-card">
                  <div class="tour-visual" data-badge="${escapeHtml(tour.badge)}">
                    <div>
                      <div class="eyebrow">${escapeHtml(tour.city)}</div>
                      <h3>${escapeHtml(tour.title)}</h3>
                    </div>
                    <div class="meta-row">
                      <span class="pill">${escapeHtml(tour.nights)}</span>
                      <span class="pill">${escapeHtml(tour.price)}</span>
                    </div>
                  </div>
                  <div class="body">
                    <p>${escapeHtml(tour.summary)}</p>
                    <div class="meta-row">${tour.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join('')}</div>
                    <div class="tour-actions">
                      <a class="btn btn-primary" href="/${tour.collection}">İncele</a>
                      <a class="btn" href="/sepet?tailor=1">Sepete ekle</a>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </article>
          <article class="panel glass-card">
            <h3>İlçe sayfası akışı</h3>
            <p>Bu ilçe sayfası, province sayfasından bağımsız açılır; arama sonuçları doğrudan bu dosyaya gider. Kullanıcı isterse il sayfasına geri dönebilir.</p>
          </article>
        </section>
      </div>
    </section>
  </main>
</body>
</html>`;
}

function buildTourCards(province, copy) {
  const firstDistrict = province.districts[0]?.name || 'Merkez';
  const secondDistrict = province.districts[1]?.name || firstDistrict;
  const regionTypes = regionThemes[province.region] || ['kultur', 'sehir', 'aile'];
  return [
    {
      title: `${province.name} Keşif Turu`,
      badge: 'Discover',
      summary: `${province.name} içinde ${firstDistrict} ve çevresini kapsayan kısa keşif rotası.`,
      city: province.region,
      nights: '1 Gece 2 Gün',
      price: `${7900 + province.plate * 90} TRY`,
      tags: [regionTypes[0], firstDistrict, province.region],
      collection: collectionByRegion(province.region),
    },
    {
      title: `${province.name} Tailor-Made`,
      badge: 'Custom',
      summary: `${firstDistrict} ile ${secondDistrict} arasında birleşik, esnek ve çok duraklı özel program.`,
      city: province.name,
      nights: 'Esnek',
      price: `${11900 + province.plate * 120} TRY`,
      tags: [regionTypes[1] || 'sehir', secondDistrict, 'tailor-made'],
      collection: 'paket-turlar',
    },
  ];
}

function buildDistrictTours(province, district) {
  const regionTypes = regionThemes[province.region] || ['kultur', 'sehir', 'aile'];
  return [
    {
      title: `${district.name} Keşif Rotası`,
      badge: 'District',
      summary: `${district.name} çevresinde kısa, odaklı ve ilçe bazlı deneyim rotası.`,
      city: province.name,
      nights: '1 Gece 2 Gün',
      price: `${7200 + province.plate * 85} TRY`,
      tags: [regionTypes[0], district.name, province.region],
      collection: collectionByRegion(province.region),
    },
    {
      title: `${district.name} Tailor-Made`,
      badge: 'Custom',
      summary: `${district.name} ile komşu ilçeleri birleştiren esnek ve çok duraklı özel program.`,
      city: province.name,
      nights: 'Esnek',
      price: `${10900 + province.plate * 110} TRY`,
      tags: [regionTypes[1] || 'sehir', district.name, 'tailor-made'],
      collection: 'paket-turlar',
    },
  ];
}

function buildDistrictIntro(province, district) {
  const base = `${district.name}, ${province.name} ilinin ${province.region} hattında yer alan önemli yerleşimlerinden biridir.`;
  const theme = regionThemes[province.region] || ['kultur', 'sehir', 'aile'];
  return `${base} Bu alan; ${theme.join(', ')} odaklı tur akışları, yerel ulaşım bağlantıları ve tailor-made seyahat kombinasyonları için hazırlanmıştır.`;
}

function collectionByRegion(region) {
  if (region === 'Akdeniz' || region === 'Ege') return 'mavi-turlar';
  if (region === 'Karadeniz') return 'grup-turlari';
  if (region === 'Doğu Anadolu') return 'paket-turlar';
  if (region === 'Güneydoğu Anadolu') return 'turkiye-turlari';
  if (region === 'İç Anadolu') return 'paket-turlar';
  return 'turkiye-turlari';
}

function buildKeywords(parts) {
  return [...new Set(parts.flatMap((item) => [item, `${item} turu`, `${item} tatil`, `${item} seyahat`]).map((value) => String(value || '').trim()).filter(Boolean))];
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeXml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function blendHex(a, b, amount) {
  const ah = hexToRgb(a);
  const bh = hexToRgb(b);
  const mix = (x, y) => Math.round(x + (y - x) * amount);
  return rgbToHex(mix(ah.r, bh.r), mix(ah.g, bh.g), mix(ah.b, bh.b));
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const value = clean.length === 3
    ? clean.split('').map((ch) => ch + ch).join('')
    : clean;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('')}`;
}
