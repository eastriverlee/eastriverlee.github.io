<script lang="ts">
	import type { Sticker } from '$lib/site';

	let { stickers, label }: { stickers: Sticker[]; label: string } = $props();

	const tiltsInDegrees = [-6, 4, -2, 7, -4, 3, -8, 2, 5, -3, 6, -5];
	const liftsInPixels = [0, 18, -10, 8, -16, 12, 4, -6, 14, -12];

	function placeSticker(sticker: Sticker, index: number): string {
		const tilt = tiltsInDegrees[index % tiltsInDegrees.length];
		const lift = liftsInPixels[index % liftsInPixels.length];
		return `--width: ${sticker.width / 2}px; --tilt: ${tilt}deg; --lift: ${lift}px; z-index: ${(index * 7) % 11}`;
	}
</script>

<ul class="wall" aria-label={label}>
	{#each stickers as sticker, index (sticker.name)}
		<li class:die-cut={sticker.isDieCut} style={placeSticker(sticker, index)}>
			<a href={sticker.url} rel="external" title={sticker.name}>
				<img
					src={sticker.imageURL}
					alt={sticker.name}
					width={sticker.width / 2}
					height={sticker.height / 2}
					loading="lazy"
					decoding="async"
				/>
			</a>
		</li>
	{/each}
</ul>

<style>
	.wall {
		--scale: 0.6;
		isolation: isolate;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin: 48px 0 0;
		padding: 24px 0;
		list-style: none;
	}

	@media (min-width: 880px) {
		.wall {
			--scale: 0.7;
		}
	}

	li {
		position: relative;
		width: calc(var(--width) * var(--scale));
		margin: -6px -10px;
		transform: translateY(calc(var(--lift) * var(--scale))) rotate(var(--tilt));
		transition: transform 160ms ease-out;
	}

	li:hover,
	li:focus-within {
		transform: translateY(calc(var(--lift) * var(--scale))) rotate(var(--tilt)) scale(1.03);
	}

	@media (prefers-reduced-motion: reduce) {
		li {
			transition: none;
		}
	}

	a {
		display: block;
		padding: 0;
		background: none;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.35)) drop-shadow(0 6px 10px rgb(0 0 0 / 0.16));
	}


	.die-cut img {
		filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.3)) drop-shadow(0 2px 4px rgb(0 0 0 / 0.14));
	}
</style>
