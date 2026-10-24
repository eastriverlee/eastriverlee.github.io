<script lang="ts">
	import type { Work } from '$lib/site';

	let { works }: { works: Work[] } = $props();

	function isExternal(url: string): boolean {
		return url.startsWith('http');
	}
</script>

<ul>
	{#each works as work (work.name)}
		<li>
			<span class="name">
				{#if work.url}
					<a href={work.url} rel={isExternal(work.url) ? 'external' : undefined}>{work.name}</a>
				{:else}
					{work.name}
				{/if}
			</span>
			<span class="since">{work.since ?? ''}</span>
			{#if work.summary}
				<span class="summary">{work.summary}</span>
			{/if}
		</li>
	{/each}
</ul>

<style>
	li {
		display: grid;
		grid-template-columns: minmax(12ch, 22ch) 1fr;
		column-gap: 2ch;
		padding: 10px 0;
		border-top: 1px solid var(--rule);
	}

	li:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.name {
		font-weight: 700;
	}

	.since {
		color: var(--muted);
		text-align: right;
	}

	.summary {
		grid-column: 1 / -1;
		color: var(--muted);
	}

	@media (min-width: 720px) {
		li {
			grid-template-columns: 22ch 1fr 5ch;
		}

		.summary {
			grid-column: 2;
			grid-row: 1;
			color: inherit;
		}

		.since {
			grid-column: 3;
			grid-row: 1;
		}
	}
</style>
