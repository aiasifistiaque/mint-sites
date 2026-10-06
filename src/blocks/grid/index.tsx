import type { BlockProps } from '../types';
import { GAP } from '../stack';
import { cx } from '../util';

const BASE: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2' };
const MD: Record<number, string> = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };
const LG: Record<number, string> = {
	1: 'lg:grid-cols-1',
	2: 'lg:grid-cols-2',
	3: 'lg:grid-cols-3',
	4: 'lg:grid-cols-4',
	5: 'lg:grid-cols-5',
	6: 'lg:grid-cols-6',
};

export default function Grid({ props, attrs, children }: BlockProps) {
	return (
		<div
			{...attrs}
			className={cx(
				'grid',
				BASE[props.columnsMobile] ?? 'grid-cols-1',
				MD[props.columnsTablet] ?? 'md:grid-cols-2',
				LG[props.columns] ?? 'lg:grid-cols-3',
				GAP[props.gap] ?? 'gap-6'
			)}>
			{children}
		</div>
	);
}
