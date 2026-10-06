import { SvgIcon } from '../icon';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

// Soft = a tint of the colour behind text in the page's own text colour (always readable).
const SOFT: Record<string, string> = {
	primary: 'bg-primary/12 text-foreground ring-primary/30',
	accent: 'bg-accent text-accent-foreground ring-transparent',
	muted: 'bg-muted text-muted-foreground ring-border',
	success: 'bg-success/12 text-foreground ring-success/30',
	warning: 'bg-warning/15 text-foreground ring-warning/35',
	danger: 'bg-danger/12 text-foreground ring-danger/30',
};
const SOLID: Record<string, string> = {
	primary: 'bg-primary text-primary-foreground',
	accent: 'bg-accent text-accent-foreground',
	muted: 'bg-foreground text-background',
	success: 'bg-success text-background',
	warning: 'bg-warning text-background',
	danger: 'bg-danger text-background',
};
const OUTLINE: Record<string, string> = {
	primary: 'ring-primary text-primary',
	accent: 'ring-accent text-foreground',
	muted: 'ring-border text-muted-foreground',
	success: 'ring-success text-success',
	warning: 'ring-warning text-foreground',
	danger: 'ring-danger text-danger',
};

export default function Badge({ props, attrs, ctx }: BlockProps) {
	const tone = props.tone in SOFT ? props.tone : 'primary';
	const look = props.variant === 'solid' ? SOLID[tone] : props.variant === 'outline' ? cx('ring-1 ring-inset', OUTLINE[tone]) : cx('ring-1 ring-inset', SOFT[tone]);
	return (
		<span {...attrs} className={cx('inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', look)}>
			{props.icon && <SvgIcon name={str(props.icon)} size={14} />}
			<span {...(ctx.mode === 'edit' && { 'data-mint-text': 'text' })}>{str(props.text)}</span>
		</span>
	);
}
