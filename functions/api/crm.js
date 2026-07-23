import { buildId, cors, json } from './_shared.js';

export async function onRequestOptions() {
  return cors();
}

export async function onRequestPost({ request }) {
  const body = await request.json().catch(() => ({}));
  const syncId = buildId('crm');
  return json({
    ok: true,
    syncId,
    synced: true,
    recordCount: Array.isArray(body.questions) ? body.questions.length : 0,
    receivedAt: new Date().toISOString(),
  });
}
