<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { siteDescription } from '$lib/site';

	let { children } = $props();

	const navigation = [
		{ label: 'works', path: '/works' },
		{ label: 'writing', path: '/writing' },
		{ label: 'about', path: '/about' }
	];

	function isActive(path: string): boolean {
		return page.url.pathname === path || page.url.pathname.startsWith(`${path}/`);
	}
</script>

<svelte:head>
	<meta name="description" content={siteDescription} />
	<meta property="og:site_name" content="eastriver.dev" />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:url" content={`https://eastriver.dev${page.url.pathname}`} />
</svelte:head>

<a class="skip-link visually-hidden" href="#content">skip to content</a>

<header class="band site-header">
	<div class="band-inner">
		<a class="wordmark" href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>eastriver</a>
		<nav aria-label="main">
			<ul>
				{#each navigation as item (item.path)}
					<li>
						<a href={item.path} aria-current={isActive(item.path) ? 'page' : undefined}>{item.label}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<main id="content">
	{@render children()}
</main>

<footer class="band band-blue">
	<div class="band-inner">
		<p>svelte+css written in vim; because i'm a simple man.</p>
		<p><a href="mailto:lee@eastriver.dev">lee@eastriver.dev</a></p>
	</div>
</footer>

<style>
	.skip-link:focus {
		position: fixed;
		top: 8px;
		left: 8px;
		width: auto;
		height: auto;
		clip-path: none;
		padding: 8px 12px;
		background: var(--paper);
		z-index: 3;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: 2;
	}

	.band {
		background: var(--band);
		color: var(--band-ink);
	}

	.band-inner {
		max-width: calc(var(--measure) + 2 * var(--gutter) + 28ch);
		margin: 0 auto;
		padding: 12px var(--gutter);
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		flex-wrap: wrap;
	}

	.wordmark {
		color: var(--band-ink);
		font-weight: 700;
		font-size: 1.125rem;
	}

	nav ul {
		display: flex;
		gap: 4px;
	}

	nav a {
		display: block;
		padding: 2px 10px;
		color: var(--band-ink);
	}

	nav a:hover {
		background: #cccccc;
		color: #121212;
		text-decoration: none;
	}

	nav a[aria-current='page'] {
		background: var(--band-ink);
		color: var(--band);
	}

	main {
		max-width: calc(var(--measure) + 2 * var(--gutter) + 28ch);
		margin: 0 auto;
		padding: clamp(32px, 6vw, 72px) var(--gutter) 96px;
	}

	.band-blue {
		background: var(--blue);
		color: var(--blue-ink);
	}

	.band-blue p {
		font-size: 0.875rem;
	}

	.band-blue a {
		color: var(--blue-ink);
	}
</style>
