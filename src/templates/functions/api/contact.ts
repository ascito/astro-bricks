/**
 * Template Cloudflare Pages Function — Proxy formulaire contact → n8n
 *
 * À copier dans le dossier `functions/api/contact.ts` de chaque site consommateur.
 *
 * Configuration Cloudflare Pages requise :
 *  - `CONTACT_WEBHOOK_URL` (Secret) — URL n8n complète (ex: https://n8n.mon-site.fr/webhook/contact-XXX)
 *  - `SITE_ORIGIN` (Variable) — origine du site (ex: https://mon-site.fr)
 *
 * Avantages :
 *  - URL n8n cachée côté serveur (pas exposée dans le HTML public)
 *  - Rate limit + WAF Cloudflare en amont
 *  - Possibilité d'ajouter Turnstile / CAPTCHA
 *  - L'Origin forgé matche la whitelist CORS n8n côté serveur
 */

interface Env {
  CONTACT_WEBHOOK_URL: string;
  SITE_ORIGIN: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Lecture du body JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanity check : taille max 10KB (anti-flood)
  const text = JSON.stringify(body);
  if (text.length > 10_000) {
    return new Response(JSON.stringify({ success: false, error: 'Payload too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Vérification config serveur
  if (!env.CONTACT_WEBHOOK_URL) {
    console.error('CONTACT_WEBHOOK_URL non défini');
    return new Response(JSON.stringify({ success: false, error: 'Configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const origin = env.SITE_ORIGIN || new URL(request.url).origin;

  // Proxy vers le webhook n8n interne
  try {
    const res = await fetch(env.CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
      body: text,
    });

    // Renvoie la réponse n8n telle quelle
    return new Response(await res.text(), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Proxy contact échoué :', err);
    return new Response(JSON.stringify({ success: false, error: 'Upstream unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/** OPTIONS preflight (le navigateur en envoie parfois pour les XHR JSON). */
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
