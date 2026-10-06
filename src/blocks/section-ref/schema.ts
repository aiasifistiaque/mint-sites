import type { BlockDef } from '@/types';

export const def: BlockDef = {
	type: 'section-ref',
	label: 'Saved section',
	category: 'layout',
	icon: 'puzzle-piece',
	description: 'A section saved in Design. It looks the same everywhere it’s used — change it once and every page follows.',
	aiHint: 'Places a saved (global) section by its id from the design’s sections. To change what it shows, edit the saved section, not this block.',
	props: [{ key: 'section', label: 'Saved section', kind: 'section', default: '' }],
	style: ['spacing', 'effects'],
	defaults: { props: { section: '' } },
};
