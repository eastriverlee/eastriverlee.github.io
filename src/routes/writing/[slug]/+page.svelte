<script lang="ts">
	import Prose from '$lib/components/Prose.svelte';
	import { siteTitle } from '$lib/site';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.article.title} — {siteTitle}</title>
	<meta property="og:title" content="{data.article.title} — {siteTitle}" />
</svelte:head>

<Prose title={data.article.title} meta={data.article.date}>
	{@html data.article.html}
</Prose>
