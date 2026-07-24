export const menuItems = [
  { slug: 'turkiye-turlari', key: 'menu.turkiye' },
  { slug: 'mavi-turlar', key: 'menu.mavi' },
  { slug: 'grup-turlari', key: 'menu.grup' },
  { slug: 'paket-turlar', key: 'menu.paket' },
  { slug: 'yurtdisi-turlar', key: 'menu.yurtdisi' },
];

export const tourTypes = [
  { slug: 'kultur', key: 'types.culture', emoji: '🏛️' },
  { slug: 'sehir', key: 'types.city', emoji: '🌆' },
  { slug: 'alisveris', key: 'types.shopping', emoji: '🛍️' },
  { slug: 'trekking', key: 'types.trekking', emoji: '🥾' },
  { slug: 'aile', key: 'types.family', emoji: '👨‍👩‍👧‍👦' },
  { slug: 'balayi', key: 'types.honeymoon', emoji: '💞' },
  { slug: 'doga', key: 'types.nature', emoji: '🌲' },
  { slug: 'safari', key: 'types.safari', emoji: '🦒' },
  { slug: 'deniz', key: 'types.sea', emoji: '🌊' },
  { slug: 'kayak', key: 'types.ski', emoji: '⛷️' },
  { slug: 'paragliding', key: 'types.paragliding', emoji: '🪂' },
  { slug: 'diger', key: 'types.other', emoji: '✨' },
];

export const tourCollections = [
  { slug: 'turkiye-turlari', title: { tr: 'Türkiye Turları', en: 'Turkey Tours', ru: 'Туры по Турции' } },
  { slug: 'mavi-turlar', title: { tr: 'Mavi Turlar', en: 'Blue Cruises', ru: 'Голубые круизы' } },
  { slug: 'grup-turlari', title: { tr: 'Grup Turları', en: 'Group Tours', ru: 'Групповые туры' } },
  { slug: 'paket-turlar', title: { tr: 'Paket Turlar', en: 'Package Tours', ru: 'Пакетные туры' } },
  { slug: 'yurtdisi-turlar', title: { tr: 'Yurtdışı Turlar', en: 'International Tours', ru: 'Зарубежные туры' } },
];

export const themes = [
  { id: 'aurora', label: 'Aurora', sample: '#6ae0d9' },
  { id: 'coastal', label: 'Coastal', sample: '#78cfff' },
  { id: 'lagoon', label: 'Lagoon', sample: '#7fe5c2' },
  { id: 'sunrise', label: 'Sunrise', sample: '#ffca7a' },
  { id: 'light', label: 'Açık', sample: '#0d9e9d' },
  { id: 'sunset', label: 'Sunset', sample: '#ff8c8c' },
];

export const widgetCatalog = [
  { id: 'search', title: 'Gelişmiş Arama', description: 'İl, ilçe, tur, tema ve içerik araması.' },
  { id: 'currency', title: 'Fiyat Dönüştürücü', description: 'Try, EUR, USD görüntüleme.' },
  { id: 'weather', title: 'Hava Durumu', description: 'Tur planlamasında şehir bazlı hava paneli.' },
  { id: 'faq', title: 'Sık Sorulan Sorular', description: 'Admin panelden aç/kapa.' },
  { id: 'support', title: 'Canlı Destek', description: 'WhatsApp, telefon, chat entegrasyonu.' },
  { id: 'testimonial', title: 'Yorumlar', description: 'Müşteri referansları ve puanlama.' },
];

export const adminGroups = [
  { id: 'account', label: 'Hesap ve Giriş', description: 'Admin kullanıcı adı, parola ve backend oturum ayarları.', icon: '🔐' },
  { id: 'appearance', label: 'Görünüm', description: 'Tema, renk, dil ve menü etiketleri.', icon: '🎨' },
  { id: 'homepage', label: 'Ana Sayfa', description: 'Hero, arama, istatistik ve öne çıkan bloklar.', icon: '🏝️' },
  { id: 'content', label: 'İçerik', description: 'Tanıtım metinleri, footer ve iletişim alanları.', icon: '📝' },
  { id: 'publish', label: 'Yayın Merkezi', description: 'Yayında/pasif durumları ve görünürlük anahtarları.', icon: '📣' },
  { id: 'commerce', label: 'Rezervasyon ve CRM', description: 'Checkout, ödeme, PDF ve CRM akışları.', icon: '🧾' },
  { id: 'security', label: 'Güvenlik', description: 'KVKK, form korumaları ve login politikası.', icon: '🛡️' },
];

