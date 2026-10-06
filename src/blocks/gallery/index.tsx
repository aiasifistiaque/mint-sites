import { isSafeMediaUrl } from '@/render/styleSchema';
import { SvgIcon } from '../icon';
import { parsePlaceholder } from '../image';
import type { BlockProps } from '../types';
import { cx, EditHint, str } from '../util';

const COLS: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-3 lg:grid-cols-4', 5: 'md:grid-cols-3 lg:grid-cols-5' };
const GAP: Record<number, string> = { 2: 'gap-2', 4: 'gap-4', 6: 'gap-6' };

type Item = { src: string; alt: string; caption: string };

// The grid is plain HTML. With "open big" on, each picture is a button and
// the gallery script (src/render/interactive.ts) shows it in a <dialog>
// with previous / next — Esc and the browser's focus handling for free.
export default function Gallery({ node, props, attrs, ctx }: BlockProps) {
	const items: Item[] = (Array.isArray(props.items) ? props.items : [])
		.map((r: any) => ({ src: str(r?.src), alt: str(r?.alt), caption: str(r?.caption) }))
		.filter((r: Item) => parsePlaceholder(r.src) || isSafeMediaUrl(r.src))
		.slice(0, 50);
	if (!items.length) return <EditHint ctx={ctx} attrs={attrs}>Add pictures to the gallery</EditHint>;
	const ratio = { aspectRatio: ['1/1', '4/3', '3/4', '16/9'].includes(props.ratio) ? props.ratio.replace('/', ' / ') : '1 / 1' };
	const box = props.lightbox !== false && ctx.mode === 'live';
	const lb = `lb-${node.id}`;
	return (
		<div {...attrs} data-mint-gallery={box ? lb : undefined}>
			<ul className={cx('grid grid-cols-2', COLS[props.columns] ?? COLS[3], GAP[props.gap] ?? 'gap-4')}>
				{items.map((it, i) => {
					const ph = parsePlaceholder(it.src);
					const pic = ph ? (
						<div role='img' aria-label={it.alt || ph.label} className='flex h-full w-full items-center justify-center bg-foreground/8 text-sm text-muted-foreground'>
							{ph.label}
						</div>
					) : (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={it.src} alt={it.alt} loading='lazy' decoding='async' className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transform-none' />
					);
					return (
						<li key={i} className='flex flex-col gap-2'>
							{box && !ph ? (
								<button
									type='button'
									data-mint-lb-src={it.src}
									data-mint-lb-alt={it.alt}
									aria-label={`Open ${it.alt || `picture ${i + 1}`}`}
									className='group block w-full cursor-zoom-in overflow-hidden rounded-md'
									style={ratio}>
									{pic}
								</button>
							) : (
								<div className='overflow-hidden rounded-md' style={ratio}>
									{pic}
								</div>
							)}
							{it.caption && <span className='text-sm text-muted-foreground'>{it.caption}</span>}
						</li>
					);
				})}
			</ul>
			{box && (
				<dialog id={lb} aria-label='Picture' className='mint-overlay mint-lightbox'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img suppressHydrationWarning alt='' className='max-h-[85dvh] max-w-full object-contain' />
					<div className='flex items-center justify-between gap-2 p-3 text-sm'>
						<span suppressHydrationWarning data-mint-lb-caption='' className='text-muted-foreground' />
						<div className='flex gap-2'>
							{(['prev', 'next', 'close'] as const).map(b => (
								<button
									key={b}
									type='button'
									data-mint-lb={b}
									aria-label={b === 'prev' ? 'Previous' : b === 'next' ? 'Next' : 'Close'}
									className='inline-flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-muted'>
									<SvgIcon name={b === 'prev' ? 'arrow-left' : b === 'next' ? 'arrow-right' : 'x'} size={18} />
								</button>
							))}
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}
