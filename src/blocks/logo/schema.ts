import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'logo',
	label: 'Logo',
	category: 'navigation',
	icon: 'crown',
	description: 'Your logo and/or site name from Website settings, linking to the home page.',
	aiHint: 'The site’s logo and name (from Website settings unless set here). Links home unless node.action says otherwise.',
	props: [
		{ key: 'show', label: 'Show', kind: 'select', options: opts([['both', 'Logo and name'], ['logo', 'Logo only'], ['name', 'Name only']]), default: 'both' },
		{ key: 'src', label: 'Logo', kind: 'image', help: 'Leave empty to use the logo from Website settings.' },
		{ key: 'text', label: 'Name', kind: 'text', help: 'Leave empty to use the site name from Website settings.' },
		{ key: 'size', label: 'Size', kind: 'select', options: opts([['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']]), default: 'md' },
	],
	style: ['spacing', 'type', 'effects'],
	actions: true,
	defaults: { props: { show: 'both', size: 'md' } },
};
