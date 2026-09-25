// Shared book types and the part manifest.
//
// This module holds no chapter prose — only the small metadata that both the
// server load functions and the Svelte components need, so it is safe to import
// from either side. The prose lives in `$lib/server/book.ts`, which is
// server-only and therefore never reaches a client bundle.

/** One entry in the table of contents. */
export type ChapterRef = {
  /** URL slug, e.g. `1-1-introduction-to-public-value` or `preface`. */
  slug: string;
  /** Chapter number as printed, e.g. `1.1`. Empty for front matter. */
  number: string;
  /** Chapter title without the `Chapter N.N — ` prefix. */
  title: string;
  /** Part number this chapter belongs to; 0 for front matter. */
  part: number;
};

/** One of the book's five parts. */
export type Part = {
  number: number;
  title: string;
  /** The one-line framing shown under the part title. */
  tagline: string;
};

/** One locale the book is written in, per `locales/<slug>/chapters/` upstream. */
export type Locale = {
  /** URL slug and directory name, e.g. `en-gb`. Matches the source repo's `locales/<slug>/`. */
  slug: string;
  /** Reader-facing label for the locale picker. */
  label: string;
};

/**
 * The book's locales. Kept in sync by hand with the source repo's `locales/`
 * directory: `cy-gb` and `cy-001` are also scaffolded there (see
 * spec/index.md §4a upstream) but are not yet fully translated, so they are
 * not listed here until they are — an incomplete locale would otherwise
 * offer a picker option that 404s on whichever chapter has no translation
 * yet. Add a locale here, and to `$lib/i18n`'s `STRINGS`, only once
 * `scripts/sync-content.sh` reports every chapter synced for it.
 */
export const LOCALES: Locale[] = [
  { slug: 'en-gb-oxendict', label: 'English (UK, Oxford spelling)' },
  { slug: 'en-gb', label: 'English (UK)' },
  { slug: 'en-us', label: 'English (US)' },
  { slug: 'en-001', label: 'English (World)' }
];

/**
 * Locale slugs, sorted by code, for validating a route param against the
 * known set and for the header picker's ordering. Sorting by code (rather
 * than keeping `LOCALES`' declared order) means a `-001` "world" variant
 * always sorts immediately before its regional siblings, since `-001` sorts
 * before any letter-starting suffix — e.g. `en-001` before `en-gb`.
 */
export const LOCALE_SLUGS: string[] = LOCALES.map((locale) => locale.slug).sort();

/**
 * The locale served at unprefixed reference pages (glossary, index) and used
 * for "browse the chapters" links from locale-neutral pages. Oxford spelling
 * is the book's own house style (`spec/oxford-spelling.md` upstream) and its
 * canonical/source-of-truth locale (`spec/index.md` §4a), so it is the
 * natural default.
 */
export const DEFAULT_LOCALE = 'en-gb-oxendict';

/** Is `value` one of the book's known locale slugs? */
export function isLocale(value: string): boolean {
  return LOCALE_SLUGS.includes(value);
}

/**
 * `LOCALES`, ordered for display: the default locale first, then grouped by
 * language name (the label text before its first `(`), with a `-001` "world"
 * variant sorted before its regional siblings within each group, then
 * alphabetically by label. This does not fall out of a plain alphabetical
 * sort on its own — "English (World)" would sort after "English (UK)" — so
 * the `-001` check is explicit.
 */
export function sortedLocales(locales: Locale[] = LOCALES): Locale[] {
  const languageOf = (locale: Locale) => locale.label.split('(')[0].trim();
  const [defaults, rest] = [
    locales.filter((locale) => locale.slug === DEFAULT_LOCALE),
    locales.filter((locale) => locale.slug !== DEFAULT_LOCALE)
  ];
  rest.sort((a, b) => {
    const language = languageOf(a).localeCompare(languageOf(b));
    if (language !== 0) return language;
    const aIsWorld = a.slug.endsWith('-001');
    const bIsWorld = b.slug.endsWith('-001');
    if (aIsWorld !== bIsWorld) return aIsWorld ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
  return [...defaults, ...rest];
}

/**
 * The five parts, in reading order. Kept in sync by hand with the source repo's
 * README — the chapter files themselves record only their own number, not the
 * part groupings or taglines.
 */
export const PARTS: Part[] = [
  {
    number: 1,
    title: 'Foundations',
    tagline:
      'why public value is different from market value or democratic mandate alone, and the models that explain it'
  },
  {
    number: 2,
    title: 'Evaluation and Evidence',
    tagline: "the analyst's toolkit: valuing outcomes, building the case, testing claims"
  },
  {
    number: 3,
    title: 'Systems, Governance and Priorities',
    tagline: 'how public and social-sector organizations are structured, funded, and held accountable'
  },
  {
    number: 4,
    title: 'Global and Societal Issues',
    tagline:
      'public value beyond one institution: behaviour, trust, the planet, and the public conversation'
  },
  {
    number: 5,
    title: 'Digital, Software, and Technology',
    tagline:
      'the public value of technology: digital government, artificial intelligence, software, data, and cybersecurity'
  }
];

/**
 * `PARTS`' title and tagline, translated per locale. Keyed by part number.
 * English variants share the canonical English wording (`PARTS` itself);
 * only locales whose chapter prose is actually translated get an entry here.
 * `cy-001` reuses `cy-gb`'s wording, matching the book repo's own decision to
 * reuse `cy-gb` prose for `cy-001` (see spec/index.md upstream).
 */
const PART_TRANSLATIONS: Record<string, Record<number, { title: string; tagline: string }>> = {
  'cy-gb': {
    1: {
      title: 'Sylfeini',
      tagline:
        "pam mae gwerth cyhoeddus yn wahanol i werth marchnad neu fandad democrataidd yn unig, a'r modelau sy'n ei egluro"
    },
    2: {
      title: 'Gwerthuso a Thystiolaeth',
      tagline: "pecyn offer y dadansoddwr: prisio canlyniadau, adeiladu'r achos, profi honiadau"
    },
    3: {
      title: 'Systemau, Llywodraethiant a Blaenoriaethau',
      tagline:
        "sut mae sefydliadau cyhoeddus a sector-cymdeithasol wedi'u strwythuro, eu hariannu, a'u dal yn atebol"
    },
    4: {
      title: 'Materion Byd-eang a Chymdeithasol',
      tagline:
        "gwerth cyhoeddus y tu hwnt i un sefydliad: ymddygiad, ymddiriedaeth, y blaned, a'r sgwrs gyhoeddus"
    },
    5: {
      title: 'Digidol, Meddalwedd, a Thechnoleg',
      tagline:
        "gwerth cyhoeddus technoleg: llywodraeth ddigidol, deallusrwydd artiffisial, meddalwedd, data, a seiberddiogelwch"
    }
  }
};
PART_TRANSLATIONS['cy-001'] = PART_TRANSLATIONS['cy-gb'];

/** `PARTS`, translated for `locale` where a translation exists, English otherwise. */
export function partsFor(locale: string): Part[] {
  const translation = PART_TRANSLATIONS[locale];
  if (!translation) return PARTS;
  return PARTS.map((part) => ({ ...part, ...(translation[part.number] ?? {}) }));
}

/** Where the book's source lives, for "edit this page" and provenance links. */
export const SOURCE_REPO = 'https://github.com/public-value-guide/public-value-guide';

/** Where the Claude Code skills for this guide live, in the source repo. */
export const SKILLS_REPO = `${SOURCE_REPO}/tree/main/skills`;
