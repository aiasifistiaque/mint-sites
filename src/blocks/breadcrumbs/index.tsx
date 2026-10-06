import type { MenuItem } from '@/types';
import type { BlockProps } from '../types';
import { str } from '../util';

const SEP: Record<string, string> = { chevron: '›', slash: '/', dot: '·' };

export default function Breadcrumbs({ props, attrs, ctx }: BlockProps) {
	let crumbs: MenuItem[] = ctx.crumbs?.length ? ctx.crumbs : [];
	if (!crumbs.length && ctx.mode === 'edit')
		crumbs = [
			{ label: 'Home', path: '/' },
			{ label: 'This page', path: ctx.path || '/page' },
		];
	if (crumbs.length < 2) return null;
	crumbs = crumbs.map((c, i) => (i === 0 && c.path === '/' ? { ...c, label: str(props.homeLabel) || c.label } : c));
	const sep = SEP[props.separator] ?? SEP.chevron;
	return (
		<nav {...attrs} aria-label='Breadcrumb'>
			<ol className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
				{crumbs.map((c, i) => {
					const last = i === crumbs.length - 1;
					return (
						<li key={c.path} className='flex items-center gap-2'>
							{last ? (
								<span aria-current='page' className='text-foreground'>
									{c.label}
								</span>
							) : (
								<>
									<a href={c.path} className='hover:text-foreground hover:underline'>
										{c.label}
									</a>
									<span aria-hidden>{sep}</span>
								</>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
