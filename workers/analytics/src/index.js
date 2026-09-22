/**
 * Visitor analytics for xibrer.github.io.
 *
 * Write-only: one Workers Analytics Engine data point per event, and no read
 * endpoint at all. Statistics are read from the Cloudflare dashboard, so nothing
 * is ever exposed publicly.
 *
 * What is stored (6 short strings + a count):
 *   blob1  type      pageview | event
 *   blob2  path      e.g. /en/publications/wang2024bp/
 *   blob3  event     e.g. pdf:wang2024bp   (empty for pageviews)
 *   blob4  referrer  hostname only, e.g. scholar.google.com
 *   blob5  country   ISO code from Cloudflare's edge, no IP is read or kept
 *   blob6  device    desktop | mobile | tablet | bot | unknown
 *   double1          1 (so SUM(double1) also works)
 *   index            the path, for cheap filtering
 *
 * Deliberately NOT stored: IP addresses, cookies, user ids, full referrer URLs
 * (they can carry query strings), or anything else that identifies a person.
 * There is no way to reconstruct a visit path for an individual from this data.
 */

const MAX_BODY_BYTES = 512;
const ALLOWED_ORIGINS = new Set(['https://xibrer.github.io', 'https://www.xibrer.github.io']);
const FALLBACK_ORIGIN = 'https://xibrer.github.io';

/** Truncate to a hard limit so a hostile client cannot inflate a data point. */
const str = (value, max) => (typeof value === 'string' ? value.slice(0, max) : '');

/** Referrer reduced to its hostname. Same-site navigation is not a referrer. */
function referrerHost(header) {
  if (!header) return '';
  try {
    const host = new URL(header).hostname;
    return host === 'xibrer.github.io' ? '' : host.slice(0, 64);
  } catch {
    return '';
  }
}

/** Coarse bucket only — enough to answer "mobile vs desktop". */
function deviceClass(userAgent) {
  if (!userAgent) return 'unknown';
  if (/bot|crawler|spider|facebookexternalhit|preview/i.test(userAgent)) return 'bot';
  if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : FALLBACK_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };

    const { pathname } = new URL(request.url);

    // A sendBeacon with a text/plain body is a CORS-simple request, so in
    // practice no preflight is sent; this is here for the fetch() fallback.
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (pathname !== '/hit') {
      return new Response(null, { status: 404, headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response(null, { status: 405, headers: cors });
    }

    const body = await request.text();
    if (!body || body.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 413, headers: cors });
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return new Response(null, { status: 400, headers: cors });
    }

    const type = payload && payload.t === 'event' ? 'event' : 'pageview';
    const path = str(payload && payload.p, 120) || '/';
    const event = type === 'event' ? str(payload && payload.e, 64) : '';
    if (type === 'event' && !event) {
      return new Response(null, { status: 400, headers: cors });
    }

    const cf = request.cf || {};
    env.ANALYTICS.writeDataPoint({
      blobs: [
        type,
        path,
        event,
        referrerHost(request.headers.get('Referer')),
        str(cf.country, 8),
        deviceClass(request.headers.get('User-Agent')),
      ],
      doubles: [1],
      // The index is capped at 96 bytes by Analytics Engine.
      indexes: [path.slice(0, 96)],
    });

    return new Response(null, { status: 204, headers: cors });
  },
};
