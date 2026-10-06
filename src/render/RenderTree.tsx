// Walks a Node[] and draws each node with its block. Unknown types render
// nothing; children and named slots render only where the block declares
// them; every block root carries data-n="<id>" for compiled styles and the
// editor. Hidden-per-breakpoint is CSS (compileStyles), not markup.
import type { ReactNode } from 'react';
import { REGISTRY } from '@/blocks/registry';
import type { BlockEntry } from '@/blocks/types';
import type { BlockDef, Node, RenderContext } from '@/types';
import { actionAttrs, anchorId } from './actions';

const ID = /^[A-Za-z0-9_-]{1,32}$/;
export const MAX_RENDER_DEPTH = 30;

const defaultsCache = new WeakMap<BlockDef, Record<string, any>>();
/** The PropDefs' defaults, so a node missing a prop still draws sensibly. */
function propDefaults(def: BlockDef) {
	let d = defaultsCache.get(def);
	if (!d) {
		d = Object.fromEntries(def.props.filter(p => p.default !== undefined).map(p => [p.key, p.default]));
		defaultsCache.set(def, d);
	}
	return d;
}

type Props = { nodes: Node[] | undefined; ctx: RenderContext; registry?: Record<string, BlockEntry>; depth?: number };

export function RenderTree({ nodes, ctx, registry = REGISTRY, depth = 0 }: Props): ReactNode {
	if (!Array.isArray(nodes) || depth > MAX_RENDER_DEPTH) return null;
	return nodes.map((node, i) => (
		<RenderNode key={typeof node?.id === 'string' ? node.id : `i${i}`} node={node} ctx={ctx} registry={registry} depth={depth} />
	));
}

function RenderNode({ node, ctx, registry, depth }: { node: Node; ctx: RenderContext; registry: Record<string, BlockEntry>; depth: number }) {
	if (!node || typeof node !== 'object') return null;
	const entry = registry[node.type];
	if (!entry) return null;
	const { def, Component } = entry;
	const id = typeof node.id === 'string' && ID.test(node.id) ? node.id : undefined;
	const attrs: { 'data-n'?: string; id?: string } = id ? { 'data-n': id } : {};
	if (id && ctx.anchors?.has(id)) attrs.id = anchorId(id);

	const children = def.slots?.children ? (
		<RenderTree nodes={node.children} ctx={ctx} registry={registry} depth={depth + 1} />
	) : undefined;
	const slots: Record<string, ReactNode> = {};
	for (const name of Object.keys(def.slots || {}))
		if (name !== 'children') slots[name] = <RenderTree nodes={node.slots?.[name]} ctx={ctx} registry={registry} depth={depth + 1} />;

	const props = { ...propDefaults(def), ...(node.props && typeof node.props === 'object' ? node.props : {}) };
	const action = def.actions ? actionAttrs(node.action, ctx) : null;
	return <Component node={node} props={props} attrs={attrs} slots={slots} action={action} ctx={ctx}>{children}</Component>;
}
