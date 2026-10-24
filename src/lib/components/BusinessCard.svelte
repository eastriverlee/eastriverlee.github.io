<script lang="ts">
	type Props = {
		frontURL: string;
		backURL: string;
		label: string;
	};

	type Drag = { startX: number; startTurn: number };

	let { frontURL, backURL, label }: Props = $props();

	const maximumTiltInDegrees = 14;
	const edgeSlices = [1, 2, 3, 4, 5];

	let card: HTMLDivElement;
	let turn = $state(0);
	let drag: Drag | null = $state(null);
	let tilt = $state({ x: 0, y: 0 });

	function startDrag(event: PointerEvent) {
		drag = { startX: event.clientX, startTurn: turn };
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
		turn = activeDrag.startTurn + ((event.clientX - activeDrag.startX) / width) * 180;
	}

	function tiltTowardPointer(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const bounds = card.getBoundingClientRect();
		const horizontal = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
		const vertical = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
		tilt = { x: -vertical * maximumTiltInDegrees, y: horizontal * maximumTiltInDegrees };
	}

	function endDrag() {
		if (!drag) return;
		turn = Math.round(turn / 180) * 180;
		drag = null;
	}

	function resetTilt() {
		tilt = { x: 0, y: 0 };
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
	style:--tilt-x="{tilt.x}deg"
	style:--turn="{tilt.y + turn}deg"
	style:--sheen="{50 - tilt.y * 4}%"
>
	<span class="body" class:is-dragging={drag !== null}>
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
		transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.body.is-dragging {
		transition: none;
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
		overflow: hidden;
	}

	.face::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			115deg,
			transparent 30%,
			rgb(255 255 255 / 0.28) 48%,
			transparent 62%
		);
		background-size: 250% 100%;
		background-position: var(--sheen) 0;
		mix-blend-mode: soft-light;
		pointer-events: none;
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
		background: #dcdfe4;
		transform: translateZ(calc(var(--thickness) / 2 - var(--slice) * var(--thickness) / 6));
	}

	.slice.is-middle {
		box-shadow: 0 10px 24px rgb(0 0 0 / 0.18);
	}

	@media (prefers-reduced-motion: reduce) {
		.body {
			transition: none;
		}
	}
</style>
