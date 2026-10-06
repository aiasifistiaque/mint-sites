import type { BlockProps } from '../types';
import { cx, str } from '../util';

const BY_LEVEL: Record<number, string> = {
	1: 'text-4xl md:text-5xl lg:text-6xl',
	2: 'text-3xl md:text-4xl',
	3: 'text-xl md:text-2xl',
	4: 'text-lg md:text-xl',
};
const SIZE: Record<string, string> = {
	sm: 'text-lg',
	md: 'text-2xl',
	lg: 'text-3xl md:text-4xl',
	xl: 'text-4xl md:text-5xl',
	'2xl': 'text-5xl md:text-6xl lg:text-7xl',
};

export default function Heading({ props, attrs, ctx }: BlockProps) {
	const level = [1, 2, 3, 4].includes(props.level) ? (props.level as 1 | 2 | 3 | 4) : 2;
	const Tag = `h${level}` as const;
	return (
		<Tag
			{...attrs}
			{...(ctx.mode === 'edit' && { 'data-mint-text': 'text' })}
			className={cx('font-heading text-balance font-semibold tracking-tight', SIZE[props.size] ?? BY_LEVEL[level])}>
			{str(props.text)}
		</Tag>
	);
}
