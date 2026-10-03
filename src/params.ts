import { defineParams } from '@sveltejs/kit/params';
import { isLocaleOrAlias } from './lib/book.ts';

/** Only known locale slugs match `[locale=locale]`, so `/glossary/` etc. never collide. */
export const params = defineParams({
  locale: (param: string) => (isLocaleOrAlias(param) ? param : undefined)
});
