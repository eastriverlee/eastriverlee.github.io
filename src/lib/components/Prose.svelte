<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		meta?: string;
		lang?: string;
		children: Snippet;
	};

	let { title, meta, lang, children }: Props = $props();
</script>

<article {lang}>
	<header>
		<p class="back"><a href="/writing">← writing</a></p>
		<h1>{title}</h1>
		{#if meta}
			<p class="meta">{meta}</p>
		{/if}
	</header>
	<div class="body">
		{@render children()}
	</div>
</article>

<style>
	article {
		max-width: var(--measure);
		margin: 0 auto;
	}

	header {
		margin-bottom: 40px;
	}

	.back {
		margin-bottom: 24px;
	}

	h1 {
		font-size: clamp(1.5rem, 4vw, 2.25rem);
	}

	.meta {
		margin-top: 8px;
		color: var(--muted);
	}

	.body {
		line-height: 1.9;
		word-break: keep-all;
		overflow-wrap: anywhere;
	}

	.body :global(p + p) {
		margin-top: 1.2em;
	}

	.body :global(h2),
	.body :global(h3) {
		margin: 2em 0 0.6em;
	}

	.body :global(code) {
		background: var(--rule);
		padding: 0.1em 0.3em;
	}

	.body :global(pre) {
		background: var(--band);
		color: var(--band-ink);
		padding: 16px;
		overflow-x: auto;
		line-height: 1.5;
	}

	.body :global(pre code) {
		background: none;
		padding: 0;
	}
</style>
