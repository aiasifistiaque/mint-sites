import { isSafeHref } from '@/render/sanitize';
import { SvgIcon } from '../icon';
import type { BlockProps } from '../types';
import { cx, str } from '../util';
import { NETWORKS } from './schema';

const LOOK: Record<string, string> = {
	plain: 'text-muted-foreground hover:text-foreground',
	circle: 'size-10 justify-center rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground',
	square: 'size-10 justify-center rounded-md border border-border text-foreground hover:bg-muted',
};

export default function SocialLinks({ props, attrs, ctx }: BlockProps) {
	const rows: { network: string; url: string }[] =
		props.source === 'custom'
			? (Array.isArray(props.items) ? props.items : []).map((r: any) => ({ network: str(r?.network), url: str(r?.url) }))
			: [
					...Object.entries(ctx.site?.social || {}).map(([network, url]) => ({ network, url: str(url) })),
					...(ctx.site?.contact?.email ? [{ network: 'email', url: `mailto:${ctx.site.contact.email}` }] : []),
				];
	let links = rows.filter(r => NETWORKS[r.network] && isSafeHref(r.url));
	// The canvas before any profile is set: show what it looks like.
	if (!links.length && ctx.mode === 'edit')
		links = ['instagram', 'facebook', 'linkedin'].map(network => ({ network, url: '#' }));
	if (!links.length) return null;
	const size = [16, 20, 24].includes(props.size) ? props.size : 20;
	return (
		<ul {...attrs} className='flex flex-wrap items-center gap-3'>
			{links.map(({ network, url }) => {
				const [label, icon] = NETWORKS[network];
				return (
					<li key={`${network}|${url}`}>
						<a
							href={url}
							{...(/^https?:/.test(url) && { target: '_blank', rel: 'noopener noreferrer' })}
							aria-label={label}
							className={cx('inline-flex items-center transition-colors', LOOK[props.variant] ?? LOOK.plain)}>
							<SvgIcon name={icon} size={size} />
						</a>
					</li>
				);
			})}
		</ul>
	);
}
