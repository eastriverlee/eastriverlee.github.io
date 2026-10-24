import type { Offset } from '$lib/motion';

export type ViewGrid = {
	columns: number;
	rows: number;
	travelInMeters: number;
	focalLengthInImageHeights: number;
	aspectRatio: number;
	nearestDepthInMeters: number;
	farthestDepthInMeters: number;
	focusDepthInMeters: number;
};

export type ViewGridImages = {
	views: ImageBitmap[];
	depths: ImageBitmap[];
};

export type ViewGridRenderer = {
	render: (unitOffset: Offset) => void;
	resize: () => void;
	dispose: () => void;
};

const vertexSource = `#version 300 es
in vec2 position;
out vec2 textureCoordinate;
void main() {
	textureCoordinate = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
	gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentSource = `#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform sampler2DArray views;
uniform sampler2DArray depths;
uniform vec2 target;
uniform vec2 gridSize;
uniform vec2 parallaxScale;
uniform vec3 inverseDepth;
in vec2 textureCoordinate;
out vec4 color;

vec4 warpedView(vec2 cell) {
	float layer = cell.y * gridSize.x + cell.x;
	vec2 delta = target - (cell / (gridSize - 1.0) * 2.0 - 1.0);
	vec2 coordinate = textureCoordinate;
	for (int step = 0; step < 6; step++) {
		float nearness = texture(depths, vec3(coordinate, layer)).r;
		float inverse = mix(inverseDepth.y, inverseDepth.x, nearness);
		coordinate = textureCoordinate + delta * parallaxScale * (inverse - inverseDepth.z);
	}
	return texture(views, vec3(coordinate, layer));
}

void main() {
	vec2 grid = (target + 1.0) * 0.5 * (gridSize - 1.0);
	vec2 cell = min(floor(grid), gridSize - 2.0);
	vec2 fraction = grid - cell;
	vec4 top = mix(warpedView(cell), warpedView(cell + vec2(1.0, 0.0)), fraction.x);
	vec4 bottom = mix(warpedView(cell + vec2(0.0, 1.0)), warpedView(cell + vec2(1.0, 1.0)), fraction.x);
	color = mix(top, bottom, fraction.y);
}`;

const maximumPixelRatio = 2;

function compileShader(context: WebGL2RenderingContext, type: number, source: string): WebGLShader {
	const shader = context.createShader(type);
	if (!shader) throw new Error('WebGL could not allocate a shader');
	context.shaderSource(shader, source);
	context.compileShader(shader);
	if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
		throw new Error(`WebGL shader failed to compile: ${context.getShaderInfoLog(shader)}`);
	}
	return shader;
}

function linkProgram(context: WebGL2RenderingContext): WebGLProgram {
	const program = context.createProgram();
	context.attachShader(program, compileShader(context, context.VERTEX_SHADER, vertexSource));
	context.attachShader(program, compileShader(context, context.FRAGMENT_SHADER, fragmentSource));
	context.linkProgram(program);
	if (!context.getProgramParameter(program, context.LINK_STATUS)) {
		throw new Error(`WebGL program failed to link: ${context.getProgramInfoLog(program)}`);
	}
	return program;
}

function bindFullscreenTriangle(context: WebGL2RenderingContext, program: WebGLProgram): void {
	context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
	context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
	const position = context.getAttribLocation(program, 'position');
	context.enableVertexAttribArray(position);
	context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
}

async function sliceSprite(sprite: ImageBitmap, grid: ViewGrid): Promise<ImageBitmap[]> {
	const width = sprite.width / grid.columns;
	const height = sprite.height / grid.rows;
	const cells = Array.from({ length: grid.columns * grid.rows }, (_, layer) => ({
		x: (layer % grid.columns) * width,
		y: Math.floor(layer / grid.columns) * height
	}));
	return Promise.all(cells.map((cell) => createImageBitmap(sprite, cell.x, cell.y, width, height)));
}

function uploadLayers(
	context: WebGL2RenderingContext,
	unit: number,
	layers: ImageBitmap[],
	internalFormat: number,
	format: number
): void {
	const { width, height } = layers[0];
	context.activeTexture(context.TEXTURE0 + unit);
	context.bindTexture(context.TEXTURE_2D_ARRAY, context.createTexture());
	context.texStorage3D(context.TEXTURE_2D_ARRAY, 1, internalFormat, width, height, layers.length);
	context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_MIN_FILTER, context.LINEAR);
	context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_MAG_FILTER, context.LINEAR);
	context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
	context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
	layers.forEach((layer, index) => {
		context.texSubImage3D(context.TEXTURE_2D_ARRAY, 0, 0, 0, index, width, height, 1, format, context.UNSIGNED_BYTE, layer);
		layer.close();
	});
}

function setGridUniforms(context: WebGL2RenderingContext, program: WebGLProgram, grid: ViewGrid): void {
	const uniform = (name: string) => context.getUniformLocation(program, name);
	const parallaxPerInverseMeter = grid.travelInMeters * grid.focalLengthInImageHeights;
	context.uniform1i(uniform('views'), 0);
	context.uniform1i(uniform('depths'), 1);
	context.uniform2f(uniform('gridSize'), grid.columns, grid.rows);
	context.uniform2f(uniform('parallaxScale'), parallaxPerInverseMeter / grid.aspectRatio, parallaxPerInverseMeter);
	context.uniform3f(
		uniform('inverseDepth'),
		1 / grid.nearestDepthInMeters,
		1 / grid.farthestDepthInMeters,
		1 / grid.focusDepthInMeters
	);
}

export function createViewGridRenderer(
	canvas: HTMLCanvasElement,
	images: ViewGridImages,
	grid: ViewGrid
): ViewGridRenderer | undefined {
	const context = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
	if (!context) return undefined;

	const program = linkProgram(context);
	context.useProgram(program);
	bindFullscreenTriangle(context, program);
	uploadLayers(context, 0, images.views, context.RGBA8, context.RGBA);
	uploadLayers(context, 1, images.depths, context.R8, context.RED);
	setGridUniforms(context, program, grid);
	const targetLocation = context.getUniformLocation(program, 'target');

	const render = (unitOffset: Offset) => {
		context.uniform2f(targetLocation, unitOffset.x, unitOffset.y);
		context.drawArrays(context.TRIANGLES, 0, 3);
	};

	const resize = () => {
		const pixelRatio = Math.min(window.devicePixelRatio, maximumPixelRatio);
		canvas.width = Math.round(canvas.clientWidth * pixelRatio);
		canvas.height = Math.round(canvas.clientHeight * pixelRatio);
		context.viewport(0, 0, canvas.width, canvas.height);
	};

	const dispose = () => {
		context.getExtension('WEBGL_lose_context')?.loseContext();
	};

	resize();
	return { render, resize, dispose };
}

export async function loadSpriteLayers(url: string, grid: ViewGrid): Promise<ImageBitmap[]> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Loading ${url} failed with HTTP ${response.status}`);
	const sprite = await createImageBitmap(await response.blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
	const layers = await sliceSprite(sprite, grid);
	sprite.close();
	return layers;
}
