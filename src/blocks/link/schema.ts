import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'link',
	label: 'Link',
	category: 'basic',
	icon: 'link',
	description: 'A text link to a page, another site, an email address or a phone number.',
	aiHint: 'Inline navigation (menus, footers). Set node.action to { type: "link", href } or { type: "page", pageId }.',
	props: [
		{ key: 'text', label: 'Text', kind: 'text', default: 'Learn more', bindable: true },
		{ key: 'tone', label: 'Colour', kind: 'select', options: opts([['foreground', 'Text'], ['primary', 'Primary'], ['muted', 'Muted']]), default: 'foreground' },
		{ key: 'underline', label: 'Underline', kind: 'select', options: opts([['hover', 'On hover'], ['always', 'Always'], ['none', 'Never']]), default: 'hover' },
	],
	style: ['spacing', 'type', 'effects'],
	actions: true,
	defaults: { props: { text: 'Learn more', tone: 'foreground', underline: 'hover' } },
};
