import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'tabs',
	label: 'Tabs',
	category: 'layout',
	icon: 'browsers',
	description: 'Content in tabs: visitors pick a title to see its part. Each tab is a block inside.',
	aiHint: 'children are tab blocks (2–6), each with a short label. For services, menus by meal, plans by audience.',
	client: true,
	props: [
		{ key: 'variant', label: 'Look', kind: 'select', options: opts([['line', 'Underlined'], ['pills', 'Pills']]), default: 'line' },
		{ key: 'align', label: 'Titles', kind: 'select', options: opts([['start', 'Left'], ['center', 'Centre']]), default: 'start' },
	],
	slots: { children: { allow: ['tab'] } },
	style: 'all',
	defaults: {
		props: { variant: 'line', align: 'start' },
		children: [
			{ id: 'tbs0tab1', type: 'tab', props: { label: 'First' }, children: [{ id: 'tbs0txt1', type: 'text', props: { html: '<p>What the first tab is about.</p>' } }] },
			{ id: 'tbs0tab2', type: 'tab', props: { label: 'Second' }, children: [{ id: 'tbs0txt2', type: 'text', props: { html: '<p>What the second tab is about.</p>' } }] },
			{ id: 'tbs0tab3', type: 'tab', props: { label: 'Third' }, children: [{ id: 'tbs0txt3', type: 'text', props: { html: '<p>What the third tab is about.</p>' } }] },
		],
	},
};
