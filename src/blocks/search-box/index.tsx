import { SvgIcon } from '../icon';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

/** Only a page on the site or a web address. */
export const safePath = (u: string) => (/^(\/(?!\/)|https?:\/\/)/i.test(u.trim()) ? u.trim() : '');

// Live: the place mint.js mounts the Search widget in. In the editor (no mint.js there): what it will look like.
export default function SearchBox({ props, attrs, ctx }: BlockProps) {
	const layout = props.layout === 'box' ? 'box' : 'icon';
	const results = safePath(str(props.resultsUrl));
	if (ctx.mode === 'edit')
		return layout === 'box' ? (
			<div {...attrs} className='flex h-11 w-full max-w-md items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground'>
				<SvgIcon name='magnifying-glass' size={16} />
				Search the store
			</div>
		) : (
			<span {...attrs} className='inline-flex size-10 items-center justify-center rounded-md border border-border' aria-label='Search'>
				<SvgIcon name='magnifying-glass' size={18} />
			</span>
		);
	return <div {...attrs} className={cx(layout === 'icon' ? 'inline-block' : 'w-full max-w-md')} data-mint='search' data-layout={layout} {...(results && { 'data-results-url': results })} />;
}
