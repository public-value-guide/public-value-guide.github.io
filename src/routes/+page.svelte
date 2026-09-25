<script lang="ts">
  import { ArticleLayout, SectionHeading, Badge } from '@lilydesignsystem/svelte-headless';
  import { PARTS, SOURCE_REPO, SKILLS_REPO, LOCALES, DEFAULT_LOCALE } from '$lib/book';

  let { data } = $props();

  const parts = $derived(
    PARTS.map((part) => ({
      ...part,
      chapters: data.toc.filter((chapter) => chapter.part === part.number)
    }))
  );

  const preface = $derived(data.toc.find((chapter) => chapter.part === 0));
  const chapterCount = $derived(data.toc.filter((chapter) => chapter.part > 0).length);
  const otherLocales = $derived(LOCALES.filter((locale) => locale.slug !== DEFAULT_LOCALE));
</script>

<svelte:head>
  <title>Public Value Guide</title>
  <meta
    name="description"
    content="A practical handbook of best practices for creating public value in government and the social sector. Worldwide in scope, free and open."
  />
</svelte:head>

<ArticleLayout class="page page-home">
  <header class="page-hero">
    <h1>Public Value Guide</h1>
    <p class="page-hero-lead">
      A practical handbook of best practices for creating public value in government and the
      social sector.
    </p>
    <p>
      This guide is for the people who lead public and social-sector organizations — permanent
      secretaries and agency heads, elected and appointed local-government leaders, nonprofit and
      social-enterprise executive directors, policy and programme directors, and the digital,
      finance, and operations leaders who serve them. Its premise: public value theory — Mark
      Moore's strategic triangle of legitimacy and support, value creation, and operational
      capacity — gives public managers a language for justifying what they do that is neither pure
      market efficiency nor pure democratic mandate, but a third thing worth naming and building
      for deliberately.
    </p>
    <p>
      The scope is worldwide. National governments, regional and local government, social
      enterprises, nonprofits and NGOs, and multilateral and international bodies are all
      first-class citizens here; named institutions appear as exemplars of patterns, not as
      defaults.
    </p>
    <p class="page-hero-actions">
      {#if preface}
        <a
          class="page-action page-action-primary"
          href="/locales/{DEFAULT_LOCALE}/chapters/{preface.slug}/"
        >
          Start with the preface
        </a>
      {/if}
      <a class="page-action" href="/locales/{DEFAULT_LOCALE}/contents/"
        >Browse all {chapterCount} chapters</a
      >
      <a class="page-action" href="/glossary/">Glossary</a>
    </p>
    {#if otherLocales.length > 0}
      <p>
        Written in Oxford spelling by default. Also available in
        {#each otherLocales as locale, i (locale.slug)}
          {i > 0 ? ' and ' : ''}<a href="/locales/{locale.slug}/contents/">{locale.label}</a>
        {/each}
        — switch anytime from the language picker above.
      </p>
    {/if}
  </header>

  <section class="page-section">
    <SectionHeading
      heading="How the book is organized"
      subtitle="Five parts, {chapterCount} chapters. Any chapter can be read on its own — the night before the decision."
    />

    <div class="part-list">
      {#each parts as part (part.number)}
        <div class="part-block">
          <h3 class="part-block-heading">Part {part.number} — {part.title}</h3>
          <p class="part-block-tagline">{part.tagline}</p>
          <ol class="contents-chapters">
            {#each part.chapters as chapter (chapter.slug)}
              <li>
                <a href="/locales/{DEFAULT_LOCALE}/chapters/{chapter.slug}/">
                  <span class="site-contents-number">{chapter.number}</span>
                  {chapter.title}
                </a>
              </li>
            {/each}
          </ol>
        </div>
      {/each}
    </div>
  </section>

  <section class="page-section">
    <SectionHeading heading="Reference" />
    <ul class="reference-list">
      <li>
        <a href="/glossary/">Glossary</a>
        <Badge type="info">A–Z</Badge>
        — plain-English definitions of every key term, each pointing at its home chapter.
      </li>
      <li>
        <a href="/index/">Index</a>
        <Badge type="info">by chapter</Badge>
        — concepts and frameworks mapped to the chapters that cover them.
      </li>
      <li>
        <a href={SOURCE_REPO} rel="noopener">Source repository</a>
        — the markdown behind this site, its specification, and the contribution guide.
      </li>
    </ul>
  </section>

  <section class="page-section">
    <SectionHeading
      heading="Use with Claude"
      subtitle="Two Claude Code skills teach an AI assistant to work with this guide."
    />
    <ul class="reference-list">
      <li>
        <a href="{SKILLS_REPO}/public-value-guide-skill" rel="noopener">public-value-guide</a>
        <Badge type="info">readers</Badge>
        — routes a question to the right chapter, answers grounded in the book's own text, runs
        team workshops from a chapter's discussion questions, and applies the maturity model and
        checklists to a reader's own organization.
      </li>
      <li>
        <a href="{SKILLS_REPO}/public-value-guide-maintainer-skill" rel="noopener"
          >public-value-guide-maintainer</a
        >
        <Badge type="info">maintainers</Badge>
        — encodes the book's authoring, review, and cross-file consistency rules for anyone writing,
        reviewing, or reorganizing chapters.
      </li>
    </ul>
  </section>
</ArticleLayout>
