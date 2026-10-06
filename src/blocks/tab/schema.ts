import type { BlockDef } from '@/types';

export const def: BlockDef = {
	type: 'tab',
	label: 'Tab',
	category: 'layout',
	icon: 'browsers',
	description: 'One tab of a Tabs block: its title and what shows when it’s chosen.',
	aiHint: 'Only inside tabs. label is the tab’s title; children are its content.',
	props: [{ key: 'label', label: 'Title', kind: 'text', default: 'Tab' }],
	slots: { children: {} },
	canBeChildOf: ['tabs'],
	style: ['spacing', 'layout', 'type'],
	defaults: {
		props: { label: 'Tab' },
		children: [{ id: 'tab0text', type: 'text', props: { html: '<p>What this tab is about.</p>' } }],
	},
};
