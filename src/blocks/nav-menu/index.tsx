import { isSafeHref } from '@/render/sanitize';
import type { MenuItem, RenderContext } from '@/types';
import { GAP } from '../stack';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

const TONE: Record<string, string> = {
	muted: 'text-muted-foreground hover:text-foreground',
	foreground: 'text-foreground hover:text-primary',
	primary: 'text-primary hover:opacity-80',
};

const SAMPLE: MenuItem[] = [
	{ label: 'About', path: '/about' },
	{ label: 'Services', path: '/services' },
	{ label: 'Contact', path: '/contact' },
];

/** The links a menu shows: the site's menu pages, or its own rows. */
export function menuItems(props: Record<string, any>, ctx: RenderContext): MenuItem[] {
	if (props.source === 'custom')
		return (Array.isArray(props.items) ? props.items : [])
			.map((r: any) => ({ label: str(r?.label), path: str(r?.href) }))
			.filter((r: MenuItem) => r.label && isSafeHref(r.path));
	// The canvas before any page is in the menu: show what a menu looks like.
	if (!ctx.menu?.length && ctx.mode === 'edit') return SAMPLE;
	return ctx.menu || [];
}

export const isCurrent = (path: string, ctx: RenderContext) =>
	!!ctx.path && (path === ctx.path || (path !== '/' && ctx.path.startsWith(`${path}/`)));

export function MenuLinks({ items, ctx, tone = 'muted', className }: { items: MenuItem[]; ctx: RenderContext; tone?: string; className?: string }) {
	return items.map(item => (
		<li key={`${item.path}|${item.label}`}>
			<a
				href={item.path}
				{...(isCurrent(item.path, ctx) && { 'aria-current': 'page' as const })}
				className={cx('transition-colors aria-[current=page]:text-foreground aria-[current=page]:font-medium', TONE[tone] ?? TONE.muted, className)}>
				{item.label}
			</a>
		</li>
	));
}

export default function NavMenu({ props, attrs, ctx }: BlockProps) {
	const items = menuItems(props, ctx);
	if (!items.length)
		return ctx.mode === 'edit' ? (
			<nav {...attrs} className='text-sm text-muted-foreground'>
				No links yet
			</nav>
		) : null;
	return (
		<nav {...attrs} aria-label='Menu'>
			<ul className={cx('flex', props.direction === 'column' ? 'flex-col' : 'flex-row flex-wrap items-center', GAP[props.gap] ?? 'gap-6')}>
				<MenuLinks items={items} ctx={ctx} tone={props.tone} />
			</ul>
		</nav>
	);
}
