import { anchorId } from '@/render/actions';
import { CloseButton } from '../modal/Close';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

const SIZE: Record<string, string> = { sm: 'w-[22rem]', md: 'w-[28rem]', lg: 'w-[36rem]' };

export default function Drawer({ node, props, attrs, children }: BlockProps) {
	return (
		<dialog
			{...attrs}
			id={anchorId(node.id)}
			data-mint-overlay='drawer'
			data-side={props.side === 'left' ? 'left' : 'right'}
			aria-label={str(props.title) || 'Drawer'}
			className={cx('mint-overlay mint-drawer', SIZE[props.size] ?? SIZE.sm)}>
			{props.closeButton !== false && <CloseButton target={attrs['data-n']} />}
			<div className='mint-overlay-body flex min-h-full flex-col gap-4 p-6'>{children}</div>
		</dialog>
	);
}
