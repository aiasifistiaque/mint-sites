import type { BlockDef } from '@/types';
import { opts } from '../util';

export const RATIOS = ['auto', '1/1', '4/3', '3/2', '16/9', '21/9', '3/4', '2/3'] as const;

export const def: BlockDef = {
	type: 'image',
	label: 'Image',
	category: 'media',
	icon: 'image',
	description: 'A picture from your media library, optionally cropped to a shape.',
	aiHint:
		'src is a media-library URL or "placeholder:<w>x<h>:<label>" when no picture exists yet. Always write a short alt text describing the picture.',
	props: [
		{ key: 'src', label: 'Image', kind: 'image', bindable: true },
		{ key: 'alt', label: 'Alt text', kind: 'text', bindable: true, help: 'Describes the picture for screen readers and search engines.' },
		{ key: 'ratio', label: 'Shape', kind: 'select', options: opts([['auto', 'Original'], ['1/1', 'Square'], ['4/3', '4:3'], ['3/2', '3:2'], ['16/9', '16:9'], ['21/9', 'Wide'], ['3/4', 'Portrait 3:4'], ['2/3', 'Portrait 2:3']]), default: 'auto' },
		{ key: 'fit', label: 'Fit', kind: 'select', options: opts([['cover', 'Fill the shape'], ['contain', 'Show all of it']]), default: 'cover' },
		{ key: 'rounded', label: 'Corners', kind: 'select', options: opts([['none', 'Square'], ['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large'], ['xl', 'Extra large'], ['full', 'Round']]), default: 'md' },
		{ key: 'priority', label: 'Load first', kind: 'boolean', default: false, help: 'Turn on for the big picture at the top of a page.' },
	],
	style: ['spacing', 'size', 'border', 'effects'],
	actions: true,
	defaults: { props: { src: 'placeholder:1200x800:Image', alt: '', ratio: 'auto', fit: 'cover', rounded: 'md' } },
};
