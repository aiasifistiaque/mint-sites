import type { BlockProps } from '../types';
import { str } from '../util';
import { ICONS } from './icons';

export function SvgIcon({ name, size = 24, label, attrs }: { name: string; size?: number; label?: string; attrs?: object }) {
	const body = ICONS[name];
	if (!body) return null;
	return (
		<svg
			{...attrs}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 256 256'
			width={size}
			height={size}
			fill='currentColor'
			className='inline-block shrink-0'
			{...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
			dangerouslySetInnerHTML={{ __html: body }}
		/>
	);
}

export default function Icon({ props, attrs, action }: BlockProps) {
	const size = [16, 24, 32, 48].includes(props.size) ? props.size : 24;
	const svg = <SvgIcon name={str(props.name)} size={size} label={str(props.label) || undefined} attrs={action ? undefined : attrs} />;
	if (action?.href)
		return (
			<a {...attrs} {...action} className='inline-flex'>
				{svg}
			</a>
		);
	if (action)
		return (
			<button {...attrs} {...action} type='button' className='inline-flex cursor-pointer'>
				{svg}
			</button>
		);
	return svg;
}
