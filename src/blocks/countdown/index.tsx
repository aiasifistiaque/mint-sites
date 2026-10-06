import type { BlockProps } from '../types';
import { cx, EditHint, str } from '../util';

const UNITS: [string, number][] = [
	['days', 86400],
	['hours', 3600],
	['minutes', 60],
	['seconds', 1],
];

/** Seconds left split into days / hours / minutes / seconds. */
export const split = (s: number) => {
	let left = Math.max(0, Math.floor(s));
	return UNITS.map(([unit, n]) => {
		const v = Math.floor(left / n);
		left -= v * n;
		return [unit, v] as const;
	});
};

// Drawn on the server with the time left when the page was made; the
// countdown script (src/render/interactive.ts) keeps it ticking.
export default function Countdown({ props, attrs, ctx }: BlockProps) {
	const to = Date.parse(str(props.to));
	if (Number.isNaN(to)) return <EditHint ctx={ctx} attrs={attrs}>Set the date it counts down to</EditHint>;
	const left = (to - Date.now()) / 1000;
	const units = split(left).filter(([u]) => props.seconds !== false || u !== 'seconds');
	const lg = props.size === 'lg';
	return (
		<div {...attrs} data-mint-countdown={new Date(to).toISOString()} className='flex flex-col gap-2'>
			<div suppressHydrationWarning className={cx('flex flex-wrap gap-3', left <= 0 && 'hidden')} data-mint-cd-units='' role='timer' aria-label={`Until ${new Date(to).toUTCString()}`}>
				{units.map(([unit, v]) => (
					<div
						key={unit}
						className={cx('flex min-w-16 flex-col items-center', props.boxed !== false && 'rounded-lg border border-border bg-card px-3 py-2 text-card-foreground', lg && 'min-w-20 md:min-w-24')}>
						<span suppressHydrationWarning data-mint-cd={unit} className={cx('font-heading font-semibold tabular-nums', lg ? 'text-4xl md:text-5xl' : 'text-3xl')}>
							{String(v).padStart(2, '0')}
						</span>
						<span className='text-xs text-muted-foreground'>{unit}</span>
					</div>
				))}
			</div>
			<p suppressHydrationWarning data-mint-cd-ended='' className={cx('font-heading text-2xl font-semibold', left > 0 && 'hidden')}>
				{str(props.endedText)}
			</p>
		</div>
	);
}
