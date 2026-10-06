import { RenderTree } from '@/render/RenderTree';
import type { BlockProps } from '../types';

export default function Accordion({ node, props, attrs, children, ctx }: BlockProps) {
	// Empty: the editor's drop area (children), nothing on the live site.
	if (!node.children?.length) return ctx.mode === 'edit' ? <div {...attrs}>{children}</div> : null;
	return (
		<div {...attrs} className='flex flex-col border-t border-border'>
			<RenderTree nodes={node.children} ctx={{ ...ctx, group: props.single ? `acc-${node.id}` : undefined }} />
		</div>
	);
}
