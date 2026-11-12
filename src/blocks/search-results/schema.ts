import type { BlockDef } from '@/types';
import { opts } from '../util';

// The Search widget's results layout (docs/search SI-07): reads ?q=, with filters, chips, sort and pages.
export const def: BlockDef = {
	type: 'search-results',
	label: 'Search results',
	category: 'commerce',
	icon: 'magnifying-glass',
	description: 'The store’s search results: products for ?q=, with filters, sort and pages.',
	aiHint: 'Put it alone on the store’s /search page. Needs the Search widget switched on.',
	props: [
		{ key: 'showFilters', label: 'Filters', kind: 'select', options: opts([['default', 'As set for the widget'], ['true', 'Show'], ['false', 'Hide']]), default: 'default' },
		{ key: 'productUrl', label: 'Product address', kind: 'text', default: '', help: 'Leave empty for the widget’s own, /products/{slug} by default. {slug} and {id} are filled in.' },
	],
	style: ['spacing'],
	defaults: { props: { showFilters: 'default' } },
};
