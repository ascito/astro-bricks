# Cloudflare Pages — Redirections HTTP 301
# https://developers.cloudflare.com/pages/configuration/redirects/
#
# À copier dans `public/_redirects` de chaque site.
# Remplacer __SITE_DOMAIN__ par le domaine apex du site (ex: mon-site.fr).

# Alias commun pour le sitemap (Google et co. utilisent sitemap-index.xml directement,
# mais les humains tapent souvent /sitemap.xml)
/sitemap.xml      /sitemap-index.xml      301

# www → apex (au cas où la Bulk Redirect Cloudflare ne soit pas active)
https://www.__SITE_DOMAIN__/*   https://__SITE_DOMAIN__/:splat   301
