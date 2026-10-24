<script lang="ts">
	import { onMount } from 'svelte';
	import { pointerToUnitOffset, requiresOrientationPermission, tiltToUnitOffset, type Offset } from '$lib/motion';
	import { createViewGridRenderer, loadSpriteLayers, type ViewGrid, type ViewGridRenderer } from '$lib/viewGrid';

	type Props = {
		photoURL: string;
		viewsURL: string;
		depthsURL: string;
		grid: ViewGrid;
		alt: string;
	};

	let { photoURL, viewsURL, depthsURL, grid, alt }: Props = $props();

	const easing = 0.08;

	let canvas: HTMLCanvasElement;
	let isRendering = $state(false);
	let needsMotionPermission = $state(false);
	let target: Offset = { x: 0, y: 0 };
	let orientationBaseline: DeviceOrientationEvent | undefined;

	function handlePointerMove(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		target = pointerToUnitOffset(event);
	}

	function handleOrientation(event: DeviceOrientationEvent) {
		if (event.gamma === null || event.beta === null) return;
		orientationBaseline ??= event;
		target = tiltToUnitOffset(event, orientationBaseline);
	}

	function listenToOrientation() {
		window.addEventListener('deviceorientation', handleOrientation);
	}

	async function enableMotion() {
		if (!requiresOrientationPermission(DeviceOrientationEvent)) return;
		needsMotionPermission = false;
		if ((await DeviceOrientationEvent.requestPermission()) === 'granted') listenToOrientation();
	}

	function startOrientation() {
		if (!('DeviceOrientationEvent' in window)) return;
		if (!window.matchMedia('(pointer: coarse)').matches) return;
		if (requiresOrientationPermission(DeviceOrientationEvent)) {
			needsMotionPermission = true;
			return;
		}
		listenToOrientation();
	}

	function runAnimation(renderer: ViewGridRenderer, element: HTMLCanvasElement): () => void {
		let current: Offset = { x: 0, y: 0 };
		let frame = 0;
		const step = () => {
			const next = {
				x: current.x + (target.x - current.x) * easing,
				y: current.y + (target.y - current.y) * easing
			};
			if (Math.abs(next.x - current.x) + Math.abs(next.y - current.y) > 1e-4) {
				current = next;
				renderer.render(current);
			}
			frame = requestAnimationFrame(step);
		};
		const resizeObserver = new ResizeObserver(() => {
			renderer.resize();
			renderer.render(current);
		});
		resizeObserver.observe(element);
		frame = requestAnimationFrame(step);
		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			renderer.dispose();
		};
	}

	async function startRendering(isActive: () => boolean): Promise<() => void> {
		const element = canvas;
		const [views, depths] = await Promise.all([loadSpriteLayers(viewsURL, grid), loadSpriteLayers(depthsURL, grid)]);
		const renderer = createViewGridRenderer(element, { views, depths }, grid);
		if (!renderer) return () => {};
		if (!isActive()) {
			renderer.dispose();
			return () => {};
		}
		renderer.render({ x: 0, y: 0 });
		isRendering = true;
		return runAnimation(renderer, element);
	}

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let isMounted = true;
		const stopRendering = startRendering(() => isMounted);
		window.addEventListener('pointermove', handlePointerMove);
		startOrientation();
		return () => {
			isMounted = false;
			stopRendering.then((stop) => stop());
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	});
</script>

<figure>
	<img src={photoURL} {alt} width="720" height="960" fetchpriority="high" />
	<canvas bind:this={canvas} class:is-rendering={isRendering} aria-hidden="true"></canvas>
	{#if needsMotionPermission}
		<button type="button" onclick={enableMotion}>tilt to look around</button>
	{/if}
</figure>

<style>
	figure {
		position: relative;
		margin: 0;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background: #000000;
	}

	img,
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	img {
		object-fit: cover;
	}

	canvas {
		opacity: 0;
		transition: opacity 0.4s ease-out;
	}

	canvas.is-rendering {
		opacity: 1;
	}

	button {
		position: absolute;
		left: 12px;
		bottom: 12px;
		padding: 6px 10px;
		font: inherit;
		font-size: 0.8125rem;
		color: #ffffff;
		background: var(--blue);
		border: 0;
		cursor: pointer;
	}
</style>
