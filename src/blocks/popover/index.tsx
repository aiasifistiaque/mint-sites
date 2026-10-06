import { anchorId } from '@/render/actions';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

const SIZE: Record<string, string> = { sm: 'w-[16rem]', md: 'w-[22rem]' };

// The HTML popover attribute: light dismiss and Esc for free; overlays.ts puts it under its trigger.
export default function Popover({ node, props, attrs, children }: BlockProps) {
	return (
		<div
			{...attrs}
			id={anchorId(node.id)}
			popover='auto'
			data-mint-overlay='popover'
			role='dialog'
			aria-label={str(props.title) || 'Popover'}
			className={cx('mint-overlay mint-popover', SIZE[props.size] ?? SIZE.sm)}>
			<div className='mint-overlay-body flex flex-col gap-3 p-4'>{children}</div>
		</div>
	);
}
