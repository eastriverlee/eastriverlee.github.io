import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';
import type { Offset } from '$lib/motion';

export type SplatCamera = {
	verticalFieldOfViewInDegrees: number;
	focusDistanceInMeters: number;
	maximumTravelInMeters: number;
	edgeZoom: number;
};

export type SplatScene = {
	render: (unitOffset: Offset) => void;
	resize: () => void;
	dispose: () => void;
};

const maximumPixelRatio = 2;

function displayFieldOfView(camera: SplatCamera): number {
	const halfHeight = Math.tan((camera.verticalFieldOfViewInDegrees * Math.PI) / 360) / camera.edgeZoom;
	return (Math.atan(halfHeight) * 360) / Math.PI;
}

function focalLengthInPixels(camera: PerspectiveCamera, heightInPixels: number): number {
	return heightInPixels / 2 / Math.tan((camera.fov * Math.PI) / 360);
}

export async function createSplatScene(canvas: HTMLCanvasElement, url: string, settings: SplatCamera): Promise<SplatScene> {
	const renderer = new WebGLRenderer({ canvas, antialias: false });
	const scene = new Scene();
	const camera = new PerspectiveCamera(displayFieldOfView(settings), 3 / 4, 0.05, 50);
	const splat = new SplatMesh({ url });
	splat.quaternion.set(1, 0, 0, 0);
	scene.add(new SparkRenderer({ renderer }), splat);
	await splat.initialized;

	let current: Offset = { x: 0, y: 0 };

	const render = (unitOffset: Offset) => {
		current = unitOffset;
		const width = canvas.width;
		const height = canvas.height;
		const travelX = unitOffset.x * settings.maximumTravelInMeters;
		const travelY = -unitOffset.y * settings.maximumTravelInMeters;
		const shift = focalLengthInPixels(camera, height) / settings.focusDistanceInMeters;
		camera.position.set(travelX, travelY, 0);
		camera.setViewOffset(width, height, -travelX * shift, travelY * shift, width, height);
		renderer.render(scene, camera);
	};

	const resize = () => {
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, maximumPixelRatio));
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
		render(current);
	};

	const dispose = () => {
		splat.dispose();
		renderer.dispose();
	};

	resize();
	return { render, resize, dispose };
}
