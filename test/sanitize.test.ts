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
