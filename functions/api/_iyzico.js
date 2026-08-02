import { base64Encode, buildId, hmacSha256Hex, resolveEnvValue } from './_shared.js';

// iyzico "Ödeme Formu" (Checkout Form) entegrasyonu.
// Kart bilgileri (numara, son kullanma, CVV) hiçbir zaman bizim sunucumuza uğramaz;
// müşteri doğrudan iyzico'nun barındırdığı, PCI-DSS uyumlu ödeme sayfasında kart bilgisini girer.
// Biz yalnızca ödeme başlatma isteği gönderir, sonucunu callback ile alırız.

function resolveIyzicoConfig(env = {}) {
  const apiKey = resolveEnvValue(env, 'IYZICO_API_KEY');
  const secretKey = resolveEnvValue(env, 'IYZICO_SECRET_KEY');
  const baseUrl = resolveEnvValue(env, 'IYZICO_BASE_URL', 'https://sandbox-api.iyzipay.com');
  return {
    apiKey,
    secretKey,
    baseUrl,
    configured: Boolean(apiKey && secretKey),
  };
}

async function buildIyzicoHeaders({ apiKey, secretKey, uriPath, body }) {
  const randomKey = `${Date.now()}${Math.random().toString().slice(2, 10)}`;
  const payload = `${randomKey}${uriPath}${JSON.stringify(body)}`;
  const signature = await hmacSha256Hex(secretKey, payload);
  const authorizationParams = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  const authorization = `IYZWSv2 ${base64Encode(authorizationParams)}`;
  return {
    'Content-Type': 'application/json',
    Authorization: authorization,
    'x-iyzi-rnd': randomKey,
    'x-iyzi-client-version': 'mytourguide-cf-1.0',
  };
}

async function iyzicoRequest(env, uriPath, body) {
  const config = resolveIyzicoConfig(env);
  if (!config.configured) {
    return { ok: false, configured: false, message: 'iyzico API anahtarları tanımlı değil.' };
  }
  const headers = await buildIyzicoHeaders({
    apiKey: config.apiKey,
    secretKey: config.secretKey,
    uriPath,
    body,
  });
  const response = await fetch(`${config.baseUrl}${uriPath}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    return { ok: false, configured: true, message: `iyzico HTTP ${response.status}`, raw: data };
  }
  return { ok: true, configured: true, data };
}

function buildBasketItems(cart = []) {
  const items = Array.isArray(cart) ? cart : [];
  if (!items.length) {
    return [{
      id: buildId('item'),
      name: 'Tur rezervasyonu',
      category1: 'Tur',
      itemType: 'VIRTUAL',
      price: '0.01',
    }];
  }
  return items.map((item, index) => ({
    id: String(item.id || buildId(`item${index}`)),
    name: String(item.title || 'Tur rezervasyonu').slice(0, 100),
    category1: 'Tur',
    itemType: 'VIRTUAL',
    price: Number(item.linePrice || item.price || 0).toFixed(2),
  }));
}

function sanitizeIdentityNumber(value) {
  const digits = String(value || '').replace(/\D/g, '');
  // iyzico test ortamı, gerçek olmayan T.C. kimlik numaralarını reddeder; sandbox'ta 74300864791 kullanılabilir.
  return digits.length === 11 ? digits : '11111111111';
}

async function initializeCheckoutForm(env, { conversationId, customer, cart, totalPrice, callbackUrl, ip }) {
  const basketItems = buildBasketItems(cart);
  const computedTotal = basketItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const price = (Number(totalPrice) > 0 ? Number(totalPrice) : computedTotal).toFixed(2);
  const address = String(customer?.address || 'Adres belirtilmedi').slice(0, 200) || 'Adres belirtilmedi';
  const body = {
    locale: 'tr',
    conversationId,
    price,
    paidPrice: price,
    currency: 'TRY',
    basketId: buildId('basket'),
    paymentGroup: 'PRODUCT',
    callbackUrl,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: buildId('buyer'),
      name: String(customer?.firstName || customer?.name || 'Misafir').slice(0, 60) || 'Misafir',
      surname: String(customer?.lastName || '-').slice(0, 60) || '-',
      gsmNumber: String(customer?.phone || '').slice(0, 20),
      email: String(customer?.email || 'misafir@mytourguide.com.tr'),
      identityNumber: sanitizeIdentityNumber(customer?.tcNo),
      registrationAddress: address,
      ip: ip || '85.34.78.112',
      city: String(customer?.city || 'Istanbul'),
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: String(customer?.name || `${customer?.firstName || ''} ${customer?.lastName || ''}`).trim() || 'Misafir',
      city: String(customer?.city || 'Istanbul'),
      country: 'Turkey',
      address,
    },
    billingAddress: {
      contactName: String(customer?.name || `${customer?.firstName || ''} ${customer?.lastName || ''}`).trim() || 'Misafir',
      city: String(customer?.city || 'Istanbul'),
      country: 'Turkey',
      address,
    },
    basketItems,
  };
  return iyzicoRequest(env, '/payment/iyzipos/checkoutform/initialize/auth/ecom', body);
}

async function retrieveCheckoutForm(env, { conversationId, token }) {
  return iyzicoRequest(env, '/payment/iyzipos/checkoutform/auth/ecom/detail', {
    locale: 'tr',
    conversationId,
    token,
  });
}

export {
  initializeCheckoutForm,
  resolveIyzicoConfig,
  retrieveCheckoutForm,
};
