// Shorthands for writing presets: nodes without ids get fixed ones from the
// preset's prefix and their order (`fea` → fea00001, fea00002 …), so a preset's
// ids never change unless its tree does. Inserted copies get fresh ids anyway.
import type { Action, Node, Preset, Style } from '@/types';

type Draft = Omit<Node, 'id' | 'props' | 'children'> & { id?: string; props?: Record<string, any>; children?: Draft[] };

export function preset(key: string, label: string, category: string, prefix: string, nodes: Draft[], extra: Partial<Preset> = {}): Preset {
	if (!/^[a-z]{3}$/.test(prefix)) throw new Error(`preset ${key}: prefix must be 3 letters`);
	let n = 0;
	const fill = (d: Draft): Node => {
		const node: Node = { ...d, id: d.id ?? `${prefix}${String(++n).padStart(5, '0')}`, props: d.props ?? {} } as Node;
		if (d.children) node.children = d.children.map(fill);
		return node;
	};
	return { key, label, category, thumbnail: '', ...extra, tree: nodes.map(fill) };
}

const base = (s?: Style) => (s ? { style: { base: s } } : {});

export const section = (props: Record<string, any>, children: Draft[], name?: string, style?: Node['style']): Draft => ({
	type: 'section',
	...(name && { name }),
	props,
	...(style && { style }),
	children,
});
export const stack = (props: Record<string, any>, children: Draft[], style?: Style, extra: Partial<Draft> = {}): Draft => ({
	type: 'stack',
	props: { direction: 'column', gap: 4, ...props },
	...base(style),
	...extra,
	children,
});
export const row = (props: Record<string, any>, children: Draft[], style?: Style) => stack({ direction: 'row', align: 'center', gap: 3, ...props }, children, style);
export const grid = (props: Record<string, any>, children: Draft[], style?: Style): Draft => ({
	type: 'grid',
	props: { columns: 3, columnsTablet: 2, columnsMobile: 1, gap: 6, ...props },
	...base(style),
	children,
});
export const heading = (text: string, level = 2, props: Record<string, any> = {}, style?: Style): Draft => ({
	type: 'heading',
	props: { text, level, ...props },
	...base(style),
});
export const text = (html: string, props: Record<string, any> = {}, style?: Style): Draft => ({
	type: 'text',
	props: { html: html.startsWith('<') ? html : `<p>${html}</p>`, ...props },
	...base(style),
});
export const eyebrow = (words: string) =>
	text(words, { size: 'sm' }, { color: 'primary', fontWeight: 600, tracking: 'wide', transform: 'uppercase' });
export const button = (label: string, href: string, variant = 'primary', size = 'md', props: Record<string, any> = {}): Draft => ({
	type: 'button',
	props: { label, variant, size, ...props },
	action: { type: 'link', href } as Action,
});
export const link = (textValue: string, href: string, tone = 'muted'): Draft => ({
	type: 'link',
	props: { text: textValue, tone },
	action: { type: 'link', href },
});
export const image = (w: number, h: number, label: string, props: Record<string, any> = {}, style?: Style): Draft => ({
	type: 'image',
	props: { src: `placeholder:${w}x${h}:${label}`, alt: label, ratio: 'auto', ...props },
	...base(style),
});
export const icon = (name: string, style: Style = { color: 'primary' }, size = 32): Draft => ({ type: 'icon', props: { name, size }, style: { base: style } });
export const card = (props: Record<string, any>, children: Draft[], style?: Style, action?: Action): Draft => ({
	type: 'card',
	props: { variant: 'outline', padding: 'md', gap: 3, ...props },
	...base(style),
	...(action && { action }),
	children,
});
export const block = (type: string, props: Record<string, any> = {}, style?: Style, children?: Draft[]): Draft => ({
	type,
	props,
	...base(style),
	...(children && { children }),
});

/** A centred title block for the top of a section: eyebrow, h2, one line. */
export const intro = (eye: string, title: string, line: string) =>
	stack({ gap: 3, align: 'center' }, [eyebrow(eye), heading(title, 2), text(line, { size: 'lg', muted: true })], { textAlign: 'center', marginBottom: 12, maxWidth: 'md', marginLeft: 'auto', marginRight: 'auto' });
