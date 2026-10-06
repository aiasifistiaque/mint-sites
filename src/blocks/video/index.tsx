import { isSafeMediaUrl } from '@/render/styleSchema';
import type { BlockProps } from '../types';
import { cx, EditHint, str } from '../util';

/** A video link → what to draw: an embeddable player URL or a file. */
export function parseVideo(url: string): { kind: 'embed'; src: string } | { kind: 'file'; src: string } | null {
	let u: URL;
	try {
		u = new URL(url);
	} catch {
		return url.startsWith('/') && /\.(mp4|webm|mov|m4v)$/i.test(url) ? { kind: 'file', src: url } : null;
	}
	if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
	const host = u.hostname.replace(/^www\.|^m\./, '');
	const yt = (id: string | null | undefined) =>
		id && /^[\w-]{6,20}$/.test(id) ? { kind: 'embed' as const, src: `https://www.youtube-nocookie.com/embed/${id}` } : null;
	if (host === 'youtu.be') return yt(u.pathname.slice(1));
	if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
		if (u.pathname === '/watch') return yt(u.searchParams.get('v'));
		const m = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]+)/);
		return yt(m?.[2]);
	}
	if (host === 'vimeo.com' || host === 'player.vimeo.com') {
		const id = u.pathname.match(/(\d{5,12})/)?.[1];
		return id ? { kind: 'embed', src: `https://player.vimeo.com/video/${id}` } : null;
	}
	if (/\.(mp4|webm|mov|m4v)$/i.test(u.pathname) && isSafeMediaUrl(url)) return { kind: 'file', src: url };
	return null;
}

const RATIO: Record<string, string> = { '16/9': '16 / 9', '4/3': '4 / 3', '1/1': '1 / 1', '9/16': '9 / 16' };

export default function Video({ props, attrs, ctx }: BlockProps) {
	const video = parseVideo(str(props.url));
	if (!video) return <EditHint ctx={ctx} attrs={attrs}>Paste a YouTube or Vimeo link, or pick a video file</EditHint>;
	const box = cx('relative w-full overflow-hidden bg-muted', props.rounded !== false && 'rounded-lg');
	const style = { aspectRatio: RATIO[props.ratio] ?? '16 / 9' };
	const title = str(props.title) || 'Video';
	return (
		<div {...attrs} className={box} style={style}>
			{video.kind === 'embed' ? (
				<iframe
					src={video.src}
					title={title}
					loading='lazy'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
					referrerPolicy='strict-origin-when-cross-origin'
					allowFullScreen
					className='absolute inset-0 h-full w-full border-0'
				/>
			) : props.autoplay ? (
				<video src={video.src} title={title} autoPlay muted loop playsInline className='absolute inset-0 h-full w-full object-cover' />
			) : (
				<video src={video.src} title={title} controls preload='metadata' playsInline className='absolute inset-0 h-full w-full' />
			)}
		</div>
	);
}
