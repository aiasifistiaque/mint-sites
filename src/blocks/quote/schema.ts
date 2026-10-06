import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'quote',
	label: 'Quote',
	category: 'basic',
	icon: 'quotes',
	description: 'What a customer said, with their name, role and photo.',
	aiHint: 'Testimonials: text in the customer’s words (1–3 sentences), author, role ("Owner, Café Nord"). rating 0 hides the stars.',
	props: [
		{ key: 'text', label: 'Quote', kind: 'textarea', default: 'They were quick, friendly and the result was better than we hoped.', bindable: true },
		{ key: 'author', label: 'Name', kind: 'text', default: 'Sam Rivera', bindable: true },
		{ key: 'role', label: 'Role or company', kind: 'text', default: 'Customer', bindable: true },
		{ key: 'avatar', label: 'Photo', kind: 'image', bindable: true },
		{ key: 'rating', label: 'Stars', kind: 'select', options: opts([[0, 'None'], [3, '3'], [4, '4'], [5, '5']]), default: 0 },
		{ key: 'variant', label: 'Look', kind: 'select', options: opts([['card', 'Card'], ['plain', 'Plain'], ['large', 'Large, centred']]), default: 'card' },
	],
	style: 'all',
	defaults: { props: { text: 'They were quick, friendly and the result was better than we hoped.', author: 'Sam Rivera', role: 'Customer', rating: 0, variant: 'card' } },
};
