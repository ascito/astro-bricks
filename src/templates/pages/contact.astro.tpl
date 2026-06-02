---
/**
 * Template page contact — à copier dans `src/pages/contact.astro` de chaque site.
 *
 * Remplacer __SITE_DOMAIN__ par le domaine du site (ex: saunaguide.fr).
 *
 * Requiert :
 *  - Une Pages Function `functions/api/contact.ts` (template dans astro-bricks/templates/functions/)
 *  - Un workflow n8n importé avec le bon path webhook
 *  - Les variables d'env `CONTACT_WEBHOOK_URL` et `SITE_ORIGIN` côté Cloudflare Pages
 */
import BaseLayout from 'astro-bricks/layouts/BaseLayout.astro';
import Breadcrumb from 'astro-bricks/bricks/nav/Breadcrumb.astro';
import siteConfig from '~/site.config';

const WEBHOOK_URL = '/api/contact';
---

<BaseLayout
  siteConfig={siteConfig}
  title={`Contact — ${siteConfig.brand}`}
  description={`Contactez l'équipe ${siteConfig.brand} via le formulaire ci-dessous. Notification immédiate, réponse sous 5 jours ouvrés.`}
  breadcrumbs={[
    { label: 'Accueil', href: '/' },
    { label: 'Contact' },
  ]}
>
  <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
    <Breadcrumb
      items={[{ label: 'Accueil', href: '/' }, { label: 'Contact' }]}
      siteUrl={siteConfig.siteUrl}
      withJsonLd={false}
    />

    <header class="mt-8 mb-10">
      <h1 class="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
        Nous contacter
      </h1>
      <p class="text-slate-600">
        Une question, un signalement d'erreur, une suggestion ? Le formulaire ci-dessous nous notifie en temps réel — réponse sous 5 jours ouvrés.
      </p>
    </header>

    <section class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 mb-12">
      <form id="contact-form" data-webhook={WEBHOOK_URL} novalidate>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="name" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Nom <span class="text-red-500">*</span>
            </label>
            <input type="text" id="name" name="name" required autocomplete="name"
              minlength="2" maxlength="100"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 outline-none" />
          </div>
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Email <span class="text-red-500">*</span>
            </label>
            <input type="email" id="email" name="email" required autocomplete="email"
              maxlength="150" placeholder="Pour qu'on puisse vous répondre"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 outline-none" />
          </div>
        </div>

        <div class="mb-4">
          <label for="subject" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Sujet <span class="text-slate-400 font-normal">(facultatif)</span>
          </label>
          <input type="text" id="subject" name="subject" maxlength="200"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 outline-none" />
        </div>

        <div class="mb-4">
          <label for="message" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Votre message <span class="text-red-500">*</span>
          </label>
          <textarea id="message" name="message" required rows="6"
            minlength="10" maxlength="3000" placeholder="Décrivez votre demande..."
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 outline-none resize-y"></textarea>
          <p class="text-xs text-slate-500 mt-1">
            <span id="char-count">0</span> / 3000 caractères
          </p>
        </div>

        {/* Honeypot anti-spam */}
        <div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">
          <label for="website">Site web</label>
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
        </div>

        <div class="flex items-start gap-2 mb-5 text-xs text-slate-500">
          <input type="checkbox" id="consent" name="consent" required class="mt-0.5" />
          <label for="consent">
            J'accepte que mes données (nom, email, message) soient transmises pour traiter ma demande,
            conformément à la <a href="/politique-confidentialite" class="underline">politique de confidentialité</a>.
          </label>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <button type="submit" id="submit-btn"
            class="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2">
            <span class="btn-text">Envoyer le message</span>
          </button>
          <p class="text-xs text-slate-500">
            Notification immédiate. Aucune donnée n'est conservée au-delà du traitement.
          </p>
        </div>

        <div id="form-success" hidden class="mt-5 bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 text-sm text-green-900">
          <strong>✓ Message envoyé !</strong> Nous reviendrons vers vous sous 5 jours ouvrés.
        </div>
        <div id="form-error" hidden class="mt-5 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 text-sm text-red-900">
          <strong>✕ Une erreur est survenue.</strong>
          <span class="error-detail"></span>
        </div>
      </form>
    </section>
  </article>

  <script define:vars={{ domain: siteConfig.domain }}>
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const successEl = document.getElementById('form-success');
    const errorEl = document.getElementById('form-error');
    const errorDetail = errorEl?.querySelector('.error-detail');
    const messageEl = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    messageEl?.addEventListener('input', () => {
      charCount.textContent = String(messageEl.value.length);
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      successEl.hidden = true;
      errorEl.hidden = true;

      const honeypot = form.querySelector('[name="website"]')?.value;
      if (honeypot) { successEl.hidden = false; form.reset(); return; }

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = messageEl.value.trim();
      const subject = document.getElementById('subject').value.trim();
      const consent = form.querySelector('[name="consent"]')?.checked;

      if (name.length < 2) {
        errorDetail.textContent = ' (merci d\'indiquer votre nom)';
        errorEl.hidden = false; return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorDetail.textContent = ' (email invalide)';
        errorEl.hidden = false; return;
      }
      if (message.length < 10) {
        errorDetail.textContent = ` (message trop court: ${message.length} caractères)`;
        errorEl.hidden = false; return;
      }
      if (!consent) {
        errorDetail.textContent = ' (consentement requis)';
        errorEl.hidden = false; return;
      }

      submitBtn.disabled = true;
      btnText.textContent = 'Envoi...';

      try {
        const res = await fetch(form.dataset.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            site: domain,
            name, email, subject, message,
            userAgent: navigator.userAgent.slice(0, 200),
            referrer: document.referrer.slice(0, 200),
            sentAt: new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        successEl.hidden = false;
        form.reset();
        charCount.textContent = '0';
      } catch (err) {
        errorDetail.textContent = ` (${err.message})`;
        errorEl.hidden = false;
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Envoyer le message';
      }
    });
  </script>
</BaseLayout>
