import type { BlockProps } from '../types';
import { cx, oneOf } from '../util';

const SIZE = {
	sm: 'max-w-2xl',
	md: 'max-w-3xl',
	lg: 'max-w-5xl',
	xl: 'max-w-7xl',
	container: 'max-w-(--mint-container)',
	full: 'max-w-none',
};

export default function Container({ props, attrs, children }: BlockProps) {
	const size = oneOf(props.size, Object.keys(SIZE) as (keyof typeof SIZE)[], 'container');
	return (
		<div {...attrs} className={cx('mx-auto w-full', SIZE[size])}>
			{children}
		</div>
	);
}
