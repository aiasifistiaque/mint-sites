import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'heading',
	label: 'Heading',
	category: 'basic',
	icon: 'text-h',
	description: 'A title. Level 1 once per page, then 2–4 in order.',
	aiHint: 'level 1 for the page title (once), 2 for section titles, 3–4 below them. Keep it short; size "auto" follows the level.',
	props: [
		{ key: 'text', label: 'Text', kind: 'text', default: 'Heading', bindable: true },
		{ key: 'level', label: 'Level', kind: 'select', options: opts([[1, 'H1 — page title'], [2, 'H2'], [3, 'H3'], [4, 'H4']]), default: 2 },
		{ key: 'size', label: 'Size', kind: 'select', options: opts([['auto', 'Auto (by level)'], ['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large'], ['xl', 'Extra large'], ['2xl', 'Huge']]), default: 'auto' },
	],
	style: 'all',
	defaults: { props: { text: 'Heading', level: 2, size: 'auto' } },
};
