// Dev only: every block and preset in any theme, light or dark (SB-08).
//   /__mint/fixture                      the hand-made home page (fixtures/home.json)
//   ?view=blocks                         every block with its defaults
//   ?view=presets                        every preset, one after another
//   ?view=demo                           a 20-section page (the performance budget, SB-08)
//   ?view=richtext                       the text block: old Quill markup and plain HTML (docs/rich-text RT-00)
//   ?preset=<key>                        one preset alone (thumbnails are shot from this)
//   &theme=<key>  &mode=dark             any theme, light or dark
// 404 in production unless MINT_FIXTURES=1.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import home from '../../../../fixtures/home.json';
import { BLOCK_DEFS } from '@/blocks/defs';
import { PRESETS } from '@/presets';
import { SiteDocument } from '@/render/SiteDocument';
import { THEMES } from '@/themes';
import type { Node, RenderContext } from '@/types';

export const metadata: Metadata = { title: 'Block fixture', robots: { index: false } };

const preset = (key: string) => PRESETS.find(p => p.key === key)?.tree ?? [];

/** A sample site, so the header, logo, menu, socials and map have something to show. */
const SAMPLE: Omit<RenderContext, 'mode'> = {
	site: {
		name: 'Northwind Studio',
		tagline: 'Design for small businesses',
		logo: '',
		contact: { email: 'hello@example.com', address: 'Kungsgatan 1, Stockholm', phone: '+46 000 000' },
		social: { instagram: 'https://instagram.com/example', facebook: 'https://facebook.com/example', linkedin: 'https://linkedin.com/company/example' },
	},
	menu: [
		{ label: 'Home', path: '/' },
		{ label: 'Services', path: '/services' },
		{ label: 'About', path: '/about' },
		{ label: 'Contact', path: '/contact' },
	],
	path: '/services/design',
	crumbs: [
		{ label: 'Home', path: '/' },
		{ label: 'Services', path: '/services' },
		{ label: 'Design', path: '/services/design' },
	],
};

/** Every block (but overlays, saved sections and the parts that only live inside another) with its defaults. */
function blocksTree(): Node[] {
	const skip = new Set(['section', 'section-ref', 'modal', 'drawer', 'popover', 'tab', 'accordion-item']);
	let n = 0;
	const rekey = (nodes: Node[] = []): Node[] =>
		nodes.map(c => ({ ...c, id: `fx${String(++n).padStart(6, '0')}`, ...(c.children && { children: rekey(c.children) }) }));
	return BLOCK_DEFS.filter(d => !skip.has(d.type)).map(d => ({
		id: `fx${String(++n).padStart(6, '0')}`,
		type: 'section',
		props: { paddingY: 'sm' },
		children: [
			{ id: `fx${String(++n).padStart(6, '0')}`, type: 'text', props: { html: `<p><code>${d.type}</code> — ${d.label}</p>`, size: 'sm', muted: true } },
			{
				id: `fx${String(++n).padStart(6, '0')}`,
				type: d.type,
				props: d.defaults.props,
				...(d.defaults.style && { style: d.defaults.style }),
				...(d.slots?.children && { children: rekey(d.defaults.children || [{ id: 'x', type: 'text', props: { html: '<p>Inside</p>' } }]) }),
			},
		],
	}));
}

const UI = '<span class="ql-ui" contenteditable="false"></span>';
/** What a panel record held before docs/rich-text RT-00 (Quill's own markup), and what it saves now. */
const RICH_SAMPLES = {
	quill:
		'<h1>Saved by the old editor</h1><p class="ql-align-center">Centred, <strong>bold</strong>, <u>underlined</u>, <s>struck</s>, <span style="color: rgb(230, 0, 0);">red</span>.</p>' +
		`<ol><li data-list="bullet">${UI}Bullet one</li><li data-list="bullet" class="ql-indent-1">${UI}Nested bullet</li><li data-list="bullet" class="ql-indent-2">${UI}Deeper</li>` +
		`<li data-list="ordered">${UI}Numbered one</li><li data-list="ordered" class="ql-indent-1">${UI}Numbered nested</li></ol>` +
		'<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block" data-language="plain">const site = mint();</div><div class="ql-code-block" data-language="plain">site.render();</div></div>' +
		'<p class="ql-align-center"><img src="https://picsum.photos/id/1015/640/320" width="320"></p>',
	clean:
		'<h2>Saved by the editor now</h2><p>A paragraph with a <a href="/about">link</a>, <code>inline code</code>, H<sub>2</sub>O and x<sup>2</sup>.</p>' +
		'<blockquote>A quote, in the theme\'s muted colour.</blockquote><hr><h3>Subheading</h3><ul><li>One<ul><li>Two</li></ul></li></ul>' +
		'<p data-align="right">Right-aligned line.</p><pre>npm run dev\nnpm test</pre>',
};

function richTextTree(): Node[] {
	return Object.entries(RICH_SAMPLES).map(([key, html], i) => ({
		id: `rt${i}section`,
		type: 'section',
		props: { paddingY: 'sm' },
		children: [
			{ id: `rt${i}label`, type: 'text', props: { html: `<p><code>${key}</code></p>`, size: 'sm', muted: true } },
			{ id: `rt${i}text`, type: 'text', props: { html, size: 'base', muted: false } },
		],
	}));
}

export default async function Fixture({ searchParams }: { searchParams: Promise<{ theme?: string; mode?: string; view?: string; preset?: string }> }) {
	// Read the query first: that makes the route dynamic, so MINT_FIXTURES is checked when it runs, not at build.
	const q = await searchParams;
	if (process.env.NODE_ENV === 'production' && process.env.MINT_FIXTURES !== '1') notFound();
	const theme = THEMES.some(t => t.key === q.theme) ? q.theme : 'studio';
	// ?theme=dark kept working from SB-02
	const dark = q.mode === 'dark' || q.theme === 'dark';
	const one = q.preset ? PRESETS.find(p => p.key === q.preset) : null;
	if (q.preset && !one) notFound();
	const tree = one
		? one.tree
		: q.view === 'presets'
			? PRESETS.filter(p => p.category !== 'header' && p.category !== 'footer').flatMap(p => p.tree)
			: q.view === 'demo'
				? PRESETS.filter(p => !['header', 'footer', 'pages'].includes(p.category)).slice(0, 20).flatMap(p => p.tree)
			: q.view === 'richtext'
				? richTextTree()
			: q.view === 'blocks'
				? blocksTree()
				: (home.tree as Node[]);
	const chrome = !one && q.view !== 'presets';
	// (demo: header-bar + 20 sections + footer-columns)
	return (
		<SiteDocument
			theme={theme}
			colorScheme={dark ? 'dark' : 'light'}
			header={one ? [] : q.view === 'presets' ? PRESETS.filter(p => p.category === 'header').flatMap(p => p.tree) : chrome ? preset('header-bar') : []}
			tree={tree}
			footer={one ? [] : q.view === 'presets' ? PRESETS.filter(p => p.category === 'footer').flatMap(p => p.tree) : chrome ? preset('footer-columns') : []}
			ctx={{ mode: 'live', ...SAMPLE }}
		/>
	);
}
