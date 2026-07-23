# My Tour Guide Web

Modern seyahat acentesi web vitrini.

## Kapsam

- Gelişmiş site genelinde arama
- Türkiye il ve ilçe bazlı dinamik sayfalar
- Türkiye Turları, Mavi Turlar, Grup Turları, Paket Turlar, Yurtdışı Turlar
- Tailor-made sepet ve rezervasyon akışı
- Çok dilli destek: `TR`, `EN`, `RU`
- Tema değişimi ve admin paneli
- SEO odaklı meta, canonical ve schema katmanı

## Çalıştırma

```bash
npm install
npm run dev
```

Üretim derlemesi:

```bash
npm run build
```

Ana site giriş noktası: `/`

Admin giriş noktası: `/admin/`

Cloudflare Pages için `_redirects` dosyası tüm rotaları `index.html`'e yönlendirir ve `functions/api/*` endpointleri edge tarafında çalışır.

Admin config kalıcı depolama için `ADMIN_CONFIG_DB` adında bir Cloudflare D1 binding kullanır. Şema dosyası `migrations/0001_admin_config.sql` içindedir.

Yerel geliştirme için Vite `0.0.0.0:5173` üzerinde dinler; `http://127.0.0.1:5173/` veya aynı makinedeki LAN adresinden erişebilirsin.

## Cloudflare Yayın

Önerilen yol:

1. `wrangler login`
2. `wrangler d1 create mytourguide-admin-config`
3. `wrangler d1 migrations apply mytourguide-web --remote`
4. `wrangler pages deploy dist`

`wrangler.toml` içinde `ADMIN_CONFIG_DB` binding'i ve D1 database adı hazırdır. Sadece `database_id` alanını kendi D1 oluşturma çıktınla değiştirmen gerekir.

İlk kurulumdan sonra admin panelde kaydettiğin sıralama, medya ve kimlik bilgileri D1 üzerinde kalıcı olur.

## Not

Ödeme, CRM, PDF üretimi ve e-posta gönderimi için frontend akışı ve Cloudflare Functions sözleşmesi hazırlanmıştır. Gerçek sağlayıcı anahtarları ve webhook URL'leri production ortamında tanımlanmalıdır.
