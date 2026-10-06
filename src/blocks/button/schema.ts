import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'button',
	label: 'Button',
	category: 'basic',
	icon: 'cursor-click',
	description: 'A call to action: goes to a page or link, or opens a modal, drawer or widget.',
	aiHint: 'One "primary" button per section, others "outline" or "ghost". Set node.action (link / page / open / scroll / widget).',
	props: [
		{ key: 'label', label: 'Label', kind: 'text', default: 'Get started', bindable: true },
		{ key: 'variant', label: 'Style', kind: 'select', options: opts([['primary', 'Primary'], ['secondary', 'Secondary'], ['outline', 'Outline'], ['ghost', 'Ghost'], ['link', 'Link']]), default: 'primary' },
		{ key: 'size', label: 'Size', kind: 'select', options: opts([['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']]), default: 'md' },
		{ key: 'icon', label: 'Icon', kind: 'icon' },
		{ key: 'iconPosition', label: 'Icon position', kind: 'select', options: opts([['start', 'Before'], ['end', 'After']]), default: 'end' },
		{ key: 'fullWidth', label: 'Full width', kind: 'boolean', default: false },
	],
	style: ['spacing', 'size', 'effects'],
	actions: true,
	defaults: { props: { label: 'Get started', variant: 'primary', size: 'md', iconPosition: 'end' } },
};
