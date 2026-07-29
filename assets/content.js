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
  { id: 'mint', label: 'Mint', sample: '#8fe7c2' },
  { id: 'sky', label: 'Sky', sample: '#8ccfff' },
  { id: 'peach', label: 'Peach', sample: '#ffc39a' },
  { id: 'sage', label: 'Sage', sample: '#b9de9d' },
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
  { id: 'pages', label: 'Sayfalar', description: 'İl/ilçe sayfalarını düzenle, yeni kategori ve sayfa oluştur.', icon: '📄' },
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

// Real, research-verified per-province content used as a fallback for province pages
// when the admin hasn't set custom content via the panel. Keyed by province slug.
// This is populated incrementally, province by province — see /areas/mytourguide-web.md
// for progress. Districts will get an equivalent districtCopy structure later.
export const provinceCopy = {
  ardahan: {
    summary: 'Ardahan, Karadeniz ile Doğu Anadolu bölgelerinin kesişim noktasında, Kura Nehri kıyısında kurulu, Doğu Anadolu\'nun Van Gölü\'nden sonraki en büyük gölü Çıldır Gölü ile tanınan bir sınır ilidir.',
    facts: 'Kuzey ve doğuda Gürcistan, güneyde Kars, batıda Artvin ve Erzurum ile komşudur. Ardahan Kalesi, Kanuni Sultan Süleyman\'ın emriyle Kura Nehri kıyısında inşa ettirilmiştir. Ortalama yüksekliği 1.800 metre olan il, sert kışları (-30°C\'ye varan soğuklar) ve kısa serin yazlarıyla karasal iklime sahiptir; ekonomisi büyük ölçüde hayvancılığa dayanır. 5 ilçesi (Çıldır, Damal, Göle, Hanak, Posof) ile merkez ilçeden oluşur; 1992\'de il statüsü kazanmıştır.',
  },
  antalya: {
    summary: '"Attalos Yurdu" anlamına gelen Antalya, II. Attalos tarafından kurulan, Bergama Krallığı, Roma (Attaleia), Bizans ve Selçuklu dönemlerinden izler taşıyan, 630 km\'yi bulan sahil şeridiyle Türkiye\'nin en önemli Akdeniz turizm merkezidir.',
    facts: 'Yüzölçümü bakımından Türkiye\'nin 6., nüfus bakımından 5. büyük ilidir; 2023 sonu nüfusu 2,7 milyona yakındır. Kuzeyinde Burdur, Isparta ve Konya, doğusunda Karaman ve Mersin, batısında Muğla illeri vardır. Tarihi Kaleiçi semti 1972\'de SİT alanı ilan edilmiş, 1984\'te Altın Elma Turizm Oskarı almıştır. Ekonomisi büyük ölçüde turizm, ticaret ve tarıma dayanır; 19 ilçesi vardır.',
  },
  ankara: {
    summary: 'Ankara, 13 Ekim 1923\'te Türkiye Cumhuriyeti\'nin başkenti ilan edilen, Frigya, Lidya, Pers, Galat, Roma, Bizans ve Selçuklu dönemlerinden izler taşıyan köklü bir İç Anadolu şehridir.',
    facts: 'Yüzölçümü 25.632-26.897 km² civarında, denizden yüksekliği yaklaşık 890 metredir; 25 ilçesi ve 2025 sonu itibarıyla yaklaşık 5,9 milyon nüfusu vardır. Doğuda Kızılırmak, batıda Sakarya nehirlerinin çizdiği kavisler arasında yer alır; kuzeyindeki Köroğlu Dağları\'nın en yüksek noktası Yıldırım Dağı 2.044 metredir. Ankara Kalesi, Anıtkabir ve Anadolu Medeniyetleri Müzesi şehrin simge yapılarındandır.',
  },
  adana: {
    summary: 'Adana, Çukurova\'nın verimli ovasında, Seyhan Nehri kıyısında kurulu Akdeniz\'in en kalabalık şehirlerinden biridir. Hitit dönemine (Uruadaniya) uzanan tarihi, Roma-Bizans kalıntıları ve dünyaca ünlü Adana kebabıyla tanınır.',
    facts: 'Nüfus yaklaşık 2,26 milyon, 15 ilçesi vardır. Tarihi M.Ö. 3000\'lere uzanır; Hitit, Roma ve Bizans izleri taşır. Adana Kalesi (M.Ö. 1. yy, Romalılar), Taşköprü, Adana Ulu Camii (1509-1541) ve dünyanın en büyük antik kentlerinden Anavarza ören yeri başlıca tarihi noktalarıdır. Şehir aynı zamanda Türkiye\'nin tarım ve sanayi merkezlerinden biridir; İstanbul\'a 936 km, Ankara\'ya 488 km uzaklıktadır.',
  },
  adiyaman: {
    summary: 'Adıyaman, UNESCO Dünya Mirası Listesi\'ndeki Nemrut Dağı ile dünya çapında tanınan, Güneydoğu Anadolu\'nun tarih ve doğa turizmi açısından en zengin illerinden biridir. Kommagene Krallığı\'na başkentlik yapmış bir bölgedir.',
    facts: 'Yüzölçümü 7.614 km², deniz seviyesinden yüksekliği 669 metredir. Nemrut Dağı\'ndaki 2.150 metre yükseklikteki dev heykeller, Kral I. Antiochos tarafından M.Ö. 1. yüzyılda inşa ettirilmiştir (UNESCO listesi 1987). Fırat Nehri ve Atatürk Barajı ilin en önemli su kaynaklarıdır; Kahta ilçesi Nemrut\'a en yakın merkezdir. İklim yazın sıcak-kurak, kışın serin geçer; yöresel mutfakta çiğ köfte, içli köfte ve besni üzümü öne çıkar.',
  },
  afyonkarahisar: {
    summary: '"Türkiye\'nin termal başkenti" olarak bilinen Afyonkarahisar, İç Batı Anadolu\'da yer alır; zengin jeotermal kaynakları ve Hitit dönemine uzanan Afyonkarahisar Kalesi ile tanınan bir kültür ve sağlık turizmi merkezidir.',
    facts: 'Eskişehir, Kütahya, Uşak, Denizli, Burdur, Isparta ve Konya ile komşudur. Afyonkarahisar Kalesi M.Ö. 1350 yıllarında Hitit İmparatoru II. Murşil tarafından 226 metre yükseklikteki bir kaya kütlesi üzerine yaptırılmıştır (kaleye 625 basamakla çıkılır). İlde Gazlıgöl, Ömer-Gecek, Heybeli ve Hüdai başta olmak üzere 5 resmi "Turizm Merkezi" ilan edilmiş termal tesis bulunur; Avrupa\'da termal su kaynağı bakımından ilk sırada yer alan Türkiye\'nin en zengin bölgelerindendir.',
  },
  agri: {
    summary: 'Ağrı, Türkiye\'nin en yüksek zirvesi olan Ağrı Dağı (Ararat) ve Doğubeyazıt\'taki İshak Paşa Sarayı ile tanınan, Doğu Anadolu\'nun en doğusundaki illerinden biridir.',
    facts: 'İran, Iğdır, Kars, Muş, Erzurum, Van ve Bitlis ile komşudur. İshak Paşa Sarayı, 1685-1784 yılları arasında (99 yıl) inşa edilmiş; Osmanlı, Selçuklu, Fars ve Ermeni mimari unsurlarını bir arada barındıran 116 odalı bir külliyedir, UNESCO Dünya Kültür Mirası geçici listesindedir. Ağrı Dağı, halk arasında Nuh\'un Gemisi efsanesiyle anılır. İle Ahmed-i Hani Havalimanı üzerinden İstanbul, Ankara ve İzmir\'den doğrudan ulaşım sağlanabilir.',
  },
  aksaray: {
    summary: 'Aksaray, İç Anadolu\'da, Kapadokya bölgesinin batı ucunda yer alan; dünyanın en büyük kanyonlarından sayılan Ihlara Vadisi ve volkanik Hasan Dağı ile tanınan bir tarih ve doğa turizmi merkezidir.',
    facts: 'Ihlara Vadisi, Hasan Dağı\'nın (3.268 m) volkanik lavlarının Melendiz Çayı tarafından aşındırılmasıyla oluşmuş, yaklaşık 14-18 km uzunluğunda, 100-150 m derinliğinde bir kanyondur; Güzelyurt ilçesi sınırlarında yer alır ve 4. yüzyıldan kalma freskli kayaya oyulmuş kiliseleriyle (Ağaçaltı, Yılanlı, Kokar Kilise gibi) önemli bir erken Hristiyanlık merkezidir. Aksaray, 1933-1989 arasında Niğde\'ye bağlı bir ilçe iken 1989\'da yeniden il olmuştur.',
  },
  amasya: {
    summary: '"Şehzadeler Şehri" olarak bilinen Amasya, Yeşilırmak kıyısındaki tarihi Yalıboyu Evleri ve Harşena Dağı\'ndaki Pontus Kral Kaya Mezarları ile tanınan, Karadeniz\'in iç kesimlerindeki köklü bir kültür şehridir.',
    facts: 'Yüzölçümü 5.690 km²; doğuda Tokat, güneyde Yozgat, batıda Çorum, kuzeyde Samsun ile komşudur. M.Ö. 4. yüzyılda Pontus Krallığı\'na başkentlik yapmış; Harşena Dağı eteklerindeki kayalara oyulmuş 21 Kral Kaya Mezarı bu döneme aittir. Osmanlı döneminde 183 yıl boyunca şehzadelerin yetiştiği bir sancak merkezi olmuştur; coğrafyacı Strabon\'un memleketidir. Yöresel lezzetleri arasında Amasya elması, bamyası ve çöreği öne çıkar.',
  },
  mugla: {
    summary: 'Muğla, Ege ve Akdeniz\'in kesiştiği Türkiye\'nin en uzun sahil şeridine (1.100 km\'yi aşan) sahip ilidir. Bodrum, Marmaris, Fethiye, Datça ve Köyceğiz gibi dünya çapında tanınan turistik merkezleriyle hem yerli hem yabancı ziyaretçilerin en çok tercih ettiği bölgelerden biridir.',
    facts: 'Yüzölçümü: 12.655 km². Antik Karya bölgesinin merkezi olan Muğla, 103 ören yerine ev sahipliği yapar; Halikarnas Mozolesi gibi dünya harikaları arasında sayılan kalıntılar buradadır. Akdeniz iklimi hakimdir: yazlar sıcak-kurak, kışlar ılık-yağışlı geçer. Ekonomi turizm, zeytincilik, arıcılık (çam balı) ve mermercilik üzerine kuruludur; Fethiye ve Ortaca çevresinde narenciye tarımı yaygındır.',
  },
};

