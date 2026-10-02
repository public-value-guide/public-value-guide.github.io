<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { targetFromSearch, search, type IndexEntry, type SearchResult } from '#lib/search.js';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();

	let target = $state('');
	let input = $state('');
	let results = $state<SearchResult[] | null>(null);
	let failed = $state(false);
	let indexPromise: Promise<IndexEntry[]> | null = null;

	const onHome = $derived(page.url.pathname === '/');

	// Client-only: the home page is prerendered, so the query is read here.
	$effect(() => {
		target = onHome ? targetFromSearch(page.url.search) : '';
		input = target;
	});

	$effect(() => {
		const q = target;
		if (!q) {
			results = null;
			return;
		}
		failed = false;
		indexPromise ??= fetch('/search-index.json').then((r) => {
			if (!r.ok) throw new Error(String(r.status));
			return r.json() as Promise<IndexEntry[]>;
		});
		indexPromise.then(
			(index) => {
				if (q === target) results = search(index, q);
			},
			() => {
				indexPromise = null;
				failed = true;
			}
		);
	});

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const q = input.trim();
		goto(q ? `/?${encodeURIComponent(q).replace(/%20/g, '+')}` : '/');
	}
</script>

{#if onHome}
	<form class="site-search" role="search" onsubmit={submit}>
		<label for="site-search-input">Search</label>
		<input id="site-search-input" type="search" bind:value={input} autocomplete="off" />
		<button type="submit">Search</button>
	</form>
{/if}

{#if target}
	<section class="site-search-results" aria-live="polite" aria-label="Search results">
		<h1>Search: {target}</h1>
		{#if failed}
			<p>The search index could not be loaded.</p>
		{:else if results === null}
			<p>Searching…</p>
		{:else if results.length === 0}
			<p>No results for “{target}”. <a href="/">Back to the home page</a></p>
		{:else}
			<p>{results.length}{results.length === 50 ? '+' : ''} result{results.length === 1 ? '' : 's'}</p>
			<ol>
				{#each results as r (r.url)}
					<li>
						<a href={r.url}>{r.title}</a>
						<div class="site-search-url">{r.url}</div>
						<p>{@html r.snippet}</p>
					</li>
				{/each}
			</ol>
		{/if}
	</section>
{:else}
	{@render children?.()}
{/if}

