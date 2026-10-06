// The site builder's shared shapes (backend/docs/site-builder/README.md, "Data
// shapes"). The backend validates trees against the manifest these produce, so
// keep names stable — a rename here is a contract change.

/* ── Nodes ─────────────────────────────────────────────────────────────── */

export type Breakpoint = 'base' | 'md' | 'lg';

export type Node = {
	/** 8-char nanoid, unique within its tree */
	id: string;
	/** a block type from the manifest */
	type: string;
	/** label in the outline */
	name?: string;
	props: Record<string, any>;
	style?: Partial<Record<Breakpoint, Style>>;
	hidden?: Partial<Record<Breakpoint, boolean>>;
	/** prop key → where its value comes from (SB-09) */
	bind?: Record<string, Binding>;
	/** the default slot, only if the block has one */
	children?: Node[];
	/** named slots (tabs: one per tab; card: 'media' / 'body' …) */
	slots?: Record<string, Node[]>;
	/** buttons, links, cards, images (D12) */
	action?: Action;
	/** can't be moved or removed in the editor */
	locked?: boolean;
};

export type Action =
	| { type: 'link'; href: string; newTab?: boolean }
	| { type: 'page'; pageId: string; newTab?: boolean }
	| { type: 'open' | 'close' | 'toggle'; target: string }
	| { type: 'scroll'; target: string }
	| { type: 'widget'; widget: string; op?: 'open' | 'add'; bind?: Binding };

export type Binding =
	| { from: 'record'; field: string }
	| { from: 'item'; field: string }
	| { from: 'site'; field: string }
	| { from: 'content'; slug: string; field: string }
	| { from: 'customer'; field: string };

/* ── Style (D14) — fixed keys; values are tokens, enums or { n, unit } ──── */

export const COLOR_TOKENS = [
	'background',
	'foreground',
	'muted',
	'muted-foreground',
	'primary',
	'primary-foreground',
	'secondary',
	'secondary-foreground',
	'accent',
	'accent-foreground',
	'card',
	'card-foreground',
	'border',
	'ring',
	'success',
	'warning',
	'danger',
] as const;
export type ColorToken = (typeof COLOR_TOKENS)[number];
/** a colour in a style: a theme token, or transparent / white / black */
export type StyleColor = ColorToken | 'transparent' | 'white' | 'black';

export const SPACE_STEPS = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32] as const;
export type SpaceStep = (typeof SPACE_STEPS)[number];

export const RADIUS_TOKENS = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const;
export type RadiusToken = (typeof RADIUS_TOKENS)[number];

export const SHADOW_TOKENS = ['none', 'sm', 'md', 'lg'] as const;
export type ShadowToken = (typeof SHADOW_TOKENS)[number];

export const FONT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const;
export type FontSize = (typeof FONT_SIZES)[number];

export const MAX_WIDTHS = ['prose', 'sm', 'md', 'lg', 'xl', 'container', 'full'] as const;
export type MaxWidth = (typeof MAX_WIDTHS)[number];

export const LENGTH_UNITS = ['px', 'rem', '%', 'vh', 'vw'] as const;
export type Length = { n: number; unit: (typeof LENGTH_UNITS)[number] };

export type Style = {
	// layout
	display?: 'block' | 'flex' | 'grid' | 'none';
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	wrap?: 'wrap' | 'nowrap';
	gap?: SpaceStep;
	rowGap?: SpaceStep;
	align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	columns?: number; // 1–12
	colSpan?: number | 'full'; // 1–12
	// spacing
	paddingTop?: SpaceStep;
	paddingRight?: SpaceStep;
	paddingBottom?: SpaceStep;
	paddingLeft?: SpaceStep;
	marginTop?: SpaceStep | 'auto';
	marginRight?: SpaceStep | 'auto';
	marginBottom?: SpaceStep | 'auto';
	marginLeft?: SpaceStep | 'auto';
	// size
	width?: Length | 'auto' | 'full';
	maxWidth?: MaxWidth;
	minHeight?: Length;
	height?: Length | 'auto';
	aspectRatio?: '1/1' | '4/3' | '3/2' | '16/9' | '21/9' | '3/4' | '2/3' | '9/16' | 'auto';
	// background
	bgColor?: StyleColor;
	bgImage?: string; // media URL
	bgPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
	bgSize?: 'cover' | 'contain' | 'auto';
	bgOverlay?: StyleColor; // drawn over the image
	bgOverlayOpacity?: number; // 0–100
	gradient?: { from: StyleColor; to: StyleColor; angle: number };
	// border
	borderWidth?: 0 | 1 | 2 | 3 | 4;
	borderColor?: StyleColor;
	radius?: RadiusToken;
	shadow?: ShadowToken;
	// type
	fontSize?: FontSize;
	fontWeight?: 300 | 400 | 500 | 600 | 700 | 800;
	textAlign?: 'left' | 'center' | 'right' | 'justify';
	color?: StyleColor;
	leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
	tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
	transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
	// effects
	opacity?: number; // 0–100
	position?: 'static' | 'relative' | 'sticky';
	top?: SpaceStep; // sticky offset
	zIndex?: number; // 0–50
	overflow?: 'visible' | 'hidden' | 'auto' | 'clip';
};

