<script lang="ts">
	import { onMount } from 'svelte';
	import { pointerToUnitOffset, requiresOrientationPermission, tiltToUnitOffset, type Offset } from '$lib/motion';
	import type { SplatCamera, SplatScene } from '$lib/splatScene';

	type Props = {
		photoURL: string;
		splatURL: string;
		camera: SplatCamera;
		alt: string;
	};

	let { photoURL, splatURL, camera, alt }: Props = $props();

	const easing = 0.08;
	const settleFrames = 30;

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

	function runAnimation(scene: SplatScene, element: HTMLCanvasElement): () => void {
		let current: Offset = { x: 0, y: 0 };
		let framesSinceChange = 0;
		let frame = 0;
		const step = () => {
			const next = {
				x: current.x + (target.x - current.x) * easing,
				y: current.y + (target.y - current.y) * easing
			};
			const hasMoved = Math.abs(next.x - current.x) + Math.abs(next.y - current.y) > 1e-4;
			framesSinceChange = hasMoved ? 0 : framesSinceChange + 1;
			current = next;
			if (framesSinceChange < settleFrames) scene.render(current);
			frame = requestAnimationFrame(step);
		};
		const resizeObserver = new ResizeObserver(() => {
			scene.resize();
			framesSinceChange = 0;
		});
		resizeObserver.observe(element);
		frame = requestAnimationFrame(step);
		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			scene.dispose();
		};
	}

	async function startRendering(isActive: () => boolean): Promise<() => void> {
		const element = canvas;
		const { createSplatScene } = await import('$lib/splatScene');
		const scene = await createSplatScene(element, splatURL, camera);
		if (!isActive()) {
			scene.dispose();
			return () => {};
		}
		isRendering = true;
		return runAnimation(scene, element);
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

<figure style:--zoom={camera.edgeZoom}>
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
