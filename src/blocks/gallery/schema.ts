import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'gallery',
	label: 'Gallery',
	category: 'media',
	icon: 'images',
	description: 'A grid of pictures; a click opens them big, one by one.',
	aiHint: 'items [{ src, alt, caption? }] — media URLs or placeholders; always write alt text. 6–12 pictures.',
	client: true,
	props: [
		{
			key: 'items',
			label: 'Pictures',
			kind: 'list',
			fields: [
				{ key: 'src', label: 'Picture', kind: 'image' },
				{ key: 'alt', label: 'Alt text', kind: 'text' },
				{ key: 'caption', label: 'Caption', kind: 'text' },
			],
			default: [],
		},
		{ key: 'columns', label: 'Columns (desktop)', kind: 'select', options: opts([2, 3, 4, 5]), default: 3 },
		{ key: 'ratio', label: 'Shape', kind: 'select', options: opts([['1/1', 'Square'], ['4/3', '4:3'], ['3/4', 'Portrait'], ['16/9', 'Wide']]), default: '1/1' },
		{ key: 'gap', label: 'Gap', kind: 'select', options: opts([[2, 'Small'], [4, 'Medium'], [6, 'Large']]), default: 4 },
		{ key: 'lightbox', label: 'Open big on click', kind: 'boolean', default: true },
	],
	style: 'all',
	defaults: {
		props: {
			items: [1, 2, 3, 4, 5, 6].map(n => ({ src: `placeholder:800x800:Photo ${n}`, alt: `Photo ${n}` })),
			columns: 3,
			ratio: '1/1',
			gap: 4,
			lightbox: true,
		},
	},
};
