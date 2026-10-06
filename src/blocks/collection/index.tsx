import type { BlockProps } from '../types';
import { GAP } from '../stack';
import { cx, EditHint } from '../util';

const BASE: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2' };
const MD: Record<number, string> = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };
const LG: Record<number, string> = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' };

/** ?page=n on the page the visitor is on (server rendered — no script). */
const pageHref = (path: string | undefined, page: number) => `${path || ''}${page > 1 ? `?page=${page}` : ''}` || '?';

/**
 * A list of records (SB-09): its children are the item template, drawn once
 * per record of the model its `source` names, with `item` in scope for
 * bindings and {{item.…}}. The backend reads the records through the public
 * API's rules (library/siteBuilder/resolve.ts). In the editor, a list with no
 * records still shows its template once so it can be designed.
 */
export default function Collection({ node, props, attrs, slots, ctx, renderSlot }: BlockProps) {
	const data = ctx.collections?.[node.id];
	const items = data?.items || [];
	const edit = ctx.mode === 'edit';
	if (ctx.inCollection) return <EditHint ctx={ctx} attrs={attrs}>A list inside another list’s items shows nothing</EditHint>;

	const layout =
		props.layout === 'list'
			? cx('flex flex-col', GAP[props.gap] ?? 'gap-6')
			: cx('grid', BASE[props.columnsMobile] ?? 'grid-cols-1', MD[props.columnsTablet] ?? 'md:grid-cols-2', LG[props.columns] ?? 'lg:grid-cols-3', GAP[props.gap] ?? 'gap-6');
	const inner = { ...ctx, inCollection: node.id };

	if (!items.length) {
		const hasEmpty = !!node.slots?.empty?.length;
		if (!edit) return hasEmpty ? <div {...attrs}>{slots.empty}</div> : null;
		const why = !props.source?.model ? 'Pick the model this list shows (Records, on the right)' : data?.problem || 'No records yet — they show here when they’re added in the panel';
		return (
			<div {...attrs} className='flex flex-col gap-3'>
				<div className='rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground'>{why}</div>
				<div className={layout}>{renderSlot('children', { ...inner, scope: { ...ctx.scope, item: {} } })}</div>
				{hasEmpty && slots.empty}
			</div>
		);
	}

	const pages = props.pagination && data && data.totalPages > 1 ? data : null;
	return (
		<div {...attrs}>
			<div className={layout}>
				{items.map((item, i) => (
					<div key={typeof item._id === 'string' ? item._id : i} className='min-w-0 [&>*]:h-full'>
						{renderSlot('children', { ...inner, scope: { ...ctx.scope, item } })}
					</div>
				))}
			</div>
			{pages && (
				<nav aria-label='Pages' className='mt-8 flex items-center justify-center gap-4 text-sm'>
					{pages.page > 1 ? (
						<a href={pageHref(ctx.path, pages.page - 1)} rel='prev' className='rounded-md border border-border px-3 py-1.5 hover:bg-muted'>
							Previous
						</a>
					) : (
						<span className='px-3 py-1.5 text-muted-foreground'>Previous</span>
					)}
					<span className='text-muted-foreground'>
						Page {pages.page} of {pages.totalPages}
					</span>
					{pages.page < pages.totalPages ? (
						<a href={pageHref(ctx.path, pages.page + 1)} rel='next' className='rounded-md border border-border px-3 py-1.5 hover:bg-muted'>
							Next
						</a>
					) : (
						<span className='px-3 py-1.5 text-muted-foreground'>Next</span>
					)}
				</nav>
			)}
		</div>
	);
}
