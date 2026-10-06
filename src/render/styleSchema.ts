// The fixed list of style keys (README "Style", D14). One table drives three
// things: compileStyles (CSS), the manifest's `style` part (the backend
// validator and the editor's Style panel read it) and value checks. A value
// that doesn't fit its key is dropped — never passed through as CSS.
import {
	COLOR_TOKENS,
	FONT_SIZES,
	LENGTH_UNITS,
	MAX_WIDTHS,
	RADIUS_TOKENS,
	SHADOW_TOKENS,
	SPACE_STEPS,
	type Length,
	type StyleGroup,
} from '@/types';

export type StyleKeyDef =
	| { group: StyleGroup; kind: 'enum'; values: readonly (string | number)[] }
	| { group: StyleGroup; kind: 'space'; auto?: boolean }
	| { group: StyleGroup; kind: 'color' }
	| { group: StyleGroup; kind: 'int'; min: number; max: number; also?: readonly string[] }
	| { group: StyleGroup; kind: 'length'; values?: readonly string[] }
	| { group: StyleGroup; kind: 'url' }
	| { group: StyleGroup; kind: 'gradient' };

const e = (group: StyleGroup, values: readonly (string | number)[]): StyleKeyDef => ({ group, kind: 'enum', values });

export const STYLE_COLORS = [...COLOR_TOKENS, 'transparent', 'white', 'black'] as const;

export const STYLE_SCHEMA: Record<string, StyleKeyDef> = {
	display: e('layout', ['block', 'flex', 'grid', 'none']),
	direction: e('layout', ['row', 'column', 'row-reverse', 'column-reverse']),
	wrap: e('layout', ['wrap', 'nowrap']),
	gap: { group: 'layout', kind: 'space' },
	rowGap: { group: 'layout', kind: 'space' },
	align: e('layout', ['start', 'center', 'end', 'stretch', 'baseline']),
	justify: e('layout', ['start', 'center', 'end', 'between', 'around', 'evenly']),
	columns: { group: 'layout', kind: 'int', min: 1, max: 12 },
	colSpan: { group: 'layout', kind: 'int', min: 1, max: 12, also: ['full'] },

	paddingTop: { group: 'spacing', kind: 'space' },
	paddingRight: { group: 'spacing', kind: 'space' },
	paddingBottom: { group: 'spacing', kind: 'space' },
	paddingLeft: { group: 'spacing', kind: 'space' },
	marginTop: { group: 'spacing', kind: 'space', auto: true },
	marginRight: { group: 'spacing', kind: 'space', auto: true },
	marginBottom: { group: 'spacing', kind: 'space', auto: true },
	marginLeft: { group: 'spacing', kind: 'space', auto: true },

	width: { group: 'size', kind: 'length', values: ['auto', 'full'] },
	maxWidth: e('size', MAX_WIDTHS),
	minHeight: { group: 'size', kind: 'length' },
	height: { group: 'size', kind: 'length', values: ['auto'] },
	aspectRatio: e('size', ['1/1', '4/3', '3/2', '16/9', '21/9', '3/4', '2/3', '9/16', 'auto']),

	bgColor: { group: 'background', kind: 'color' },
	bgImage: { group: 'background', kind: 'url' },
	bgPosition: e('background', ['center', 'top', 'bottom', 'left', 'right']),
	bgSize: e('background', ['cover', 'contain', 'auto']),
	bgOverlay: { group: 'background', kind: 'color' },
	bgOverlayOpacity: { group: 'background', kind: 'int', min: 0, max: 100 },
	gradient: { group: 'background', kind: 'gradient' },

	borderWidth: e('border', [0, 1, 2, 3, 4]),
	borderColor: { group: 'border', kind: 'color' },
	radius: e('border', RADIUS_TOKENS),
	shadow: e('border', SHADOW_TOKENS),

	fontSize: e('type', FONT_SIZES),
	fontWeight: e('type', [300, 400, 500, 600, 700, 800]),
	textAlign: e('type', ['left', 'center', 'right', 'justify']),
	color: { group: 'type', kind: 'color' },
	leading: e('type', ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose']),
	tracking: e('type', ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']),
	transform: e('type', ['none', 'uppercase', 'lowercase', 'capitalize']),

	opacity: { group: 'effects', kind: 'int', min: 0, max: 100 },
	position: e('effects', ['static', 'relative', 'sticky']),
	top: { group: 'effects', kind: 'space' },
	zIndex: { group: 'effects', kind: 'int', min: 0, max: 50 },
	overflow: e('effects', ['visible', 'hidden', 'auto', 'clip']),
};

/** Length limits per unit, so a value can't blow the page up. */
export const LENGTH_MAX: Record<Length['unit'], number> = { px: 4000, rem: 250, '%': 100, vh: 100, vw: 100 };

const isInt = (v: unknown, min: number, max: number) =>
	typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

export const isLength = (v: any): v is Length =>
	!!v &&
	typeof v === 'object' &&
	typeof v.n === 'number' &&
	Number.isFinite(v.n) &&
	(LENGTH_UNITS as readonly string[]).includes(v.unit) &&
	v.n >= 0 &&
	v.n <= LENGTH_MAX[v.unit as Length['unit']];

/** Relative paths and http(s) only — the same rule as the backend's URL check. */
export const isSafeMediaUrl = (v: unknown): v is string =>
	typeof v === 'string' && v.length <= 2048 && (/^https?:\/\/[^\s]+$/i.test(v) || /^\/[^\s/][^\s]*$/.test(v) || v === '/');

export const isStyleColor = (v: unknown) => (STYLE_COLORS as readonly unknown[]).includes(v);

/** Is `value` allowed for style key `key`? Unknown keys are not. */
export function isValidStyleValue(key: string, value: unknown): boolean {
	const def = STYLE_SCHEMA[key];
	if (!def) return false;
	switch (def.kind) {
		case 'enum':
			return def.values.includes(value as any);
		case 'space':
			return (SPACE_STEPS as readonly unknown[]).includes(value) || (!!def.auto && value === 'auto');
		case 'color':
			return isStyleColor(value);
		case 'int':
			return isInt(value, def.min, def.max) || (def.also || []).includes(value as string);
		case 'length':
			return (def.values || []).includes(value as string) || isLength(value);
		case 'url':
			return isSafeMediaUrl(value);
		case 'gradient': {
			const g = value as any;
			return !!g && isStyleColor(g.from) && isStyleColor(g.to) && isInt(g.angle, 0, 360);
		}
	}
}

/** The manifest's `style` part: every key with its group and allowed values. */
export function styleManifest() {
	return Object.fromEntries(
		Object.entries(STYLE_SCHEMA).map(([key, def]) => {
			const out: Record<string, unknown> = { ...def };
			if (def.kind === 'space') out.values = [...SPACE_STEPS, ...(def.auto ? ['auto'] : [])];
			if (def.kind === 'color') out.values = [...STYLE_COLORS];
			if (def.kind === 'length') out.units = { ...LENGTH_MAX };
			return [key, out];
		})
	);
}
