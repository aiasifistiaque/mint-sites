'use client';

// The editor's canvas (backend docs/site-builder D9): the panel sends the
// draft over postMessage and this draws it with the real blocks and theme.
// Clicks select (nothing navigates), hovering highlights, and the selection
// and hover boxes are drawn here, inside the page, so they scroll with it.
// SB-06: drop lines for drags from the panel, moving a block by its handle,
// typing straight into headings / text / buttons / links, showing overlays,
// and passing shortcuts back to the panel. The canvas never changes the
// draft itself — it reports, and the panel applies.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { REGISTRY } from '@/blocks/registry';
import { sanitizeRichText } from '@/render/sanitize';
import { SiteDocument } from '@/render/SiteDocument';
import type { Node, PageData } from '@/types';
import { elementOf, findDrop, locate, type DropResult } from './drop';
import { isPanelMessage, type CanvasContext, type CanvasDesign, type CanvasLayout, type CanvasMessage, type Rect } from './protocol';

type State = {
	design: CanvasDesign;
	layout: CanvasLayout;
	tree: Node[];
	links: Record<string, string>;
	theme: 'light' | 'dark';
	readOnly: boolean;
	context: CanvasContext;
	data: PageData;
};

const findNode = (nodes: Node[] | undefined, id: string): Node | null => {
	for (const n of nodes || []) {
		if (n?.id === id) return n;
		const hit = findNode(n.children, id) || Object.values(n.slots || {}).reduce<Node | null>((f, s) => f || findNode(s, id), null);
		if (hit) return hit;
	}
	return null;
};

const rectOf = (el: HTMLElement | null): Rect | null => {
	if (!el) return null;
	const r = el.getBoundingClientRect();
	return { x: r.left, y: r.top, w: r.width, h: r.height };
};

/** Keys the panel handles even when the canvas has the focus. */
const isShortcut = (e: KeyboardEvent) => {
	const mod = e.metaKey || e.ctrlKey;
	const k = e.key.toLowerCase();
	if (mod && ['z', 'y', 'c', 'x', 'v', 'd'].includes(k)) return true;
	return ['delete', 'backspace', 'escape', 'arrowup', 'arrowdown'].includes(k);
};

/** Scrolls the canvas while a drag is near its top or bottom edge. */
const edgeScroll = (y: number) => {
	if (y < 48) window.scrollBy(0, -Math.ceil((48 - y) / 2));
	else if (y > window.innerHeight - 48) window.scrollBy(0, Math.ceil((y - (window.innerHeight - 48)) / 2));
};

type Editing = { id: string; prop: string; el: HTMLElement; rich: boolean; original: string };

