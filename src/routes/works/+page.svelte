<script lang="ts">
	import DeferredEmbed from '$lib/components/DeferredEmbed.svelte';
	import WorkList from '$lib/components/WorkList.svelte';
	import { kindLabels, siteTitle, works, type WorkKind } from '$lib/site';

	const listedKinds: WorkKind[] = ['language', 'app', 'tool', 'library'];
	const fonts = works.filter((work) => work.kind === 'font');
	const films = works.filter((work) => work.kind === 'film');

	function worksOfKind(kind: WorkKind) {
		return works.filter((work) => work.kind === kind);
	}
</script>

<svelte:head>
	<title>works — {siteTitle}</title>
	<meta property="og:title" content="works — {siteTitle}" />
</svelte:head>

<h1 class="visually-hidden">works</h1>

{#each listedKinds as kind (kind)}
	<section aria-labelledby="{kind}-label">
		<h2 id="{kind}-label" class="section-label">{kindLabels[kind]}</h2>
		<WorkList works={worksOfKind(kind)} />
	</section>
{/each}

<section aria-labelledby="font-label">
	<h2 id="font-label" class="section-label">{kindLabels.font}</h2>
	<div class="grid">
		{#each fonts as font (font.name)}
			<article>
				<a class="specimen" href={font.url} rel="external" aria-label={font.name}>
					{@html font.specimenSVG}
				</a>
				<h3><a href={font.url} rel="external">{font.name}</a></h3>
				<p>{font.summary}</p>
			</article>
		{/each}
	</div>
	<p class="note">
		both fonts are on <a href="https://eastriverlee.itch.io/semteulche-hesalche" rel="external">itch.io as a set</a>.
	</p>
</section>

<section aria-labelledby="film-label">
	<h2 id="film-label" class="section-label">{kindLabels.film}</h2>
	<div class="grid">
		{#each films as film (film.name)}
			<article>
				<DeferredEmbed
					source="https://www.youtube-nocookie.com/embed/{film.youtubeID}?autoplay=1&rel=0"
					title={film.name}
					label="play"
					aspectRatio="16 / 9"
					posterURL="https://i.ytimg.com/vi/{film.youtubeID}/hqdefault.jpg"
				/>
				<h3>{film.name}</h3>
				{#if film.summary}
					<p>{film.summary}</p>
				{/if}
			</article>
		{/each}
	</div>
</section>

<style>
	section + section {
		margin-top: 56px;
	}

	.grid {
		display: grid;
		gap: 32px;
	}

	@media (min-width: 720px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	article h3 {
		font-size: 1rem;
		margin-top: 12px;
	}

	article p {
		color: var(--muted);
	}

	.specimen {
		display: block;
		padding: 24px;
		border: 1px solid var(--rule);
		color: var(--ink);
	}

	.specimen:hover {
		border-color: var(--blue);
		color: var(--blue);
	}

	.specimen :global(svg) {
		display: block;
		height: clamp(72px, 14vw, 112px);
		width: auto;
		max-width: 100%;
	}

	.note {
		margin-top: 16px;
		color: var(--muted);
	}
</style>
