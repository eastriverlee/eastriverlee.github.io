export type Offset = { x: number; y: number };

const tiltRangeInDegrees = 20;

function clampUnit(value: number): number {
	return Math.max(-1, Math.min(1, value));
}

export function pointerToUnitOffset(event: PointerEvent): Offset {
	return {
		x: (event.clientX / window.innerWidth) * 2 - 1,
		y: (event.clientY / window.innerHeight) * 2 - 1
	};
}

export function tiltToUnitOffset(event: DeviceOrientationEvent, baseline: DeviceOrientationEvent): Offset {
	return {
		x: -clampUnit(((event.gamma ?? 0) - (baseline.gamma ?? 0)) / tiltRangeInDegrees),
		y: -clampUnit(((event.beta ?? 0) - (baseline.beta ?? 0)) / tiltRangeInDegrees)
	};
}

type PermissionRequestingOrientationEvent = typeof DeviceOrientationEvent & {
	requestPermission: () => Promise<'granted' | 'denied'>;
};

export function requiresOrientationPermission(
	eventType: typeof DeviceOrientationEvent
): eventType is PermissionRequestingOrientationEvent {
	return 'requestPermission' in eventType && typeof eventType.requestPermission === 'function';
}
