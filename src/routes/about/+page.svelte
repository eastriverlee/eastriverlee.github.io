<script lang="ts">
	import DeferredEmbed from '$lib/components/DeferredEmbed.svelte';
	import { despised, dreams, favorites, playlistEmbedURL, siteTitle } from '$lib/site';
</script>

<svelte:head>
	<title>about — {siteTitle}</title>
	<meta property="og:title" content="about — {siteTitle}" />
</svelte:head>

<h1 class="visually-hidden">about</h1>

<div class="columns">
	<div>
		<section aria-labelledby="intro-label">
			<h2 id="intro-label" class="section-label">intro</h2>
			<p class="intro">
				i code, draw type, write, design, box, invest, and do all the other stuff (…except for socializing).
			</p>
			<p class="intro">i was born twenty-six years after there was a giant leap for mankind.</p>
		</section>

		<section aria-labelledby="favorites-label">
			<h2 id="favorites-label" class="section-label">favorites</h2>
			<dl>
				{#each favorites as favorite (favorite.category)}
					<div>
						<dt>{favorite.category}</dt>
						<dd>{favorite.items.join(', ')}</dd>
					</div>
				{/each}
				<div>
					<dt>despise</dt>
					<dd>{despised.join(', ')}</dd>
				</div>
			</dl>
		</section>

		<section aria-labelledby="dreams-label">
			<h2 id="dreams-label" class="section-label">dreams</h2>
			<ul class="dreams">
				{#each dreams as dream (dream)}
					<li>{dream}</li>
				{/each}
			</ul>
		</section>
	</div>

	<aside aria-labelledby="listening-label">
		<h2 id="listening-label" class="section-label">listening</h2>
		<DeferredEmbed
			source={playlistEmbedURL}
			title="timeless, an apple music playlist"
			label="timeless"
			aspectRatio="3 / 4"
			allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
		/>
	</aside>
</div>

<style>
	.columns {
		display: grid;
		gap: 56px;
	}

	@media (min-width: 880px) {
		.columns {
			grid-template-columns: 1fr 300px;
		}

		aside {
			position: sticky;
			top: 24px;
			align-self: start;
		}
	}

	section + section {
		margin-top: 56px;
	}

	.intro {
		max-width: 56ch;
	}

	.intro + .intro {
		margin-top: 12px;
	}

	dl {
		margin: 0;
	}

	dl > div {
		display: grid;
		grid-template-columns: 12ch 1fr;
		column-gap: 2ch;
		padding: 8px 0;
		border-top: 1px solid var(--rule);
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
	}

	.dreams li::before {
		content: '* ';
		color: var(--blue);
	}
</style>
