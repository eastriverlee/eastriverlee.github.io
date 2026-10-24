<script lang="ts">
	import { siteTitle } from '$lib/site';
	import { story } from '$lib/writing';
	import Prose from '$lib/components/Prose.svelte';

	const characterCount = story.characterCount.toLocaleString('ko-KR');
</script>

<svelte:head>
	<title>{story.title} — {siteTitle}</title>
	<meta property="og:title" content="{story.title} — {siteTitle}" />
</svelte:head>

<Prose title={story.title} meta="{characterCount} 글자" lang="ko">
	{#each story.paragraphs as paragraph, index (index)}
		<p>{paragraph}</p>
	{/each}
</Prose>
