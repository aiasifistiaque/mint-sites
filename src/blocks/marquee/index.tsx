import { RenderTree } from '@/render/RenderTree';
import type { BlockProps } from '../types';
import { cx } from '../util';

const SPEED: Record<string, string> = { slow: '60s', normal: '35s', fast: '18s' };
const GAP: Record<number, string> = { 6: '1.5rem', 12: '3rem', 16: '4rem' };

// Pure CSS: the items twice in a row, moved left by half (globals.css
// .mint-marquee). The copy is hidden from screen readers. In the editor it
// stands still so its items can be picked.
export default function Marquee({ node, props, attrs, children, ctx }: BlockProps) {
	const style = { '--speed': SPEED[props.speed] ?? SPEED.normal, '--gap': GAP[props.gap] ?? '3rem' } as React.CSSProperties;
	if (ctx.mode === 'edit')
		return (
			<div {...attrs} className='flex flex-wrap items-center justify-center' style={{ gap: GAP[props.gap] ?? '3rem' }}>
				{children}
			</div>
		);
	return (
		<div {...attrs} className={cx('mint-marquee', props.fade !== false && 'mint-marquee-fade')} data-reverse={props.reverse ? '' : undefined} style={style}>
			<div className='mint-marquee-track'>
				<div className='mint-marquee-group'>{children}</div>
				<div className='mint-marquee-group' aria-hidden inert>
					<RenderTree nodes={node.children} ctx={{ ...ctx, anchors: new Set() }} />
				</div>
			</div>
		</div>
	);
}
