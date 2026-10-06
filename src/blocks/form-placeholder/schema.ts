import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'form-placeholder',
	label: 'Contact form',
	category: 'form',
	icon: 'envelope',
	description: 'Name, email and message fields. Until built-in forms arrive, sending opens the visitor’s email app, addressed to you.',
	aiHint: 'kind "contact" (name, email, message) or "newsletter" (email only, inline). Sends to the site’s email from Website settings. Real form handling comes later (W-08).',
	props: [
		{ key: 'kind', label: 'Fields', kind: 'select', options: opts([['contact', 'Name, email, message'], ['newsletter', 'Email only']]), default: 'contact' },
		{ key: 'button', label: 'Button', kind: 'text', default: 'Send' },
		{ key: 'to', label: 'Send to', kind: 'text', help: 'Leave empty to use the email in Website settings.' },
		{ key: 'note', label: 'Small print', kind: 'text', default: '' },
	],
	style: 'all',
	defaults: { props: { kind: 'contact', button: 'Send', to: '', note: '' } },
};
