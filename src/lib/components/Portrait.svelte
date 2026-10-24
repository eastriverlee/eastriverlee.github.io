<script lang="ts">
	import portrait from '$lib/content/portrait.txt?raw';
</script>

<figure>
	<pre aria-hidden="true">{portrait}</pre>
	<figcaption class="visually-hidden">an ascii portrait of eastriver</figcaption>
</figure>

<style>
	figure {
		margin: 0;
		container-type: inline-size;
		background: #000000;
		color: #ffffff;
		padding: 6%;
	}

	pre {
		margin: 0;
		font-family: inherit;
		font-size: calc(100cqw / 80 / 0.6);
		line-height: 1.15;
		overflow: hidden;
		user-select: none;
	}
</style>
