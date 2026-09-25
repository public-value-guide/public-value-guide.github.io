import { DEFAULT_LOCALE } from '$lib/book';
import { toc } from '$lib/server/book';

/** The home page lists every chapter grouped by part, in the default locale. */
export function load() {
  return { toc: toc(DEFAULT_LOCALE) };
}
