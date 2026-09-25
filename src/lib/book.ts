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
 * The book's locales, in the order offered by the picker. Kept in sync by hand
 * with the source repo's `locales/` directory: it currently also has `en-us`,
 * `en-001`, `cy-gb`, and `cy-001` scaffolded (see spec/index.md §4a upstream),
 * but they have no chapters synced yet, so they are not listed here until they
 * do — an empty locale would otherwise offer a picker option that 404s on
 * every chapter.
 */
export const LOCALES: Locale[] = [
  { slug: 'en-gb-oxendict', label: 'English (UK, Oxford spelling)' }
];

/** Locale slugs only, for validating a route param against the known set. */
export const LOCALE_SLUGS: string[] = LOCALES.map((locale) => locale.slug);

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

/** Where the book's source lives, for "edit this page" and provenance links. */
export const SOURCE_REPO = 'https://github.com/public-value-guide/public-value-guide';

/** Where the Claude Code skills for this guide live, in the source repo. */
export const SKILLS_REPO = `${SOURCE_REPO}/tree/main/skills`;
