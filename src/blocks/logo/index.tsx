import { isSafeMediaUrl } from '@/render/styleSchema';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

const IMG: Record<string, string> = { sm: 'h-6', md: 'h-8', lg: 'h-11' };
const TEXT: Record<string, string> = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };

/** The logo picture and the site name, as used by the logo and header blocks. */
export function LogoMark({ src, text, show = 'both', size = 'md' }: { src: string; text: string; show?: string; size?: string }) {
	const img = show !== 'name' && isSafeMediaUrl(src) ? src : '';
	const name = show !== 'logo' || !img ? text : '';
	return (
		<>
			{img && (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={img} alt={name ? '' : text || 'Home'} className={cx('w-auto shrink-0', IMG[size] ?? IMG.md)} />
			)}
			{name && <span className={cx('font-heading font-semibold tracking-tight whitespace-nowrap', TEXT[size] ?? TEXT.md)}>{name}</span>}
		</>
	);
}

export default function Logo({ props, attrs, action, ctx }: BlockProps) {
	const src = str(props.src) || ctx.site?.logo || '';
	const text = str(props.text) || ctx.site?.name || 'Your business';
	const link = action ?? { href: '/' };
	const mark = <LogoMark src={src} text={text} show={props.show} size={props.size} />;
	if (link.href)
		return (
			<a {...attrs} {...link} className='inline-flex items-center gap-2 text-foreground no-underline'>
				{mark}
			</a>
		);
	return (
		<button {...attrs} {...link} type='button' className='inline-flex cursor-pointer items-center gap-2 text-foreground'>
			{mark}
		</button>
	);
}
