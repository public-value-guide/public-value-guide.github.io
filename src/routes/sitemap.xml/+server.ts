import { LOCALE_SLUGS } from '$lib/book';
import { slugs } from '$lib/server/book';

export const prerender = true;

const SITE = 'https://public-value-guide.github.io';

/**
 * A sitemap for a book that search engines should index chapter by chapter —
 * readers arrive from a search for one concept, not for the front page.
 * Every locale's chapters are listed; the glossary and index are not
 * localized upstream, so each gets one shared entry rather than one per
 * locale.
 */
export function GET() {
  const paths = [
    '/',
    '/glossary/',
    '/index/',
    ...LOCALE_SLUGS.flatMap((locale) => [
      `/locales/${locale}/contents/`,
      ...slugs(locale).map((slug) => `/locales/${locale}/chapters/${slug}/`)
    ])
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${SITE}${path}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