export const districtCopy = {
  'ardahan/merkez': {
    summary: 'Ardahan Merkez, Kanuni Sultan Süleyman\'ın emriyle Kura Nehri kıyısında inşa ettirilen tarihi Ardahan Kalesi\'ne ev sahipliği yapan il merkezidir.',
    facts: 'Ortalama 1.800 metre yüksekliğiyle Ardahan, adeta Türkiye\'nin yaylası konumundadır; temel geçim kaynağı hayvancılıktır.',
  },
  'ardahan/cildir': {
    summary: 'Çıldır, Doğu Anadolu\'nun Van Gölü\'nden sonraki en büyük ikinci gölü olan Çıldır Gölü\'ne ev sahipliği yapan, en eski Türk yerleşim merkezlerinden biridir.',
    facts: '1950-1960 metre rakımdaki göl kışın tamamen donar; atlı kızak ve buz üstünde balık avı bölgenin başlıca kış turizmi etkinlikleridir. Gölün ortasındaki Akçakale Adası\'nda Neolitik döneme uzanan kalıntılar ile Urartu dönemine ait olduğu düşünülen Şeytan Kalesi ilçenin önemli tarihi noktalarıdır.',
  },
  'ardahan/damal': {
    summary: 'Damal, Ardahan-Posof karayolu üzerinde, Karadağ yamaçlarına her yıl 15 Haziran-15 Temmuz arasında yansıyan doğal Atatürk Silüeti fenomeniyle tanınan bir ilçedir.',
    facts: 'Yılın 7 ayı karla kaplı Ilgar Dağı (2.918 m) ve Keldağ (3.033 m) arasında, engebeli bir arazi yapısına sahiptir; ekonomisi hayvancılığa dayanır.',
  },
  'ardahan/gole': {
    summary: 'Göle, Ardahan\'ın nüfus ve yüzölçümü bakımından en büyük ilçesi olup, arazisinin %81\'inin orman örtüsüyle kaplı olması nedeniyle "Yeşil Göle" olarak da anılır.',
    facts: 'Ortalama 2.030-2.038 metre rakımlı düz bir ovada kurulu olan ilçe, 27 Mayıs 1992\'de yeni kurulan Ardahan iline bağlanmıştır; ekonomisi büyükbaş hayvancılık ve arpa-buğday-patates tarımına dayanır.',
  },
  'ardahan/hanak': {
    summary: 'Hanak, kuruluşu M.Ö. 680 yılına, kuzeyden gelen Saka Türk oymaklarının Ilgar Geçidi\'ni aşarak bu düzlüğe yerleşmesine dayanan tarihi bir ilçedir.',
    facts: 'Osmanlı döneminde "Meşe Ardahan" adıyla anılırdı; ekonomisi tarım ve hayvancılığa dayanır, nüfusu yaklaşık 10 bindir.',
  },
  'ardahan/posof': {
    summary: 'Posof, çevresi dağlarla çevrili, ortalama 900 metre yükseklikte, mikroklimatik iklim koşullarına sahip bir Ardahan ilçesidir.',
    facts: 'İlin diğer bölgelerinin aksine kışları yumuşak ve yağışlı, yazları sıcak geçer; Karadeniz ile Doğu Anadolu bölgelerinin geçiş kuşağında yer alır.',
  },
  'antalya/akseki': {
    summary: 'Akseki, Antalya\'nın kuzeydoğusunda, Toros Dağları\'nda yer alan, tarihi ve kültürel değerleriyle bilinen dağlık bir ilçedir.',
    facts: 'Termessos Antik Kenti\'ne yakınlığıyla bilinir; geçimini büyük ölçüde ormancılık ve hayvancılıktan sağlar.',
  },
  'antalya/aksu': {
    summary: 'Aksu, Antalya Havalimanı\'nın bulunduğu, UNESCO geçici listesindeki Perge Antik Kenti ve Kurşunlu Şelalesi ile tanınan bir ilçedir.',
    facts: 'Seracılık ve tarımla uğraşan köylere ev sahipliği yapar; Antalya\'da nüfus artış hızının en yüksek olduğu ilçedir (%5,46).',
  },
  'antalya/alanya': {
    summary: 'Alanya, Helenistik dönemde yapımına başlanan, Selçuklu döneminde tamamlanan, 6,5 km surlu ve 140 kuleli Alanya Kalesi\'yle ve Kleopatra Plajı\'yla tanınan bir Akdeniz turizm merkezidir.',
    facts: 'Antalya kent merkezine 135 km uzaklıktadır; kale 250 metre yükseklikte bir tepeye kuruludur.',
  },
  'antalya/demre': {
    summary: 'Demre, Likya uygarlığının önemli merkezlerinden biri olup Aziz Nikolaos (Noel Baba) Kilisesi ve Myra Antik Kenti\'yle Hristiyan dünyası için önemli bir hac güzergahıdır.',
    facts: 'Yakınlarındaki Kekova Adası\'nın batık kalıntıları da ilçenin önemli turistik noktalarındandır.',
  },
  'antalya/dosemealti': {
    summary: 'Döşemealtı, Antalya kent merkezine 20 km uzaklıkta, 687 km² yüzölçümüne ve yaklaşık 80 bin nüfusa sahip, doğal güzellikleri ve kırsal dokusuyla bilinen bir ilçedir.',
    facts: 'Karst mağaraları ve ormanlık alanlarıyla doğa turizmine elverişlidir.',
  },
  'antalya/elmali': {
    summary: 'Elmalı, Antalya\'nın iç kesimlerinde, Yörük Türkmenlerinin kültürünü yansıtan Gökbelen Yaylası ile tanınan tarihi bir ilçedir.',
    facts: '8 teşhir salonlu Elmalı Müzesi, bölgenin arkeolojik zenginliğini yansıtan önemli bir kültür noktasıdır.',
  },
  'antalya/finike': {
    summary: 'Finike, Antalya kent merkezine 139 km uzaklıkta, portakal bahçeleri ve 10 km\'yi bulan Finike Plajı ile Türkiye\'nin en uzun sahil şeritlerinden birine sahip bir ilçedir.',
    facts: 'Limyra ve Arykanda antik kentleri ile Cenevizli bir amiralden adını alan Andrea Doria Koyu ilçenin önemli tarihi ve doğal noktalarındandır.',
  },
  'antalya/gazipasa': {
    summary: 'Gazipaşa, Antalya kent merkezine 177 km uzaklıkta, küçük yüzölçümüne rağmen doğal güzellikleriyle öne çıkan bir sahil ilçesidir.',
    facts: 'Kendi adını taşıyan bir havalimanına sahiptir.',
  },
  'antalya/gundogmus': {
    summary: 'Gündoğmuş, Antalya\'nın kuzeydoğusunda, yaylaları ve doğal güzellikleriyle bilinen dağlık bir ilçedir.',
    facts: 'Antalya\'da nüfus artış hızının en düşük olduğu (-%5,44) ilçesidir.',
  },
  'antalya/ibradi': {
    summary: 'İbradı, Antalya\'nın Toros Dağları\'ndaki en küçük nüfuslu ilçelerinden biri olup yeşil doğası ve serin yaylalarıyla bilinir.',
    facts: 'Ceviz ve elma bahçeleriyle tarım ekonomisine sahiptir.',
  },
  'antalya/kas': {
    summary: 'Kaş, Likya Birliği\'nin önemli şehirlerinden Patara ve Antiphellos antik kentleri, Kekova Adası ve Mavi Mağara ile tanınan, dalış ve doğa turizminin merkezi bir Akdeniz ilçesidir.',
    facts: 'Bağlı beldesi Kalkan, beyaz duvarlı evleri ve gece hayatıyla tanınan ayrı bir sahil kasabasıdır; Kaputaş Plajı ilçenin öne çıkan plajlarındandır.',
  },
  'antalya/kemer': {
    summary: 'Kemer, Likya Yolu yürüyüş rotasının geçtiği, doğa ile denizin buluştuğu, turistik tesisleri ve plajlarıyla tanınan bir Antalya ilçesidir.',
    facts: 'Antalya\'nın batısında yer alır; uzun tatil sezonuyla yaz tatillerinin gözde adreslerindendir.',
  },
  'antalya/kepez': {
    summary: 'Kepez, 2021 itibarıyla 591.895 kişilik nüfusuyla Antalya\'nın en kalabalık ilçesi olup kentsel dönüşüm projeleri ve spor tesisleriyle bilinir.',
    facts: 'Antalya\'nın önemli altyapı yatırımlarının odağında yer alan merkez ilçelerinden biridir.',
  },
  'antalya/konyaalti': {
    summary: 'Konyaaltı, Antalya\'nın batısında, dünyaca tanınan Konyaaltı Plajı ile bilinen bir sahil ilçesidir.',
    facts: 'Antalya kent merkezinin denize paralel uzanan başlıca turizm bölgelerinden biridir.',
  },
  'antalya/korkuteli': {
    summary: 'Korkuteli, Antalya\'nın iç kesimlerinde, tarım ve hayvancılıkla geçimini sağlayan, Termessos Antik Kenti\'ne yakınlığıyla bilinen bir ilçedir.',
    facts: 'İç Anadolu\'ya geçiş karakteri taşıyan bir arazi yapısına sahiptir.',
  },
  'antalya/kumluca': {
    summary: 'Kumluca, Kemer ile Finike arasında, narenciye bahçeleri ve seracılığıyla bilinen, Olimpos ve Phaselis antik kentlerine yakın bir Antalya ilçesidir.',
    facts: 'Adrasan, Suluada ve Gelidonya Feneri gibi doğal güzellikleriyle de tanınır.',
  },
  'antalya/manavgat': {
    summary: 'Manavgat, dünyaca ünlü Manavgat Şelaleleri, Köprülü Kanyon Milli Parkı ve Side antik kentine yakınlığıyla Antalya\'nın turizm açısından en önemli ilçelerinden biridir.',
    facts: 'Oymapınar Gölü ve Roma dönemine ait Oluk Köprü de ilçenin gezilecek noktaları arasındadır.',
  },
  'antalya/muratpasa': {
    summary: 'Muratpaşa, tarihi Kaleiçi semtini ve Lara Plajı\'nı barındıran, Antalya\'nın ticari ve kültürel merkezi konumundaki ilçesidir.',
    facts: 'Nüfus yoğunluğunun en fazla olduğu (km² başına 5.429 kişi) Antalya ilçesidir; lüks otelleriyle de tanınır.',
  },
  'antalya/serik': {
    summary: 'Serik, Roma döneminden kalma 12 bin kişilik amfi tiyatrosuyla ünlü Aspendos Antik Kenti ile golf sahaları ve lüks tatil köyleriyle bilinen Belek bölgesine ev sahipliği yapan bir ilçedir.',
    facts: 'Aspendos, Akalar tarafından M.Ö. 10. yüzyılda kurulmuş, Belkıs Köyü sınırlarında yer alır.',
  },
  'ankara/akyurt': {
    summary: 'Akyurt, Ankara kent merkezine 33 km uzaklıkta, Balıkhisar Köyü yakınlarındaki M.Ö. 3000\'lere uzanan höyüğüyle bilinen bir ilçedir.',
    facts: 'Höyükte Eski Tunç Çağı\'na ve sonrasına ait kalıntılar bulunmuştur; ilçe Ankara\'nın kuzeydoğusunda yer alır.',
  },
  'ankara/altindag': {
    summary: 'Altındağ, Ankara Kalesi, Augustus Tapınağı, Julianus Sütunu ve Roma Hamamı gibi başkentin en önemli tarihi yapılarını barındıran, kent merkezine 1 km uzaklıktaki ilçedir.',
    facts: 'Yüzölçümü 174 km², denizden yüksekliği 850 metredir; Anadolu Medeniyetleri Müzesi, Etnografya Müzesi ve Kurtuluş Savaşı Müzesi de ilçe sınırlarındadır.',
  },
  'ankara/ayas': {
    summary: 'Ayaş, Ankara kent merkezine yaklaşık 60 km uzaklıkta, Osmanlı dönemi ahşap-taş işçiliğiyle yapılmış tarihi evleri ve şifalı termal sularıyla bilinen bir ilçedir.',
    facts: 'Kaplıcaları romatizmal hastalıklar ve kas ağrıları için tercih edilir; dar sokakları ve sakin atmosferiyle günübirlik gezi rotalarından biridir.',
  },
  'ankara/bala': {
    summary: 'Balâ, Ankara\'nın Cumhuriyet döneminden önce kurulmuş en eski yerleşim yerlerinden biri olup kent merkezine 70 km uzaklıktadır.',
    facts: '93 Harbi sonrası Kafkasya göçmenlerinin yerleştiği Kartal Dağı mevkiinde kurulmuştur; Beynam Ormanları ve Kesikköprü Barajı ilçe sınırları içindedir, ortalama yükseklik 1.313 metredir.',
  },
  'ankara/beypazari': {
    summary: 'Beypazarı, korunmuş Osmanlı dönemi evleri, gümüş işçiliği ve havucuyla tanınan, 2020\'de UNESCO\'nun kalıcı listesine alınan tarihi bir Ankara ilçesidir.',
    facts: 'Suluhan Kervansarayı, İnözü Vadisi, Yaşayan Müze ve Hıdırlık Tepesi başlıca gezi noktalarıdır; kent merkezine yaklaşık 100 km uzaklıktadır.',
  },
  'ankara/camlidere': {
    summary: 'Çamlıdere, Ankara\'nın kuzeybatısında, kent merkezine 108 km uzaklıkta, Selçuklu dönemine ait Peçenek Camii ile Bizans dönemi kalıntılarını barındıran bir ilçedir.',
    facts: 'Ormanlık arazisiyle av turizmi ve doğa sporları açısından bilinir.',
  },
  'ankara/cankaya': {
    summary: 'Çankaya, 1936\'da Ankara ilçesinden ayrılarak kurulmuş, günümüzde başkentin idari, kültürel ve prestijli yerleşim merkezi konumundaki ilçedir.',
    facts: 'Çankaya Köşkü\'nün de bulunduğu ilçe, Ankara\'nın en yüksek gelişmişlik düzeyine sahip bölgelerinden biridir.',
  },
  'ankara/cubuk': {
    summary: 'Çubuk, Ankara kent merkezine 39 km uzaklıkta, adını ilçeden geçen Çubuk Çayı\'ndan alan bir ilçedir.',
    facts: 'Çubuk Barajı ve ilçenin tarımsal üretimi (özellikle Çubuk turşusu ile bilinir) yerel ekonominin önemli parçalarıdır.',
  },
  'ankara/elmadag': {
    summary: 'Elmadağ, Ankara\'nın doğusunda, Bala ve Kırşehir\'e komşu, adını çevresindeki dağlık araziden alan bir ilçedir.',
    facts: 'Ekonomisi tarım ve hayvancılığa dayanır; başkente yakınlığı sayesinde sanayi yatırımları da almaktadır.',
  },
  'ankara/etimesgut': {
    summary: 'Etimesgut, Ankara şehir merkezine 20 km uzaklıkta, adını Ahi Mesud\'dan alan, Atatürk\'ün İstanbul seyahatlerinde kullandığı tarihi Etimesgut Tren İstasyonu\'na ev sahipliği yapan bir ilçedir.',
    facts: 'Bağlıca ve Elvankent gibi modern konut projeleriyle son yıllarda hızla büyüyen, genç nüfusun yoğunlaştığı bir yatırım bölgesi haline gelmiştir.',
  },
  'ankara/evren': {
    summary: 'Evren, Ankara kent merkezine 178 km uzaklıkta, çevresindeki höyük ve kilise kalıntılarıyla İslamiyet öncesine uzanan bir yerleşim geçmişine sahip küçük bir ilçedir.',
    facts: 'Sığırcık Kalesi (Geç Bizans-Osmanlı dönemi) ilçe sınırları içindedir.',
  },
  'ankara/golbasi': {
    summary: 'Gölbaşı, Ankara\'nın üst gelir grubuna hitap eden sakin ve prestijli yaşam alanlarıyla bilinen, doğa ve villa yaşamının merkezi konumundaki ilçesidir.',
    facts: 'Mogan ve Eymir gölleri çevresindeki mesire alanları ilçenin başlıca doğal turizm noktalarıdır.',
  },
  'ankara/gudul': {
    summary: 'Güdül, Kirmir Çayı boyunca kayalara oyulmuş, M.Ö. 2000\'lere (Etiler dönemi) tarihlenen mağaralarıyla bilinen bir Ankara ilçesidir.',
    facts: 'M.Ö. 8. yüzyılda Frigler bu yörede hakimiyet sürmüştür; ilçe merkez hariç 3 belde ve 23 köyden oluşur.',
  },
  'ankara/haymana': {
    summary: 'Haymana, Ankara kent merkezine 73 km uzaklıkta, tarihi Hititlere uzanan, Romalılar döneminde de kullanılan kaplıcalarıyla dünyaca tanınan bir ilçedir.',
    facts: 'Kaplıcanın 1-1,5 km doğusunda halen harabeleri bulunan antik bir su tedavi kenti yer alır.',
  },
  'ankara/kalecik': {
    summary: 'Kalecik, Ankara kent merkezine 71 km uzaklıkta, adını taşıyan meşhur "Kalecik Karası" üzüm çeşidiyle ve ürettiği şarapla tanınan bir ilçedir.',
    facts: 'Kalecik Kalesi ve Davud Dede (Dokuzlar) Türbesi ilçenin başlıca tarihi noktalarıdır; bağcılık son yıllarda önemli bir gelişim göstermiştir.',
  },
  'ankara/kazan': {
    summary: 'Kahramankazan (kısaca Kazan), Ankara\'yı Çankırı, Kastamonu ve Sinop\'a bağlayan devlet karayolu üzerinde, kent merkezine 32 km uzaklıkta bir ilçedir.',
    facts: 'Sanayi ve lojistik alanında son yıllarda gelişim gösteren ilçelerden biridir.',
  },
  'ankara/kecioren': {
    summary: 'Keçiören, Ankara\'nın en yoğun nüfuslu ilçelerinden biri olup km² başına düşen nüfus yoğunluğunda (5.860 kişi) ilin başında gelir.',
    facts: 'Yeni konut projeleriyle hızla gelişen ve değer kazanan bölgelerden biridir; başkentin merkez ilçelerinden biri olarak nüfusun büyük bölümünü barındırır.',
  },
  'ankara/kizilcahamam': {
    summary: 'Kızılcahamam, Ankara kent merkezine 83 km uzaklıkta, zengin maden suyu kaynakları ve traverten oluşumlarıyla bilinen bir termal turizm ilçesidir.',
    facts: 'Ormanlık arazisiyle av turizmi açısından da öne çıkar; Ankara\'nın en çok ziyaret edilen doğa ve kaplıca bölgelerinden biridir.',
  },
  'ankara/mamak': {
    summary: 'Mamak, Ankara\'nın uygun fiyatlı konut seçenekleri ve yatırım fırsatlarıyla bilinen, kentin merkez ilçelerinden biridir.',
    facts: 'Nüfus yoğunluğu yüksek, hızla gelişen semtleri barındıran bir yerleşim bölgesidir.',
  },
  'ankara/nallihan': {
    summary: 'Nallıhan, Ankara kent merkezine 161 km uzaklıkta, 1599\'da Vezir Nasuhpaşa\'nın yaptırdığı handan adını alan tarihi bir ilçedir.',
    facts: 'Han, cami ve hamamdan oluşan külliyenin yanı sıra 17. yüzyılda inşa edilmiş Uluhan Camii de ilçenin önemli tarihi eserlerindendir; ormanlık alanlarında av turizmi yapılır.',
  },
  'ankara/polatli': {
    summary: 'Polatlı, Ankara kent merkezine 78 km uzaklıkta, antik Frig başkenti Gordion\'un da içinde bulunduğu Yassıhöyük ve çevresindeki 86 tümülüsle bilinen bir tarih ve arkeoloji merkezidir.',
    facts: 'İlçe merkezinde de tümülüs ve şehir kalıntıları yer alır; bölge gerçek bir tarih başlangıcı sayılır.',
  },
  'ankara/pursaklar': {
    summary: 'Pursaklar, adının geçtiği en eski belge 1530 tarihli Osmanlı tapu tahrir defteri olan, 2008 yılında ilçe statüsü kazanmış, Ankara kent merkezine 10 km uzaklıktaki bir ilçedir.',
    facts: '20. yüzyıl başında 30-40 haneli küçük bir köy iken, 1970\'lerden itibaren hızlı nüfus artışıyla önemli bir yerleşim merkezine dönüşmüştür.',
  },
  'ankara/sincan': {
    summary: 'Sincan, iş ve eğitim imkanlarıyla Ankara\'nın önemli merkez ilçelerinden biri olup kentin batı koridorunda hızlı nüfus artışı yaşanan bölgelerdendir.',
    facts: 'Sanayi ve organize sanayi bölgeleriyle başkentin üretim merkezlerinden biridir.',
  },
  'ankara/sereflikochisar': {
    summary: 'Şereflikoçhisar, Ankara kent merkezine 148 km uzaklıkta, Türkiye\'nin ikinci büyük gölü olan Tuz Gölü kıyısında yer alan bir ilçedir.',
    facts: 'Geleneksel eğlenceleri ve tuz üretimiyle bilinen, ilin en güneydoğu ucundaki ilçesidir.',
  },
  'ankara/yenimahalle': {
    summary: 'Yenimahalle, planlı ve düzenli şehir yaşamı arayanlar için Ankara\'nın en tercih edilen ilçelerinden biri olarak bilinir.',
    facts: 'Gelişmişlik sıralamasında Ankara\'nın merkez ilçeleri arasında ön sıralarda yer alır; batı koridorunda nüfus artışının yoğunlaştığı bölgelerden biridir.',
  },
  'adana/aladag': {
    summary: 'Aladağ, Adana kent merkezine yaklaşık 105 km uzaklıkta, Toros Dağları eteklerinde yer alan bir ilçedir.',
    facts: 'Antik döneme ait bir ören yeri ile harap durumda bir Ortaçağ kalesi, Akören beldesindeki Kırık Kilise harabeleri ve Meydan yaylasındaki Bığbığı Mağarası ilçenin dikkat çeken noktalarıdır. Nüfusu yaklaşık 16 bindir.',
  },
  'adana/ceyhan': {
    summary: 'Ceyhan, Çukurova\'nın doğusunda, kendi adını taşıyan Ceyhan Nehri kıyısında kurulu, Adana\'nın en büyük yüzölçümüne (1.427 km²) sahip ilçesidir.',
    facts: 'Adana kent merkezine yaklaşık 47-50 km uzaklıktadır; Yılan Kale, Ulu Cami, Mecidiye Camii ve Durhasan Dede Türbesi ilçenin önemli tarihi yapılarındandır. Ekonomik açıdan Adana\'nın en gelişmiş ilçelerinden biridir, nüfusu 156 bin civarındadır.',
  },
  'adana/cukurova': {
    summary: 'Çukurova, Seyhan ilçesinden ayrılarak kurulmuş, adını bölgenin verimli ovasından alan, Adana\'nın en kalabalık merkez ilçelerinden biridir.',
    facts: 'Yüzölçümü 240 km², nüfusu 380 binin üzerindedir; Adana\'da nüfus artış hızının en yüksek olduğu ilçelerden biridir.',
  },
  'adana/feke': {
    summary: 'Feke, Adana kent merkezine 122 km uzaklıkta, deniz seviyesinden 620 metre yükseklikte, Toroslar\'da yer alan dağlık bir ilçedir.',
    facts: 'Yüzölçümü 1.227 km², nüfusu 16 bin civarındadır; Adana\'nın nüfus kaybı en yüksek ilçelerinden biridir.',
  },
  'adana/imamoglu': {
    summary: 'İmamoğlu, kuzeyinde Kozan, güneyinde Yüreğir ve Ceyhan, batısında Aladağ ve Karaisalı ilçeleriyle çevrili bir Çukurova ova ilçesidir.',
    facts: 'Ekonomik olarak Kozan\'a bağlı bir yapısı vardır; nüfusu 27 bin civarında olup son yıllarda artış göstermektedir.',
  },
  'adana/karaisali': {
    summary: 'Karaisalı, Toros Dağları\'nın başladığı noktada, kuzeyi dağlık güneyi düzlük bir arazi yapısına sahip Adana ilçesidir.',
    facts: 'İlçenin en yüksek noktası 2.400 metre ile Akdağ\'dır; nüfusu yaklaşık 22 bindir.',
  },
  'adana/karatas': {
    summary: 'Karataş, Doğu Akdeniz\'de Seyhan ve Ceyhan nehirlerinin doğal sınırları içinde, Adana kent merkezine 48 km uzaklıkta kurulu bir sahil ilçesidir.',
    facts: 'Adana\'nın deniz kıyısındaki başlıca ilçelerinden biridir; nüfusu 24 bin civarındadır.',
  },
  'adana/kozan': {
    summary: 'Kozan, Adana\'ya yaklaşık 80 km uzaklıkta, 130 bini aşkın nüfusuyla Adana\'nın en büyük ilçelerinden biridir; uzun süre Kilikya Ermeni Krallığı\'na başkentlik yapmıştır.',
    facts: 'Kilikya Manastırı, Karasis Kalesi, Anavarza Antik Kenti, Cennet Vadisi ve Hoşkadem Camii ilçe sınırları içindeki başlıca tarihi ve doğal noktalardır. Kozan adı eski Türkçede "yaban tavşanı" anlamına gelir.',
  },
  'adana/pozanti': {
    summary: 'Pozantı, Toros Dağları\'nda, Adana\'yı İç Anadolu\'ya bağlayan tarihi güzergah üzerinde yer alan bir dağ ilçesidir.',
    facts: 'Nüfusu yaklaşık 20 bindir; serin iklimi nedeniyle yazın sık ziyaret edilen bir yayla ilçesidir.',
  },
  'adana/saimbeyli': {
    summary: 'Saimbeyli (eski adıyla Haçin), denizden 1.050 metre yükseklikte, Menteş, Geçilik, Göktepe ve Ziyarettepe dağlarıyla çevrili bir Adana ilçesidir.',
    facts: 'Tarihi Hititler dönemine uzanır; adını Kurtuluş Savaşı\'nda bölgeyi kurtaran Kaymakam Saim Bey\'den alır. İklimi Akdeniz ve İç Anadolu karasal ikliminin etkisindedir, kışları sert ve soğuk geçer.',
  },
  'adana/saricam': {
    summary: 'Sarıçam, Çukurova\'nın doğusunda yer alan, Adana\'da nüfus artış hızı en yüksek ilçedir.',
    facts: 'Nüfusu 260 binin üzerindedir; kuzey kesimleri engebeli ve ormanlıktır.',
  },
  'adana/seyhan': {
    summary: 'Seyhan, Seyhan Nehri kıyısında kurulu, Adana\'nın tarihî, ticari ve idari merkezi olan en kalabalık ilçesidir.',
    facts: 'Nüfusu 780 binin üzerindedir; eski Adana dokusu, kamu kurumları, ticaret alanları ve kültür yapılarıyla kentin kalbini oluşturur.',
  },
  'adana/tufanbeyli': {
    summary: 'Tufanbeyli, Adana\'nın Kayseri ve Kahramanmaraş sınırına yakın, Binboğa ve Tahtalı dağları arasında kalan yüksek bir plato ilçesidir.',
    facts: 'Rakımı 1.474 metre civarındadır, bazı noktaları 3.000 metrenin üzerine çıkar; Adana\'ya 196 km uzaklıktadır.',
  },
  'adana/yumurtalik': {
    summary: 'Yumurtalık, Adana kent merkezine 80 km uzaklıkta, tarihi M.Ö. 2. binlere uzanan bir Akdeniz sahil ilçesidir.',
    facts: 'Doğal güzellikleri, tarihi yapıları ve temiz plajlarıyla öne çıkar; nüfusu 18 bin civarındadır.',
  },
  'adana/yuregir': {
    summary: 'Yüreğir, Seyhan Nehri\'nin doğusunda yer alan, 1986\'da ilçe statüsü kazanmış Adana merkez ilçelerinden biridir.',
    facts: 'Nüfusu 396 binin üzerindedir; ilçeye bağlı Yakapınar Mahallesi\'ndeki Misis Antik Kenti\'nde mozaikler, su kemerleri, hamam, stadyum ve kervansaray kalıntıları yer alır.',
  },
  'adiyaman/merkez': {
    summary: 'Adıyaman Merkez, kuzeyinde Çelikhan, doğusunda Kahta, güneydoğusunda Samsat ve Atatürk Baraj Gölü ile çevrili, ilin idari ve ekonomik merkezidir.',
    facts: 'Yüzölçümü 1.702-1.814 km² civarındadır; nüfusu 300 bine yakındır.',
  },
  'adiyaman/besni': {
    summary: 'Besni, Adıyaman\'ın büyük ilçelerinden biri olup adını Süryanice "Hesna yurdu" anlamındaki bir kökten alır.',
    facts: 'Yüzölçümü 1.235 km²\'dir; ilçe merkez ile birlikte Adıyaman\'ın en kalabalık ikinci yerleşimlerinden biridir.',
  },
  'adiyaman/celikhan': {
    summary: 'Çelikhan, Adıyaman\'ın kuzeyinde, Malatya sınırına yakın, dağlık arazi yapısına sahip bir ilçedir.',
    facts: 'Yüzölçümü 444 km²\'dir; ilin dağlık kesiminde yer alan ilçelerinden biridir.',
  },
  'adiyaman/gerger': {
    summary: 'Gerger, Adıyaman\'ın doğusunda, Diyarbakır sınırına yakın, dağlık ve engebeli bir arazi yapısına sahip ilçedir.',
    facts: 'Yüzölçümü 668 km²\'dir; ilin en dağlık ilçelerinden biri olarak bilinir.',
  },
  'adiyaman/golbasi': {
    summary: 'Gölbaşı, Adıyaman\'ın batısında, Kahramanmaraş sınırına yakın, 800 km² yüzölçümüne sahip bir ilçedir.',
    facts: 'İlin dağlık kesiminde yer alır; 1958 yılında ilçe olmuştur.',
  },
  'adiyaman/kahta': {
    summary: 'Kahta, UNESCO Dünya Mirası listesindeki Nemrut Dağı\'na en yakın ilçe merkezi olup, Cendere Köprüsü ve Karakuş Tümülüsü gibi Kommagene dönemi eserlerine ev sahipliği yapar.',
    facts: 'Atatürk Barajı ve Kahta Çayı çevresiyle doğa turizmi açısından da zengindir; Nemrut Dağı ziyaretleri genellikle Kahta üzerinden yapılır.',
  },
  'adiyaman/samsat': {
    summary: 'Samsat, Kommagene Krallığı\'nın beş önemli kentinden biri olan, adını kral Samos\'tan aldığı düşünülen çok eski bir yerleşimdir.',
    facts: 'Yüzölçümü 319 km² ile Adıyaman\'ın en küçük ilçelerinden biridir; Fırat Nehri kıyısında yer alır.',
  },
  'adiyaman/sincik': {
    summary: 'Sincik, Adıyaman merkezinin 70 km kuzeydoğusunda, deniz seviyesinden 1.325 metre yükseklikte, dağlık ve engebeli bir ilçedir.',
    facts: 'Yüzölçümü 495 km²\'dir; bozkır iklimi hakimdir, kışları soğuk ve karlı, yazları sıcak ve kurak geçer.',
  },
  'adiyaman/tut': {
    summary: 'Tut, Adıyaman\'ın batısında, Besni ilçesine komşu, ilin daha az nüfuslu ilçelerinden biridir.',
    facts: 'İlin güneydoğu Anadolu ile Akdeniz bölgesi arasındaki geçiş karakterini yansıtan bir arazi yapısına sahiptir.',
  },
  'afyonkarahisar/merkez': {
    summary: 'Afyonkarahisar Merkez, M.Ö. 1350 yıllarında Hitit İmparatoru II. Murşil tarafından yaptırılan 226 metre yükseklikteki Afyonkarahisar Kalesi\'yle tanınan il merkezidir.',
    facts: 'Kaleye 625 basamakla çıkılır; şehir aynı zamanda kaymak şekeri ve haşhaş üretimiyle de bilinir.',
  },
  'afyonkarahisar/basmakci': {
    summary: 'Başmakçı, Afyonkarahisar\'ın güneybatısında, tarım ve hayvancılığa dayalı ekonomisiyle bilinen küçük bir ilçedir.',
    facts: 'İlin Dazkırı ve Dinar ilçelerine komşudur.',
  },
  'afyonkarahisar/bayat': {
    summary: 'Bayat, Bolvadin ve Emirdağ ilçeleri arasında, Paşa ve Bey Dağları eteklerinde yer alan tarım ağırlıklı bir ilçedir.',
    facts: 'Bölgedeki göletlerden biri olan Bayat Göleti ilçe sınırları içindedir.',
  },
  'afyonkarahisar/bolvadin': {
    summary: 'Bolvadin, büyükbaş hayvancılık ve süt üretimiyle bilinen, tarihi dokusuyla da dikkat çeken bir Afyonkarahisar ilçesidir.',
    facts: 'Bölgesel ticarette önemli bir rol oynar; Emirdağ ile arasında 2.307 metrelik Emirdağları yükselir.',
  },
  'afyonkarahisar/cay': {
    summary: 'Çay, adını çevresindeki doğal su kaynaklarından alan, verimli tarım arazileri sayesinde hububat üretiminin yoğun olduğu bir ilçedir.',
    facts: 'İlçede küçük ölçekli sanayi faaliyetleri de bulunur; 28 metre yükseklikten dökülen bir çağlayanı vardır.',
  },
  'afyonkarahisar/cobanlar': {
    summary: 'Çobanlar, Afyonkarahisar\'ın tarım ve hayvancılığa dayalı küçük ilçelerinden biridir.',
    facts: 'İl merkezine yakın konumdadır.',
  },
  'afyonkarahisar/dazkiri': {
    summary: 'Dazkırı, Afyonkarahisar\'ın güneybatısında, Denizli sınırına yakın bir tarım ilçesidir.',
    facts: 'Ahır Dağları ve çevresindeki yüksek arazi yapısıyla bilinir.',
  },
  'afyonkarahisar/dinar': {
    summary: 'Dinar, Menderes Nehri\'nin kaynağına yakın, 2.449 metrelik Akdağ\'ın eteklerinde yer alan bir Afyonkarahisar ilçesidir.',
    facts: 'Dinar Ovası ilçenin tarımsal üretiminin temelini oluşturur; ilçeye 1 km uzaklıkta Menderes\'in kaynağında bir mesire parkı bulunur.',
  },
  'afyonkarahisar/emirdag': {
    summary: 'Emirdağ, adını verdiği 2.307 metrelik Emirdağları\'nın eteğinde, Bolvadin\'e komşu bir ilçedir.',
    facts: 'Tarım ve hayvancılığa dayalı bir ekonomisi vardır.',
  },
  'afyonkarahisar/evciler': {
    summary: 'Evciler, Afyonkarahisar\'ın küçük ilçelerinden biri olup ekonomisi tarım ve hayvancılığa dayanır.',
    facts: 'İl merkezine yakın konumdadır.',
  },
  'afyonkarahisar/hocalar': {
    summary: 'Hocalar, Burgazdağı (1.754 m) eteklerinde, Uşak sınırına yakın bir Afyonkarahisar ilçesidir.',
    facts: 'Ekonomisi tarım ve hayvancılığa dayanır.',
  },
  'afyonkarahisar/ihsaniye': {
    summary: 'İhsaniye, 1959\'da ilçe olmuş, dünyaca ünlü Kızılay ve Yıldız Maden Suyu tesislerine ev sahipliği yapan bir ilçedir.',
    facts: 'Yüzölçümü 900 km², nüfusu 27 bin civarındadır; ekonomisi hayvancılık, besicilik ve tarıma dayanır.',
  },
  'afyonkarahisar/iscehisar': {
    summary: 'İscehisar, Türkiye\'nin önemli mermer üretim merkezlerinden biri olan, mermer ocaklarıyla tanınan bir Afyonkarahisar ilçesidir.',
    facts: 'Antik dönemden beri mermer işlemeciliğiyle bilinen bölgededir.',
  },
  'afyonkarahisar/kiziloren': {
    summary: 'Kızılören, Afyonkarahisar\'ın küçük ilçelerinden biri olup tarım ve hayvancılığa dayalı bir ekonomisi vardır.',
    facts: 'İlin güney kesiminde yer alır.',
  },
  'afyonkarahisar/sandikli': {
    summary: 'Sandıklı, Ahır Dağları ile Akdağ arasında yer alan, termal kaynaklarıyla da bilinen bir Afyonkarahisar ilçesidir.',
    facts: 'Sandıklı Ovası ilçenin tarımsal üretiminin temelini oluşturur.',
  },
  'afyonkarahisar/sinanpasa': {
    summary: 'Sinanpaşa, geniş tarım arazileriyle Afyonkarahisar ekonomisinin önemli ayaklarından birini oluşturan bir ilçedir.',
    facts: 'Ahır Dağları ile Sandıklı arasında yer alır; ilçe sınırlarında çok sayıda sulama göleti bulunur.',
  },
  'afyonkarahisar/sultandagi': {
    summary: 'Sultandağı, kiraz, vişne ve elma üretimiyle bilinen bir Afyonkarahisar ilçesidir.',
    facts: 'Nüfusu 14 bin, yüzölçümü 898 km² civarındadır.',
  },
  'afyonkarahisar/suhut': {
    summary: 'Şuhut, Afyonkarahisar\'ın en yüksek yerleşim merkezlerinden biri olup ekonomisinin temelini tarım ve hayvancılık oluşturur.',
    facts: 'Yüzölçümü 1.175 km², nüfusu 36 bin civarındadır; buğday, arpa, nohut, patates, şeker pancarı ve ayçiçeği yetiştirilir.',
  },
  'agri/merkez': {
    summary: 'Ağrı Merkez, Türkiye\'nin en yüksek zirvesi Ağrı Dağı\'nın idari merkezi olduğu il merkez ilçesidir.',
    facts: 'Şehir merkezinde nüfus yoğunluğu km² başına 89 kişi civarındadır.',
  },
  'agri/diyadin': {
    summary: 'Diyadin, tarihi adı Daudyana olan, Murat Nehri kıyısında kurulu, şifalı kaplıcalarıyla (Yılanlı, Davud, Köprü) tanınan bir Ağrı ilçesidir.',
    facts: 'Yüzölçümü 1.274 km², rakımı 1.925 metredir; Urartu\'dan Osmanlı\'ya birçok medeniyete ev sahipliği yapmıştır. Diyadin, Türkiye\'de resmi "termal turizm merkezi" ilan edilmiştir.',
  },
  'agri/dogubayazit': {
    summary: 'Doğubayazıt, İshak Paşa Sarayı ve Ağrı Dağı\'nın bulunduğu, İran sınırındaki Gürbulak sınır kapısına 35 km uzaklıktaki tarihi Ağrı ilçesidir.',
    facts: 'Yüzölçümü 2.424 km², nüfusu 116 binin üzerindedir; ekonomisi hayvancılık, sınır ticareti ve tarıma dayanır. Balık Gölü ve bir meteor çukuru da ilçenin doğal ilgi noktalarındandır.',
  },
  'agri/eleskirt': {
    summary: 'Eleşkirt, Murat Vadisi\'nin Erzurum\'a geçit veren ucunda yer alan, 1998\'den beri kayak turizmine yönelik tesisleri bulunan bir ilçedir.',
    facts: 'Bölge Ahıska Türkleri, Azerbaycan Türkleri ve Kürtlerin etkisiyle zengin bir kültürel mirasa sahiptir.',
  },
  'agri/hamur': {
    summary: 'Hamur, Ağrı il merkezinin 15 km güneyinde, Selçuklulardan kalma Havaran Kalesi ve Mahmut Paşa Kümbeti\'ne ev sahipliği yapan bir ilçedir.',
    facts: 'İlin daha küçük nüfuslu ilçelerinden biridir.',
  },
  'agri/patnos': {
    summary: 'Patnos, Ağrı\'nın nüfus yoğunluğu bakımından öne çıkan ilçelerinden biridir (km² başına 76 kişi).',
    facts: 'Tarım ve hayvancılık ilçe ekonomisinin temelini oluşturur.',
  },
  'agri/taslicay': {
    summary: 'Taşlıçay, Ağrı ilinin orta kesiminde, kuzey ve güneyinde 2.000 metreyi bulan dağlarla çevrili, volkanik arazi yapısına sahip bir ilçedir.',
    facts: 'Yüzölçümü 798 km²\'dir; ekonomisi tarım ve hayvancılığa dayanır, en yüksek noktası Aladağ üzerindeki Koçbaşı tepesidir.',
  },
  'agri/tuta': {
    summary: 'Tutak, deniz seviyesinden 1.535 metre yükseklikte, yüksek yayla karakterinde ve engebeli bir arazi yapısına sahip Ağrı ilçesidir.',
    facts: 'Yüzölçümü 1.562 km²\'dir.',
  },
  'aksaray/merkez': {
    summary: 'Aksaray Merkez, 3.935 km²\'lik alanıyla Aksaray\'ın en büyük ilçesi ve ilin başlıca yerleşim merkezidir.',
    facts: 'Nüfusu 300 binin üzerindedir; Selçuklu ve Osmanlı dönemine ait önemli eserlere ev sahipliği yapar.',
  },
  'aksaray/agacoren': {
    summary: 'Ağaçören, M.Ö. 3-6. yüzyıllarda Hititler zamanında yerleşim alanı olarak kullanılmış, daha sonra Bizans döneminde Kapadokya sınırları içinde kalmış bir ilçedir.',
    facts: 'Hirfanlı Baraj Gölü çevresindeki piknik alanları ve doğa yürüyüşü parkurlarıyla tanınır; Taşkale ve Kilise mevkilerinde dönemin kalıntıları bulunur.',
  },
  'aksaray/eskil': {
    summary: 'Eskil, Türkiye\'nin ikinci büyük gölü Tuz Gölü\'nün güneyinde, düz bir ova üzerinde kurulu bir Aksaray ilçesidir.',
    facts: 'Yüzölçümü 1.601 km², nüfusu 22 bin civarındadır; halkı çoğunlukla buğday, arpa ve şeker pancarı yetiştiriciliğiyle uğraşır. Selçuklu dönemine ait bir Ulu Camii ilçededir.',
  },
  'aksaray/gulagac': {
    summary: 'Gülağaç, 1957\'de "Ağaçlı" adıyla kurulmuş, 1990\'da bugünkü ismini almış, ünlü Ihlara Vadisi\'ne 12 km uzaklıktaki bir ilçedir.',
    facts: 'Yüzölçümü 341 km², rakımı 1.170 metredir; Derinkuyu yeraltı şehrine 50 km uzaklıktadır.',
  },
  'aksaray/guzelyurt': {
    summary: 'Güzelyurt, Kapadokya bölümü içinde yer alan, sınırları içindeki Ihlara Vadisi sayesinde büyük ilgi gören bir Aksaray ilçesidir.',
    facts: '4. yüzyıldan kalma freskli kayaya oyulmuş kiliseleriyle önemli bir erken Hristiyanlık merkezidir.',
  },
  'aksaray/ortakoy': {
    summary: 'Ortaköy, Aksaray\'ın nüfus bakımından en kalabalık ilçesi olup çevresindeki yaylalar ve mesire alanlarıyla bilinir.',
    facts: 'İlçede yapılan kazılarda çeşitli arkeolojik buluntular elde edilmiştir; 30 köy muhtarlığı ve 12 mahallesi vardır.',
  },
  'aksaray/sariyahsi': {
    summary: 'Sarıyahşi, Aksaray\'ın nüfus bakımından en küçük ilçesidir.',
    facts: 'Ekonomisi tarım ve hayvancılığa dayanır.',
  },
};

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
    .toLocaleLowerCase('tr')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
