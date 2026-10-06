import { error } from '@sveltejs/kit';
import { isLocaleOrAlias, resolveLocale, ROUTE_LOCALES } from '#lib/book.js';
import { toc } from '#lib/server/book.js';

/** One contents page per locale — topic titles and slugs both vary by locale. */
export function entries() {
  return ROUTE_LOCALES.map((locale) => ({ locale }));
}

export function load({ params }) {
  if (!isLocaleOrAlias(params.locale)) error(404, `No locale named "${params.locale}"`);
  return { locale: params.locale, toc: toc(resolveLocale(params.locale)) };
}
