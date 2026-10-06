import type { BlockDef } from '@/types';
import { MENU_ITEMS, MENU_SOURCE } from '../nav-menu/schema';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'header',
	label: 'Header',
	category: 'navigation',
	icon: 'browsers',
	description: 'The top of every page: logo, menu and buttons. On phones the menu folds into a ☰ button.',
	aiHint:
		'Put one in the layout header. Logo + name come from Website settings, the menu from pages marked showInMenu (source "site"). Children are the buttons on the right (1–2 buttons). layout "split" | "center" | "stacked".',
	props: [
		{ key: 'layout', label: 'Layout', kind: 'select', options: opts([['split', 'Logo left, menu right'], ['center', 'Menu in the middle'], ['stacked', 'Logo above the menu']]), default: 'split' },
		{ key: 'show', label: 'Logo shows', kind: 'select', options: opts([['both', 'Logo and name'], ['logo', 'Logo only'], ['name', 'Name only']]), default: 'both' },
		{ key: 'logoSize', label: 'Logo size', kind: 'select', options: opts([['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']]), default: 'md' },
		MENU_SOURCE,
		MENU_ITEMS,
		{ key: 'sticky', label: 'Stays at the top when scrolling', kind: 'boolean', default: false },
		{ key: 'border', label: 'Line underneath', kind: 'boolean', default: true },
		{ key: 'width', label: 'Content width', kind: 'select', options: opts([['container', 'Normal'], ['wide', 'Wide'], ['full', 'Full width']]), default: 'container' },
	],
	slots: { children: { label: 'Buttons' } },
	style: ['spacing', 'background', 'type', 'effects'],
	defaults: {
		props: { layout: 'split', show: 'both', logoSize: 'md', source: 'site', sticky: false, border: true, width: 'container' },
		children: [{ id: 'hdr0btn1', type: 'button', props: { label: 'Get in touch', variant: 'primary', size: 'sm' }, action: { type: 'link', href: '/contact' } }],
	},
};
