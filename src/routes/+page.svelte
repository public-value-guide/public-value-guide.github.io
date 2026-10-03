<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { DEFAULT_LOCALE } from '#lib/book.js';

  const destination = `/${DEFAULT_LOCALE}/contents/`;

  // `/` has no content of its own: send the reader to the default locale.
  // A query (`/?<target>`) is a site search handled by SearchGate in the
  // layout, so it must not be redirected away.
  onMount(() => {
    if (!location.search) goto(destination, { replaceState: true });
  });
</script>

<svelte:head>
  <title>Public Value Guide</title>
  <noscript><meta http-equiv="refresh" content="0;url={destination}" /></noscript>
</svelte:head>

<p><a href={destination}>Continue to the Public Value Guide</a></p>
