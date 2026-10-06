import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'modal',
	label: 'Pop-up',
	category: 'overlay',
	icon: 'app-window',
	description: 'A window over the page, opened by a button or link. Closes with its × button, Esc or a click outside.',
	aiHint:
		'A modal dialog. Put it at the top level of the page; open it with a button whose action is { type: "open", target: <this id> }. Hidden until opened. Good for sign-up forms, video, details.',
	props: [
		{ key: 'title', label: 'Name for screen readers', kind: 'text', default: 'Pop-up', help: 'Read out when it opens; not shown.' },
		{ key: 'size', label: 'Width', kind: 'select', options: opts([['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']]), default: 'md' },
		{ key: 'closeButton', label: 'Close button (×)', kind: 'boolean', default: true },
	],
	slots: { children: {} },
	style: ['spacing', 'background', 'border', 'type'],
	client: true,
	defaults: {
		props: { title: 'Pop-up', size: 'md', closeButton: true },
		children: [
			{ id: 'mdl0head', type: 'heading', props: { text: 'Pop-up title', level: 2, size: 'md' } },
			{ id: 'mdl0text', type: 'text', props: { html: '<p>Say what this is about.</p>' } },
		],
	},
};
