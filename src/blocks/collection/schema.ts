import type { BlockDef } from '@/types';
import { opts, SPACE_OPTIONS } from '../util';

export const def: BlockDef = {
	type: 'collection',
	label: 'List of records',
	category: 'data',
	icon: 'database',
	description: 'Shows records from one of the project’s models — services, team, products, posts — drawn with the blocks inside it, once per record.',
	aiHint:
		'For anything that repeats and grows (services, team, products, posts, testimonials): props.source = { model: "<route>", sort: "-createdAt", pageSize: 12, filter: { featured: true } } names a model whose public API has list. Its children are the item template, drawn once per record; inside it bind props to the record with bind: { text: { from: "item", field: "title" } } or write "{{item.title}}" in text. slots.empty shows when there are no records.',
	props: [
		{ key: 'source', label: 'Records', kind: 'source', help: 'The model, its order, how many and which ones.' },
		{ key: 'layout', label: 'Layout', kind: 'select', options: opts([['grid', 'Grid'], ['list', 'List']]), default: 'grid' },
		{ key: 'columns', label: 'Columns (desktop)', kind: 'select', options: opts([1, 2, 3, 4, 5, 6]), default: 3 },
		{ key: 'columnsTablet', label: 'Columns (tablet)', kind: 'select', options: opts([1, 2, 3, 4]), default: 2 },
		{ key: 'columnsMobile', label: 'Columns (phone)', kind: 'select', options: opts([1, 2]), default: 1 },
		{ key: 'gap', label: 'Gap', kind: 'select', options: SPACE_OPTIONS, default: 6 },
		{ key: 'pagination', label: 'Show pages', kind: 'boolean', default: false, help: 'Previous / next links when there are more records than fit.' },
	],
	slots: { children: {}, empty: { label: 'When there are none' } },
	style: 'all',
	defaults: {
		props: { source: { model: '', sort: '-createdAt', pageSize: 12 }, layout: 'grid', columns: 3, columnsTablet: 2, columnsMobile: 1, gap: 6, pagination: false },
		children: [
			{
				id: 'colcard1',
				type: 'card',
				props: {},
				children: [
					{ id: 'colhead1', type: 'heading', props: { text: '{{item.title}}', level: 3 } },
					{ id: 'coltext1', type: 'text', props: { html: '<p>{{item.description}}</p>' } },
				],
			},
		],
	},
};
