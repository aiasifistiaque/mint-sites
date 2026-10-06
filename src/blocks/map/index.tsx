import { allowedEmbed } from '../embed';
import type { BlockProps } from '../types';
import { EditHint, str } from '../util';

/** The map's iframe address: the address typed here, else the site's own embed link, else its address. */
export function mapSrc(address: string, zoom: number, site?: Record<string, string>) {
	if (!address && site?.mapEmbedUrl) {
		const own = allowedEmbed(site.mapEmbedUrl);
		if (own) return own;
	}
	const q = (address || site?.address || '').trim().slice(0, 300);
	if (!q) return null;
	return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
}

export default function MapBlock({ props, attrs, ctx }: BlockProps) {
	const zoom = [12, 14, 16, 18].includes(props.zoom) ? props.zoom : 16;
	const src = mapSrc(str(props.address), zoom, ctx.site?.contact);
	if (!src) return <EditHint ctx={ctx} attrs={attrs}>Add your address in Website settings → Contact, or type one here</EditHint>;
	const height = [240, 360, 480].includes(props.height) ? props.height : 360;
	return (
		<div {...attrs} className='w-full overflow-hidden rounded-lg bg-muted'>
			<iframe
				src={src}
				title={`Map: ${str(props.address) || ctx.site?.contact?.address || 'our address'}`}
				height={height}
				loading='lazy'
				referrerPolicy='no-referrer-when-downgrade'
				className='block w-full border-0'
				{...(ctx.mode === 'edit' && { style: { pointerEvents: 'none' } })}
			/>
		</div>
	);
}
