// Per-locale UI chrome strings — everything on the page that is not the
// book's own prose: nav labels, breadcrumbs, picker labels, pagination,
// footer text.
//
// This exists because a reader who switches the language picker to, say,
// Welsh should not land on a chapter written in Welsh surrounded by English
// navigation. Chapter prose comes from the book's markdown (`$lib/server/book`);
// everything else comes from here, keyed by the same locale slugs as `LOCALES`
// in `$lib/book`.
//
// English variants (`en-gb`, `en-gb-oxendict`, `en-us`, `en-001`) differ only
// in spelling convention, matching the house style each variant uses for its
// chapter prose (see `spec/index.md` §4 upstream). `cy-001` reuses `cy-gb`'s
// strings verbatim — the same decision the book repo made for chapter prose,
// since the register difference between Welsh (Wales) and World Welsh is
// negligible for this formal content.

export type UiStrings = {
  /** The site's own name, as shown in the header brand and used in page titles. */
  siteTitle: string;
  skipToContent: string;
  nav: { contents: string; glossary: string; index: string; source: string };
  breadcrumb: { home: string; contents: string };
  picker: { theme: string; locale: string; textSize: string; share: string };
  share: {
    emailLink: string;
    shareOnLinkedIn: string;
    shareOnReddit: string;
    shareOnBluesky: string;
    shareOnMastodon: string;
    copyLink: string;
    copied: string;
    copyFailed: string;
  };
  contents: {
    pageTitle: string;
    lead: string;
    readingIn: (label: string) => string;
    frontMatter: string;
    part: (n: number) => string;
    reference: string;
  };
  chapter: {
    chapterEyebrow: (n: string) => string;
    paginationLabel: string;
    onThisPage: string;
    previous: string;
    next: string;
  };
  footer: {
    tagline: string;
    sourceAndContributions: string;
    builtWith: string;
  };
};

const en: UiStrings = {
  siteTitle: 'Public Value Guide',
  skipToContent: 'Skip to main content',
  nav: { contents: 'Contents', glossary: 'Glossary', index: 'Index', source: 'Source' },
  breadcrumb: { home: 'Home', contents: 'Contents' },
  picker: { theme: 'Theme', locale: 'Language', textSize: 'Text size', share: 'Share' },
  share: {
    emailLink: 'Email Link',
    shareOnLinkedIn: 'Share on LinkedIn',
    shareOnReddit: 'Share on Reddit',
    shareOnBluesky: 'Share on Bluesky',
    shareOnMastodon: 'Share on Mastodon',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    copyFailed: 'Copy failed — copy the address bar instead'
  },
  contents: {
    pageTitle: 'Contents',
    lead: 'Every chapter is self-contained. Read straight through for a course in public value, or go directly to the chapter that matches the decision in front of you.',
    readingIn: (label) => `Reading in ${label}. Switch language from the header picker.`,
    frontMatter: 'Front matter',
    part: (n) => `Part ${n}`,
    reference: 'Reference'
  },
  chapter: {
    chapterEyebrow: (n) => `Chapter ${n}`,
    paginationLabel: 'Chapter',
    onThisPage: 'On this page',
    previous: 'Previous',
    next: 'Next'
  },
  footer: {
    tagline:
      'a practical handbook of best practices for creating public value in government and the social sector, worldwide in scope.',
    sourceAndContributions: 'Source and contributions:',
    builtWith: 'Built with the'
  }
};

// en-us differs from en-gb only in spelling; none of this chrome text
// contains a British/American spelling divergence, so it is identical to
// `en`. Kept as its own entry, rather than aliased, so a future chrome string
// that does diverge (e.g. "-ize"/"-ise") has an obvious place to change.
const enUs: UiStrings = en;

const enGb: UiStrings = en;

const enGbOxendict: UiStrings = en;

const en001: UiStrings = en;

const cyGb: UiStrings = {
  siteTitle: 'Canllaw Gwerth Cyhoeddus',
  skipToContent: 'Neidio i’r prif gynnwys',
  nav: { contents: 'Cynnwys', glossary: 'Geirfa', index: 'Mynegai', source: 'Ffynhonnell' },
  breadcrumb: { home: 'Hafan', contents: 'Cynnwys' },
  picker: { theme: 'Thema', locale: 'Iaith', textSize: 'Maint testun', share: 'Rhannu' },
  share: {
    emailLink: 'E-bostio’r Ddolen',
    shareOnLinkedIn: 'Rhannu ar LinkedIn',
    shareOnReddit: 'Rhannu ar Reddit',
    shareOnBluesky: 'Rhannu ar Bluesky',
    shareOnMastodon: 'Rhannu ar Mastodon',
    copyLink: 'Copïo’r Ddolen',
    copied: 'Wedi copïo!',
    copyFailed: 'Methodd y copïo — copïwch far y cyfeiriad yn lle hynny'
  },
  contents: {
    pageTitle: 'Cynnwys',
    lead: 'Mae pob pennod yn hunangynhwysol. Darllenwch drwyddo am gwrs mewn gwerth cyhoeddus, neu ewch yn syth i’r bennod sy’n cyfateb â’r penderfyniad o’ch blaen.',
    readingIn: (label) => `Yn darllen yn ${label}. Newidiwch iaith o’r dewisydd yn y pennawd.`,
    frontMatter: 'Deunydd blaen',
    part: (n) => `Rhan ${n}`,
    reference: 'Cyfeirnod'
  },
  chapter: {
    chapterEyebrow: (n) => `Pennod ${n}`,
    paginationLabel: 'Pennod',
    onThisPage: 'Ar y dudalen hon',
    previous: 'Blaenorol',
    next: 'Nesaf'
  },
  footer: {
    tagline:
      'llawlyfr ymarferol o arferion gorau ar gyfer creu gwerth cyhoeddus mewn llywodraeth a’r sector cymdeithasol, byd-eang ei gwmpas.',
    sourceAndContributions: 'Ffynhonnell a chyfraniadau:',
    builtWith: 'Wedi’i adeiladu â’r'
  }
};

// cy-001 reuses cy-gb's chrome strings verbatim, matching the book repo's own
// decision to reuse cy-gb prose for cy-001 (see spec/index.md upstream).
const cy001: UiStrings = cyGb;

const STRINGS: Record<string, UiStrings> = {
  'en-gb-oxendict': enGbOxendict,
  'en-gb': enGb,
  'en-us': enUs,
  'en-001': en001,
  'cy-gb': cyGb,
  'cy-001': cy001
};

/** UI chrome strings for `locale`, falling back to English if the locale is unknown. */
export function ui(locale: string | undefined): UiStrings {
  return (locale && STRINGS[locale]) || en;
}
