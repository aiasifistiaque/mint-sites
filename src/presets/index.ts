// Presets: saved trees of blocks (D11) — sections people insert and then edit
// freely. Ids here are fixed; the editor and the backend give inserted copies
// fresh ones. The catalogue grows in SB-08; the backend seeds a new site's
// home page with `header-simple` + `hero-centered` + `footer-simple` (SB-03).
import type { Preset } from '@/types';

const headerSimple: Preset = {
	key: 'header-simple',
	label: 'Header — name, links and a button',
	category: 'header',
	thumbnail: '',
	tree: [
		{
			id: 'hdS0sect',
			type: 'section',
			name: 'Header',
			props: { tag: 'header', width: 'container', paddingY: 'none' },
			style: { base: { paddingTop: 4, paddingBottom: 4, borderColor: 'border' } },
			children: [
				{
					id: 'hdS0row1',
					type: 'stack',
					props: { direction: 'row', gap: 6, align: 'center', justify: 'between', stackOnMobile: false },
					children: [
						{
							id: 'hdS0name',
							type: 'link',
							name: 'Site name',
							props: { text: 'Your business', tone: 'foreground', underline: 'none' },
							style: { base: { fontSize: 'lg', fontWeight: 600 } },
							action: { type: 'link', href: '/' },
						},
						{
							id: 'hdS0nav1',
							type: 'stack',
							name: 'Menu',
							props: { direction: 'row', gap: 6, align: 'center', stackOnMobile: false },
							hidden: { base: true, md: false },
							children: [
								{ id: 'hdS0lnk1', type: 'link', props: { text: 'About', tone: 'muted' }, action: { type: 'link', href: '/about' } },
								{ id: 'hdS0lnk2', type: 'link', props: { text: 'Services', tone: 'muted' }, action: { type: 'link', href: '/services' } },
								{ id: 'hdS0lnk3', type: 'link', props: { text: 'Contact', tone: 'muted' }, action: { type: 'link', href: '/contact' } },
							],
						},
						{
							id: 'hdS0btn1',
							type: 'button',
							props: { label: 'Get in touch', variant: 'primary', size: 'sm' },
							action: { type: 'link', href: '/contact' },
						},
					],
				},
			],
		},
	],
};

const heroCentered: Preset = {
	key: 'hero-centered',
	label: 'Hero — centred title, text and two buttons',
	category: 'hero',
	thumbnail: '',
	tree: [
		{
			id: 'hrC0sect',
			type: 'section',
			name: 'Hero',
			props: { width: 'narrow', paddingY: 'xl' },
			children: [
				{
					id: 'hrC0stck',
					type: 'stack',
					props: { direction: 'column', gap: 6, align: 'center' },
					style: { base: { textAlign: 'center' } },
					children: [
						{
							id: 'hrC0badg',
							type: 'text',
							name: 'Eyebrow',
							props: { html: '<p>Welcome</p>', size: 'sm' },
							style: { base: { color: 'primary', fontWeight: 600, tracking: 'wide', transform: 'uppercase' } },
						},
						{ id: 'hrC0head', type: 'heading', props: { text: 'A clear promise in a few words', level: 1 } },
						{
							id: 'hrC0text',
							type: 'text',
							props: {
								html: '<p>One or two sentences on what you do, who it is for and why it is worth their time.</p>',
								size: 'xl',
								muted: true,
							},
						},
						{
							id: 'hrC0btns',
							type: 'stack',
							props: { direction: 'row', gap: 3, justify: 'center', align: 'center' },
							children: [
								{ id: 'hrC0btn1', type: 'button', props: { label: 'Get started', variant: 'primary', size: 'lg' }, action: { type: 'link', href: '/contact' } },
								{ id: 'hrC0btn2', type: 'button', props: { label: 'Learn more', variant: 'outline', size: 'lg' }, action: { type: 'link', href: '/about' } },
							],
						},
					],
				},
			],
		},
	],
};

const footerSimple: Preset = {
	key: 'footer-simple',
	label: 'Footer — name, links and copyright',
	category: 'footer',
	thumbnail: '',
	tree: [
		{
			id: 'ftS0sect',
			type: 'section',
			name: 'Footer',
			props: { tag: 'footer', width: 'container', paddingY: 'md' },
			style: { base: { bgColor: 'muted' } },
			children: [
				{
					id: 'ftS0stck',
					type: 'stack',
					props: { direction: 'column', gap: 8 },
					children: [
						{
							id: 'ftS0row1',
							type: 'stack',
							props: { direction: 'row', gap: 6, justify: 'between', align: 'center' },
							children: [
								{ id: 'ftS0name', type: 'heading', name: 'Site name', props: { text: 'Your business', level: 2, size: 'sm' } },
								{
									id: 'ftS0nav1',
									type: 'stack',
									name: 'Links',
									props: { direction: 'row', gap: 6, wrap: true, stackOnMobile: false },
									children: [
										{ id: 'ftS0lnk1', type: 'link', props: { text: 'About', tone: 'muted' }, action: { type: 'link', href: '/about' } },
										{ id: 'ftS0lnk2', type: 'link', props: { text: 'Contact', tone: 'muted' }, action: { type: 'link', href: '/contact' } },
										{ id: 'ftS0lnk3', type: 'link', props: { text: 'Privacy', tone: 'muted' }, action: { type: 'link', href: '/privacy' } },
									],
								},
							],
						},
						{ id: 'ftS0line', type: 'divider', props: { thickness: 1 } },
						{
							id: 'ftS0copy',
							type: 'text',
							name: 'Copyright',
							props: { html: '<p>© Your business. All rights reserved.</p>', size: 'sm', muted: true },
						},
					],
				},
			],
		},
	],
};

export const PRESETS: Preset[] = [headerSimple, heroCentered, footerSimple];
