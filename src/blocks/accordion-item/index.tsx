import { SvgIcon } from '../icon';
import type { BlockProps } from '../types';
import { str } from '../util';

// <details>: opens and closes with no script; `name` makes the accordion's
// rows close each other (one open at a time).
export default function AccordionItem({ props, attrs, children, ctx }: BlockProps) {
	const edit = ctx.mode === 'edit';
	return (
		<details suppressHydrationWarning {...attrs} {...(ctx.group && !edit && { name: ctx.group })} open={edit || !!props.open} className='group mint-accordion-item border-b border-border'>
			<summary className='flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium [&::-webkit-details-marker]:hidden'>
				<span {...(edit && { 'data-mint-text': 'title' })}>{str(props.title)}</span>
				<span aria-hidden className='shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none'>
					<SvgIcon name='caret-down' size={18} />
				</span>
			</summary>
			<div className='flex flex-col gap-3 pb-5'>{children}</div>
		</details>
	);
}
