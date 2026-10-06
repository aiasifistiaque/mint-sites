import type { BlockDef, PropDef } from '@/types';
import { opts } from '../util';

/** Custom menu rows (the nav menu, header and footer columns). */
export const MENU_ITEMS: PropDef = {
	key: 'items',
	label: 'Links',
	kind: 'list',
	help: 'Used when “Links from” is “These links”.',
	fields: [
		{ key: 'label', label: 'Text', kind: 'text' },
		{ key: 'href', label: 'Goes to', kind: 'link' },
	],
	default: [],
};

export const MENU_SOURCE: PropDef = {
	key: 'source',
	label: 'Links from',
	kind: 'select',
	options: opts([['site', 'Pages in the menu'], ['custom', 'These links']]),
	default: 'site',
	help: '“Pages in the menu” follows each page’s “Show in the menu” setting.',
};

export const def: BlockDef = {
	type: 'nav-menu',
	label: 'Menu',
	category: 'navigation',
	icon: 'list',
	description: 'A row or column of links — your pages marked “Show in the menu”, or links you choose.',
	aiHint: 'source "site" lists the pages marked showInMenu (preferred); "custom" uses items [{ label, href }]. direction "row" for headers, "column" for footers.',
	props: [
		MENU_SOURCE,
		MENU_ITEMS,
		{ key: 'direction', label: 'Direction', kind: 'select', options: opts([['row', 'Row'], ['column', 'Column']]), default: 'row' },
		{ key: 'tone', label: 'Colour', kind: 'select', options: opts([['muted', 'Muted'], ['foreground', 'Text'], ['primary', 'Primary']]), default: 'muted' },
		{ key: 'gap', label: 'Gap', kind: 'select', options: opts([[2, 'Small'], [4, 'Medium'], [6, 'Large'], [8, 'Extra large']]), default: 6 },
	],
	style: ['spacing', 'type', 'effects'],
	defaults: { props: { source: 'site', direction: 'row', tone: 'muted', gap: 6 } },
};
