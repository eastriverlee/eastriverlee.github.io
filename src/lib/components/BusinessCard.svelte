<script lang="ts">
	type Props = {
		frontURL: string;
		backURL: string;
		label: string;
	};

	type Drag = { startX: number; startTurn: number };
	type Pose = { tiltX: number; tiltY: number; turn: number };

	let { frontURL, backURL, label }: Props = $props();

	const maximumTiltInDegrees = 14;
	const easingPerFrame = 0.16;
	const settledDegrees = 0.01;
	const edgeSlices = [1, 2, 3, 4, 5];

	let card: HTMLDivElement;
	let drag: Drag | null = null;
	let target: Pose = { tiltX: 0, tiltY: 0, turn: 0 };
	let pose: Pose = $state({ tiltX: 0, tiltY: 0, turn: 0 });
	let animationFrame = 0;

	function moveToward(next: Partial<Pose>) {
		target = { ...target, ...next };
		if (!animationFrame) animationFrame = requestAnimationFrame(stepPose);
	}

	function stepPose() {
		const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const easing = isReduced ? 1 : easingPerFrame;
		pose = {
			tiltX: pose.tiltX + (target.tiltX - pose.tiltX) * easing,
			tiltY: pose.tiltY + (target.tiltY - pose.tiltY) * easing,
			turn: pose.turn + (target.turn - pose.turn) * easing
		};
		animationFrame = hasSettled() ? 0 : requestAnimationFrame(stepPose);
	}

	function hasSettled() {
		return (
			Math.abs(target.tiltX - pose.tiltX) < settledDegrees &&
			Math.abs(target.tiltY - pose.tiltY) < settledDegrees &&
			Math.abs(target.turn - pose.turn) < settledDegrees
		);
	}

	function startDrag(event: PointerEvent) {
		drag = { startX: event.clientX, startTurn: target.turn };
		card.setPointerCapture(event.pointerId);
	}

	function handlePointerMove(event: PointerEvent) {
		if (drag) {
			turnWithDrag(event, drag);
			return;
		}
		tiltTowardPointer(event);
	}

	function turnWithDrag(event: PointerEvent, activeDrag: Drag) {
		const width = card.getBoundingClientRect().width;
		moveToward({ turn: activeDrag.startTurn + ((event.clientX - activeDrag.startX) / width) * 180 });
	}

	function tiltTowardPointer(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const bounds = card.getBoundingClientRect();
		const horizontal = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
		const vertical = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
		moveToward({ tiltX: -vertical * maximumTiltInDegrees, tiltY: horizontal * maximumTiltInDegrees });
	}

	function endDrag() {
		if (!drag) return;
		moveToward({ turn: Math.round(target.turn / 180) * 180 });
		drag = null;
	}

	function resetTilt() {
		moveToward({ tiltX: 0, tiltY: 0 });
	}
</script>

<div
	bind:this={card}
	class="card"
	role="img"
	aria-label={label}
	onpointerdown={startDrag}
	onpointermove={handlePointerMove}
	onpointerup={endDrag}
	onpointercancel={endDrag}
	onpointerleave={resetTilt}
	style:--tilt-x="{pose.tiltX}deg"
	style:--turn="{pose.tiltY + pose.turn}deg"
>
	<span class="body">
		<span class="face front" style:background-image="url({frontURL})"></span>
		{#each edgeSlices as slice (slice)}
			<span class="slice" class:is-middle={slice === 3} style:--slice={slice}></span>
		{/each}
		<span class="face back" style:background-image="url({backURL})"></span>
	</span>
</div>

<style>
	.card {
		--thickness: 3px;
		--radius: 4.5% / 6.86%;
		display: block;
		width: 100%;
		aspect-ratio: 1046 / 686;
		perspective: 900px;
		cursor: grab;
		touch-action: pan-y;
		user-select: none;
	}

	.card:active {
		cursor: grabbing;
	}

	.body {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transform: rotateX(var(--tilt-x)) rotateY(var(--turn));
	}

	.face,
	.slice {
		position: absolute;
		inset: 0;
		border-radius: var(--radius);
	}

	.face {
		background: center / 100% 100% no-repeat;
		backface-visibility: hidden;
	}

	.front {
		background-color: #ffffff;
		transform: translateZ(calc(var(--thickness) / 2));
	}

	.back {
		background-color: #1a6bbd;
		transform: rotateY(180deg) translateZ(calc(var(--thickness) / 2));
	}

	.slice {
		background: #8db5de;
		transform: translateZ(calc(var(--thickness) / 2 - var(--slice) * var(--thickness) / 6));
	}

	.slice.is-middle {
		box-shadow: 0 10px 24px rgb(0 0 0 / 0.18);
	}
</style>
