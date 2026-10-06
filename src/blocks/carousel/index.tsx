import { SvgIcon } from '../icon';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

const PER: Record<number, string> = { 1: '1', 2: '2', 3: '3', 4: '4' };
const GAP: Record<number, string> = { 2: '0.5rem', 4: '1rem', 6: '1.5rem' };

// CSS scroll-snap does the sliding (touch, trackpad, keyboard); the arrows
// are shown and wired by the carousel script (src/render/interactive.ts).
export default function Carousel({ props, attrs, children, ctx }: BlockProps) {
	const style = {
		'--per': PER[props.perView] ?? '3',
		'--per-md': PER[props.perViewTablet] ?? '2',
		'--gap': GAP[props.gap] ?? '1rem',
	} as React.CSSProperties;
	const arrow = (dir: 'prev' | 'next') => (
		<button
			type='button'
			data-mint-carousel-btn={dir}
			suppressHydrationWarning
			hidden={ctx.mode === 'live'}
			aria-label={dir === 'prev' ? 'Previous' : 'Next'}
			className='inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-muted disabled:cursor-default disabled:opacity-40'>
			<SvgIcon name={dir === 'prev' ? 'arrow-left' : 'arrow-right'} size={18} />
		</button>
	);
	return (
		<div {...attrs} data-mint-carousel='' role='region' aria-roledescription='carousel' aria-label={str(props.label) || 'Slides'} className='flex flex-col gap-4'>
			<div className='mint-carousel-track' style={style} tabIndex={0}>
				{children}
			</div>
			{props.arrows !== false && (
				<div className={cx('flex justify-end gap-2')}>
					{arrow('prev')}
					{arrow('next')}
				</div>
			)}
		</div>
	);
}
