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
	medium?: string;
	durationInSeconds?: number;
};

export type Link = {
	label: string;
	url: string;
};

export type FavoriteItem = {
	name: string;
	url?: string;
};

export type Favorite = {
	category: string;
	items: FavoriteItem[];
};

export type Sticker = {
	name: string;
	url: string;
	imageURL: string;
	width: number;
	height: number;
	isDieCut?: boolean;
};

function buildWikipediaURL(title: string, language = 'en'): string {
	return `https://${language}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
}

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
		name: 'promi$er',
		kind: 'app',
		since: 2024,
		summary: 'a todo list with fines. miss a deadline and you pay what you promised.',
		url: 'https://apps.apple.com/app/promi%24er/id6740737772'
	},
	{
		name: 'todoom',
		kind: 'app',
		since: 2022,
		summary: 'a todo list where finished tasks turn into bombs and blow up. shake to undo.'
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
		name: '(an rgb display of)(a video of)the weight of goldilocks',
		kind: 'film',
		since: 2018,
		medium: 'single-channel video',
		durationInSeconds: 522,
		youtubeID: 'deP_KRzFTsY'
	},
	{
		name: '(an rgb display of)(a video of)동산에 올라',
		kind: 'film',
		since: 2020,
		medium: 'single-channel video',
		durationInSeconds: 951,
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
		items: [
			{ name: 'exapunks', url: buildWikipediaURL('Exapunks') },
			{ name: 'grim fandango', url: buildWikipediaURL('Grim Fandango') },
			{ name: 'the curse of monkey island', url: buildWikipediaURL('The Curse of Monkey Island') },
			{ name: 'thimbleweed park', url: buildWikipediaURL('Thimbleweed Park') },
			{ name: 'ftl', url: buildWikipediaURL('FTL: Faster Than Light') },
			{ name: 'sonic adventure', url: buildWikipediaURL('Sonic Adventure') },
			{ name: 'i love katamari', url: buildWikipediaURL('I Love Katamari') }
		]
	},
	{
		category: 'music',
		items: [
			{ name: 'the beatles', url: buildWikipediaURL('The Beatles') },
			{ name: 'goonamgwayeoridingstella', url: buildWikipediaURL('구남과여라이딩스텔라', 'ko') },
			{ name: 'amy winehouse', url: buildWikipediaURL('Amy Winehouse') },
			{ name: 'bitgwasoeum' },
			{ name: 'wedance' },
			{ name: 'the symposium', url: buildWikipediaURL('The Symposium (band)') },
			{ name: 'mitsume', url: buildWikipediaURL('ミツメ', 'ja') },
			{ name: 'remi wolf', url: buildWikipediaURL('Remi Wolf') }
		]
	},
	{
		category: 'writers',
		items: [
			{ name: 'solmoe park', url: buildWikipediaURL('박솔뫼', 'ko') },
			{ name: 'romain gary', url: buildWikipediaURL('Romain Gary') },
			{ name: 'j. d. salinger', url: buildWikipediaURL('J. D. Salinger') },
			{ name: 'david vann', url: buildWikipediaURL('David Vann (writer)') }
		]
	},
	{
		category: 'movies',
		items: [
			{ name: 'pulp fiction', url: buildWikipediaURL('Pulp Fiction') },
			{ name: 'face/off', url: buildWikipediaURL('Face/Off') },
			{ name: 'whiplash', url: buildWikipediaURL('Whiplash (2014 film)') },
			{ name: 'burning', url: buildWikipediaURL('Burning (2018 film)') },
			{ name: 'parasite', url: buildWikipediaURL('Parasite (2019 film)') },
			{ name: 'garden state', url: buildWikipediaURL('Garden State (film)') },
			{ name: 'matchstick men', url: buildWikipediaURL('Matchstick Men') }
		]
	},
	{
		category: 'animation',
		items: [
			{ name: 'futurama', url: buildWikipediaURL('Futurama') },
			{ name: "bob's burgers", url: buildWikipediaURL("Bob's Burgers") },
			{ name: 'the simpsons', url: buildWikipediaURL('The Simpsons') },
			{ name: 'rick and morty', url: buildWikipediaURL('Rick and Morty') },
			{ name: 'star trek: lower decks', url: buildWikipediaURL('Star Trek: Lower Decks') },
			{ name: 'arcane', url: buildWikipediaURL('Arcane (TV series)') },
			{ name: 'evangelion', url: buildWikipediaURL('Neon Genesis Evangelion') }
		]
	},
	{
		category: 'shows',
		items: [
			{ name: 'mr. robot', url: buildWikipediaURL('Mr. Robot') },
			{ name: 'friends', url: buildWikipediaURL('Friends') },
			{ name: 'the office', url: buildWikipediaURL('The Office (American TV series)') },
			{ name: 'my mister', url: buildWikipediaURL('My Mister') }
		]
	},
	{
		category: 'sites',
		items: [
			{ name: 'khan academy', url: buildWikipediaURL('Khan Academy') },
			{ name: 'coursera', url: buildWikipediaURL('Coursera') },
			{ name: 'stack overflow', url: buildWikipediaURL('Stack Overflow') },
			{ name: 'kyobobooks', url: buildWikipediaURL('Kyobo Book Centre') }
		]
	},
	{
		category: 'languages',
		items: [
			{ name: 'swift', url: buildWikipediaURL('Swift (programming language)') },
			{ name: 'c', url: buildWikipediaURL('C (programming language)') },
			{ name: 'go', url: buildWikipediaURL('Go (programming language)') },
			{ name: 'cweed' }
		]
	},
	{
		category: 'brands',
		items: [
			{ name: 'apple', url: buildWikipediaURL('Apple Inc.') },
			{ name: 'lego', url: buildWikipediaURL('Lego') },
			{ name: 'zsa' },
			{ name: 'mozilla', url: buildWikipediaURL('Mozilla') },
			{ name: "o'reilly", url: buildWikipediaURL("O'Reilly Media") },
			{ name: 'no starch press', url: buildWikipediaURL('No Starch Press') }
		]
	}
];

export const stickers: Sticker[] = [
	{ name: 'grim fandango', url: buildWikipediaURL('Grim Fandango'), imageURL: '/images/stickers/grim-fandango.webp', width: 270, height: 360 },
	{ name: 'futurama', url: buildWikipediaURL('Futurama'), imageURL: '/images/stickers/futurama.webp', width: 436, height: 153, isDieCut: true },
	{ name: 'pulp fiction', url: buildWikipediaURL('Pulp Fiction'), imageURL: '/images/stickers/pulp-fiction.webp', width: 244, height: 360 },
	{ name: 'abbey road', url: buildWikipediaURL('Abbey Road'), imageURL: '/images/stickers/abbey-road.webp', width: 360, height: 360 },
	{ name: 'mr. robot', url: buildWikipediaURL('Mr. Robot'), imageURL: '/images/stickers/mr-robot.webp', width: 424, height: 87, isDieCut: true },
	{ name: 'the catcher in the rye', url: buildWikipediaURL('The Catcher in the Rye'), imageURL: '/images/stickers/the-catcher-in-the-rye.webp', width: 310, height: 360 },
	{ name: 'the curse of monkey island', url: buildWikipediaURL('The Curse of Monkey Island'), imageURL: '/images/stickers/curse-of-monkey-island.webp', width: 269, height: 360 },
	{ name: 'parasite', url: buildWikipediaURL('Parasite (2019 film)'), imageURL: '/images/stickers/parasite.webp', width: 252, height: 360 },
	{ name: 'the simpsons', url: buildWikipediaURL('The Simpsons'), imageURL: '/images/stickers/the-simpsons.webp', width: 444, height: 208, isDieCut: true },
	{ name: 'back to black', url: buildWikipediaURL('Back to Black'), imageURL: '/images/stickers/back-to-black.webp', width: 360, height: 360 },
	{ name: 'exapunks', url: buildWikipediaURL('Exapunks'), imageURL: '/images/stickers/exapunks.webp', width: 360, height: 168 },
	{ name: 'whiplash', url: buildWikipediaURL('Whiplash (2014 film)'), imageURL: '/images/stickers/whiplash.webp', width: 243, height: 360 },
	{ name: 'friends', url: buildWikipediaURL('Friends'), imageURL: '/images/stickers/friends.webp', width: 444, height: 94, isDieCut: true },
	{ name: 'i love katamari', url: buildWikipediaURL('I Love Katamari'), imageURL: '/images/stickers/i-love-katamari.webp', width: 360, height: 360 },
	{ name: 'burning', url: buildWikipediaURL('Burning (2018 film)'), imageURL: '/images/stickers/burning.webp', width: 252, height: 360 },
	{ name: 'rick and morty', url: buildWikipediaURL('Rick and Morty'), imageURL: '/images/stickers/rick-and-morty.webp', width: 444, height: 153, isDieCut: true },
	{ name: 'la vie devant soi', url: buildWikipediaURL('The Life Before Us'), imageURL: '/images/stickers/the-life-before-us.webp', width: 248, height: 360 },
	{ name: 'thimbleweed park', url: buildWikipediaURL('Thimbleweed Park'), imageURL: '/images/stickers/thimbleweed-park.webp', width: 301, height: 360 },
	{ name: 'face/off', url: buildWikipediaURL('Face/Off'), imageURL: '/images/stickers/face-off.webp', width: 241, height: 360 },
	{ name: 'evangelion', url: buildWikipediaURL('Neon Genesis Evangelion'), imageURL: '/images/stickers/evangelion.webp', width: 360, height: 132 },
	{ name: 'juno', url: buildWikipediaURL('Juno (Remi Wolf album)'), imageURL: '/images/stickers/juno.webp', width: 360, height: 360 },
	{ name: "bob's burgers", url: buildWikipediaURL("Bob's Burgers"), imageURL: '/images/stickers/bobs-burgers.webp', width: 444, height: 157, isDieCut: true },
	{ name: 'my mister', url: buildWikipediaURL('My Mister'), imageURL: '/images/stickers/my-mister.webp', width: 360, height: 248 },
	{ name: 'sonic adventure', url: buildWikipediaURL('Sonic Adventure'), imageURL: '/images/stickers/sonic-adventure.webp', width: 360, height: 356 },
	{ name: 'garden state', url: buildWikipediaURL('Garden State (film)'), imageURL: '/images/stickers/garden-state.webp', width: 243, height: 360 },
	{ name: 'the office', url: buildWikipediaURL('The Office (American TV series)'), imageURL: '/images/stickers/the-office.webp', width: 444, height: 93, isDieCut: true },
	{ name: 'ftl', url: buildWikipediaURL('FTL: Faster Than Light'), imageURL: '/images/stickers/ftl.webp', width: 360, height: 118 },
	{ name: 'matchstick men', url: buildWikipediaURL('Matchstick Men'), imageURL: '/images/stickers/matchstick-men.webp', width: 243, height: 360 },
	{ name: 'star trek: lower decks', url: buildWikipediaURL('Star Trek: Lower Decks'), imageURL: '/images/stickers/lower-decks.webp', width: 428, height: 112, isDieCut: true },
	{ name: 'arcane', url: buildWikipediaURL('Arcane (TV series)'), imageURL: '/images/stickers/arcane.webp', width: 426, height: 96, isDieCut: true }
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

export const playlistEmbedURL = 'https://embed.music.apple.com/us/playlist/eastriver/pl.u-YW7pF1kg1Z5';
