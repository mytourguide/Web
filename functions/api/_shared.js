function json(body, init = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status: init.status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      ...(init.headers || {}),
    },
  });
}

function cors() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

function safeText(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildPdf(lines) {
  const text = lines.map((line, index) => `(${escapePdf(safeText(line))}) Tj\n0 -18 Td${index === 0 ? '' : ''}`).join('\n');
  const content = `BT\n/F1 12 Tf\n72 740 Td\n${lines.map((line, index) => `${index === 0 ? '' : 'T* '}${index === 0 ? '' : ''}(${escapePdf(safeText(line))}) Tj`).join('\nT*\n')}\nET`;
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${new TextEncoder().encode(content).length} >> stream\n${content}\nendstream endobj`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${obj}\n`;
  }
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function escapePdf(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
}

function reservationSummary(data) {
  const customer = data.customer || {};
  const cart = Array.isArray(data.cart) ? data.cart : [];
  return [
    `My Tour Guide Rezervasyon`,
    `Musteri: ${customer.name || 'N/A'}`,
    `E-posta: ${customer.email || 'N/A'}`,
    `Telefon: ${customer.phone || 'N/A'}`,
    `Sefer sayisi: ${cart.length}`,
    `Toplam urun: ${cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}`,
  ];
}

function resolveEnvValue(env, key, fallback = '') {
  const direct = env?.[key];
  const processValue = typeof process !== 'undefined' ? process?.env?.[key] : undefined;
  return String(direct ?? processValue ?? fallback).trim();
}

function resolveAuthConfig(env = {}, overrides = {}) {
  return {
    username: String(overrides.username ?? resolveEnvValue(env, 'ADMIN_USERNAME', 'admin')),
    password: String(overrides.password ?? resolveEnvValue(env, 'ADMIN_PASSWORD', 'tour2026')),
    secret: String(resolveEnvValue(env, 'ADMIN_SESSION_SECRET')),
    cookieName: 'mytourguide_admin_session',
    ttlSeconds: 60 * 60 * 8,
  };
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    String(cookieHeader || '')
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf('=');
        if (index === -1) return [item, ''];
        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      }),
  );
}

async function digestText(text, secret) {
  const input = new TextEncoder().encode(`${text}.${secret}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

async function createSessionToken(username, secret, ttlSeconds) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    username,
    iat: issuedAt,
    exp: issuedAt + ttlSeconds,
  };
  const encoded = btoa(JSON.stringify(payload));
  const signature = await digestText(encoded, secret);
  return `${encoded}.${signature}`;
}

async function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = await digestText(encoded, secret);
  if (expected !== signature) return null;
  const payload = JSON.parse(atob(encoded));
  if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function buildAuthCookie(value, ttlSeconds, secure = true, cookieName = 'mytourguide_admin_session') {
  const maxAge = Math.max(0, Number(ttlSeconds) || 0);
  const parts = [
    `${cookieName}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (maxAge > 0) parts.push(`Max-Age=${maxAge}`);
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

function clearAuthCookie(secure = true, cookieName = 'mytourguide_admin_session') {
  return [
    `${cookieName}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    secure ? 'Secure' : null,
  ].filter(Boolean).join('; ');
}

export {
  buildAuthCookie,
  buildId,
  buildPdf,
  clearAuthCookie,
  cors,
  createSessionToken,
  json,
  parseCookies,
  reservationSummary,
  resolveAuthConfig,
  safeText,
  verifySessionToken,
};