export default function EditRoot({ origins, manifestVersion }: { origins: string[]; manifestVersion: string }) {
	const [state, setState] = useState<State | null>(null);
	const [selected, setSelected] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [boxes, setBoxes] = useState<{ selected: Rect | null; hovered: Rect | null }>({ selected: null, hovered: null });
	const [drop, setDropState] = useState<(DropResult & { at: { x: number; y: number } }) | null>(null);
	const dropRef = useRef(drop);
	const setDrop = (d: typeof drop) => {
		dropRef.current = d;
		setDropState(d);
	};
	const [openId, setOpenId] = useState<string | null>(null);
	const panel = useRef<string | null>(null);
	const lastHover = useRef<string | null>(null);
	const editing = useRef<Editing | null>(null);
	const moving = useRef<{ id: string; type: string; pointer: number } | null>(null);
	const stateRef = useRef(state);
	stateRef.current = state;

	const post = useCallback(
		(msg: CanvasMessage) => {
			if (panel.current) window.parent.postMessage(msg, panel.current);
			// Before the panel has spoken we don't know which allowed origin it is; the browser only delivers to the matching one.
			else for (const o of origins) window.parent.postMessage(msg, o);
		},
		[origins]
	);

	useEffect(() => {
		const onMessage = (e: MessageEvent) => {
			if (e.source !== window.parent || !origins.includes(e.origin) || !isPanelMessage(e.data)) return;
			panel.current = e.origin;
			const m = e.data;
			switch (m.type) {
				case 'init':
					setState({ design: m.design, layout: m.layout, tree: m.page.tree, links: m.links || {}, theme: m.theme, readOnly: !!m.readOnly, context: m.context || {}, data: m.data || {} });
					break;
				case 'tree':
					setState(s => (s ? { ...s, tree: m.tree, ...(m.layout !== undefined && { layout: m.layout }) } : s));
					break;
				case 'design':
					setState(s => (s ? { ...s, design: m.design } : s));
					break;
				case 'context':
					setState(s => (s ? { ...s, context: m.context || {} } : s));
					break;
				case 'data':
					setState(s => (s ? { ...s, data: m.data || {} } : s));
					break;
				case 'theme':
					setState(s => (s ? { ...s, theme: m.theme } : s));
					break;
				case 'select':
					setSelected(m.id);
					elementOf(m.id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
					break;
				case 'hover':
					setHovered(m.id);
					break;
				case 'open':
					setOpenId(m.id);
					break;
				case 'drag': {
					const s = stateRef.current;
					if (!s) return;
					edgeScroll(m.y);
					const res = findDrop(m.x, m.y, m.item.types, s.tree);
					setDrop({ ...res, at: { x: m.x, y: m.y } });
					post({ mint: 1, type: 'dropTarget', target: res.placement?.target ?? null, ...(res.reason && { reason: res.reason }) });
					break;
				}
				case 'dragend':
					setDrop(null);
					break;
			}
		};
		window.addEventListener('message', onMessage);
		post({ mint: 1, type: 'ready', manifestVersion });
		return () => window.removeEventListener('message', onMessage);
	}, [origins, manifestVersion, post]);

	// Shortcuts pressed in the canvas go to the panel (not while typing on the page).
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (editing.current || !isShortcut(e)) return;
			if (e.key === 'Escape' && moving.current) return;
			e.preventDefault();
			post({ mint: 1, type: 'key', key: e.key, meta: e.metaKey, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey });
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [post]);

	// The overlay the panel asked for (a pop-up, drawer or popover, or the one holding the selection).
	useEffect(() => {
		const el = elementOf(openId);
		if (!el) return;
		if (el instanceof HTMLDialogElement) {
			if (!el.open) el.show();
			return () => el.close();
		}
		if (typeof el.showPopover === 'function') {
			el.setAttribute('popover', 'manual');
			try {
				el.showPopover();
			} catch {}
			Object.assign(el.style, { position: 'fixed', top: '96px', left: '50%', transform: 'translateX(-50%)' });
			return () => {
				try {
					el.hidePopover();
				} catch {}
				el.setAttribute('popover', 'auto');
				el.removeAttribute('style');
			};
		}
	}, [openId, state]);

	// Selection and hover boxes follow layout changes, scrolling and resizing.
	useEffect(() => {
		let frame = 0;
		const measure = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const s = rectOf(elementOf(selected));
				const h = hovered && hovered !== selected ? rectOf(elementOf(hovered)) : null;
				setBoxes({ selected: s, hovered: h });
				const rects: Record<string, Rect> = {};
				if (selected && s) rects[selected] = s;
				if (hovered && h) rects[hovered] = h;
				post({ mint: 1, type: 'rects', rects });
				post({ mint: 1, type: 'height', px: document.documentElement.scrollHeight });
			});
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(document.body);
		const sel = elementOf(selected);
		if (sel) ro.observe(sel);
		window.addEventListener('scroll', measure, { passive: true, capture: true });
		window.addEventListener('resize', measure);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
			window.removeEventListener('scroll', measure, { capture: true });
			window.removeEventListener('resize', measure);
		};
	}, [selected, hovered, state, openId, post]);

	/** The block under the pointer — inside a saved section, the section-ref block itself. */
	const idAt = (target: EventTarget | null) =>
		target instanceof Element ? (target.closest<HTMLElement>('[data-mint-ref]') || target.closest<HTMLElement>('[data-n]'))?.dataset.n ?? null : null;

	const onClickCapture = (e: React.MouseEvent) => {
		// Nothing on the canvas navigates, submits or opens: a click selects.
		if (editing.current?.el.contains(e.target as globalThis.Node)) return;
		e.preventDefault();
		e.stopPropagation();
		const id = idAt(e.target);
		if (id) post({ mint: 1, type: 'click', id, shift: e.shiftKey });
	};
	const onMouseMove = (e: React.MouseEvent) => {
		if (moving.current) return;
		const id = idAt(e.target);
		if (id === lastHover.current) return;
		lastHover.current = id;
		setHovered(id);
		post({ mint: 1, type: 'hover', id });
	};
	const onMouseLeave = () => {
		lastHover.current = null;
		setHovered(null);
		post({ mint: 1, type: 'hover', id: null });
	};

	/* ------------------------------------------------------ inline text */

	const finishEditing = useCallback(
		(commit: boolean) => {
			const ed = editing.current;
			if (!ed) return;
			editing.current = null;
			const value = ed.rich ? sanitizeRichText(ed.el.innerHTML) : ed.el.innerText.replace(/\s+/g, ' ').trim();
			ed.el.removeAttribute('contenteditable');
			// Put back what React drew, so it can apply the change itself.
			ed.el.innerHTML = ed.original;
			if (commit && value !== (ed.rich ? sanitizeRichText(ed.original) : ed.el.innerText.replace(/\s+/g, ' ').trim()))
				post({ mint: 1, type: 'text', id: ed.id, prop: ed.prop, value });
		},
		[post]
	);

	const onDoubleClick = (e: React.MouseEvent) => {
		const s = stateRef.current;
		if (!s || s.readOnly || editing.current) return;
		const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-mint-text]') : null;
		const id = target?.closest<HTMLElement>('[data-n]')?.dataset.n;
		if (!target || !id || !locate(s.tree, id) || findNode(s.tree, id)?.locked) return;
		// A value that comes from data is changed in its record, not typed here.
		if ((target.closest<HTMLElement>('[data-n]')?.dataset.mintBound || '').split(' ').includes(target.dataset.mintText || '')) return;
		e.preventDefault();
		const rich = target.hasAttribute('data-mint-rich');
		editing.current = { id, prop: target.dataset.mintText!, el: target, rich, original: target.innerHTML };
		target.setAttribute('contenteditable', rich ? 'true' : 'plaintext-only');
		target.focus();
		// New lines as <p>, which rich text keeps (Chrome's default <div> would be stripped).
		if (rich) document.execCommand('defaultParagraphSeparator', false, 'p');
		const range = document.createRange();
		range.selectNodeContents(target);
		const sel = window.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
		const onKey = (k: KeyboardEvent) => {
			if (k.key === 'Escape') {
				k.preventDefault();
				finishEditing(false);
			} else if (k.key === 'Enter' && (!rich || k.metaKey || k.ctrlKey)) {
				k.preventDefault();
				finishEditing(true);
			}
		};
		const onBlur = () => {
			target.removeEventListener('keydown', onKey);
			finishEditing(true);
		};
		target.addEventListener('keydown', onKey);
		target.addEventListener('blur', onBlur, { once: true });
	};

	/* --------------------------------------- moving a block by its handle */

	const onHandleDown = (e: React.PointerEvent) => {
		const s = stateRef.current;
		const n = selected && s ? locate(s.tree, selected)?.node : null;
		if (!n || !s || s.readOnly || n.locked) return;
		e.preventDefault();
		e.stopPropagation();
		moving.current = { id: n.id, type: n.type, pointer: e.pointerId };
		const onMove = (ev: PointerEvent) => {
			const cur = stateRef.current;
			if (!cur || !moving.current) return;
			edgeScroll(ev.clientY);
			setDrop({ ...findDrop(ev.clientX, ev.clientY, [moving.current.type], cur.tree, moving.current.id), at: { x: ev.clientX, y: ev.clientY } });
		};
		const stop = (ev: PointerEvent | KeyboardEvent) => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', stop);
			window.removeEventListener('keydown', onEsc);
			const m = moving.current;
			const cur = dropRef.current;
			moving.current = null;
			setDrop(null);
			if (m && ev.type === 'pointerup' && cur?.placement) {
				const t = cur.placement.target;
				post({ mint: 1, type: 'move', id: m.id, parentId: t.parentId, index: t.index, ...(t.slot && { slot: t.slot }) });
			}
		};
		const onEsc = (k: KeyboardEvent) => k.key === 'Escape' && stop(k);
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', stop);
		window.addEventListener('keydown', onEsc);
	};

	const all = useMemo(() => (state ? [...(state.layout?.header || []), ...state.tree, ...(state.layout?.footer || [])] : []), [state]);
	const label = (id: string | null) => {
		const n = id ? findNode(all, id) : null;
		return n ? n.name || REGISTRY[n.type]?.def.label || n.type : '';
	};
	const movable = !!(state && !state.readOnly && selected && locate(state.tree, selected) && !findNode(state.tree, selected)?.locked);

	if (!state)
		return (
			<div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#888', padding: 24 }}>Loading the page…</div>
		);

	return (
		<div
			onClickCapture={onClickCapture}
			onDoubleClick={onDoubleClick}
			onSubmitCapture={e => e.preventDefault()}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}>
			<SiteDocument
				theme={state.design.theme}
				tokens={state.design.tokens}
				colorScheme={state.theme}
				header={state.layout?.header}
				tree={state.tree}
				footer={state.layout?.footer}
				sections={state.design.sections}
				ctx={{
					...state.context,
					mode: 'edit',
					pages: state.links,
					collections: state.data.nodes,
					scope: {
						record: state.data.record ?? undefined,
						site: { name: state.context.site?.name, tagline: state.context.site?.tagline, ...(state.context.site?.contact || {}) },
						content: state.data.contents,
						currency: state.data.currency,
					},
				}}
			/>
			{openId && (
				<div
					aria-hidden
					style={{ position: 'fixed', inset: 0, background: 'rgb(0 0 0 / 0.35)', zIndex: 49, pointerEvents: 'none' }}
				/>
			)}
			<Box rect={boxes.hovered} kind='hover' />
			<Box
				rect={boxes.selected}
				kind='select'
				label={label(selected)}
				onHandleDown={movable ? onHandleDown : undefined}
			/>
			{drop && <DropLine drop={drop} />}
		</div>
	);
}

