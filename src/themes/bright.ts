import type { Theme } from '@/types';
import { studio } from './studio';

// Friendly and colourful: a violet primary with a coral accent, Outfit
// headings over DM Sans, round corners and pill buttons. For apps, shops,
// classes and anything playful.
export const bright: Theme = {
	key: 'bright',
	label: 'Bright',
	description: 'Friendly and colourful — violet and coral, round corners and pill buttons. Suits apps, shops and classes.',
	preview: { bg: '#fdfcff', fg: '#1c1530', primary: '#7c3aed', font: 'Outfit' },
	tokens: {
		colors: {
			background: { light: '#fdfcff', dark: '#120e1c' },
			foreground: { light: '#1c1530', dark: '#ece8f7' },
			muted: { light: '#f4f1fb', dark: '#1b1629' },
			'muted-foreground': { light: '#635a7a', dark: '#a69fbd' },
			primary: { light: '#7c3aed', dark: '#a78bfa' },
			'primary-foreground': { light: '#ffffff', dark: '#120e1c' },
			secondary: { light: '#ffe4dc', dark: '#3a1f1a' },
			'secondary-foreground': { light: '#7a2614', dark: '#ffd0c2' },
			accent: { light: '#ff7a59', dark: '#ff9b80' },
			'accent-foreground': { light: '#ffffff', dark: '#1f0d08' },
			card: { light: '#ffffff', dark: '#191427' },
			'card-foreground': { light: '#1c1530', dark: '#ece8f7' },
			border: { light: '#e7e1f5', dark: '#2c2540' },
			ring: { light: '#7c3aed', dark: '#a78bfa' },
			success: { light: '#16a34a', dark: '#4ade80' },
			warning: { light: '#d97706', dark: '#fbbf24' },
			danger: { light: '#e11d48', dark: '#fb7185' },
		},
		fonts: {
			heading: { family: 'Outfit', weights: [600, 700, 800] },
			body: { family: 'DM Sans', weights: [400, 500, 700] },
			mono: { family: 'JetBrains Mono', weights: [400] },
		},
		radius: { none: '0px', sm: '0.5rem', md: '0.875rem', lg: '1.25rem', xl: '2rem', full: '9999px' },
		shadow: {
			none: 'none',
			sm: '0 1px 3px rgb(76 29 149 / 0.08)',
			md: '0 8px 24px rgb(76 29 149 / 0.12)',
			lg: '0 24px 56px rgb(76 29 149 / 0.18)',
		},
		space: studio.tokens.space,
		container: 1200,
		button: { radius: 'full', weight: 700, uppercase: false },
	},
};
