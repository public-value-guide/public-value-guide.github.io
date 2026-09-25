import { error, redirect } from '@sveltejs/kit';
import { isLocale, LOCALE_SLUGS } from '$lib/book';

/**
 * `/locales/<slug>/` on its own has nothing to show — the contents page is
 * the locale's actual landing page. adapter-static prerenders a `redirect()`
 * as a static page with a meta-refresh, so this works with no server.
 */
export function entries() {
  return LOCALE_SLUGS.map((locale) => ({ locale }));
}

export function load({ params }) {
  if (!isLocale(params.locale)) error(404, `No locale named "${params.locale}"`);
  redirect(307, `/locales/${params.locale}/contents/`);
}
