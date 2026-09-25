// Server-only access to the book's markdown.
//
// Living under `$lib/server/` means SvelteKit refuses to bundle this into
// client code, which matters here: the vendored content is several megabytes of
// prose. The site is fully prerendered, so this module runs at build time and
// each page ships only its own rendered HTML.

import { parse, type Document, type Heading } from '$lib/markdown';
import { PARTS, LOCALE_SLUGS, type ChapterRef } from '$lib/book';

/**
 * Raw markdown for every chapter, keyed by module path, e.g.
 * `../../content/locales/en-gb-oxendict/chapters/01-01-introduction-to-public-value/index.md`.
 * Each locale is its own directory upstream (`locales/<slug>/chapters/`), and
 * each chapter within it is its own directory holding one `index.md` — the
 * `locale-peer-id` convention (see spec/index.md §4a upstream) — vendored here
 * the same way. See `scripts/sync-content.sh`.
 */
const chapterFiles = import.meta.glob('../../content/locales/*/chapters/*/index.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const glossaryFile = import.meta.glob('../../content/GLOSSARY.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const indexFile = import.meta.glob('../../content/INDEX.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

/** A chapter: its table-of-contents entry plus its markdown source. */
type Chapter = ChapterRef & { markdown: string };

/**
 * Turn a content chapter-directory name into a URL slug.
 *
 * Directories are named `NN-NN-kebab-title`, where the leading numbers order
 * the book on disk. URLs keep the chapter number (readers cite chapters by
 * number) but drop the zero padding: `01-01-introduction-to-public-value`
 * becomes `1-1-introduction-to-public-value`. Front matter has no chapter
 * number, so `00-01-preface` becomes just `preface`.
 *
 * The kebab-title itself can differ by locale (a Welsh chapter directory is
 * named in Welsh), which is exactly why chapters are looked up per locale
 * rather than by a single slug shared across every locale.
 */
function slugFor(stem: string): string {
  const numbered = stem.match(/^(\d+)-(\d+)-(.+)$/);
  if (numbered) {
    const [, part, chapter, rest] = numbered;
    // Front matter directories are numbered `00-01-preface` for ordering
    // only — part `00` is not a real part — and read better without digits.
    if (Number(part) === 0) return rest;
    return `${Number(part)}-${Number(chapter)}-${rest}`;
  }
  return stem;
}

/**
 * Split a document title into its number and its title.
 *
 * Chapter files open with `# Chapter 1.1 — Introduction to Public Value`;
 * the preface opens with a bare `# Preface`.
 */
function splitTitle(heading: string): { number: string; title: string } {
  const match = heading.match(/^Chapter\s+([\d.]+)\s*[—–-]\s*(.+)$/);
  if (match) return { number: match[1], title: match[2].trim() };
  return { number: '', title: heading.trim() };
}

/** Parse `../../content/locales/<slug>/chapters/<chapter-dir>/index.md` into its parts. */
function parseChapterPath(path: string): { locale: string; stem: string } {
  const match = path.match(/\/locales\/([^/]+)\/chapters\/([^/]+)\/index\.md$/);
  if (!match) throw new Error(`Unrecognized chapter content path: ${path}`);
  return { locale: match[1], stem: match[2] };
}

/**
 * Every chapter, in reading order, grouped by locale. The content directory
 * names already sort into reading order within a locale, so sorting the glob
 * keys is enough.
 */
const chaptersByLocale: Record<string, Chapter[]> = {};
for (const [path, markdown] of Object.entries(chapterFiles).sort(([a], [b]) =>
  a.localeCompare(b)
)) {
  const { locale, stem } = parseChapterPath(path);
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? stem;
  const { number, title } = splitTitle(heading);
  const entry: Chapter = {
    slug: slugFor(stem),
    number,
    title,
    part: number ? Number(number.split('.')[0]) : 0,
    markdown
  };
  (chaptersByLocale[locale] ??= []).push(entry);
}

/** Chapters for one locale, or `[]` if the locale is unknown. */
function chaptersFor(locale: string): Chapter[] {
  return chaptersByLocale[locale] ?? [];
}

/** Table-of-contents entries for one locale — metadata only, safe for the client. */
export function toc(locale: string): ChapterRef[] {
  return chaptersFor(locale).map(({ slug, number, title, part }) => ({
    slug,
    number,
    title,
    part
  }));
}

/** The parts, each with its chapters, for rendering one locale's full contents. */
export function contents(locale: string): Array<{
  number: number;
  title: string;
  tagline: string;
  chapters: ChapterRef[];
}> {
  const chapters = toc(locale);
  return PARTS.map((part) => ({
    ...part,
    chapters: chapters.filter((chapter) => chapter.part === part.number)
  }));
}

/** Front matter for one locale — chapters with no part, such as the preface. */
export function frontMatter(locale: string): ChapterRef[] {
  return toc(locale).filter((chapter) => chapter.part === 0);
}

/** A rendered chapter plus its neighbours, or `null` if the locale or slug is unknown. */
export function chapter(
  locale: string,
  slug: string
): {
  ref: ChapterRef;
  doc: Document;
  previous: ChapterRef | null;
  next: ChapterRef | null;
} | null {
  const chapters = chaptersFor(locale);
  const at = chapters.findIndex((candidate) => candidate.slug === slug);
  if (at === -1) return null;

  const { markdown, ...ref } = chapters[at];
  const neighbour = (offset: number): ChapterRef | null => {
    const found = chapters[at + offset];
    if (!found) return null;
    const { markdown: _omit, ...rest } = found;
    return rest;
  };

  return { ref, doc: parse(markdown), previous: neighbour(-1), next: neighbour(1) };
}

/** `{ locale, slug }` for every chapter in every locale, for prerender entry generation. */
export function localeChapterEntries(): Array<{ locale: string; slug: string }> {
  return LOCALE_SLUGS.flatMap((locale) => slugs(locale).map((slug) => ({ locale, slug })));
}

/** Every chapter slug for one locale, for prerender entry generation. */
export function slugs(locale: string): string[] {
  return chaptersFor(locale).map((chapter) => chapter.slug);
}

/**
 * Maps a chapter identifier to its slug in each locale, so the locale picker
 * can jump to the equivalent chapter after a switch instead of just the
 * target locale's contents page. Most chapters share the same slug in every
 * English locale; a Welsh chapter directory does not, which is exactly why
 * this is keyed by chapter number rather than by slug.
 *
 * Front matter has no number, so it is keyed by its own slug instead — safe
 * here because front-matter directory names (and therefore slugs) are
 * identical across the English locales upstream.
 */
export function localeSlugMap(): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {};
  for (const [locale, chapters] of Object.entries(chaptersByLocale)) {
    for (const ch of chapters) {
      const key = ch.number || `front:${ch.slug}`;
      (map[key] ??= {})[locale] = ch.slug;
    }
  }
  return map;
}

/**
 * Render a reference document (the glossary or the index).
 *
 * Both files carry relative links to `spec/index.md`, which exists in the
 * source repository but not on this site; repoint it at GitHub so the link
 * still resolves for readers who follow it.
 */
function reference(markdown: string): Document & { letters: Heading[] } {
  const repointed = markdown.replace(
    /\]\(spec\/index\.md\)/g,
    '](https://github.com/public-value-guide/public-value-guide/blob/main/spec/index.md)'
  );
  const doc = parse(repointed);
  return { ...doc, letters: doc.headings.filter((heading) => heading.depth === 2) };
}

/**
 * The A–Z glossary and the concept index are not localized upstream — one
 * shared copy, served at unprefixed URLs regardless of which locale a reader
 * arrived from.
 */
export function glossary() {
  return reference(Object.values(glossaryFile)[0]);
}

/** The concept index. */
export function conceptIndex() {
  return reference(Object.values(indexFile)[0]);
}
