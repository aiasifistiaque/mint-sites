import type { Theme } from '@/types';
import { studio } from './studio';

// Warm and literary: paper tones, a terracotta accent, Fraunces headings over
// Source Serif body text, small corners. For writers, studios, restaurants.
export const editorial: Theme = {
	key: 'editorial',
	label: 'Editorial',
	description: 'Warm and literary — paper tones, a terracotta accent and serif type. Suits writers, studios and restaurants.',
	preview: { bg: '#faf6ef', fg: '#2b2118', primary: '#b4532a', font: 'Fraunces' },
	tokens: {
		colors: {
			background: { light: '#faf6ef', dark: '#17130f' },
			foreground: { light: '#2b2118', dark: '#efe6d8' },
			muted: { light: '#f1eadf', dark: '#211b16' },
			'muted-foreground': { light: '#6f6253', dark: '#b3a592' },
			primary: { light: '#b4532a', dark: '#e58a5f' },
			'primary-foreground': { light: '#fffaf3', dark: '#1a120c' },
			secondary: { light: '#ece3d4', dark: '#2a231c' },
			'secondary-foreground': { light: '#2b2118', dark: '#efe6d8' },
			accent: { light: '#f6dccd', dark: '#3a2619' },
			'accent-foreground': { light: '#7a3417', dark: '#f6cdb6' },
			card: { light: '#fffcf7', dark: '#1d1813' },
			'card-foreground': { light: '#2b2118', dark: '#efe6d8' },
			border: { light: '#e3d8c6', dark: '#352c23' },
			ring: { light: '#b4532a', dark: '#e58a5f' },
			success: { light: '#3f7a3a', dark: '#8bc983' },
			warning: { light: '#a8610b', dark: '#f0b65a' },
			danger: { light: '#a33a2c', dark: '#ef8a7b' },
		},
		fonts: {
			heading: { family: 'Fraunces', weights: [500, 600, 700] },
			body: { family: 'Source Serif 4', weights: [400, 600] },
			mono: { family: 'IBM Plex Mono', weights: [400] },
		},
		radius: { none: '0px', sm: '0.125rem', md: '0.25rem', lg: '0.375rem', xl: '0.75rem', full: '9999px' },
		shadow: {
			none: 'none',
			sm: '0 1px 2px rgb(43 33 24 / 0.06)',
			md: '0 6px 16px rgb(43 33 24 / 0.08)',
			lg: '0 20px 44px rgb(43 33 24 / 0.12)',
		},
		space: studio.tokens.space,
		container: 1120,
		button: { radius: 'sm', weight: 600, uppercase: false },
	},
};
