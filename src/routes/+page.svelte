<script lang="ts">
	import BusinessCard from '$lib/components/BusinessCard.svelte';
	import ParallaxPortrait from '$lib/components/ParallaxPortrait.svelte';
	import type { ViewGrid } from '$lib/viewGrid';
	import WorkList from '$lib/components/WorkList.svelte';
	import { links, siteTitle, works } from '$lib/site';

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
			i code, draw type, write, design, box and invest.
		</p>
		<div class="card">
			<BusinessCard
				frontURL="/images/card-front.svg"
				backURL="/images/card-back.svg"
				label="business card: 이동하 (dan lee), cto at 여명거리"
			/>
			<p class="hint">drag to turn</p>
		</div>
	</div>
	<div class="portrait">
		<ParallaxPortrait
			photoURL="/images/portrait.jpg"
			viewsURL="/images/portrait-views.webp"
			depthsURL="/images/portrait-depths.webp"
			grid={portraitGrid}
			alt="eastriver eating dinner on a train, glancing back at the camera"
		/>
	</div>
</section>

<section aria-labelledby="now-label">
	<h2 id="now-label" class="section-label">now</h2>
	<WorkList works={currentWorks} />
	<p class="more"><a href="/works">all works →</a></p>
</section>

<section aria-labelledby="elsewhere-label">
	<h2 id="elsewhere-label" class="section-label">elsewhere</h2>
	<ul class="links">
		{#each links as link (link.url)}
			<li><a href={link.url}>{link.label}</a></li>
		{/each}
	</ul>
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

	.card {
		max-width: 300px;
		margin-top: 40px;
	}

	.hint {
		margin-top: 8px;
		font-size: 0.8125rem;
		color: var(--muted);
	}

	.portrait {
		max-width: 420px;
	}

	@media (min-width: 880px) {
		.hero {
			grid-template-columns: 1fr 340px;
		}
	}

	.more {
		margin-top: 12px;
		text-align: right;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 24px;
	}

	.links a::before {
		content: '→ ';
	}
</style>
