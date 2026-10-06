import NextImage from 'next/image';
import { isSafeMediaUrl } from '@/render/styleSchema';
import type { BlockProps } from '../types';
import { cx, EditHint, oneOf, str } from '../util';
import { RATIOS } from './schema';

const RADIUS: Record<string, string> = {
	none: 'rounded-none',
	sm: 'rounded-sm',
	md: 'rounded-md',
	lg: 'rounded-lg',
	xl: 'rounded-xl',
	full: 'rounded-full',
};
const MEDIA_HOSTS = (process.env.NEXT_PUBLIC_MEDIA_HOSTS || '').split(',').filter(Boolean);

/** next/image only for hosts configured in next.config (MEDIA_HOSTS); a plain <img> otherwise. */
const optimizable = (src: string) => {
	try {
		const u = new URL(src);
		return u.protocol === 'https:' && MEDIA_HOSTS.includes(u.hostname);
	} catch {
		return false;
	}
};

/** "placeholder:<w>x<h>:<label>" → its size and label (the AI uses these before real pictures exist). */
export const parsePlaceholder = (src: string) => {
	const m = src.match(/^placeholder:(\d{1,4})x(\d{1,4})(?::(.{0,60}))?$/);
	return m ? { w: Number(m[1]), h: Number(m[2]), label: m[3] || '' } : null;
};

export default function Image({ props, attrs, action, ctx }: BlockProps) {
	const src = str(props.src);
	const ratio = oneOf(props.ratio, RATIOS, 'auto');
	const radius = RADIUS[props.rounded] ?? RADIUS.md;
	const fit = props.fit === 'contain' ? 'object-contain' : 'object-cover';
	const placeholder = parsePlaceholder(src);
	const aspect = ratio !== 'auto' ? { aspectRatio: ratio.replace('/', ' / ') } : undefined;

	let picture;
	if (placeholder) {
		picture = (
			<div
				role='img'
				aria-label={str(props.alt) || placeholder.label || 'Image'}
				className={cx('flex w-full items-center justify-center bg-foreground/8 text-sm text-muted-foreground', radius)}
				style={aspect ?? { aspectRatio: `${placeholder.w} / ${placeholder.h}` }}>
				{placeholder.label}
			</div>
		);
	} else if (isSafeMediaUrl(src)) {
		const alt = str(props.alt);
		picture =
			ratio !== 'auto' ? (
				<div className={cx('relative w-full overflow-hidden', radius)} style={aspect}>
					{optimizable(src) ? (
						<NextImage src={src} alt={alt} fill sizes='(min-width: 1024px) 50vw, 100vw' priority={!!props.priority} className={fit} />
					) : (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={src} alt={alt} loading={props.priority ? 'eager' : 'lazy'} className={cx('absolute inset-0 h-full w-full', fit)} />
					)}
				</div>
			) : optimizable(src) ? (
				<NextImage src={src} alt={alt} width={1600} height={1000} sizes='(min-width: 1024px) 50vw, 100vw' priority={!!props.priority} className={cx('h-auto w-full', radius)} />
			) : (
				// eslint-disable-next-line @next/next/no-img-element
				<img src={src} alt={alt} loading={props.priority ? 'eager' : 'lazy'} className={cx('h-auto w-full', radius)} />
			);
	} else return <EditHint ctx={ctx} attrs={attrs}>Choose an image</EditHint>;

	if (action?.href)
		return (
			<a {...attrs} {...action} className='block'>
				{picture}
			</a>
		);
	if (action)
		return (
			<button {...attrs} {...action} type='button' className='block w-full cursor-pointer'>
				{picture}
			</button>
		);
	return (
		<div {...attrs} className='w-full'>
			{picture}
		</div>
	);
}