export const cmsDefaults = {
  brand: {
    title: 'Mytourguide.com.tr',
  },
  menu: {
    turkiye: 'Türkiye Turları',
    mavi: 'Mavi Turlar',
    grup: 'Grup Turları',
    paket: 'Paket Turlar',
    yurtdisi: 'Yurtdışı Turlar',
  },
  hero: {
    kicker: 'Yeni nesil seyahat vitrini',
    title: 'Türkiye genelinde arama yapın, turları birleştirin, rezervasyonu yönetin.',
    copy: '81 il, çok dilli deneyim, tailor-made akış, admin kontrolü, güvenlik odaklı form yapısı ve büyümeye hazır içerik mimarisi.',
    ctaSearch: 'Aramayı Aç',
    ctaPlan: 'Tailor-made Planla',
    ctaAdmin: 'Admin Panel',
  },
  home: {
    searchTitle: 'Türkiye genelinde il, ilçe veya tur arayın',
    searchCopy: 'Arama, kategori ve hızlı bağlantılar tek satırda çalışır.',
    searchPlaceholder: 'İl, ilçe ya da tur adı yazın',
    sliderTitle: 'Seçili rotalar',
    categoriesTitle: 'Tur kategorileri',
    featuredTitle: 'Tur kategorileri',
    provincesTitle: 'İl sayfaları',
    tailorTitle: 'Tailor-made akış',
    seoTitle: 'SEO ve güvenlik',
    workflowTitle: 'İş akışı',
    searchTitle: 'Gelişmiş arama',
    statsTitle: 'Seyahat özeti',
    sectionOrder: ['homeSearch', 'homeSlider', 'homeCategories', 'homeStats', 'homeProvinces', 'homeFeatured', 'homeTailor', 'homeSeo'],
    slides: [
      {
        title: 'İstanbul, Antalya, Kapadokya',
        copy: 'Hazır dikdörtgen vitrin, hızlı rezervasyon ve tailor-made kombinasyonlar.',
        image: '/banners/istanbul.svg',
        cta: 'Turları incele',
        href: '/turkiye-turlari',
      },
      {
        title: 'Mavi tur ve sahil rotaları',
        copy: 'Yaz sezonuna uygun, admin panelden açılıp kapatılabilen özel vitrin.',
        image: '/banners/antalya.svg',
        cta: 'Mavi turlar',
        href: '/mavi-turlar',
      },
      {
        title: 'Tailor-made seyahat planı',
        copy: 'İller arası birleştirme, ulaşım seçimi ve PDF özeti tek akışta.',
        image: '/banners/nevsehir.svg',
        cta: 'Plan oluştur',
        href: '/sepet?tailor=1',
      },
    ],
    categories: [
      {
        title: 'Kültür',
        copy: 'Müze, tarih ve şehir rotaları.',
        image: '/banners/istanbul.svg',
        href: '/turkiye-turlari?type=kultur',
      },
      {
        title: 'Şehir',
        copy: 'Kısa kaçamaklar ve yoğun programlar.',
        image: '/banners/ankara.svg',
        href: '/turkiye-turlari?type=sehir',
      },
      {
        title: 'Balayı',
        copy: 'Özel oteller ve romantik planlar.',
        image: '/banners/antalya.svg',
        href: '/turkiye-turlari?type=balayi',
      },
      {
        title: 'Doğa',
        copy: 'Yayla, trekking ve manzara rotaları.',
        image: '/banners/trabzon.svg',
        href: '/turkiye-turlari?type=doga',
      },
      {
        title: 'Deniz',
        copy: 'Mavi tur ve koy deneyimleri.',
        image: '/banners/mugla.svg',
        href: '/mavi-turlar',
      },
      {
        title: 'Kayak',
        copy: 'Kış sezonu ve yüksek rakım turları.',
        image: '/banners/erzurum.svg',
        href: '/paket-turlar?type=kayak',
      },
    ],
  },
  footer: {
    note: 'Modern seyahat acentesi web vitrini. Reservations, CRM ve desktop entegrasyonu için hazır mimari.',
    security: 'HTTPS, CSP, KVKK, maskeli ödeme formu, audit log, 3D Secure ve WAF entegrasyonu için ayrılmış alanlar mevcuttur.',
  },
  contact: {
    title: 'Bize ulaşın',
    intro: 'Şirket sahibi yalnızca gerekli bilgileri girerek sistemi çalışır hale getirebilir; tema, dil, widget, tur ve sayfa içerikleri yönetim panelinden düzenlenebilir.',
  },
  login: {
    title: 'Admin Girişi',
    subtitle: 'Yönetim paneli erişimi için kimlik doğrulama.',
  },
  auth: {
    username: 'admin',
    password: '',
  },
  commerce: {
    checkoutTitle: 'Sepet ve ödeme',
    checkoutNote: 'Kart bilgileri, tarih seçimi, tailor-made birleşim ve PDF çıktı akışı.',
    pdfMail: 'rezervation@mytourguide.com.tr',
    crmWebhook: '/api/crm',
  },
  security: {
    loginPolicy: 'Backend session cookie ile giriş yapılır. Parola düz metin tutulmaz; üretimde secret env ile değiştirilmelidir.',
    kvkk: 'Kullanıcı rızası, veri maskeleme ve yalnızca zorunlu alanların toplanması önerilir.',
    payment: 'Ödeme ekranı maskelenmiş kart alanları, 3D Secure yönlendirmesi ve audit log ile hazırlanmıştır.',
  },
  publish: {
    homeBrand: true,
    homeMenu: true,
    homeSearch: true,
    homeSlider: true,
    homeCategories: true,
    homeHero: true,
    homeStats: true,
    homeFeatured: true,
    homeProvinces: true,
    homeTailor: true,
    homeSeo: true,
    seo: true,
    footer: true,
    contact: true,
    checkout: true,
    widgets: true,
  },
  adminNotes: 'Admin paneldeki tüm alanlar kaydedilebilir; frontend ayarları localStorage üzerinde, oturum ise backend cookie ile tutulur.',
};

