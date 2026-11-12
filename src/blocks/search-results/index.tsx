import type { BlockProps } from '../types';
import { str } from '../util';
import { safePath } from '../search-box';

// Live: the Search widget's results layout (mint.js draws it). In the editor: a sketch of it.
export default function SearchResults({ props, attrs, ctx }: BlockProps) {
	const product = str(props.productUrl).trim();
	const filters = props.showFilters === 'true' || props.showFilters === 'false' ? props.showFilters : null;
	if (ctx.mode === 'edit')
		return (
			<div {...attrs} className='w-full'>
				<p className='mb-1 text-xl font-semibold'>Results for “…”</p>
				<p className='mb-4 text-sm text-muted-foreground'>The store’s search results show here, for the words in the address (?q=).</p>
				<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
					{[0, 1, 2, 3].map(i => (
						<div key={i}>
							<div className='aspect-square rounded-md border border-dashed border-border bg-muted' />
							<div className='mt-2 h-3 w-3/4 rounded bg-muted' />
							<div className='mt-1 h-3 w-1/3 rounded bg-muted' />
						</div>
					))}
				</div>
			</div>
		);
	return (
		<div
			{...attrs}
			className='w-full'
			data-mint='search'
			data-layout='results'
			{...(filters && { 'data-show-filters': filters })}
			{...(product && (safePath(product) || product.startsWith('#')) && { 'data-product-url': product })}
		/>
	);
}
