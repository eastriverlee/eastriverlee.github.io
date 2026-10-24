import semteulcheSpecimen from '$lib/content/specimens/semteulche.svg?raw';
import hesalcheSpecimen from '$lib/content/specimens/hesalche.svg?raw';

export type WorkKind = 'language' | 'app' | 'tool' | 'library' | 'font' | 'film';

export type Work = {
	name: string;
	kind: WorkKind;
	since?: number;
	summary?: string;
	url?: string;
	isCurrent?: boolean;
	specimenSVG?: string;
	youtubeID?: string;
};

export type Link = {
	label: string;
	url: string;
};

export type Favorite = {
	category: string;
	items: string[];
};

export const siteTitle = '동녘 강의 오늘';
export const siteDescription = "eastriver's space: code, type, art and writing by 이동하.";

export const kindLabels: Record<WorkKind, string> = {
	language: 'languages',
	app: 'apps',
	tool: 'tools',
	library: 'libraries',
	font: 'type',
	film: 'film'
};

export const works: Work[] = [
	{
		name: 'cweed',
		kind: 'language',
		since: 2022,
		summary: "a programming language i'm making.",
		isCurrent: true
	},
	{
		name: 'omnlet',
		kind: 'app',
		since: 2026,
		summary: 'practice words and generated sentences in many languages, with spaced review and offline voices.',
		url: '/omnlet/support/index.html',
		isCurrent: true
	},
	{
		name: 'monkeys',
		kind: 'tool',
		since: 2026,
		summary: 'replaces .env with a keys-only file. secrets stay in the os vault.',
		url: 'https://monk3ys.dev',
		isCurrent: true
	},
	{
		name: 'gitto',
		kind: 'tool',
		since: 2026,
		summary: 'a second checkout, whatever it weighs: submodules, dependencies and build output included.',
		url: 'https://gitto.13e7.co'
	},
	{
		name: 'hocus',
		kind: 'tool',
		since: 2021,
		summary: 'a keyboard-centric window manager and focus changer.',
		url: 'https://eastriverlee.itch.io/hocus'
	},
	{
		name: 'LLM.swift',
		kind: 'library',
		since: 2023,
		summary: 'run large language models locally on apple platforms.',
		url: 'https://github.com/eastriverlee/LLM.swift'
	},
	{
		name: 'julia.swift',
		kind: 'library',
		since: 2026,
		summary: 'fast, free, offline julia-1 decisions on cpu.',
		url: 'https://github.com/eastriverlee/julia.swift'
	},
	{
		name: 'geulzza',
		kind: 'library',
		since: 2021,
		summary: 'decomposes korean strings into jamo.',
		url: 'https://github.com/eastriverlee/geulzza'
	},
	{
		name: '셈틀체 semteulche',
		kind: 'font',
		summary: 'a monospaced sans-serif hangul typeface, a spiritual offspring of jetbrains mono.',
		url: 'https://eastriverlee.itch.io/semteulche',
		specimenSVG: semteulcheSpecimen
	},
	{
		name: '헤살체 hesalche',
		kind: 'font',
		summary: 'a monospaced serif hangul typeface. 헤살 is an old korean word for meddling, close to hacking.',
		url: 'https://eastriverlee.itch.io/hesalche',
		specimenSVG: hesalcheSpecimen
	},
	{
		name: 'the weight of goldilocks',
		kind: 'film',
		summary: '(an rgb display of)(a video of)the weight of goldilocks.',
		youtubeID: 'deP_KRzFTsY'
	},
	{
		name: '동산에 올라',
		kind: 'film',
		youtubeID: 'cqutxaAJRtE'
	}
];

export const links: Link[] = [
	{ label: 'github', url: 'https://github.com/eastriverlee' },
	{ label: 'linkedin', url: 'https://www.linkedin.com/in/eastriver' },
	{ label: 'twitter', url: 'https://twitter.com/3astriver' },
	{ label: 'itch.io', url: 'https://eastriverlee.itch.io' }
];

export const favorites: Favorite[] = [
	{
		category: 'games',
		items: ['exapunks', 'grim fandango', 'the curse of monkey island', 'thimbleweed park', 'ftl', 'sonic adventure', 'i love katamari']
	},
	{
		category: 'music',
		items: ['the beatles', 'sunny day service', 'goonamgwayeoridingstella', 'sunset rollercoaster', 'amy winehouse', 'bitgwasoeum', 'wedance']
	},
	{
		category: 'writers',
		items: ['solmoe park', 'romain gary', 'j. d. salinger', 'david van']
	},
	{
		category: 'movies',
		items: ['pulp fiction', 'face/off', 'whiplash', 'burning', 'parasite', 'garden state']
	},
	{
		category: 'animation',
		items: ['futurama', "bob's burgers", 'the simpsons', 'rick and morty', 'star trek: lower decks', 'arcane', 'evangelion']
	},
	{
		category: 'shows',
		items: ['mr. robot', 'friends', 'the office', 'my mister']
	},
	{
		category: 'sites',
		items: ['khan academy', 'coursera', 'stack overflow', 'kyobobooks']
	},
	{
		category: 'languages',
		items: ['swift', 'c', 'go', 'cweed']
	},
	{
		category: 'brands',
		items: ['apple', 'lego', 'zsa', 'mozilla', "o'reilly", 'no starch press']
	}
];

export const despised = ['conservatives', 'windows®', 'bloat', 'bothsidesism', 'yellow journalism'];

export const dreams = [
	'the extinction of wars',
	'people reading',
	'the conquest of death',
	'water desalination',
	'universal basic income',
	'better media'
];

export const playlistEmbedURL = 'https://embed.music.apple.com/us/playlist/timeless/pl.u-b6jBsdbKd5p';
