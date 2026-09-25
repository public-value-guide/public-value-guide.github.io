<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import {
    SkipLink,
    GrailLayout,
    GrailLayoutTopHeader,
    GrailLayoutCenterMain,
    GrailLayoutBottomFooter
  } from '@lilydesignsystem/svelte-headless';
  import PickerBar from '@lilydesignsystem/svelte-picker-bar';
  import { SOURCE_REPO, LOCALES, LOCALE_SLUGS, DEFAULT_LOCALE } from '$lib/book';

  let { children } = $props();

  const LOCALE_LABELS: Record<string, string> = Object.fromEntries(
    LOCALES.map((locale) => [locale.slug, locale.label])
  );

  // The locale of the page currently showing, when there is one — set on
  // every `/locales/<slug>/...` route, absent on locale-neutral pages
  // (home, glossary, index).
  const currentLocale = $derived(page.params.locale);

  /**
   * Where switching to `newLocale` should go from the page showing now.
   *
   * A chapter page jumps to the *same chapter* in the new locale via the
   * cross-locale slug map (most chapters share a slug across locales, but a
   * Welsh chapter directory does not). Anywhere else lands on the new
   * locale's contents page, since locale-neutral pages (home, glossary,
   * index) have no per-locale equivalent to jump to.
   */
  function targetPathForLocale(newLocale: string): string {
    const chapterMatch = page.url.pathname.match(/^\/locales\/[^/]+\/chapters\/([^/]+)\/?$/);
    if (chapterMatch && page.data?.ref) {
      const key: string = page.data.ref.number || `front:${page.data.ref.slug}`;
      const mapped = page.data.localeSlugMap?.[key]?.[newLocale];
      if (mapped) return `/locales/${newLocale}/chapters/${mapped}/`;
    }
    return `/locales/${newLocale}/contents/`;
  }

  /**
   * The locale picker fires `onChange` once on mount (to apply the initial
   * `lang`/`dir`) as well as on a genuine user selection — the two are
   * indistinguishable from here, see the Lily locale-picker source. Treat the
   * very first call as that mount-time initialisation, never navigation; only
   * calls after that come from the reader actually choosing a language.
   */
  let readyToNavigate = false;

  function handleLocaleChange(newLocale: string): void {
    if (!readyToNavigate) {
      readyToNavigate = true;
      return;
    }
    const target = targetPathForLocale(newLocale);
    if (target !== page.url.pathname) goto(target);
  }

  // "Contents" follows whichever locale is currently showing, falling back
  // to the house-style default on locale-neutral pages.
  const siteLinks = $derived([
    { href: `/locales/${currentLocale ?? DEFAULT_LOCALE}/contents/`, label: 'Contents' },
    { href: '/glossary/', label: 'Glossary' },
    { href: '/index/', label: 'Index' }
  ]);

  // Read at share time (inside each href, not as a static prop), so it
  // reflects whatever page is showing even after a client-side
  // navigation the layout itself doesn't re-run for.
  function pageTitle(): string {
    return typeof document !== 'undefined' ? document.title : '';
  }

  const shareTargets = [
    {
      id: 'email',
      label: 'Email Link',
      href: (url: string) =>
        `mailto:?subject=${encodeURIComponent(pageTitle())}&body=${encodeURIComponent(url)}`,
      newTab: false
    },
    {
      id: 'linkedin',
      label: 'Share on LinkedIn',
      href: (url: string) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      id: 'reddit',
      label: 'Share on Reddit',
      href: (url: string) =>
        `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(pageTitle())}`
    },
    {
      id: 'bluesky',
      label: 'Share on Bluesky',
      href: (url: string) =>
        `https://bsky.app/intent/compose?text=${encodeURIComponent(`${pageTitle()} ${url}`)}`
    },
    {
      id: 'mastodon',
      label: 'Share on Mastodon',
      href: (url: string) =>
        `https://mastodonshare.com/?text=${encodeURIComponent(pageTitle())}&url=${encodeURIComponent(url)}`
    }
  ];
</script>

<SkipLink href="#main" label="Skip to main content" />

<GrailLayout class="site">
  <GrailLayoutTopHeader class="site-header">
    <a class="site-brand" href="/">
      <span class="site-brand-icon" aria-hidden="true">⚖</span>
      <span class="site-brand-title">Public Value Guide</span>
    </a>

    <nav class="site-nav" aria-label="Site">
      {#each siteLinks as link (link.href)}
        <a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : undefined}>
          {link.label}
        </a>
      {/each}
      <a href={SOURCE_REPO} rel="noopener">Source</a>
    </nav>

    <PickerBar
      class="site-controls"
      labels={{ theme: 'Theme', locale: 'Language', textSize: 'Text size', share: 'Share' }}
      themesUrl="/assets/themes/"
      themeProps={{
        defaultValue: 'light',
        detectFromSystem: true,
        storageKey: 'public-value-guide-theme'
      }}
      locales={LOCALE_SLUGS}
      localeProps={{
        value: currentLocale,
        defaultValue: DEFAULT_LOCALE,
        storageKey: 'public-value-guide-locale',
        localeLabels: LOCALE_LABELS,
        onChange: handleLocaleChange
      }}
      textSizeProps={{ storageKey: 'public-value-guide-text-size' }}
      shareTargets={shareTargets}
      shareProps={{
        copyLabel: 'Copy Link',
        copiedLabel: 'Copied!',
        copyFailedLabel: 'Copy failed — copy the address bar instead'
      }}
    />
  </GrailLayoutTopHeader>

  <GrailLayoutCenterMain class="site-main" id="main">
    {@render children()}
  </GrailLayoutCenterMain>

  <GrailLayoutBottomFooter class="site-footer">
    <p>
      <strong>Public Value Guide</strong> — a practical handbook of best practices for creating
      public value in government and the social sector, worldwide in scope.
    </p>
    <p>
      Source and contributions: <a href={SOURCE_REPO} rel="noopener">github.com/public-value-guide</a
      >. Built with the
      <a href="https://github.com/LilyDesignSystem" rel="noopener">Lily Design System™</a>.
    </p>
  </GrailLayoutBottomFooter>
</GrailLayout>
