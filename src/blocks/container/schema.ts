import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'container',
	label: 'Container',
	category: 'layout',
	icon: 'browsers',
	description: 'Keeps its content to a maximum width, centred.',
	aiHint: 'Use inside a full-width section to narrow a column of content (e.g. prose at "sm").',
	props: [
		{ key: 'size', label: 'Maximum width', kind: 'select', options: opts([['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large'], ['xl', 'Extra large'], ['container', 'Page width'], ['full', 'Full']]), default: 'container' },
	],
	slots: { children: {} },
	style: 'all',
	defaults: { props: { size: 'container' } },
};
