import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'map',
	label: 'Map',
	category: 'media',
	icon: 'map-pin',
	description: 'A Google map of your address from Website settings (or one you type here).',
	aiHint: 'Shows the site’s address (Website settings → Contact) unless address is set. No API key needed.',
	props: [
		{ key: 'address', label: 'Address', kind: 'text', help: 'Leave empty to use the address in Website settings.' },
		{ key: 'zoom', label: 'Zoom', kind: 'select', options: opts([[12, 'City'], [14, 'Neighbourhood'], [16, 'Street'], [18, 'Building']]), default: 16 },
		{ key: 'height', label: 'Height', kind: 'select', options: opts([[240, 'Small'], [360, 'Medium'], [480, 'Large']]), default: 360 },
	],
	style: ['spacing', 'size', 'border', 'effects'],
	defaults: { props: { address: '', zoom: 16, height: 360 } },
};
