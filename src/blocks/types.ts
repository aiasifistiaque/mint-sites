import type { ReactNode } from 'react';
import type { ActionAttrs } from '@/render/actions';
import type { BlockDef, Node, RenderContext } from '@/types';

/** What every block component receives from RenderTree. */
export type BlockProps<P = Record<string, any>> = {
	node: Node;
	/** node.props over the defaults of the block's PropDefs */
	props: P;
	/** spread on the block's root element: data-n (styles, editor) and the anchor id */
	attrs: { 'data-n'?: string; id?: string };
	/** the rendered default slot (only if the block declares one) */
	children?: ReactNode;
	/** rendered named slots */
	slots: Record<string, ReactNode>;
	/** the node's action as attributes, if the block takes actions */
	action: ActionAttrs | null;
	ctx: RenderContext;
};

export type BlockEntry = { def: BlockDef; Component: (p: BlockProps<any>) => ReactNode };
