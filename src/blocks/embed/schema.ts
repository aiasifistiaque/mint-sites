import type { BlockDef } from '@/types';
import { opts } from '../util';

/** The only hosts an embed may load (the manifest's `embeds`). */
export const EMBED_HOSTS = ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com', 'www.google.com/maps/embed', 'maps.google.com'];

export const def: BlockDef = {
	type: 'embed',
	label: 'Embed',
	category: 'media',
	icon: 'code',
	description: 'Shows a map or player from an allowed site (Google Maps, YouTube, Vimeo) by its embed link.',
	aiHint: 'Only for embed URLs from manifest.embeds (e.g. a Google Maps "Embed a map" link). No other sites or custom HTML.',
	props: [
		{ key: 'url', label: 'Embed link', kind: 'text', help: 'The src of the embed code — Google Maps → Share → Embed a map.' },
		{ key: 'title', label: 'Title', kind: 'text', default: 'Embedded content' },
		{ key: 'height', label: 'Height', kind: 'select', options: opts([[240, 'Small'], [360, 'Medium'], [480, 'Large'], [640, 'Extra large']]), default: 360 },
	],
	style: ['spacing', 'size', 'border', 'effects'],
	defaults: { props: { url: '', title: 'Embedded content', height: 360 } },
};
