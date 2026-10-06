import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'drawer',
	label: 'Drawer',
	category: 'overlay',
	icon: 'sidebar-simple',
	description: 'A panel that slides in from the side, opened by a button or link — menus, carts, filters.',
	aiHint:
		'A side panel. Put it at the top level of the page; open it with { type: "open", target: <this id> } on a button. side "left" for menus, "right" for carts and details.',
	props: [
		{ key: 'title', label: 'Name for screen readers', kind: 'text', default: 'Drawer', help: 'Read out when it opens; not shown.' },
		{ key: 'side', label: 'Side', kind: 'select', options: opts([['right', 'Right'], ['left', 'Left']]), default: 'right' },
		{ key: 'size', label: 'Width', kind: 'select', options: opts([['sm', 'Narrow'], ['md', 'Medium'], ['lg', 'Wide']]), default: 'sm' },
		{ key: 'closeButton', label: 'Close button (×)', kind: 'boolean', default: true },
	],
	slots: { children: {} },
	style: ['spacing', 'background', 'border', 'type'],
	client: true,
	defaults: {
		props: { title: 'Drawer', side: 'right', size: 'sm', closeButton: true },
		children: [
			{ id: 'drw0head', type: 'heading', props: { text: 'Drawer', level: 2, size: 'sm' } },
			{ id: 'drw0text', type: 'text', props: { html: '<p>Anything can go in here.</p>' } },
		],
	},
};
