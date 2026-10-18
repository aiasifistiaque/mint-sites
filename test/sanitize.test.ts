import { describe, expect, it } from 'vitest';
import { isSafeHref, sanitizeRichText } from '@/render/sanitize';

describe('sanitizeRichText', () => {
	it('keeps the allowlist and drops attributes', () => {
		expect(sanitizeRichText('<p class="x" onclick="y">Hi <b>there</b> <i>you</i></p>')).toBe('<p>Hi <strong>there</strong> <em>you</em></p>');
	});
	it('drops scripts, styles and unknown tags', () => {
		expect(sanitizeRichText('<p>a<script>alert(1)</script><style>p{}</style><img src=x onerror=alert(1)><div>b</div></p>')).toBe('<p>ab</p>');
	});
	it('keeps safe links only', () => {
		expect(sanitizeRichText('<a href="/about">a</a>')).toBe('<a href="/about">a</a>');
		expect(sanitizeRichText('<a href="https://x.com">x</a>')).toBe('<a href="https://x.com" rel="noopener noreferrer" target="_blank">x</a>');
		expect(sanitizeRichText('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
		expect(sanitizeRichText('<a href="jav&#x61;script:alert(1)">x</a>')).toBe('<a>x</a>');
		expect(sanitizeRichText('<a href="java\nscript:alert(1)">x</a>')).toBe('<a>x</a>');
	});
	it('balances tags so it cannot close its wrapper', () => {
		expect(sanitizeRichText('</div></div><p>open <strong>bold')).toBe('<p>open <strong>bold</strong></p>');
		expect(sanitizeRichText('<ul><li>a</ul>')).toBe('<ul><li>a</li></ul>');
	});
	it('escapes stray brackets', () => {
		expect(sanitizeRichText('1 < 2 > 0 & <3')).toBe('1 &lt; 2 &gt; 0 &amp; &lt;3');
	});
	it('keeps headings the block lacks as the nearest it has', () => {
		expect(sanitizeRichText('<h1>Title</h1><p>Body</p><h6>Small</h6>')).toBe('<h2>Title</h2><p>Body</p><h4>Small</h4>');
	});
	it('keeps underline, strike, sub, sup, rules and code blocks', () => {
		expect(sanitizeRichText('<p><u>u</u> <s>s</s> <del>d</del> x<sub>2</sub> y<sup>3</sup></p><hr><pre data-language="plain">a &lt; b\nc</pre>')).toBe(
			'<p><u>u</u> <s>s</s> <s>d</s> x<sub>2</sub> y<sup>3</sup></p><hr><pre>a &lt; b\nc</pre>'
		);
	});
	it('keeps alignment as data-align only', () => {
		expect(sanitizeRichText('<p class="ql-align-center x">a</p><h3 style="text-align: right; color: red">b</h3><p data-align="evil">c</p>')).toBe(
			'<p data-align="center">a</p><h3 data-align="right">b</h3><p>c</p>'
		);
	});
	it('keeps safe images, lazy, with their size', () => {
		expect(sanitizeRichText('<p><img src="https://cdn.x/a.png" alt="A &quot;cat&quot;" width="300" onerror="alert(1)"></p>')).toBe(
			'<p><img src="https://cdn.x/a.png" alt="A &quot;cat&quot;" width="300" loading="lazy" decoding="async"></p>'
		);
		expect(sanitizeRichText('<img src="/media/b.jpg" style="width: 120px">')).toBe('<img src="/media/b.jpg" alt="" width="120" loading="lazy" decoding="async">');
		expect(sanitizeRichText('<img src="data:image/png;base64,AAA">')).toBe('');
		expect(sanitizeRichText('<img src="javascript:alert(1)">')).toBe('');
		expect(sanitizeRichText('<img src="//evil.com/x.png">')).toBe('');
	});
});

describe('sanitizeRichText — Quill 2 markup (records saved before RT-00)', () => {
	const ui = '<span class="ql-ui" contenteditable="false"></span>';
	it('turns bullet lists back into bullets', () => {
		expect(sanitizeRichText(`<ol><li data-list="bullet">${ui}One</li><li data-list="bullet">${ui}Two</li></ol>`)).toBe('<ul><li>One</li><li>Two</li></ul>');
	});
	it('nests by indent and splits mixed lists', () => {
		const html =
			`<ol><li data-list="ordered">${ui}A</li><li data-list="bullet" class="ql-indent-1">${ui}A.1</li>` +
			`<li data-list="bullet" class="ql-indent-1">${ui}A.2</li><li data-list="ordered">${ui}B</li><li data-list="bullet">${ui}C</li></ol>`;
		expect(sanitizeRichText(html)).toBe('<ol><li>A<ul><li>A.1</li><li>A.2</li></ul></li><li>B</li></ol><ul><li>C</li></ul>');
	});
	it('nests one level at most on a jump', () => {
		expect(sanitizeRichText(`<ol><li data-list="bullet">${ui}A</li><li data-list="bullet" class="ql-indent-3">${ui}B</li></ol>`)).toBe(
			'<ul><li>A<ul><li>B</li></ul></li></ul>'
		);
	});
	it('keeps an aligned list item', () => {
		expect(sanitizeRichText(`<ol><li data-list="bullet" class="ql-align-center">${ui}A</li></ol>`)).toBe('<ul><li data-align="center">A</li></ul>');
	});
	it('reads code blocks', () => {
		expect(
			sanitizeRichText(
				'<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block" data-language="plain">const a = 1;</div><div class="ql-code-block" data-language="plain"><br></div><div class="ql-code-block" data-language="plain">a &lt; b</div></div>'
			)
		).toBe('<pre>const a = 1;\n\na &lt; b</pre>');
	});
	it('reads the whole README §2 sample', () => {
		const quill =
			'<h1>Title</h1><p class="ql-align-center">Centered <u>under</u> <s>strike</s> <span style="color: rgb(230, 0, 0);">red</span></p>' +
			`<ol><li data-list="bullet">${ui}Bullet one</li><li data-list="bullet">${ui}Bullet two</li></ol>` +
			'<p><img src="https://cdn.x/a.png" width="300"></p>';
		expect(sanitizeRichText(quill)).toBe(
			'<h2>Title</h2><p data-align="center">Centered <u>under</u> <s>strike</s> red</p><ul><li>Bullet one</li><li>Bullet two</li></ul>' +
				'<p><img src="https://cdn.x/a.png" alt="" width="300" loading="lazy" decoding="async"></p>'
		);
	});
	it('keeps simple tables, without Quill’s row ids or merged cells', () => {
		const quill =
			'<table><tbody><tr><td data-row="row-ab12">Name</td><td data-row="row-ab12" class="ql-align-right">Price</td></tr>' +
			'<tr><td data-row="row-cd34" colspan="2" onclick="x()">Tea <strong>hot</strong></td></tr></tbody></table>';
		expect(sanitizeRichText(quill)).toBe(
			'<table><tbody><tr><td>Name</td><td data-align="right">Price</td></tr><tr><td>Tea <strong>hot</strong></td></tr></tbody></table>'
		);
		expect(sanitizeRichText('<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1')).toBe(
			'<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'
		);
	});
	it('leaves plain HTML lists alone', () => {
		expect(sanitizeRichText('<ol><li>a<ol><li>b</li></ol></li></ol>')).toBe('<ol><li>a<ol><li>b</li></ol></li></ol>');
	});
});

describe('isSafeHref', () => {
	it.each([
		['/about', true],
		['#top', true],
		['mailto:a@b.co', true],
		['tel:+15551234', true],
		['https://x.com', true],
		['//evil.com', false],
		['javascript:alert(1)', false],
		['data:text/html,x', false],
		['', false],
	])('%s → %s', (href, ok) => expect(isSafeHref(href)).toBe(ok));
});
