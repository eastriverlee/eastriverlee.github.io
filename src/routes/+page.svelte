<script lang="ts">
	import BusinessCard from '$lib/components/BusinessCard.svelte';
	import ParallaxPortrait from '$lib/components/ParallaxPortrait.svelte';
	import type { ViewGrid } from '$lib/viewGrid';
	import WorkList from '$lib/components/WorkList.svelte';
	import { despised, dreams, favorites, playlistEmbedURL, siteTitle, works } from '$lib/site';

	const currentWorks = works.filter((work) => work.isCurrent);
	const portraitGrid: ViewGrid = {
		columns: 5,
		rows: 5,
		travelInMeters: 0.025,
		focalLengthInImageHeights: 0.7625,
		aspectRatio: 3 / 4,
		nearestDepthInMeters: 0.35,
		farthestDepthInMeters: 3.2,
		focusDepthInMeters: 0.59
	};
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta property="og:title" content={siteTitle} />
</svelte:head>

<section class="hero">
	<div class="greeting">
		<h1>hello world,<br />this is an eastriver's space<span class="cursor" aria-hidden="true"></span></h1>
		<p class="lede">
			there is not much to say, <span class="highlight">really</span>.<br />
			i code, draw type, write, design, box, invest, and do all the other stuff (…except for socializing).
		</p>
	</div>
	<div class="portrait">
		<ParallaxPortrait
			photoURL="/images/portrait.jpg"
			viewsURL="/images/portrait-views.webp"
			depthsURL="/images/portrait-depths.webp"
			grid={portraitGrid}
			alt="eastriver eating dinner on a train, glancing back at the camera"
		/>
		<div class="card">
			<BusinessCard
				frontURL="/images/card-front.svg"
				backURL="/images/card-back.svg"
				label="business card: 이동하 (dan lee), cto at 여명거리"
			/>
			<p class="hint">drag to turn</p>
		</div>
	</div>
</section>

<div class="columns">
	<div>
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
			<p class="born">i was born twenty-six years after there was a giant leap for mankind.</p>
		</section>
	</div>

	<aside aria-labelledby="listening-label">
		<h2 id="listening-label" class="section-label">listening</h2>
		<iframe
			class="playlist"
			src={playlistEmbedURL}
			title="eastriver, an apple music playlist"
			allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
			sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
			loading="lazy"
		></iframe>
	</aside>
</div>

<section aria-labelledby="now-label">
	<h2 id="now-label" class="section-label">now</h2>
	<WorkList works={currentWorks} />
	<p class="more"><a href="/works">all works →</a></p>
</section>

<style>
	section + section {
		margin-top: 64px;
	}

	.hero {
		display: grid;
		gap: 32px;
		align-items: end;
	}

	h1 {
		font-size: clamp(1.75rem, 5.2vw, 3.5rem);
		letter-spacing: -0.02em;
	}

	.cursor {
		display: inline-block;
		width: 0.55em;
		height: 0.9em;
		margin-left: 0.08em;
		vertical-align: -0.05em;
		background: var(--blue);
		animation: blink 1.1s steps(1) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor {
			animation: none;
		}
	}

	.lede {
		margin-top: 24px;
		max-width: 48ch;
	}

	.portrait {
		position: relative;
		max-width: 420px;
		margin-bottom: 96px;
	}

	.card {
		position: absolute;
		left: 16px;
		bottom: -96px;
		width: 70%;
	}

	.hint {
		margin-top: 8px;
		font-size: 0.8125rem;
		color: var(--muted);
	}

	@media (min-width: 880px) {
		.card {
			left: -48px;
		}
	}

	@media (min-width: 880px) {
		.hero {
			grid-template-columns: 1fr 340px;
		}
	}

	.columns {
		display: grid;
		gap: 56px;
		margin: 64px 0;
	}

	@media (min-width: 880px) {
		.columns {
			grid-template-columns: 1fr 300px;
		}

		aside {
			position: sticky;
			top: var(--sticky-top);
			align-self: start;
		}
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

	.playlist {
		display: block;
		width: 100%;
		height: 450px;
		border: 2px solid var(--blue);
	}

	.born {
		margin-top: 24px;
		max-width: 56ch;
	}

	.more {
		margin-top: 12px;
		text-align: right;
	}
</style>
