import type { BlockDef } from '@/types';
import { opts, SPACE_OPTIONS } from '../util';

export const def: BlockDef = {
	type: 'stack',
	label: 'Stack',
	category: 'layout',
	icon: 'rows',
	description: 'Lines its content up in a row or a column with even gaps.',
	aiHint:
		'Flexbox. direction "column" for vertical lists of text and buttons, "row" for button groups and side-by-side content; stackOnMobile turns a row into a column on phones.',
	props: [
		{ key: 'direction', label: 'Direction', kind: 'select', options: opts([['column', 'Column'], ['row', 'Row']]), default: 'column' },
		{ key: 'gap', label: 'Gap', kind: 'select', options: SPACE_OPTIONS, default: 4 },
		{ key: 'align', label: 'Align', kind: 'select', options: opts([['stretch', 'Stretch'], ['start', 'Start'], ['center', 'Centre'], ['end', 'End']]), default: 'stretch' },
		{ key: 'justify', label: 'Justify', kind: 'select', options: opts([['start', 'Start'], ['center', 'Centre'], ['end', 'End'], ['between', 'Space between']]), default: 'start' },
		{ key: 'wrap', label: 'Wrap', kind: 'boolean', default: false },
		{ key: 'stackOnMobile', label: 'Column on phones', kind: 'boolean', default: true, help: 'A row becomes a column below 768 px.' },
	],
	slots: { children: {} },
	style: 'all',
	defaults: { props: { direction: 'column', gap: 4, align: 'stretch', justify: 'start' } },
};
