import type { BlockProps } from '../types';
import { cx } from '../util';

const LINE: Record<string, string> = { solid: 'border-solid', dashed: 'border-dashed', dotted: 'border-dotted' };

export default function Divider({ props, attrs }: BlockProps) {
	return (
		<hr
			{...attrs}
			className={cx('w-full border-0 border-border', props.thickness === 2 ? 'border-t-2' : 'border-t', LINE[props.lineStyle] ?? 'border-solid')}
		/>
	);
}
