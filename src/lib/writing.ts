import { marked } from 'marked';
import storyText from '$lib/content/story.txt?raw';

export type Article = {
	slug: string;
	title: string;
	date: string;
	html: string;
};

const articleSources = import.meta.glob<string>('/src/lib/content/writing/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

const frontmatterPattern = /^---\n([\s\S]*?)\n---\n/;

function parseFrontmatter(source: string): { fields: Record<string, string>; body: string } {
	const match = source.match(frontmatterPattern);
	if (!match) return { fields: {}, body: source };
	const fields = Object.fromEntries(
		match[1].split('\n').map((line) => {
			const separatorIndex = line.indexOf(':');
			return [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()];
		})
	);
	return { fields, body: source.slice(match[0].length) };
}

function slugFromPath(path: string): string {
	return path.split('/').at(-1)?.replace(/\.md$/, '') ?? path;
}

function parseArticle(path: string, source: string): Article {
	const slug = slugFromPath(path);
	const { fields, body } = parseFrontmatter(source);
	return {
		slug,
		title: fields.title ?? slug,
		date: fields.date ?? '',
		html: marked.parse(body, { async: false })
	};
}

export const articles: Article[] = Object.entries(articleSources)
	.map(([path, source]) => parseArticle(path, source))
	.sort((first, second) => second.date.localeCompare(first.date));

export function findArticle(slug: string): Article | undefined {
	return articles.find((article) => article.slug === slug);
}

export const story = {
	title: 'story',
	paragraphs: storyText.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean),
	characterCount: storyText.trim().length
};
