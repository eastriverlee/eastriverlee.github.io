<script lang="ts">
	import { siteTitle } from '$lib/site';
	import { articles, story } from '$lib/writing';

	const characterCount = story.characterCount.toLocaleString('ko-KR');
</script>

<svelte:head>
	<title>writing — {siteTitle}</title>
	<meta property="og:title" content="writing — {siteTitle}" />
</svelte:head>

<h1 class="visually-hidden">writing</h1>

<section aria-labelledby="story-label">
	<h2 id="story-label" class="section-label">story</h2>
	<a class="story" href="/writing/story">
		<span class="excerpt" lang="ko">{story.paragraphs[0].slice(0, 160)}…</span>
		<span class="meta">{characterCount} 글자 · read →</span>
	</a>
</section>

{#if articles.length > 0}
	<section aria-labelledby="articles-label">
		<h2 id="articles-label" class="section-label">articles</h2>
		<ul>
			{#each articles as article (article.slug)}
				<li>
					<a href="/writing/{article.slug}">{article.title}</a>
					<time datetime={article.date}>{article.date}</time>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	section + section {
		margin-top: 56px;
	}

	.story {
		display: block;
		max-width: var(--measure);
		padding: 24px;
		border: 1px solid var(--rule);
		color: var(--ink);
		background: none;
	}

	.story:hover {
		border-color: var(--blue);
		text-decoration: none;
	}

	.excerpt {
		display: block;
		line-height: 1.9;
		word-break: keep-all;
	}

	.meta {
		display: inline-block;
		margin-top: 16px;
		padding: 0 0.25em;
		color: var(--cyan);
		background: var(--blue);
	}

	li {
		display: flex;
		justify-content: space-between;
		gap: 2ch;
		padding: 10px 0;
		border-top: 1px solid var(--rule);
	}

	time {
		color: var(--muted);
	}
</style>
