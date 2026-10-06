import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'marquee',
	label: 'Moving strip',
	category: 'media',
	icon: 'arrows-vertical',
	description: 'A strip that slowly scrolls sideways — customer logos, press mentions. Stops for people who prefer less motion.',
	aiHint: 'Children are logos (image blocks, small) or short text. 5–10 items. Stands still with prefers-reduced-motion.',
	props: [
		{ key: 'speed', label: 'Speed', kind: 'select', options: opts([['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']]), default: 'normal' },
		{ key: 'reverse', label: 'Move to the right', kind: 'boolean', default: false },
		{ key: 'gap', label: 'Gap', kind: 'select', options: opts([[6, 'Small'], [12, 'Medium'], [16, 'Large']]), default: 12 },
		{ key: 'fade', label: 'Fade the edges', kind: 'boolean', default: true },
	],
	slots: { children: {} },
	style: 'all',
	defaults: {
		props: { speed: 'normal', reverse: false, gap: 12, fade: true },
		children: ['Northwind', 'Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map((name, i) => ({
			id: `mrq0lg${String(i).padStart(2, '0')}`,
			type: 'text',
			props: { html: `<p><strong>${name}</strong></p>`, size: 'lg', muted: true },
		})),
	},
};
