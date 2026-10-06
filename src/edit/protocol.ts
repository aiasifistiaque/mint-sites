// The editor ↔ canvas protocol (backend docs/site-builder "Editor ↔ canvas
// protocol", D9). The admin panel keeps a copy (admin
// src/app/site-builder/_components/protocol.ts) — change both together.
// Every message is { mint: 1, type, …payload }; each side ignores messages from
// any origin it doesn't trust. The canvas never saves: the panel owns the draft.
import type { Node, TokenOverrides } from '@/types';

export const PROTOCOL = 1;

export type CanvasDesign = { theme: string; tokens: TokenOverrides; colorScheme: 'light' | 'dark' | 'system' };
export type CanvasLayout = { header: Node[]; footer: Node[] } | null;
export type Rect = { x: number; y: number; w: number; h: number };

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
	  }
	| { mint: 1; type: 'tree'; tree: Node[]; layout?: CanvasLayout }
	| { mint: 1; type: 'design'; design: CanvasDesign }
	/** the panel's light / dark preview switch */
	| { mint: 1; type: 'theme'; theme: 'light' | 'dark' }
	| { mint: 1; type: 'select'; id: string | null }
	| { mint: 1; type: 'hover'; id: string | null }
	| { mint: 1; type: 'open'; id: string | null };

/** canvas → panel */
export type CanvasMessage =
	| { mint: 1; type: 'ready'; manifestVersion: string }
	| { mint: 1; type: 'click'; id: string; shift: boolean }
	| { mint: 1; type: 'hover'; id: string | null }
	/** selected + hovered, in the canvas viewport's coordinates, after layout or scroll */
	| { mint: 1; type: 'rects'; rects: Record<string, Rect> }
	| { mint: 1; type: 'height'; px: number };

export const isPanelMessage = (d: unknown): d is PanelMessage =>
	!!d && typeof d === 'object' && (d as { mint?: unknown }).mint === PROTOCOL && typeof (d as { type?: unknown }).type === 'string';
