<script lang="ts">
	type Props = {
		source: string;
		title: string;
		label: string;
		aspectRatio: string;
		allow?: string;
		posterURL?: string;
	};

	let { source, title, label, aspectRatio, allow = 'autoplay; encrypted-media; fullscreen', posterURL }: Props =
		$props();
	let isLoaded = $state(false);
</script>

<div class="frame" style:aspect-ratio={aspectRatio}>
	{#if isLoaded}
		<iframe src={source} {title} {allow} loading="lazy"></iframe>
	{:else}
		<button
			type="button"
			onclick={() => (isLoaded = true)}
			style:background-image={posterURL ? `url(${posterURL})` : undefined}
		>
			<span class="play" aria-hidden="true">▶</span>
			{label}
		</button>
	{/if}
</div>

<style>
	.frame {
		width: 100%;
		background: #000000;
		border: 2px solid var(--blue);
	}

	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}

	button {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		font: inherit;
		color: #ffffff;
		background: transparent center / cover no-repeat;
		border: 0;
		cursor: pointer;
		text-shadow: 0 1px 2px #000000;
	}

	button:hover .play {
		background: var(--blue);
	}

	.play {
		display: inline-grid;
		place-items: center;
		width: 2.5em;
		height: 2.5em;
		border: 2px solid #ffffff;
		background: #000000;
	}
</style>