const EDIT_BLUE = '#2563eb';
const EDIT_RED = '#dc2626';
const TOP = 2147483646;

function Box({ rect, kind, label, onHandleDown }: { rect: Rect | null; kind: 'hover' | 'select'; label?: string; onHandleDown?: (e: React.PointerEvent) => void }) {
	if (!rect) return null;
	const top = rect.y + window.scrollY;
	const left = rect.x + window.scrollX;
	return (
		<div
			aria-hidden
			style={{
				position: 'absolute',
				top,
				left,
				width: rect.w,
				height: rect.h,
				pointerEvents: 'none',
				zIndex: TOP,
				outline: kind === 'select' ? `2px solid ${EDIT_BLUE}` : `1px dashed ${EDIT_BLUE}`,
				outlineOffset: kind === 'select' ? -1 : 0,
			}}>
			{label && (
				<span
					onPointerDown={onHandleDown}
					title={onHandleDown ? 'Drag to move' : undefined}
					style={{
						position: 'absolute',
						top: top < 22 ? 0 : -22,
						left: -2,
						background: EDIT_BLUE,
						color: '#fff',
						font: '600 11px/1 system-ui, sans-serif',
						padding: '5px 7px',
						borderRadius: 4,
						whiteSpace: 'nowrap',
						pointerEvents: onHandleDown ? 'auto' : 'none',
						cursor: onHandleDown ? 'grab' : undefined,
						userSelect: 'none',
						touchAction: 'none',
					}}>
					{onHandleDown && <span style={{ marginRight: 5, letterSpacing: -1 }}>⠿</span>}
					{label}
				</span>
			)}
		</div>
	);
}

