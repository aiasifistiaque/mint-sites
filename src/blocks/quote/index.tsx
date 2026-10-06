import { isSafeMediaUrl } from '@/render/styleSchema';
import { parsePlaceholder } from '../image';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

export default function Quote({ props, attrs, ctx }: BlockProps) {
	const edit = (prop: string) => (ctx.mode === 'edit' ? { 'data-mint-text': prop } : {});
	const large = props.variant === 'large';
	const avatar = str(props.avatar);
	const author = str(props.author);
	const initials = author
		.split(/\s+/)
		.map(w => w[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
	const rating = [3, 4, 5].includes(props.rating) ? props.rating : 0;
	return (
		<figure
			{...attrs}
			className={cx(
				'flex h-full flex-col gap-5',
				props.variant === 'card' && 'rounded-lg border border-border bg-card p-6 text-card-foreground',
				large && 'mx-auto max-w-3xl items-center text-center'
			)}>
			{rating > 0 && (
				<div className='flex gap-0.5 text-warning' role='img' aria-label={`${rating} out of 5 stars`}>
					{Array.from({ length: rating }, (_, i) => (
						<svg key={i} viewBox='0 0 20 20' width={16} height={16} fill='currentColor' aria-hidden>
							<path d='M10 1.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L10 14.95 4.75 17.7l1-5.85L1.5 7.7l5.9-.9z' />
						</svg>
					))}
				</div>
			)}
			<blockquote {...edit('text')} className={cx('text-pretty', large ? 'font-heading text-2xl leading-snug md:text-3xl' : 'text-base leading-relaxed')}>
				{large ? str(props.text) : `“${str(props.text)}”`}
			</blockquote>
			<figcaption className={cx('mt-auto flex items-center gap-3', large && 'mt-0 justify-center')}>
				{avatar && isSafeMediaUrl(avatar) && !parsePlaceholder(avatar) ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={avatar} alt='' loading='lazy' className='size-10 shrink-0 rounded-full object-cover' />
				) : (
					initials && (
						<span aria-hidden className='flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground'>
							{initials}
						</span>
					)
				)}
				<span className='flex flex-col text-left text-sm'>
					<span {...edit('author')} className='font-medium'>
						{author}
					</span>
					{str(props.role) && (
						<span {...edit('role')} className='text-muted-foreground'>
							{str(props.role)}
						</span>
					)}
				</span>
			</figcaption>
		</figure>
	);
}