export const businessProfile = {
  name: 'My Tour Guide',
  domain: 'mytourguide.com.tr',
  email: 'rezervation@mytourguide.com.tr',
  phone: '+90 212 555 44 88',
  phoneSecondary: '+90 532 555 44 88',
  address: 'Harbiye, Şişli / İstanbul, Türkiye',
  hours: 'Pzt-Cts 09:00-19:00',
};

export const defaultQuestions = [
  { id: 'transport', label: 'Ulaşımı kim sağlasın?', options: ['Ben kendim ayarlayacağım', 'Siz sağlayın'] },
  { id: 'mode', label: 'Ulaşım tercihi', options: ['Hava', 'Kara'] },
  { id: 'room', label: 'Oda tercihi', options: ['Standart', 'Deluxe', 'Suite'] },
  { id: 'transfer', label: 'Havalimanı transferi', options: ['İstiyorum', 'İstemiyorum'] },
];

export const regionCopy = {
  Akdeniz: {
    tag: 'Deniz, güneş ve canlı sahil hattı',
    accent: '#12d6c5',
    intro: 'Akdeniz hattı, sahil kasabaları, yat limanları, koylar ve açık hava deneyimleriyle öne çıkar.',
  },
  'Ege': {
    tag: 'Köklü tarih, gurme duraklar ve kıyı yaşamı',
    accent: '#6fb6ff',
    intro: 'Ege şehirleri; antik kentler, butik rotalar, gastronomi ve sakin bir seyahat ritmi sunar.',
  },
  Marmara: {
    tag: 'Şehir, kültür ve iş seyahatinin kalbi',
    accent: '#7a8cff',
    intro: 'Marmara bölgesi, merkezî ulaşım ağları ve yüksek yoğunluklu tur seçenekleri için güçlü bir başlangıç noktasıdır.',
  },
  'İç Anadolu': {
    tag: 'Tarihi rotalar ve güçlü karayolu bağlantıları',
    accent: '#f0b45e',
    intro: 'İç Anadolu, kültür turları ve çok duraklı tailormade planlar için ideal omurgadır.',
  },
  'Karadeniz': {
    tag: 'Yeşil doğa, yaylalar ve fotoğraf rotaları',
    accent: '#65d17a',
    intro: 'Karadeniz şehirleri yaylalar, ormanlar, kıyı geçişleri ve serin yaz rotalarıyla öne çıkar.',
  },
  'Doğu Anadolu': {
    tag: 'Geniş ufuklar, kış turizmi ve güçlü deneyimler',
    accent: '#d47bff',
    intro: 'Doğu Anadolu; kayak, kültür ve karla kaplı manzaralar için zengin içerik üretir.',
  },
  'Güneydoğu Anadolu': {
    tag: 'Lezzet, tarih ve kültürel derinlik',
    accent: '#ff8d67',
    intro: 'Güneydoğu Anadolu, gastronomi ve tarih turizmini birleştiren içerikler için dikkat çekici bir bölgedir.',
  },
};

export const pageDefaults = {
  home: {
    title: 'My Tour Guide | Türkiye Turları',
    description: 'Türkiye il ve ilçe bazlı arama, tailor-made tur planlama, SEO hazır sayfalar ve çok dilli seyahat deneyimi.',
  },
};

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