/** Where the drop would land: a line between blocks, a box for an empty container, or why it can't. */
function DropLine({ drop }: { drop: DropResult & { at: { x: number; y: number } } }) {
	const p = drop.placement;
	if (!p)
		return drop.reason ? (
			<div
				aria-hidden
				style={{
					position: 'fixed',
					top: drop.at.y + 14,
					left: Math.min(drop.at.x + 12, window.innerWidth - 260),
					maxWidth: 250,
					zIndex: TOP,
					pointerEvents: 'none',
					background: EDIT_RED,
					color: '#fff',
					font: '500 12px/1.35 system-ui, sans-serif',
					padding: '6px 8px',
					borderRadius: 6,
				}}>
				{drop.reason}
			</div>
		) : null;
	const r = p.line;
	return (
		<div
			aria-hidden
			style={{
				position: 'absolute',
				top: r.y + window.scrollY,
				left: r.x + window.scrollX,
				width: Math.max(r.w, 2),
				height: Math.max(r.h, 2),
				zIndex: TOP,
				pointerEvents: 'none',
				...(p.inside
					? { outline: `2px dashed ${EDIT_BLUE}`, outlineOffset: -2, background: 'rgb(37 99 235 / 0.08)', borderRadius: 6 }
					: { background: EDIT_BLUE, borderRadius: 2, boxShadow: `0 0 0 1px #fff` }),
			}}
		/>
	);
}
