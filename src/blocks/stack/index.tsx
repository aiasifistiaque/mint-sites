import type { BlockProps } from '../types';
import { cx, oneOf } from '../util';

export const GAP: Record<number, string> = {
	0: 'gap-0',
	1: 'gap-1',
	2: 'gap-2',
	3: 'gap-3',
	4: 'gap-4',
	6: 'gap-6',
	8: 'gap-8',
	12: 'gap-12',
	16: 'gap-16',
};
const ALIGN = { stretch: 'items-stretch', start: 'items-start', center: 'items-center', end: 'items-end' };
const JUSTIFY = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' };

export default function Stack({ props, attrs, children }: BlockProps) {
	const row = props.direction === 'row';
	const align = oneOf(props.align, Object.keys(ALIGN) as (keyof typeof ALIGN)[], 'stretch');
	const justify = oneOf(props.justify, Object.keys(JUSTIFY) as (keyof typeof JUSTIFY)[], 'start');
	return (
		<div
			{...attrs}
			className={cx(
				'flex',
				row ? (props.stackOnMobile === false ? 'flex-row' : 'flex-col md:flex-row') : 'flex-col',
				GAP[props.gap] ?? 'gap-4',
				ALIGN[align],
				JUSTIFY[justify],
				props.wrap && 'flex-wrap'
			)}>
			{children}
		</div>
	);
}
