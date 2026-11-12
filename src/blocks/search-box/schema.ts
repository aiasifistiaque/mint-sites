import type { BlockDef } from '@/types';
import { opts } from '../util';

// The store's Search widget (docs/search SI-07): an icon that opens the search, or a box, both suggesting as the
// shopper types. Words, layout and where Enter goes default to the widget's settings (Site setup → Widgets).
export const def: BlockDef = {
	type: 'search-box',
	label: 'Search box',
	category: 'commerce',
	icon: 'magnifying-glass',
	description: 'The store’s search: an icon that opens it, or a box. Suggests products and categories as people type.',
	aiHint: 'For e-commerce stores, in the header. layout icon on small headers, box when there is room. Needs the Search widget switched on.',
	props: [
		{ key: 'layout', label: 'Look', kind: 'select', options: opts([['icon', 'An icon that opens the search'], ['box', 'A search box']]), default: 'icon' },
		{ key: 'resultsUrl', label: 'Results page', kind: 'text', default: '', help: 'Leave empty for the widget’s own (Site setup → Widgets → Search), /search by default.' },
	],
	style: ['spacing'],
	defaults: { props: { layout: 'icon' } },
};
