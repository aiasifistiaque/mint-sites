import type { BlockProps } from '../types';
import { cx, oneOf } from '../util';

const TAGS = ['section', 'div', 'header', 'footer', 'main', 'aside'] as const;
const WIDTH = {
	narrow: 'max-w-3xl px-4 md:px-6',
	container: 'max-w-(--mint-container) px-4 md:px-6',
	wide: 'max-w-[calc(var(--mint-container)+16rem)] px-4 md:px-6',
	full: 'max-w-none',
};
const PAD_Y = { none: '', sm: 'py-8', md: 'py-16 md:py-20', lg: 'py-20 md:py-28', xl: 'py-28 md:py-40' };

export default function Section({ props, attrs, children }: BlockProps) {
	const Tag = oneOf(props.tag, TAGS, 'section');
	const width = oneOf(props.width, Object.keys(WIDTH) as (keyof typeof WIDTH)[], 'container');
	const pad = oneOf(props.paddingY, Object.keys(PAD_Y) as (keyof typeof PAD_Y)[], 'md');
	return (
		<Tag {...attrs} className='relative w-full'>
			<div className={cx('mx-auto w-full', WIDTH[width], PAD_Y[pad])}>{children}</div>
		</Tag>
	);
}
