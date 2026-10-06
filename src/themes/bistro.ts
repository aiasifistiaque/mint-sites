import type { Theme } from '@/types';
import { studio } from './studio';

// Warm evening light for restaurants and bars: deep wine red and brass on
// cream, Playfair Display headings over Lato, a dark mode that feels candlelit.
export const bistro: Theme = {
	key: 'bistro',
	label: 'Bistro',
	description: 'Warm and inviting — wine red, brass and cream with classic serif headings. Made for restaurants and bars.',
	preview: { bg: '#fbf6ee', fg: '#2a1a17', primary: '#8c1c2c', font: 'Playfair Display' },
	tokens: {
		colors: {
			background: { light: '#fbf6ee', dark: '#160f0d' },
			foreground: { light: '#2a1a17', dark: '#f1e6da' },
			muted: { light: '#f3ebdf', dark: '#201714' },
			'muted-foreground': { light: '#6b5750', dark: '#bba899' },
			primary: { light: '#8c1c2c', dark: '#e5868f' },
			'primary-foreground': { light: '#fff7ef', dark: '#1f0b0e' },
			secondary: { light: '#efe2cf', dark: '#2b201b' },
			'secondary-foreground': { light: '#3d2a22', dark: '#f1e6da' },
			accent: { light: '#b8893a', dark: '#d6a855' },
			'accent-foreground': { light: '#1f1405', dark: '#1f1405' },
			card: { light: '#fffdf9', dark: '#1c1411' },
			'card-foreground': { light: '#2a1a17', dark: '#f1e6da' },
			border: { light: '#e8dccb', dark: '#33261f' },
			ring: { light: '#8c1c2c', dark: '#e5868f' },
			success: { light: '#2f7a4a', dark: '#7fd19d' },
			warning: { light: '#9a5b10', dark: '#f0bf6a' },
			danger: { light: '#b3261e', dark: '#f28b82' },
		},
		fonts: {
			heading: { family: 'Playfair Display', weights: [500, 600, 700] },
			body: { family: 'Lato', weights: [400, 700] },
			mono: { family: 'IBM Plex Mono', weights: [400] },
		},
		radius: { none: '0px', sm: '0.125rem', md: '0.25rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
		shadow: {
			none: 'none',
			sm: '0 1px 2px rgb(42 26 23 / 0.08)',
			md: '0 8px 22px rgb(42 26 23 / 0.10)',
			lg: '0 22px 50px rgb(42 26 23 / 0.16)',
		},
		space: studio.tokens.space,
		container: 1160,
		button: { radius: 'sm', weight: 700, uppercase: true },
	},
};
