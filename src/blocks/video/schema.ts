import type { BlockDef } from '@/types';
import { opts } from '../util';

export const def: BlockDef = {
	type: 'video',
	label: 'Video',
	category: 'media',
	icon: 'play-circle',
	description: 'A YouTube or Vimeo video, or a video file from your media library.',
	aiHint: 'url: a YouTube / Vimeo link or an .mp4/.webm file URL. Files can autoplay muted on a loop (background-style).',
	props: [
		{ key: 'url', label: 'Video link or file', kind: 'video', bindable: true },
		{ key: 'title', label: 'Title', kind: 'text', default: 'Video', help: 'Read out by screen readers.' },
		{ key: 'ratio', label: 'Shape', kind: 'select', options: opts([['16/9', '16:9'], ['4/3', '4:3'], ['1/1', 'Square'], ['9/16', 'Vertical']]), default: '16/9' },
		{ key: 'autoplay', label: 'Autoplay muted, loop (files only)', kind: 'boolean', default: false },
		{ key: 'rounded', label: 'Rounded corners', kind: 'boolean', default: true },
	],
	style: ['spacing', 'size', 'border', 'effects'],
	defaults: { props: { url: '', title: 'Video', ratio: '16/9', rounded: true } },
};
