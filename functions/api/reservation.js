import { buildId, cors, json, reservationSummary } from './_shared.js';

export async function onRequestOptions() {
  return cors();
}

export async function onRequestPost({ request }) {
  const body = await request.json().catch(() => ({}));
  const reservationId = buildId('res');
  return json({
    ok: true,
    reservationId,
    status: 'received',
    summary: reservationSummary(body),
    receivedAt: new Date().toISOString(),
  });
}
