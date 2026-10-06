import type { BlockProps } from '../types';
import { cx, str } from '../util';

const TONE: Record<string, string> = {
	foreground: 'text-foreground',
	primary: 'text-primary',
	muted: 'text-muted-foreground hover:text-foreground',
};
const UNDERLINE: Record<string, string> = { hover: 'hover:underline', always: 'underline', none: 'no-underline' };

export default function Link({ props, attrs, action }: BlockProps) {
	const className = cx('underline-offset-4 transition-colors', TONE[props.tone] ?? TONE.foreground, UNDERLINE[props.underline] ?? UNDERLINE.hover);
	if (action?.href)
		return (
			<a {...attrs} {...action} className={className}>
				{str(props.text)}
			</a>
		);
	if (action)
		return (
			<button {...attrs} {...action} type='button' className={cx(className, 'cursor-pointer')}>
				{str(props.text)}
			</button>
		);
	return (
		<span {...attrs} className={className}>
			{str(props.text)}
		</span>
	);
}