export type StyleGroup = 'layout' | 'spacing' | 'size' | 'background' | 'border' | 'type' | 'effects';

/* ── Tokens (a theme's look, D3 / D10) ─────────────────────────────────── */

export type ColorPair = { light: string; dark: string };
export type FontToken = { family: string; weights: number[] };

export type Tokens = {
	colors: Record<ColorToken, ColorPair>;
	fonts: { heading: FontToken; body: FontToken; mono: FontToken };
	radius: Record<RadiusToken, string>;
	shadow: Record<ShadowToken, string>;
	/** CSS length per step of the space scale */
	space: Record<`${SpaceStep}`, string>;
	/** container width in px */
	container: number;
	button: { radius: RadiusToken; weight: number; uppercase: boolean };
};

/** A token override (SiteDesign.tokens): any part of Tokens, nested. */
export type TokenOverrides = {
	colors?: Partial<Record<ColorToken, Partial<ColorPair>>>;
	fonts?: Partial<Record<keyof Tokens['fonts'], Partial<FontToken>>>;
	radius?: Partial<Tokens['radius']>;
	shadow?: Partial<Tokens['shadow']>;
	space?: Partial<Tokens['space']>;
	container?: number;
	button?: Partial<Tokens['button']>;
};

/* ── Blocks and the manifest (D5) ──────────────────────────────────────── */

export type PropKind =
	| 'text'
	| 'textarea'
	| 'richtext'
	| 'number'
	| 'boolean'
	| 'select'
	| 'color'
	| 'image'
	| 'images'
	| 'video'
	| 'link'
	| 'icon'
	| 'page'
	| 'model'
	| 'field'
	| 'list'
	| 'source'
	/** a saved section's id (the design's `sections`) */
	| 'section';

export type PropDef = {
	key: string;
	label: string;
	kind: PropKind;
	options?: { value: string | number; label: string }[];
	default?: any;
	help?: string;
	bindable?: boolean;
	min?: number;
	max?: number;
	/** list rows */
	fields?: PropDef[];
};

export type BlockCategory =
	| 'layout'
	| 'basic'
	| 'media'
	| 'navigation'
	| 'overlay'
	| 'data'
	| 'commerce'
	| 'form'
	| 'widget';

export type SlotDef = { label?: string; allow?: string[] };

export type BlockDef = {
	type: string;
	label: string;
	category: BlockCategory;
	/** an icon name from the curated set */
	icon: string;
	description: string;
	/** one or two sentences for the AI */
	aiHint: string;
	props: PropDef[];
	slots?: { children?: SlotDef } & Record<string, SlotDef>;
	canBeChildOf?: string[];
	style: 'all' | StyleGroup[];
	defaults: { props: Record<string, any>; style?: Node['style']; children?: Node[] };
	/** needs JS on the page (modal, carousel …) */
	client?: boolean;
	/** which action types the block accepts (D12); none → no action */
	actions?: boolean;
};

export type SiteKind = 'shop' | 'business' | 'booking' | 'blog' | 'portfolio' | 'restaurant' | 'other';

export type Preset = {
	key: string;
	label: string;
	category: string;
	kinds?: SiteKind[];
	themes?: string[];
	/** path of a PNG under /presets, or '' until thumbnails are generated (SB-08) */
	thumbnail: string;
	tree: Node[];
};

export type Theme = {
	key: string;
	label: string;
	description: string;
	tokens: Tokens;
	preview: { bg: string; fg: string; primary: string; font: string };
};

/** A section saved in the design (SiteDesign.sections), placed with section-ref blocks. */
export type SavedSection = { name: string; tree: Node[] };

export type Limits = { maxNodes: number; maxDepth: number; maxBytes: number };

export type Manifest = {
	version: string;
	blocks: BlockDef[];
	presets: Preset[];
	themes: Theme[];
	tokens: Record<string, unknown>;
	fonts: { google: { family: string; category: string; weights: number[] }[]; system: string[] };
	style: Record<string, unknown>;
	icons: string[];
	embeds: string[];
	limits: Limits;
};

/* ── Rendering ─────────────────────────────────────────────────────────── */

export type RenderMode = 'live' | 'edit';

export type RenderContext = {
	mode: RenderMode;
	/** page id → path, for { type: 'page' } actions */
	pages?: Record<string, string>;
	/** ids that something links to (scroll / #node:) — they get an html id */
	anchors?: Set<string>;
	/** the design's saved sections, for section-ref blocks */
	sections?: Record<string, SavedSection>;
	/** drawing a saved section's own blocks (a saved section never holds another) */
	inSection?: boolean;
};
