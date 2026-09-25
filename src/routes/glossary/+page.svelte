<script lang="ts">
  import ReferencePage from '$lib/ReferencePage.svelte';

  let { data } = $props();
</script>

<ReferencePage
  title="Glossary"
  lead="Key terms defined in plain English, each pointing at the chapter that owns it."
  doc={data.doc}
/>
