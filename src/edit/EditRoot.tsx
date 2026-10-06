'use client';

// The editor's canvas (backend docs/site-builder D9): the panel sends the
// draft over postMessage and this draws it with the real blocks and theme.
// Clicks select (nothing navigates), hovering highlights, and the selection
// and hover boxes are drawn here, inside the page, so they scroll with it.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { REGISTRY } from '@/blocks/registry';
import { SiteDocument } from '@/render/SiteDocument';
import type { Node } from '@/types';
import { isPanelMessage, type CanvasDesign, type CanvasLayout, type CanvasMessage, type Rect } from './protocol';

type State = { design: CanvasDesign; layout: CanvasLayout; tree: Node[]; links: Record<string, string>; theme: 'light' | 'dark' };

const findNode = (nodes: Node[] | undefined, id: string): Node | null => {
	for (const n of nodes || []) {
		if (n?.id === id) return n;
		const hit = findNode(n.children, id) || Object.values(n.slots || {}).reduce<Node | null>((f, s) => f || findNode(s, id), null);
		if (hit) return hit;
	}
	return null;
};

const elementOf = (id: string | null) => (id ? document.querySelector<HTMLElement>(`[data-n="${CSS.escape(id)}"]`) : null);

const rectOf = (el: HTMLElement | null): Rect | null => {
	if (!el) return null;
	const r = el.getBoundingClientRect();
	return { x: r.left, y: r.top, w: r.width, h: r.height };
};

export default function EditRoot({ origins, manifestVersion }: { origins: string[]; manifestVersion: string }) {
	const [state, setState] = useState<State | null>(null);
	const [selected, setSelected] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [boxes, setBoxes] = useState<{ selected: Rect | null; hovered: Rect | null }>({ selected: null, hovered: null });
	const panel = useRef<string | null>(null);
	const lastHover = useRef<string | null>(null);

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
					setState({ design: m.design, layout: m.layout, tree: m.page.tree, links: m.links || {}, theme: m.theme });
					break;
				case 'tree':
					setState(s => (s ? { ...s, tree: m.tree, ...(m.layout !== undefined && { layout: m.layout }) } : s));
					break;
				case 'design':
					setState(s => (s ? { ...s, design: m.design } : s));
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
			}
		};
		window.addEventListener('message', onMessage);
		post({ mint: 1, type: 'ready', manifestVersion });
		return () => window.removeEventListener('message', onMessage);
	}, [origins, manifestVersion, post]);

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
		window.addEventListener('scroll', measure, { passive: true });
		window.addEventListener('resize', measure);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
			window.removeEventListener('scroll', measure);
			window.removeEventListener('resize', measure);
		};
	}, [selected, hovered, state, post]);

	const idAt = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>('[data-n]')?.dataset.n ?? null : null);

	const onClickCapture = (e: React.MouseEvent) => {
		// Nothing on the canvas navigates, submits or opens: a click selects.
		e.preventDefault();
		e.stopPropagation();
		const id = idAt(e.target);
		if (id) post({ mint: 1, type: 'click', id, shift: e.shiftKey });
	};
	const onMouseMove = (e: React.MouseEvent) => {
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

	const all = useMemo(() => (state ? [...(state.layout?.header || []), ...state.tree, ...(state.layout?.footer || [])] : []), [state]);
	const label = (id: string | null) => {
		const n = id ? findNode(all, id) : null;
		return n ? n.name || REGISTRY[n.type]?.def.label || n.type : '';
	};

	if (!state)
		return (
			<div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#888', padding: 24 }}>Loading the page…</div>
		);

	return (
		<div
			onClickCapture={onClickCapture}
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
				ctx={{ mode: 'edit', pages: state.links }}
			/>
			<Box rect={boxes.hovered} kind='hover' />
			<Box rect={boxes.selected} kind='select' label={label(selected)} />
		</div>
	);
}

const EDIT_BLUE = '#2563eb';

function Box({ rect, kind, label }: { rect: Rect | null; kind: 'hover' | 'select'; label?: string }) {
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
				zIndex: 2147483646,
				outline: kind === 'select' ? `2px solid ${EDIT_BLUE}` : `1px dashed ${EDIT_BLUE}`,
				outlineOffset: kind === 'select' ? -1 : 0,
			}}>
			{label && (
				<span
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
					}}>
					{label}
				</span>
			)}
		</div>
	);
}
