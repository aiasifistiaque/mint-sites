import { GAP } from '../stack';
import type { BlockProps } from '../types';
import { cx } from '../util';

const LOOK: Record<string, string> = {
	outline: 'border border-border bg-card text-card-foreground',
	elevated: 'bg-card text-card-foreground shadow-md',
	filled: 'bg-muted text-foreground',
	plain: '',
};
const PAD: Record<string, string> = { none: 'mint-card-pad-none', sm: 'mint-card-pad-sm', md: 'mint-card-pad-md', lg: 'mint-card-pad-lg' };

// A first image child goes edge to edge (.mint-card in globals.css).
export default function Card({ props, attrs, action, children }: BlockProps) {
	const className = cx(
		'mint-card flex h-full flex-col overflow-hidden rounded-lg',
		LOOK[props.variant] ?? LOOK.outline,
		PAD[props.padding] ?? PAD.md,
		GAP[props.gap] ?? 'gap-3',
		props.align === 'center' && 'items-center text-center',
		(props.lift || action) && 'transition duration-200 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none',
		props.variant === 'plain' && 'rounded-none'
	);
	if (action?.href)
		return (
			<a {...attrs} {...action} className={cx(className, 'text-inherit no-underline')}>
				{children}
			</a>
		);
	if (action)
		return (
			<button {...attrs} {...action} type='button' className={cx(className, 'cursor-pointer text-left')}>
				{children}
			</button>
		);
	return (
		<div {...attrs} className={className}>
			{children}
		</div>
	);
}
