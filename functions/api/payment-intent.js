import { buildId, cors, json } from './_shared.js';

export async function onRequestOptions() {
  return cors();
}

export async function onRequestPost({ request }) {
  await request.json().catch(() => ({}));
  const intentId = buildId('pay');
  return json({
    ok: true,
    intentId,
    status: 'requires_action',
    provider: 'mock-3ds',
    checkoutUrl: `/odeme?intent=${intentId}`,
  });
}
