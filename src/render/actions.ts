// A node's action (D12) → attributes for its <a> / <button>. Links become
// hrefs; open/close/toggle/scroll/widget become data attributes that the small
// client runtime wires up (overlays in SB-06, widgets in SB-10).
import type { Action, Node, RenderContext } from '@/types';
import { isSafeHref } from './sanitize';

export type ActionAttrs = {
	href?: string;
	target?: string;
	rel?: string;
	'data-mint-action'?: string;
	'data-mint-target'?: string;
	'data-mint-widget'?: string;
};

/** The html id given to nodes that something scrolls or links to. */
export const anchorId = (id: string) => `n-${id}`;

export function actionAttrs(action: Action | undefined, ctx: RenderContext): ActionAttrs | null {
	if (!action || typeof action !== 'object') return null;
	switch (action.type) {
		case 'link': {
			const href = action.href?.startsWith('#node:') ? `#${anchorId(action.href.slice(6))}` : action.href;
			if (!isSafeHref(href)) return null;
			return action.newTab ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };
		}
		case 'page': {
			const href = ctx.pages?.[action.pageId];
			if (!href) return null;
			return action.newTab ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };
		}
		case 'scroll':
			return typeof action.target === 'string'
				? { href: `#${anchorId(action.target)}`, 'data-mint-action': 'scroll', 'data-mint-target': action.target }
				: null;
		case 'open':
		case 'close':
		case 'toggle':
			return typeof action.target === 'string'
				? { 'data-mint-action': action.type, 'data-mint-target': action.target }
				: null;
		case 'widget':
			return typeof action.widget === 'string' && /^[a-z0-9-]{1,40}$/.test(action.widget)
				? { 'data-mint-action': action.op || 'open', 'data-mint-widget': action.widget }
				: null;
		default:
			return null;
	}
}

/** Ids that an action in the tree scrolls or links to — they get an html id. */
export function collectAnchors(trees: Node[][]): Set<string> {
	const ids = new Set<string>();
	const visit = (nodes?: Node[]) => {
		if (!Array.isArray(nodes)) return;
		for (const n of nodes) {
			const a = n?.action;
			if (a?.type === 'scroll' && typeof a.target === 'string') ids.add(a.target);
			if (a?.type === 'link' && typeof a.href === 'string' && a.href.startsWith('#node:')) ids.add(a.href.slice(6));
			visit(n?.children);
			if (n?.slots) Object.values(n.slots).forEach(visit);
		}
	};
	trees.forEach(visit);
	return ids;
}
