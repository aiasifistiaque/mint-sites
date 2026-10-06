import { anchorId } from '@/render/actions';
import type { BlockProps } from '../types';
import { cx, str } from '../util';
import { CloseButton } from './Close';

const SIZE: Record<string, string> = { sm: 'w-[24rem]', md: 'w-[32rem]', lg: 'w-[48rem]' };

// A native <dialog>: showModal() (src/render/overlays.ts) gives the scrim, Esc,
// aria-modal and a focus trap without any React on the page.
export default function Modal({ node, props, attrs, children }: BlockProps) {
	return (
		<dialog
			{...attrs}
			id={anchorId(node.id)}
			data-mint-overlay='modal'
			aria-label={str(props.title) || 'Pop-up'}
			className={cx('mint-overlay mint-modal', SIZE[props.size] ?? SIZE.md)}>
			{props.closeButton !== false && <CloseButton target={attrs['data-n']} />}
			<div className='mint-overlay-body flex flex-col gap-4 p-6 md:p-8'>{children}</div>
		</dialog>
	);
}
