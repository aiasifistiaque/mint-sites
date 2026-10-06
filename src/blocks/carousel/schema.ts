import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'carousel',
	label: 'Carousel',
	category: 'media',
	icon: 'slideshow',
	description: 'A row of slides people swipe or step through with arrows — pictures, cards, quotes.',
	aiHint: 'Each child is one slide (image, card, quote…). perView sets how many show at once on desktop; phones show one and a peek of the next.',
	client: true,
	props: [
		{ key: 'perView', label: 'Slides at once (desktop)', kind: 'select', options: opts([1, 2, 3, 4]), default: 3 },
		{ key: 'perViewTablet', label: 'Slides at once (tablet)', kind: 'select', options: opts([1, 2, 3]), default: 2 },
		{ key: 'gap', label: 'Gap', kind: 'select', options: opts([[2, 'Small'], [4, 'Medium'], [6, 'Large']]), default: 4 },
		{ key: 'arrows', label: 'Arrow buttons', kind: 'boolean', default: true },
		{ key: 'label', label: 'Name for screen readers', kind: 'text', default: 'Slides' },
	],
	slots: { children: {} },
	style: 'all',
	defaults: {
		props: { perView: 3, perViewTablet: 2, gap: 4, arrows: true, label: 'Slides' },
		children: [1, 2, 3, 4].map(n => ({ id: `crs0img${n}`, type: 'image', props: { src: `placeholder:800x600:Slide ${n}`, alt: '', ratio: '4/3' } })),
	},
};
