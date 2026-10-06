import { RenderTree } from '@/render/RenderTree';
import type { BlockProps } from '../types';
import { EditHint, str } from '../util';

/**
 * A saved section (SB-07): draws the tree stored in the design's `sections`.
 * Saved sections don't hold other saved sections, so this never recurses. In
 * the editor the wrapper is marked: a click anywhere inside selects this block,
 * not the saved section's own blocks (those are edited in the section itself).
 */
export default function SectionRef({ props, attrs, ctx }: BlockProps) {
	const saved = ctx.sections?.[str(props.section)];
	if (ctx.inSection) return null;
	if (!saved?.tree?.length)
		return <EditHint ctx={ctx} attrs={attrs}>{props.section ? 'This saved section was deleted' : 'Choose a saved section'}</EditHint>;
	return (
		<div {...attrs} {...(ctx.mode === 'edit' && { 'data-mint-ref': '' })}>
			<RenderTree nodes={saved.tree} ctx={{ ...ctx, inSection: true }} />
		</div>
	);
}
