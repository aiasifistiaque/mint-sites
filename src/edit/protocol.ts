// The editor ↔ canvas protocol (backend docs/site-builder "Editor ↔ canvas
// protocol", D9). The admin panel keeps a copy (admin
// src/app/site-builder/_components/protocol.ts) — change both together.
// Every message is { mint: 1, type, …payload }; each side ignores messages from
// any origin it doesn't trust. The canvas never saves: the panel owns the draft.
import type { MenuItem, Node, SavedSection, SiteInfo, TokenOverrides } from '@/types';

export const PROTOCOL = 1;

export type CanvasDesign = {
	theme: string;
	tokens: TokenOverrides;
	colorScheme: 'light' | 'dark' | 'system';
	/** the draft's saved sections, for section-ref blocks */
	sections?: Record<string, SavedSection>;
};
/** What blocks show from the site itself: name, logo, contact, the menu, this page's place (SB-08). */
export type CanvasContext = { site?: SiteInfo; menu?: MenuItem[]; path?: string; crumbs?: MenuItem[] };
export type CanvasLayout = { header: Node[]; footer: Node[] } | null;
export type Rect = { x: number; y: number; w: number; h: number };
/** Where a dragged block would land: inside `parentId` (null = the page itself), in `slot`, at `index`. */
export type DropTarget = { parentId: string | null; slot?: string; index: number };
/** What's being dragged from the Add panel: the types of its top-level blocks (a preset may have several). */
export type DragItem = { types: string[]; label: string };

/** panel → canvas */
export type PanelMessage =
	| {
			mint: 1;
			type: 'init';
			design: CanvasDesign;
			layout: CanvasLayout;
			page: { tree: Node[] };
			/** page id → path, for { type: 'page' } actions */
			links?: Record<string, string>;
			theme: 'light' | 'dark';
			/** a role that can't change the site: no dragging or typing on the canvas */
			readOnly?: boolean;
			context?: CanvasContext;
	  }
	| { mint: 1; type: 'context'; context: CanvasContext }
	| { mint: 1; type: 'tree'; tree: Node[]; layout?: CanvasLayout }
	| { mint: 1; type: 'design'; design: CanvasDesign }
	/** the panel's light / dark preview switch */
	| { mint: 1; type: 'theme'; theme: 'light' | 'dark' }
	| { mint: 1; type: 'select'; id: string | null }
	| { mint: 1; type: 'hover'; id: string | null }
	/** show an overlay (pop-up, drawer, popover) on the canvas; null closes it */
	| { mint: 1; type: 'open'; id: string | null }
	/** a drag from the Add panel is over the canvas, at x / y in the canvas's own viewport */
	| { mint: 1; type: 'drag'; x: number; y: number; item: DragItem }
	/** the drag left the canvas or ended: stop drawing the drop line */
	| { mint: 1; type: 'dragend' };

/** canvas → panel */
export type CanvasMessage =
	| { mint: 1; type: 'ready'; manifestVersion: string }
	| { mint: 1; type: 'click'; id: string; shift: boolean }
	| { mint: 1; type: 'hover'; id: string | null }
	/** selected + hovered, in the canvas viewport's coordinates, after layout or scroll */
	| { mint: 1; type: 'rects'; rects: Record<string, Rect> }
	| { mint: 1; type: 'height'; px: number }
	/** answer to 'drag': where it would land, or why it can't (null target) */
	| { mint: 1; type: 'dropTarget'; target: DropTarget | null; reason?: string }
	/** a block dragged by its handle on the canvas was dropped */
	| { mint: 1; type: 'move'; id: string; parentId: string | null; slot?: string; index: number }
	/** text typed straight onto the canvas (double click a heading, text, button or link) */
	| { mint: 1; type: 'text'; id: string; prop: string; value: string }
	/** a shortcut pressed while the canvas has the focus — the panel handles it */
	| { mint: 1; type: 'key'; key: string; meta: boolean; ctrl: boolean; shift: boolean; alt: boolean };

export const isPanelMessage = (d: unknown): d is PanelMessage =>
	!!d && typeof d === 'object' && (d as { mint?: unknown }).mint === PROTOCOL && typeof (d as { type?: unknown }).type === 'string';
