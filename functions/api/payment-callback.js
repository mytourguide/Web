import { retrieveCheckoutForm } from './_iyzico.js';

// iyzico, müşteri ödeme sayfasında işlemi tamamladıktan (veya iptal ettikten) sonra
// bu adrese application/x-www-form-urlencoded formatında bir POST isteği gönderir.
// Gövdede yalnızca "token" alanı bulunur; gerçek sonucu öğrenmek için bu token ile
// iyzico'ya ayrı bir "detail retrieve" isteği atmamız gerekir (kart sonucu callback
// gövdesinde taşınmaz, bu ekstra doğrulama adımı sahteciliği önler).

export async function onRequestPost({ request, env }) {
  const formData = await request.formData().catch(() => null);
  const token = formData?.get('token');
  const origin = new URL(request.url).origin;

  if (!token) {
    return Response.redirect(`${origin}/odeme/basarisiz`, 302);
  }

  const result = await retrieveCheckoutForm(env, {
    conversationId: formData.get('conversationId') || '',
    token: String(token),
  });

  const data = result?.data;
  const success = result?.ok && data?.status === 'success' && data?.paymentStatus === 'SUCCESS';
  const orderId = data?.basketId || data?.paymentId || '';
  const destination = success
    ? `${origin}/odeme/basarili${orderId ? `?order=${encodeURIComponent(orderId)}` : ''}`
    : `${origin}/odeme/basarisiz${orderId ? `?order=${encodeURIComponent(orderId)}` : ''}`;

  return Response.redirect(destination, 302);
}
