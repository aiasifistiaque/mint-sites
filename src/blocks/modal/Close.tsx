import { SvgIcon } from '../icon';

/** The × in a pop-up or drawer: a close action on the overlay itself (src/render/overlays.ts). */
export function CloseButton({ target }: { target: string | undefined }) {
	if (!target) return null;
	return (
		<button
			type='button'
			aria-label='Close'
			data-mint-action='close'
			data-mint-target={target}
			className='absolute top-3 right-3 z-10 inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground'>
			<SvgIcon name='x' size={18} />
		</button>
	);
}
