import type { Theme } from '@/types';
import { studio } from './studio';

// Fresh and trustworthy for shops: a deep green primary, a warm amber accent,
// Manrope throughout, medium corners and clear shadows on product cards.
export const market: Theme = {
	key: 'market',
	label: 'Market',
	description: 'Fresh and trustworthy — deep green, warm amber and Manrope. Made for shops and products.',
	preview: { bg: '#fbfaf7', fg: '#14201a', primary: '#166534', font: 'Manrope' },
	tokens: {
		colors: {
			background: { light: '#fbfaf7', dark: '#0d1310' },
			foreground: { light: '#14201a', dark: '#e6efe9' },
			muted: { light: '#f1efe8', dark: '#151d18' },
			'muted-foreground': { light: '#55625a', dark: '#9fb0a6' },
			primary: { light: '#166534', dark: '#4ade80' },
			'primary-foreground': { light: '#ffffff', dark: '#06210f' },
			secondary: { light: '#e8f3ec', dark: '#1a2a20' },
			'secondary-foreground': { light: '#14532d', dark: '#d1f0dc' },
			accent: { light: '#fde68a', dark: '#f59e0b' },
			'accent-foreground': { light: '#422006', dark: '#1c1003' },
			card: { light: '#ffffff', dark: '#121a15' },
			'card-foreground': { light: '#14201a', dark: '#e6efe9' },
			border: { light: '#e4e1d8', dark: '#24302a' },
			ring: { light: '#166534', dark: '#4ade80' },
			success: { light: '#15803d', dark: '#4ade80' },
			warning: { light: '#b45309', dark: '#fbbf24' },
			danger: { light: '#b91c1c', dark: '#f87171' },
		},
		fonts: {
			heading: { family: 'Manrope', weights: [600, 700, 800] },
			body: { family: 'Manrope', weights: [400, 500, 600] },
			mono: { family: 'JetBrains Mono', weights: [400] },
		},
		radius: { none: '0px', sm: '0.25rem', md: '0.5rem', lg: '0.875rem', xl: '1.25rem', full: '9999px' },
		shadow: {
			none: 'none',
			sm: '0 1px 2px rgb(20 32 26 / 0.06)',
			md: '0 6px 18px rgb(20 32 26 / 0.09)',
			lg: '0 20px 48px rgb(20 32 26 / 0.14)',
		},
		space: studio.tokens.space,
		container: 1280,
		button: { radius: 'md', weight: 700, uppercase: false },
	},
};
