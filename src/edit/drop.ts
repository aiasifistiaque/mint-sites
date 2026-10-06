// Where a dragged block would land on the canvas (SB-06): from the pointer's
// position and the page tree, a drop target (parent, slot, index) plus the line
// (or box) the canvas draws — or the reason it can't go there. Used for drags
// from the panel's Add list and for moving a block by its handle.
import { BLOCK_DEFS } from '@/blocks/defs';
import { OVERLAY_TYPES } from '@/render/overlays';
import type { Node } from '@/types';
import type { DropTarget, Rect } from './protocol';

const DEFS = new Map(BLOCK_DEFS.map(d => [d.type, d]));
const EDGE = 10;

export type Placement = { target: DropTarget; line: Rect; inside: boolean };
export type DropResult = { placement: Placement | null; reason?: string };

type Loc = { node: Node; parent: Node | null; list: Node[]; index: number };

export function locate(nodes: Node[], id: string, parent: Node | null = null): Loc | null {
	for (let i = 0; i < nodes.length; i++) {
		const n = nodes[i];
		if (n?.id === id) return { node: n, parent, list: nodes, index: i };
		const hit = (n?.children && locate(n.children, id, n)) || null;
		if (hit) return hit;
	}
	return null;
}

const label = (type: string | null) => (type ? DEFS.get(type)?.label || type : 'the page');

/** null when a block of `type` may go in `slot` of a `parentType` block (null = the page itself), else why not. */
export function placeProblem(parentType: string | null, type: string, slot = 'children'): string | null {
	const def = DEFS.get(type);
	if (!def) return 'That block isn’t available here.';
	if (OVERLAY_TYPES.has(type)) return parentType === null ? null : `A ${def.label.toLowerCase()} goes at the top level of the page.`;
	if (parentType === null) return def.canBeChildOf?.length ? `${def.label} can only go inside ${def.canBeChildOf.map(label).join(' or ')}.` : null;
	const parent = DEFS.get(parentType);
	const s = parent?.slots?.[slot];
	if (!parent || !s) return `${label(parentType)} can’t hold other blocks.`;
	if (s.allow?.length && !s.allow.includes(type)) return `${def.label} can’t go in ${parent.label}.`;
	if (def.canBeChildOf?.length && !def.canBeChildOf.includes(parentType)) return `${def.label} can only go inside ${def.canBeChildOf.map(label).join(' or ')}.`;
	return null;
}

const problemFor = (parentType: string | null, types: string[]) => {
	for (const t of types) {
		const p = placeProblem(parentType, t);
		if (p) return p;
	}
	return null;
};

export const elementOf = (id: string | null) => (id ? document.querySelector<HTMLElement>(`[data-n="${CSS.escape(id)}"]`) : null);

const rectOf = (el: Element | null) => {
	const r = el?.getBoundingClientRect();
	return r && (r.width || r.height) ? r : null;
};

/** Children run left to right (a row or a grid) or top to bottom. */
const flowOf = (container: Element | null): 'row' | 'column' => {
	if (!container) return 'column';
	const cs = getComputedStyle(container);
	if (cs.display.includes('grid')) return 'row';
	if (cs.display.includes('flex') && cs.flexDirection.startsWith('row')) return 'row';
	return 'column';
};

/** Where among `list` (drawn inside `box`) the pointer falls, and the line for it. */
function indexIn(list: Node[], x: number, y: number, box: DOMRect | null): { index: number; line: Rect } | null {
	const items = list
		.map((n, i) => ({ i, el: elementOf(n.id), r: rectOf(elementOf(n.id)) }))
		.filter((it): it is { i: number; el: HTMLElement; r: DOMRect } => !!it.r && !!it.el);
	if (!items.length) {
		if (!box) return null;
		return { index: list.length, line: { x: box.left, y: box.top, w: box.width, h: box.height } };
	}
	const flow = flowOf(items[0].el.parentElement);
	const left = Math.min(...items.map(it => it.r.left));
	const right = Math.max(...items.map(it => it.r.right));
	if (flow === 'column') {
		const k = items.findIndex(it => y < it.r.top + it.r.height / 2);
		const index = k === -1 ? list.length : items[k].i;
		const lineY =
			k === -1 ? items[items.length - 1].r.bottom + 2 : k === 0 ? items[0].r.top - 2 : (items[k - 1].r.bottom + items[k].r.top) / 2;
		return { index, line: { x: left, y: lineY - 1, w: right - left, h: 2 } };
	}
	const k = items.findIndex(it => y < it.r.top || (y <= it.r.bottom && x < it.r.left + it.r.width / 2));
	const ref = items[k === -1 ? items.length - 1 : k].r;
	const lineX = k === -1 ? ref.right + 2 : k > 0 && items[k - 1].r.top === ref.top ? (items[k - 1].r.right + ref.left) / 2 : ref.left - 2;
	return { index: k === -1 ? list.length : items[k].i, line: { x: lineX - 1, y: ref.top, w: 2, h: ref.height } };
}

