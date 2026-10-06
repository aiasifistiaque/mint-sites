import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'stat',
	label: 'Number',
	category: 'basic',
	icon: 'chart-bar',
	description: 'A big number with a label — “12 years”, “4.9 ★”, “2,000 customers”.',
	aiHint: 'value is short ("98%", "12k+"); label says what it counts. Use 3–4 in a grid.',
	props: [
		{ key: 'value', label: 'Number', kind: 'text', default: '98%', bindable: true },
		{ key: 'label', label: 'Label', kind: 'text', default: 'happy customers', bindable: true },
		{ key: 'description', label: 'More detail', kind: 'textarea' },
		{ key: 'tone', label: 'Number colour', kind: 'select', options: opts([['foreground', 'Text'], ['primary', 'Primary']]), default: 'foreground' },
		{ key: 'align', label: 'Align', kind: 'select', options: opts([['start', 'Left'], ['center', 'Centre']]), default: 'start' },
	],
	style: 'all',
	defaults: { props: { value: '98%', label: 'happy customers', tone: 'foreground', align: 'start' } },
};
