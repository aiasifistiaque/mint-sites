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

function Img({ src, alt, priority, className }: { src: string; alt: string; priority: boolean; className: string }) {
	// A plain <img> straight from the media host — no image optimizer (it's
	// billed per image, and it would serve every tenant's pictures).
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={alt}
			loading={priority ? 'eager' : 'lazy'}
			fetchPriority={priority ? 'high' : undefined}
			decoding='async'
			className={className}
		/>
	);
}

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
		const priority = !!props.priority;
		picture =
			ratio !== 'auto' ? (
				<div className={cx('relative w-full overflow-hidden', radius)} style={aspect}>
					<Img src={src} alt={alt} priority={priority} className={cx('absolute inset-0 h-full w-full', fit)} />
				</div>
			) : (
				<Img src={src} alt={alt} priority={priority} className={cx('h-auto w-full', radius)} />
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
