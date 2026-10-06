import type { BlockDef } from '@/types';
import { opts } from '../util';

/** network → [label, icon]. The site's own links come from Website settings → Social. */
export const NETWORKS: Record<string, [string, string]> = {
	facebook: ['Facebook', 'facebook-logo'],
	instagram: ['Instagram', 'instagram-logo'],
	x: ['X', 'x-logo'],
	linkedin: ['LinkedIn', 'linkedin-logo'],
	youtube: ['YouTube', 'youtube-logo'],
	tiktok: ['TikTok', 'tiktok-logo'],
	pinterest: ['Pinterest', 'pinterest-logo'],
	whatsapp: ['WhatsApp', 'whatsapp-logo'],
	threads: ['Threads', 'threads-logo'],
	telegram: ['Telegram', 'telegram-logo'],
	github: ['GitHub', 'github-logo'],
	dribbble: ['Dribbble', 'dribbble-logo'],
	behance: ['Behance', 'behance-logo'],
	spotify: ['Spotify', 'spotify-logo'],
	discord: ['Discord', 'discord-logo'],
	email: ['Email', 'envelope-simple'],
};

export const def: BlockDef = {
	type: 'social-links',
	label: 'Social links',
	category: 'navigation',
	icon: 'share-network',
	description: 'Icons linking to your social profiles — from Website settings, or links you add here.',
	aiHint: 'source "site" uses the profiles in Website settings (preferred); "custom" uses items [{ network, url }].',
	props: [
		{ key: 'source', label: 'Links from', kind: 'select', options: opts([['site', 'Website settings'], ['custom', 'These links']]), default: 'site' },
		{
			key: 'items',
			label: 'Profiles',
			kind: 'list',
			help: 'Used when “Links from” is “These links”.',
			fields: [
				{ key: 'network', label: 'Network', kind: 'select', options: opts(Object.entries(NETWORKS).map(([k, [label]]) => [k, label])) },
				{ key: 'url', label: 'Address', kind: 'link' },
			],
			default: [],
		},
		{ key: 'variant', label: 'Look', kind: 'select', options: opts([['plain', 'Icons'], ['circle', 'Circles'], ['square', 'Squares']]), default: 'plain' },
		{ key: 'size', label: 'Size', kind: 'select', options: opts([[16, 'Small'], [20, 'Medium'], [24, 'Large']]), default: 20 },
	],
	style: ['spacing', 'type', 'effects'],
	defaults: { props: { source: 'site', variant: 'plain', size: 20 } },
};