/**
 * The drop under (x, y) — canvas viewport coordinates — for blocks of `types`.
 * `moving` is the id of a block being moved (it can't go inside itself).
 */
export function findDrop(x: number, y: number, types: string[], tree: Node[], moving?: string): DropResult {
	const main = document.querySelector('.mint-site main');
	if (!main) return { placement: null };
	const mainRect = main.getBoundingClientRect();

	// Pop-ups, drawers and popovers always sit at the top level, at the end.
	if (types.some(t => OVERLAY_TYPES.has(t))) {
		const r = mainRect;
		return { placement: { target: { parentId: null, index: tree.length }, line: { x: r.left, y: r.bottom - 2, w: r.width, h: 2 }, inside: false } };
	}

	const hit = document.elementFromPoint(x, y);
	if (hit && !main.contains(hit)) {
		if (hit.closest('.mint-site')) return { placement: null, reason: 'The header and footer are changed on their own — open them under Pages.' };
		return { placement: null };
	}
	if (!hit && y < mainRect.bottom) return { placement: null };

	const movingEl = moving ? elementOf(moving) : null;
	// Inside a saved section: its blocks aren't this page's — drop around the section-ref block.
	let el: HTMLElement | null = hit ? hit.closest<HTMLElement>('[data-mint-ref]') || hit.closest<HTMLElement>('[data-n]') : null;
	if (el && !main.contains(el)) el = null;
	if (movingEl && el && movingEl.contains(el)) el = movingEl;

	let reason: string | null = null;
	while (el) {
		const id = el.dataset.n!;
		const loc = locate(tree, id);
		if (!loc) break;
		const n = loc.node;
		const def = DEFS.get(n.type);
		const r = el.getBoundingClientRect();

		// Inside it, unless the pointer is on its edge (then before / after it).
		const onEdge = x < r.left + EDGE || x > r.right - EDGE || y < r.top + EDGE || y > r.bottom - EDGE;
		if (def?.slots?.children && n.id !== moving && (!onEdge || !n.children?.length)) {
			const why = problemFor(n.type, types);
			if (!why) {
				const empty = !n.children?.length;
				const box = empty ? rectOf(el.querySelector(':scope [data-mint-empty]')) || r : r;
				const at = indexIn(n.children || [], x, y, box);
				if (at) return { placement: { target: { parentId: n.id, index: at.index }, line: at.line, inside: empty } };
			} else reason ??= why;
		}

		// Before or after it, in its parent.
		const parentType = loc.parent?.type ?? null;
		const why = problemFor(parentType, types);
		if (!why) {
			const flow = flowOf(el.parentElement);
			const after = flow === 'row' ? x > r.left + r.width / 2 : y > r.top + r.height / 2;
			const line: Rect =
				flow === 'row'
					? { x: (after ? r.right : r.left) - 1, y: r.top, w: 2, h: r.height }
					: { x: r.left, y: (after ? r.bottom : r.top) - 1, w: r.width, h: 2 };
			return { placement: { target: { parentId: loc.parent?.id ?? null, index: loc.index + (after ? 1 : 0) }, line, inside: false } };
		}
		reason ??= why;
		el = loc.parent ? elementOf(loc.parent.id) : null;
	}

	// The page itself: between its top-level blocks.
	const why = problemFor(null, types);
	if (why) return { placement: null, reason: reason || why };
	const at = indexIn(tree, x, y, mainRect);
	return at ? { placement: { target: { parentId: null, index: at.index }, line: at.line, inside: !tree.length } } : { placement: null, reason: reason || undefined };
}
