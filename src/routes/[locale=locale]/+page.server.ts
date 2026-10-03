import { error, redirect } from '@sveltejs/kit';
import { isLocaleOrAlias, ROUTE_LOCALES } from '#lib/book.js';

/**
 * `/<slug>/` on its own has nothing to show — the contents page is
 * the locale's actual landing page. adapter-static prerenders a `redirect()`
 * as a static page with a meta-refresh, so this works with no server.
 */
export function entries() {
  return ROUTE_LOCALES.map((locale) => ({ locale }));
}

export function load({ params }) {
  if (!isLocaleOrAlias(params.locale)) error(404, `No locale named "${params.locale}"`);
  redirect(307, `/${params.locale}/contents/`);
}
