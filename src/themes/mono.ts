import type { Theme } from '@/types';
import { studio } from './studio';

// Stark and precise for portfolios: black on white, Space Grotesk headings
// over IBM Plex Sans, square corners, no shadows, uppercase buttons.
export const mono: Theme = {
	key: 'mono',
	label: 'Mono',
	description: 'Stark and precise — black and white, square corners and a grotesk typeface. Lets portfolio work speak.',
	preview: { bg: '#ffffff', fg: '#0a0a0a', primary: '#0a0a0a', font: 'Space Grotesk' },
	tokens: {
		colors: {
			background: { light: '#ffffff', dark: '#0a0a0a' },
			foreground: { light: '#0a0a0a', dark: '#f5f5f5' },
			muted: { light: '#f4f4f4', dark: '#161616' },
			'muted-foreground': { light: '#5c5c5c', dark: '#a3a3a3' },
			primary: { light: '#0a0a0a', dark: '#f5f5f5' },
			'primary-foreground': { light: '#ffffff', dark: '#0a0a0a' },
			secondary: { light: '#ececec', dark: '#202020' },
			'secondary-foreground': { light: '#0a0a0a', dark: '#f5f5f5' },
			accent: { light: '#ff4d00', dark: '#ff6a2b' },
			'accent-foreground': { light: '#000000', dark: '#000000' },
			card: { light: '#ffffff', dark: '#111111' },
			'card-foreground': { light: '#0a0a0a', dark: '#f5f5f5' },
			border: { light: '#e2e2e2', dark: '#2a2a2a' },
			ring: { light: '#ff4d00', dark: '#ff6a2b' },
			success: { light: '#157a3c', dark: '#5fd38d' },
			warning: { light: '#a85a00', dark: '#f5b84d' },
			danger: { light: '#c0282d', dark: '#ff7b7f' },
		},
		fonts: {
			heading: { family: 'Space Grotesk', weights: [500, 600, 700] },
			body: { family: 'IBM Plex Sans', weights: [400, 500, 600] },
			mono: { family: 'IBM Plex Mono', weights: [400] },
		},
		radius: { none: '0px', sm: '0px', md: '0px', lg: '0px', xl: '0px', full: '9999px' },
		shadow: { none: 'none', sm: 'none', md: 'none', lg: '0 0 0 1px rgb(0 0 0 / 0.08)' },
		space: studio.tokens.space,
		container: 1280,
		button: { radius: 'none', weight: 500, uppercase: true },
	},
};
