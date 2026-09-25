import { localeSlugMap } from '$lib/server/book';

/**
 * The cross-locale chapter slug map, available to every page (including
 * locale-neutral ones) so the header's locale picker can jump to the
 * equivalent chapter after a switch. Small — chapter numbers and slugs only,
 * no prose — so it is cheap to carry on every page.
 */
export function load() {
  return { localeSlugMap: localeSlugMap() };
}
