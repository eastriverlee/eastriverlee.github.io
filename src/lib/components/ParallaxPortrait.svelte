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
	let edge: HTMLCanvasElement;
	let photo: HTMLImageElement;
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

	function copyEdgeColumn(source: CanvasImageSource, sourceHeight: number) {
		if (edge.height !== sourceHeight) edge.height = sourceHeight;
		edge.getContext('2d')?.drawImage(source, 0, 0, 1, sourceHeight, 0, 0, 1, sourceHeight);
	}

	function copyPhotoEdge() {
		copyEdgeColumn(photo, photo.naturalHeight);
	}

	function renderFrame(renderer: ViewGridRenderer, offset: Offset, element: HTMLCanvasElement) {
		renderer.render(offset);
		copyEdgeColumn(element, element.height);
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
				renderFrame(renderer, current, element);
			}
			frame = requestAnimationFrame(step);
		};
		const resizeObserver = new ResizeObserver(() => {
			renderer.resize();
			renderFrame(renderer, current, element);
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
		renderFrame(renderer, { x: 0, y: 0 }, element);
		isRendering = true;
		return runAnimation(renderer, element);
	}

	onMount(() => {
		if (photo.complete) copyPhotoEdge();
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

<canvas bind:this={edge} class="edge" width="1" height="960" aria-hidden="true"></canvas>
<figure>
	<img bind:this={photo} src={photoURL} {alt} width="720" height="960" fetchpriority="high" onload={copyPhotoEdge} />
	<canvas bind:this={canvas} class:is-rendering={isRendering} aria-hidden="true"></canvas>
	{#if needsMotionPermission}
		<button type="button" onclick={enableMotion}>tilt to look around</button>
	{/if}
</figure>

<style>
	.edge {
		position: absolute;
		top: 0;
		right: calc(100% - 1px);
		z-index: -1;
		width: 100vw;
		height: 100%;
	}

	figure {
		position: relative;
		margin: 0;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background: var(--black);
	}

	img,
	figure canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	img {
		object-fit: cover;
	}

	figure canvas {
		opacity: 0;
		transition: opacity 0.4s ease-out;
	}

	figure canvas.is-rendering {
		opacity: 1;
	}

	button {
		position: absolute;
		left: 12px;
		bottom: 12px;
		padding: 6px 10px;
		font: inherit;
		font-size: 0.8125rem;
		color: var(--white);
		background: var(--blue);
		border: 0;
		cursor: pointer;
	}
</style>
