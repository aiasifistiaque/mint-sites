import type { Theme } from '@/types';
import { studio } from './studio';

// Soft and unhurried for bookings and wellness: sage and sand, Lora headings
// over Nunito, generous space and round corners, very light shadows.
export const calm: Theme = {
	key: 'calm',
	label: 'Calm',
	description: 'Soft and unhurried — sage, sand and gentle serif headings. Suits bookings, wellness and care.',
	preview: { bg: '#f7f5f0', fg: '#26302b', primary: '#4d6b5a', font: 'Lora' },
	tokens: {
		colors: {
			background: { light: '#f7f5f0', dark: '#121614' },
			foreground: { light: '#26302b', dark: '#e4e9e5' },
			muted: { light: '#eeebe3', dark: '#1a201d' },
			'muted-foreground': { light: '#5d6862', dark: '#a5b0aa' },
			primary: { light: '#4d6b5a', dark: '#9cc3ad' },
			'primary-foreground': { light: '#ffffff', dark: '#0f1a14' },
			secondary: { light: '#e7ece6', dark: '#1f2823' },
			'secondary-foreground': { light: '#2f4237', dark: '#d7e4dc' },
			accent: { light: '#ead9c6', dark: '#3a2f24' },
			'accent-foreground': { light: '#4a3520', dark: '#f0dfcb' },
			card: { light: '#fdfcf9', dark: '#171c19' },
			'card-foreground': { light: '#26302b', dark: '#e4e9e5' },
			border: { light: '#e2ded3', dark: '#29312c' },
			ring: { light: '#4d6b5a', dark: '#9cc3ad' },
			success: { light: '#3f7a52', dark: '#86d0a0' },
			warning: { light: '#a25a14', dark: '#f2c26b' },
			danger: { light: '#b23b3b', dark: '#f19999' },
		},
		fonts: {
			heading: { family: 'Lora', weights: [500, 600, 700] },
			body: { family: 'Nunito', weights: [400, 600, 700] },
			mono: { family: 'IBM Plex Mono', weights: [400] },
		},
		radius: { none: '0px', sm: '0.5rem', md: '0.875rem', lg: '1.5rem', xl: '2.25rem', full: '9999px' },
		shadow: {
			none: 'none',
			sm: '0 1px 2px rgb(38 48 43 / 0.05)',
			md: '0 6px 20px rgb(38 48 43 / 0.06)',
			lg: '0 18px 44px rgb(38 48 43 / 0.09)',
		},
		space: studio.tokens.space,
		container: 1120,
		button: { radius: 'full', weight: 600, uppercase: false },
	},
};
