<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createSpatialRenderer,
		loadImage,
		pointerToUnitOffset,
		requiresOrientationPermission,
		tiltToUnitOffset,
		zoom,
		type Offset,
		type SpatialRenderer
	} from '$lib/spatial';

	type Props = {
		photoURL: string;
		backgroundURL: string;
		layersURL: string;
		focusDepth: number;
		alt: string;
	};

	let { photoURL, backgroundURL, layersURL, focusDepth, alt }: Props = $props();

	const maximumOffset = 0.05;
	const easing = 0.08;

	let canvas: HTMLCanvasElement;
	let isRendering = $state(false);
	let needsMotionPermission = $state(false);
	let target: Offset = { x: 0, y: 0 };
	let orientationBaseline: DeviceOrientationEvent | undefined;

	function aimAt(unitOffset: Offset) {
		target = { x: unitOffset.x * maximumOffset, y: unitOffset.y * maximumOffset };
	}

	function handlePointerMove(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		aimAt(pointerToUnitOffset(event));
	}

	function handleOrientation(event: DeviceOrientationEvent) {
		if (event.gamma === null || event.beta === null) return;
		orientationBaseline ??= event;
		aimAt(tiltToUnitOffset(event, orientationBaseline));
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

	function runAnimation(renderer: SpatialRenderer): () => void {
		let current: Offset = { x: 0, y: 0 };
		let frame = 0;
		const step = () => {
			const next = {
				x: current.x + (target.x - current.x) * easing,
				y: current.y + (target.y - current.y) * easing
			};
			if (Math.abs(next.x - current.x) + Math.abs(next.y - current.y) > 1e-5) {
				current = next;
				renderer.render(current);
			}
			frame = requestAnimationFrame(step);
		};
		const resizeObserver = new ResizeObserver(() => {
			renderer.resize();
			renderer.render(current);
		});
		renderer.render(current);
		resizeObserver.observe(canvas);
		frame = requestAnimationFrame(step);
		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			renderer.dispose();
		};
	}

	async function startRendering(): Promise<(() => void) | undefined> {
		const [photo, background, layers] = await Promise.all([photoURL, backgroundURL, layersURL].map(loadImage));
		const renderer = createSpatialRenderer(canvas, { photo, background, layers }, focusDepth);
		if (!renderer) return undefined;
		isRendering = true;
		return runAnimation(renderer);
	}

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const stopRendering = startRendering();
		window.addEventListener('pointermove', handlePointerMove);
		startOrientation();
		return () => {
			stopRendering.then((stop) => stop?.());
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	});
</script>

<figure style:--zoom={zoom}>
	<img src={photoURL} {alt} width="1200" height="1600" fetchpriority="high" />
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
		transform: scale(var(--zoom));
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
