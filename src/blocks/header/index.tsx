import { RenderTree } from '@/render/RenderTree';
import { SvgIcon } from '../icon';
import { LogoMark } from '../logo';
import { menuItems, MenuLinks } from '../nav-menu';
import type { BlockProps } from '../types';
import { cx } from '../util';

const WIDTH: Record<string, string> = {
	container: 'max-w-(--mint-container)',
	wide: 'max-w-[calc(var(--mint-container)+16rem)]',
	full: 'max-w-none',
};

// No script: on phones the ☰ button opens the menu with the browser's own
// popover (popovertarget), which also closes it on Esc and a click outside.
export default function Header({ node, props, attrs, children, ctx }: BlockProps) {
	const items = menuItems(props, ctx);
	const panel = `m-${node.id}`;
	const edit = ctx.mode === 'edit';
	const logo = (
		<a href='/' className='inline-flex shrink-0 items-center gap-2 text-foreground no-underline'>
			<LogoMark src={ctx.site?.logo || ''} text={ctx.site?.name || 'Your business'} show={props.show} size={props.logoSize} />
		</a>
	);
	const menu = items.length > 0 && (
		<nav aria-label='Main' className='hidden md:block'>
			<ul className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm'>
				<MenuLinks items={items} ctx={ctx} />
			</ul>
		</nav>
	);
	const actions = <div className='hidden items-center gap-3 md:flex'>{children}</div>;
	const burger = (items.length > 0 || !!node.children?.length) && (
		<button
			type='button'
			{...(!edit && { popoverTarget: panel })}
			aria-label='Open the menu'
			className='inline-flex size-10 cursor-pointer items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden'>
			<SvgIcon name='list' size={22} />
		</button>
	);
	const stacked = props.layout === 'stacked';
	return (
		<header
			{...attrs}
			className={cx(
				'relative z-40 w-full bg-background',
				props.sticky && 'sticky top-0',
				props.border !== false && 'border-b border-border'
			)}>
			<div
				className={cx(
					'mx-auto flex w-full items-center gap-6 px-4 md:px-6',
					stacked ? 'py-4 md:flex-col md:gap-3 md:py-6' : 'py-4',
					WIDTH[props.width] ?? WIDTH.container
				)}>
				{stacked ? (
					<>
						<div className='flex w-full items-center justify-between md:justify-center'>
							{logo}
							{burger}
						</div>
						<div className='hidden w-full items-center justify-center gap-6 md:flex'>
							{menu}
							{actions}
						</div>
					</>
				) : (
					<>
						{logo}
						<div className={cx('flex flex-1 items-center gap-6', props.layout === 'center' ? 'justify-center' : 'justify-end')}>{menu}</div>
						{actions}
						{burger}
					</>
				)}
			</div>
			{!edit && (
				<div id={panel} popover='auto' className='mint-overlay mint-menu-panel md:hidden'>
					<div className='flex items-center justify-between border-b border-border px-4 py-3'>
						{logo}
						<button
							type='button'
							popoverTarget={panel}
							popoverTargetAction='hide'
							aria-label='Close the menu'
							className='inline-flex size-10 cursor-pointer items-center justify-center rounded-md hover:bg-muted'>
							<SvgIcon name='x' size={20} />
						</button>
					</div>
					<nav aria-label='Main' className='px-4 py-4'>
						<ul className='flex flex-col gap-1 text-lg'>
							<MenuLinks items={items} ctx={ctx} tone='foreground' className='block rounded-md px-2 py-2 hover:bg-muted' />
						</ul>
					</nav>
					{!!node.children?.length && (
						<div className='flex flex-col gap-3 px-4 pb-6'>
							<RenderTree nodes={node.children} ctx={{ ...ctx, anchors: new Set() }} />
						</div>
					)}
				</div>
			)}
		</header>
	);
}
