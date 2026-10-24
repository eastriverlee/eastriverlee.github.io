import { error } from '@sveltejs/kit';
import { articles, findArticle } from '$lib/writing';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = articles.length > 0;

export const entries: EntryGenerator = () => articles.map((article) => ({ slug: article.slug }));

export const load: PageLoad = ({ params }) => {
	const article = findArticle(params.slug);
	if (!article) error(404, `no article named ${params.slug}`);
	return { article };
};
