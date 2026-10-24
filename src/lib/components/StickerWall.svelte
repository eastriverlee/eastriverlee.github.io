<script lang="ts">
	import type { Sticker } from '$lib/site';

	let { stickers, label }: { stickers: Sticker[]; label: string } = $props();

	const tiltsInDegrees = [-6, 4, -2, 7, -4, 3, -8, 2, 5, -3, 6, -5];
	const cellInPixels = 20;
	const stackingOrder = $derived(
		new Map(
			[...stickers]
				.sort((first, second) => second.width * second.height - first.width * first.height)
				.map((sticker, layer) => [sticker.name, layer])
		)
	);

	function countCells(lengthInPixels: number): number {
		return Math.max(1, Math.round(lengthInPixels / 2 / cellInPixels));
	}

	function placeSticker(sticker: Sticker, index: number): string {
		const tilt = tiltsInDegrees[index % tiltsInDegrees.length];
		return [
			`--width: ${sticker.width / 2}px`,
			`--tilt: ${tilt}deg`,
			`grid-column: span ${countCells(sticker.width)}`,
			`grid-row: span ${countCells(sticker.height)}`,
			`z-index: ${stackingOrder.get(sticker.name)}`
		].join('; ');
	}
</script>

<ul class="wall" aria-label={label} style="--cell-base: {cellInPixels}px">
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
		--scale: 0.45;
		--cell: calc(var(--cell-base) * var(--scale));
		isolation: isolate;
		display: grid;
		grid-template-columns: repeat(auto-fill, var(--cell));
		grid-auto-rows: var(--cell);
		grid-auto-flow: dense;
		justify-content: center;
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
		justify-self: center;
		align-self: center;
		transform: rotate(var(--tilt));
	}

	li:hover,
	li:focus-within {
		animation: wiggle 600ms ease-in-out;
	}

	@keyframes wiggle {
		30% {
			transform: rotate(calc(var(--tilt) - 1deg));
		}
		70% {
			transform: rotate(calc(var(--tilt) + 1deg));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		li:hover,
		li:focus-within {
			animation: none;
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
