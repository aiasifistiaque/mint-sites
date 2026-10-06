import type { BlockProps } from '../types';

// The tab's content; the tabs block draws the titles and hides the others.
export default function Tab({ attrs, children }: BlockProps) {
	return (
		<div {...attrs} className='flex flex-col gap-4'>
			{children}
		</div>
	);
}
