// Walks a Node[] and draws each node with its block. Unknown types render
// nothing; children and named slots render only where the block declares
// them; every block root carries data-n="<id>" for compiled styles and the
// editor. Hidden-per-breakpoint is CSS (compileStyles), not markup.
import type { ReactNode } from 'react';
import { REGISTRY } from '@/blocks/registry';
import type { BlockEntry } from '@/blocks/types';
import type { BlockDef, Node, PropDef, RenderContext } from '@/types';
import { actionAttrs, anchorId } from './actions';
import { withData } from './bind';

const ID = /^[A-Za-z0-9_-]{1,32}$/;
export const MAX_RENDER_DEPTH = 30;

const defaultsCache = new WeakMap<BlockDef, Record<string, any>>();
const propDefsCache = new WeakMap<BlockDef, Map<string, PropDef>>();
const propDefsOf = (def: BlockDef) => {
	let m = propDefsCache.get(def);
	if (!m) propDefsCache.set(def, (m = new Map(def.props.map(p => [p.key, p]))));
	return m;
};
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

/** In the editor's canvas, an empty container still has somewhere to drop blocks. */
function EmptySlot() {
	return (
		<div
			data-mint-empty=''
			className='flex min-h-16 min-w-24 flex-1 items-center justify-center rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground'>
			Drop blocks here
		</div>
	);
}

function RenderNode({ node, ctx, registry, depth }: { node: Node; ctx: RenderContext; registry: Record<string, BlockEntry>; depth: number }) {
	if (!node || typeof node !== 'object') return null;
	const entry = registry[node.type];
	if (!entry) return null;
	const { def, Component } = entry;
	const id = typeof node.id === 'string' && ID.test(node.id) ? node.id : undefined;
	const attrs: { 'data-n'?: string; id?: string; 'data-mint-bound'?: string } = id ? { 'data-n': id } : {};
	if (id && ctx.anchors?.has(id)) attrs.id = anchorId(id);

	const children = def.slots?.children ? (
		ctx.mode === 'edit' && !node.children?.length ? (
			<EmptySlot />
		) : (
			<RenderTree nodes={node.children} ctx={ctx} registry={registry} depth={depth + 1} />
		)
	) : undefined;
	const slots: Record<string, ReactNode> = {};
	for (const name of Object.keys(def.slots || {}))
		if (name !== 'children') slots[name] = <RenderTree nodes={node.slots?.[name]} ctx={ctx} registry={registry} depth={depth + 1} />;

	const own = { ...propDefaults(def), ...(node.props && typeof node.props === 'object' ? node.props : {}) };
	// Data (SB-09): bound props and {{ }} in text, from the item, the record, the site, Contents.
	const { props, bound } = withData(node, own, propDefsOf(def), ctx.scope, ctx.mode === 'edit');
	// The editor doesn't type over a value that comes from data.
	if (ctx.mode === 'edit' && bound.length) attrs['data-mint-bound'] = bound.join(' ');
	const action = def.actions ? actionAttrs(node.action, ctx) : null;
	// A block that draws its slots more than once (a collection: once per record) draws them itself.
	const renderSlot = (name: string, c: RenderContext) => (
		<RenderTree nodes={name === 'children' ? node.children : node.slots?.[name]} ctx={c} registry={registry} depth={depth + 1} />
	);
	return (
		<Component node={node} props={props} attrs={attrs} slots={slots} action={action} ctx={ctx} renderSlot={renderSlot}>
			{children}
		</Component>
	);
}
