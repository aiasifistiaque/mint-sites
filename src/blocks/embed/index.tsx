import type { BlockProps } from '../types';
import { EditHint, str } from '../util';
import { EMBED_HOSTS } from './schema';

/** https only, and the host (+ path prefix, for Google Maps) must be on the allowlist. */
export function allowedEmbed(url: string): string | null {
	try {
		const u = new URL(url);
		if (u.protocol !== 'https:') return null;
		const at = u.hostname + u.pathname;
		return EMBED_HOSTS.some(h => (h.includes('/') ? at.startsWith(h) : u.hostname === h)) ? u.toString() : null;
	} catch {
		return null;
	}
}

export default function Embed({ props, attrs, ctx }: BlockProps) {
	const src = allowedEmbed(str(props.url));
	if (!src) return <EditHint ctx={ctx} attrs={attrs}>Paste an embed link from Google Maps, YouTube or Vimeo</EditHint>;
	const height = [240, 360, 480, 640].includes(props.height) ? props.height : 360;
	return (
		<div {...attrs} className='w-full overflow-hidden rounded-lg bg-muted'>
			<iframe
				src={src}
				title={str(props.title) || 'Embedded content'}
				height={height}
				loading='lazy'
				referrerPolicy='no-referrer-when-downgrade'
				allowFullScreen
				className='block w-full border-0'
			/>
		</div>
	);
}
