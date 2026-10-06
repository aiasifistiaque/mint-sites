import { RenderTree } from '@/render/RenderTree';
import type { BlockProps } from '../types';
import { cx, str } from '../util';

const TAB = {
	line: 'border-b-2 border-transparent px-1 pb-3 text-muted-foreground hover:text-foreground aria-selected:border-primary aria-selected:text-foreground',
	pills: 'rounded-full px-4 py-2 text-muted-foreground hover:bg-muted aria-selected:bg-primary aria-selected:text-primary-foreground',
};

// The first tab shows; the tabs script (src/render/interactive.ts) switches
// them, with arrow keys too. Without script the first tab's content still
// shows. In the editor every tab shows, one under the other, so all of them
// can be edited.
export default function Tabs({ node, props, attrs, children, ctx }: BlockProps) {
	const tabs = (node.children || []).filter(c => c?.type === 'tab');
	if (!tabs.length) return ctx.mode === 'edit' ? <div {...attrs}>{children}</div> : null;
	const variant = props.variant === 'pills' ? 'pills' : 'line';
	const id = (kind: string, i: number) => `${kind}-${node.id}-${i}`;
	if (ctx.mode === 'edit')
		return (
			<div {...attrs} className='flex flex-col gap-6'>
				{tabs.map(t => (
					<div key={t.id} className='flex flex-col gap-3'>
						<span className='w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground'>Tab: {str(t.props?.label) || 'Tab'}</span>
						<RenderTree nodes={[t]} ctx={ctx} />
					</div>
				))}
			</div>
		);
	return (
		<div {...attrs} data-mint-tabs='' className='flex flex-col gap-6'>
			<div
				role='tablist'
				className={cx('flex gap-2 overflow-x-auto text-sm font-medium', variant === 'line' && 'gap-6 border-b border-border', props.align === 'center' && 'justify-center')}>
				{tabs.map((t, i) => (
					<button
						key={t.id}
						type='button'
						role='tab'
						suppressHydrationWarning
						id={id('t', i)}
						aria-controls={id('p', i)}
						aria-selected={i === 0}
						tabIndex={i === 0 ? 0 : -1}
						className={cx('shrink-0 cursor-pointer whitespace-nowrap transition-colors', TAB[variant])}>
						{str(t.props?.label) || `Tab ${i + 1}`}
					</button>
				))}
			</div>
			{tabs.map((t, i) => (
				<div key={t.id} suppressHydrationWarning role='tabpanel' id={id('p', i)} aria-labelledby={id('t', i)} tabIndex={0} hidden={i > 0}>
					<RenderTree nodes={[t]} ctx={ctx} />
				</div>
			))}
		</div>
	);
}
