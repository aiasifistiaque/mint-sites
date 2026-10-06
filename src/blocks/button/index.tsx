import { SvgIcon } from '../icon';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

const VARIANT: Record<string, string> = {
	primary: 'bg-primary text-primary-foreground hover:opacity-90',
	secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
	outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
	ghost: 'bg-transparent text-foreground hover:bg-muted',
	link: 'h-auto! bg-transparent px-0! text-primary underline-offset-4 hover:underline',
};
const SIZE: Record<string, string> = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-5 text-sm', lg: 'h-12 px-7 text-base' };

export default function Button({ props, attrs, action, ctx }: BlockProps) {
	const icon = props.icon ? <SvgIcon name={props.icon} size={props.size === 'lg' ? 20 : 16} /> : null;
	const className = cx(
		'mint-btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition',
		VARIANT[props.variant] ?? VARIANT.primary,
		SIZE[props.size] ?? SIZE.md,
		props.fullWidth && 'w-full'
	);
	const content = (
		<>
			{props.iconPosition === 'start' && icon}
			<span {...(ctx.mode === 'edit' && { 'data-mint-text': 'label' })}>{str(props.label)}</span>
			{props.iconPosition !== 'start' && icon}
		</>
	);
	if (action?.href)
		return (
			<a {...attrs} {...action} className={className}>
				{content}
			</a>
		);
	return (
		<button {...attrs} {...action} type='button' className={className}>
			{content}
		</button>
	);
}
