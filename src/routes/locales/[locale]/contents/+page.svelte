<script lang="ts">
  import {
    ArticleLayout,
    SectionHeading,
    BreadcrumbNav,
    BreadcrumbList,
    BreadcrumbListItem
  } from '@lilydesignsystem/svelte-headless';
  import { LOCALES, partsFor } from '$lib/book';
  import { ui } from '$lib/i18n';

  let { data } = $props();

  const t = $derived(ui(data.locale));
  const localeLabel = $derived(
    LOCALES.find((candidate) => candidate.slug === data.locale)?.label ?? data.locale
  );
  const frontMatter = $derived(data.toc.filter((chapter) => chapter.part === 0));
  const parts = $derived(
    partsFor(data.locale).map((part) => ({
      ...part,
      chapters: data.toc.filter((chapter) => chapter.part === part.number)
    }))
  );
</script>

<svelte:head>
  <title>{t.contents.pageTitle} — {t.siteTitle}</title>
  <meta name="description" content={t.contents.lead} />
</svelte:head>

<ArticleLayout class="page">
  <BreadcrumbNav label="Breadcrumb" class="page-breadcrumb">
    <BreadcrumbList>
      <BreadcrumbListItem><a href="/">{t.breadcrumb.home}</a></BreadcrumbListItem>
      <BreadcrumbListItem current>{t.contents.pageTitle}</BreadcrumbListItem>
    </BreadcrumbList>
  </BreadcrumbNav>

  <header class="page-header">
    <h1>{t.contents.pageTitle}</h1>
    <p class="page-lead">{t.contents.lead}</p>
    <p class="page-eyebrow">{t.contents.readingIn(localeLabel)}</p>
  </header>

  {#if frontMatter.length}
    <section class="page-section">
      <SectionHeading heading={t.contents.frontMatter} />
      <ol class="contents-chapters">
        {#each frontMatter as chapter (chapter.slug)}
          <li><a href="/locales/{data.locale}/chapters/{chapter.slug}/">{chapter.title}</a></li>
        {/each}
      </ol>
    </section>
  {/if}

  {#each parts as part (part.number)}
    <section class="page-section">
      <SectionHeading
        eyebrow={t.contents.part(part.number)}
        heading={part.title}
        subtitle={part.tagline}
      />
      <ol class="contents-chapters">
        {#each part.chapters as chapter (chapter.slug)}
          <li>
            <a href="/locales/{data.locale}/chapters/{chapter.slug}/">
              <span class="site-contents-number">{chapter.number}</span>
              {chapter.title}
            </a>
          </li>
        {/each}
      </ol>
    </section>
  {/each}

  <section class="page-section">
    <SectionHeading heading={t.contents.reference} />
    <ol class="contents-chapters">
      <li><a href="/glossary/">{t.nav.glossary}</a></li>
      <li><a href="/index/">{t.nav.index}</a></li>
    </ol>
  </section>
</ArticleLayout>
