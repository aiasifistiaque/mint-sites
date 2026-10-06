import { describe, expect, it } from 'vitest';
import { contrast, TEXT_PAIRS } from '@/themes/contrast';
import { THEMES } from '@/themes';
import type { ColorToken } from '@/types';

describe('theme contrast (WCAG AA, 4.5:1)', () => {
	it('knows black on white', () => {
		expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 0);
		expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
	});
	for (const t of THEMES)
		for (const mode of ['light', 'dark'] as const)
			it(`${t.key} ${mode}`, () => {
				const c = t.tokens.colors;
				const bad = TEXT_PAIRS.map(([fg, bg]) => [fg, bg, contrast(c[fg as ColorToken][mode], c[bg as ColorToken][mode])] as const).filter(
					([, , r]) => r < 4.5
				);
				expect(bad.map(([fg, bg, r]) => `${fg} on ${bg}: ${r.toFixed(2)}`)).toEqual([]);
			});
});
