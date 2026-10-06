import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'popover',
	label: 'Popover',
	category: 'overlay',
	icon: 'chat-circle',
	description: 'A small panel that opens just below the button or link that opens it. Closes with Esc or a click elsewhere.',
	aiHint:
		'A small floating panel under its trigger. Put it at the top level of the page; a button with { type: "toggle", target: <this id> } opens and closes it. For short menus, hints and details.',
	props: [
		{ key: 'title', label: 'Name for screen readers', kind: 'text', default: 'Popover', help: 'Read out when it opens; not shown.' },
		{ key: 'size', label: 'Width', kind: 'select', options: opts([['sm', 'Small'], ['md', 'Medium']]), default: 'sm' },
	],
	slots: { children: {} },
	style: ['spacing', 'background', 'border', 'type'],
	client: true,
	defaults: {
		props: { title: 'Popover', size: 'sm' },
		children: [{ id: 'pop0text', type: 'text', props: { html: '<p>A short note.</p>', size: 'sm' } }],
	},
};
