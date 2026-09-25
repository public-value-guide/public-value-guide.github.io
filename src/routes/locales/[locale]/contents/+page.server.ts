import { error } from '@sveltejs/kit';
import { isLocale, LOCALE_SLUGS } from '$lib/book';
import { toc } from '$lib/server/book';

/** One contents page per locale — chapter titles and slugs both vary by locale. */
export function entries() {
  return LOCALE_SLUGS.map((locale) => ({ locale }));
}

export function load({ params }) {
  if (!isLocale(params.locale)) error(404, `No locale named "${params.locale}"`);
  return { locale: params.locale, toc: toc(params.locale) };
}
