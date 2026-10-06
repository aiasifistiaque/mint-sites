import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'countdown',
	label: 'Countdown',
	category: 'basic',
	icon: 'timer',
	description: 'Days, hours, minutes and seconds until a date — a launch, a sale, an event.',
	aiHint: 'to is an ISO date-time with the business’s offset, e.g. "2026-12-24T18:00:00+06:00". endedText shows once it has passed.',
	client: true,
	props: [
		{ key: 'to', label: 'Counts down to', kind: 'text', default: '', help: 'Like 2026-12-24T18:00 — add your time zone, e.g. 2026-12-24T18:00+06:00.' },
		{ key: 'endedText', label: 'When it’s over', kind: 'text', default: 'It’s here!' },
		{ key: 'seconds', label: 'Show seconds', kind: 'boolean', default: true },
		{ key: 'size', label: 'Size', kind: 'select', options: opts([['md', 'Medium'], ['lg', 'Large']]), default: 'md' },
		{ key: 'boxed', label: 'In boxes', kind: 'boolean', default: true },
	],
	style: 'all',
	defaults: { props: { to: '', endedText: 'It’s here!', seconds: true, size: 'md', boxed: true } },
};
