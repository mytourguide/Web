import { buildId, cors, json } from './_shared.js';
import { initializeCheckoutForm, resolveIyzicoConfig } from './_iyzico.js';

export async function onRequestOptions() {
  return cors();
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const config = resolveIyzicoConfig(env);

  if (!config.configured) {
    return json({
      ok: false,
      configured: false,
      message: 'iyzico API anahtarları tanımlı değil. IYZICO_API_KEY ve IYZICO_SECRET_KEY ortam değişkenlerini tanımlayın (sandbox anahtarlarıyla test edebilirsiniz).',
    }, { status: 503 });
  }

  const customer = body.customer || {};
  const cart = Array.isArray(body.cart) ? body.cart : [];
  const totalPrice = Number(body.totalPrice) || cart.reduce((sum, item) => sum + Number(item.linePrice || 0), 0);

  const conversationId = buildId('conv');
  const origin = new URL(request.url).origin;
  const callbackUrl = `${origin}/api/payment-callback`;
  const ip = request.headers.get('cf-connecting-ip') || undefined;

  try {
    const result = await initializeCheckoutForm(env, {
      conversationId,
      customer,
      cart,
      totalPrice,
      callbackUrl,
      ip,
    });

    if (!result.ok) {
      return json({ ok: false, configured: true, message: result.message || 'iyzico isteği başarısız.', raw: result.raw }, { status: 502 });
    }

    const data = result.data;
    if (data.status !== 'success') {
      return json({ ok: false, configured: true, message: data.errorMessage || 'Ödeme formu başlatılamadı.' }, { status: 400 });
    }

    return json({
      ok: true,
      configured: true,
      conversationId,
      token: data.token,
      paymentPageUrl: data.paymentPageUrl,
      checkoutFormContent: data.checkoutFormContent,
    });
  } catch (error) {
    return json({ ok: false, configured: true, message: `iyzico isteği sırasında hata: ${error?.message || 'bilinmeyen hata'}` }, { status: 500 });
  }
}
