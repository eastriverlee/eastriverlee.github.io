export type Offset = { x: number; y: number };

export type SpatialRenderer = {
	render: (offset: Offset) => void;
	resize: () => void;
	dispose: () => void;
};

const vertexSource = `
attribute vec2 position;
varying vec2 textureCoordinate;
void main() {
	textureCoordinate = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
	gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D photo;
uniform sampler2D depth;
uniform vec2 offset;
uniform float focusDepth;
uniform float zoom;
varying vec2 textureCoordinate;
void main() {
	vec2 base = (textureCoordinate - 0.5) / zoom + 0.5;
	vec2 coordinate = base;
	for (int step = 0; step < 8; step++) {
		float nearness = texture2D(depth, coordinate).r;
		coordinate = base + offset * (nearness - focusDepth);
	}
	gl_FragColor = texture2D(photo, coordinate);
}`;

export const zoom = 1.08;
const maximumPixelRatio = 2;

function compileShader(context: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader = context.createShader(type);
	if (!shader) throw new Error('WebGL could not allocate a shader');
	context.shaderSource(shader, source);
	context.compileShader(shader);
	if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
		throw new Error(`WebGL shader failed to compile: ${context.getShaderInfoLog(shader)}`);
	}
	return shader;
}

function linkProgram(context: WebGLRenderingContext): WebGLProgram {
	const program = context.createProgram();
	if (!program) throw new Error('WebGL could not allocate a program');
	context.attachShader(program, compileShader(context, context.VERTEX_SHADER, vertexSource));
	context.attachShader(program, compileShader(context, context.FRAGMENT_SHADER, fragmentSource));
	context.linkProgram(program);
	if (!context.getProgramParameter(program, context.LINK_STATUS)) {
		throw new Error(`WebGL program failed to link: ${context.getProgramInfoLog(program)}`);
	}
	return program;
}

function uploadTexture(context: WebGLRenderingContext, unit: number, image: HTMLImageElement): void {
	context.activeTexture(context.TEXTURE0 + unit);
	context.bindTexture(context.TEXTURE_2D, context.createTexture());
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
	context.texImage2D(context.TEXTURE_2D, 0, context.RGB, context.RGB, context.UNSIGNED_BYTE, image);
}

function bindFullscreenTriangle(context: WebGLRenderingContext, program: WebGLProgram): void {
	context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
	context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
	const position = context.getAttribLocation(program, 'position');
	context.enableVertexAttribArray(position);
	context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
}

export function createSpatialRenderer(
	canvas: HTMLCanvasElement,
	photo: HTMLImageElement,
	depth: HTMLImageElement,
	focusDepth: number
): SpatialRenderer | undefined {
	const context = canvas.getContext('webgl', { antialias: false });
	if (!context) return undefined;

	const program = linkProgram(context);
	context.useProgram(program);
	bindFullscreenTriangle(context, program);
	uploadTexture(context, 0, photo);
	uploadTexture(context, 1, depth);
	context.uniform1i(context.getUniformLocation(program, 'photo'), 0);
	context.uniform1i(context.getUniformLocation(program, 'depth'), 1);
	context.uniform1f(context.getUniformLocation(program, 'focusDepth'), focusDepth);
	context.uniform1f(context.getUniformLocation(program, 'zoom'), zoom);
	const offsetLocation = context.getUniformLocation(program, 'offset');

	const resize = () => {
		const pixelRatio = Math.min(window.devicePixelRatio, maximumPixelRatio);
		canvas.width = Math.round(canvas.clientWidth * pixelRatio);
		canvas.height = Math.round(canvas.clientHeight * pixelRatio);
		context.viewport(0, 0, canvas.width, canvas.height);
	};

	const render = (offset: Offset) => {
		context.uniform2f(offsetLocation, offset.x, offset.y);
		context.drawArrays(context.TRIANGLES, 0, 3);
	};

	const dispose = () => {
		context.getExtension('WEBGL_lose_context')?.loseContext();
	};

	resize();
	return { render, resize, dispose };
}

export async function loadImage(url: string): Promise<HTMLImageElement> {
	const image = new Image();
	image.src = url;
	await image.decode();
	return image;
}

function clampUnit(value: number): number {
	return Math.max(-1, Math.min(1, value));
}

export function pointerToUnitOffset(event: PointerEvent): Offset {
	return {
		x: (event.clientX / window.innerWidth) * 2 - 1,
		y: (event.clientY / window.innerHeight) * 2 - 1
	};
}

const tiltRangeInDegrees = 20;

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
