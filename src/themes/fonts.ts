// The Google Fonts a site may use (SB-07): the Design tab's font picker lists
// these, the backend's validator allows only these (plus the system stacks),
// and fontHref asks only for weights a family really has — Google answers 400
// for the whole stylesheet if one weight is missing. Checked against
// fonts.googleapis.com when added (scripts: `npm test` doesn't go online).

export type FontCategory = 'sans' | 'serif' | 'display' | 'mono' | 'hand';
export type FontDef = { family: string; category: FontCategory; weights: number[] };

const range = (from: number, to: number) => Array.from({ length: (to - from) / 100 + 1 }, (_, i) => from + i * 100);

export const FONTS: FontDef[] = [
	// sans
	{ family: 'Inter', category: 'sans', weights: range(100, 900) },
	{ family: 'Roboto', category: 'sans', weights: range(100, 900) },
	{ family: 'Open Sans', category: 'sans', weights: range(300, 800) },
	{ family: 'Lato', category: 'sans', weights: [100, 300, 400, 700, 900] },
	{ family: 'Montserrat', category: 'sans', weights: range(100, 900) },
	{ family: 'Poppins', category: 'sans', weights: range(100, 900) },
	{ family: 'Nunito', category: 'sans', weights: range(200, 900) },
	{ family: 'Work Sans', category: 'sans', weights: range(100, 900) },
	{ family: 'DM Sans', category: 'sans', weights: range(100, 900) },
	{ family: 'Manrope', category: 'sans', weights: range(200, 800) },
	{ family: 'Plus Jakarta Sans', category: 'sans', weights: range(200, 800) },
	{ family: 'Outfit', category: 'sans', weights: range(100, 900) },
	{ family: 'Figtree', category: 'sans', weights: range(300, 900) },
	{ family: 'IBM Plex Sans', category: 'sans', weights: range(100, 700) },
	{ family: 'Source Sans 3', category: 'sans', weights: range(200, 900) },
	{ family: 'Raleway', category: 'sans', weights: range(100, 900) },
	{ family: 'Rubik', category: 'sans', weights: range(300, 900) },
	{ family: 'Karla', category: 'sans', weights: range(200, 800) },
	{ family: 'Space Grotesk', category: 'sans', weights: range(300, 700) },
	{ family: 'Sora', category: 'sans', weights: range(100, 800) },
	{ family: 'Lexend', category: 'sans', weights: range(100, 900) },
	{ family: 'Mulish', category: 'sans', weights: range(200, 900) },
	{ family: 'Archivo', category: 'sans', weights: range(100, 900) },
	{ family: 'Public Sans', category: 'sans', weights: range(100, 900) },
	{ family: 'Barlow', category: 'sans', weights: range(100, 900) },
	{ family: 'Josefin Sans', category: 'sans', weights: range(100, 700) },
	// serif
	{ family: 'Playfair Display', category: 'serif', weights: range(400, 900) },
	{ family: 'Merriweather', category: 'serif', weights: range(300, 900) },
	{ family: 'Lora', category: 'serif', weights: range(400, 700) },
	{ family: 'EB Garamond', category: 'serif', weights: range(400, 800) },
	{ family: 'Cormorant Garamond', category: 'serif', weights: range(300, 700) },
	{ family: 'Libre Baskerville', category: 'serif', weights: [400, 700] },
	{ family: 'Fraunces', category: 'serif', weights: range(100, 900) },
	{ family: 'Crimson Pro', category: 'serif', weights: range(200, 900) },
	{ family: 'Source Serif 4', category: 'serif', weights: range(200, 900) },
	{ family: 'Spectral', category: 'serif', weights: range(200, 800) },
	{ family: 'Bitter', category: 'serif', weights: range(100, 900) },
	{ family: 'DM Serif Display', category: 'serif', weights: [400] },
	{ family: 'Instrument Serif', category: 'serif', weights: [400] },
	// display
	{ family: 'Bebas Neue', category: 'display', weights: [400] },
	{ family: 'Oswald', category: 'display', weights: range(200, 700) },
	{ family: 'Abril Fatface', category: 'display', weights: [400] },
	{ family: 'Syne', category: 'display', weights: range(400, 800) },
	{ family: 'Unbounded', category: 'display', weights: range(200, 900) },
	// mono
	{ family: 'JetBrains Mono', category: 'mono', weights: range(100, 800) },
	{ family: 'Fira Code', category: 'mono', weights: range(300, 700) },
	{ family: 'IBM Plex Mono', category: 'mono', weights: range(100, 700) },
	{ family: 'Space Mono', category: 'mono', weights: [400, 700] },
	{ family: 'Roboto Mono', category: 'mono', weights: range(100, 700) },
	{ family: 'Source Code Pro', category: 'mono', weights: range(200, 900) },
	// hand
	{ family: 'Caveat', category: 'hand', weights: range(400, 700) },
	{ family: 'Pacifico', category: 'hand', weights: [400] },
];

export const FONT_BY_FAMILY = new Map(FONTS.map(f => [f.family, f]));

/** The weights to ask Google for: the ones wanted that the family has, else its closest one to each. */
export function availableWeights(family: string, wanted: number[]): number[] {
	const f = FONT_BY_FAMILY.get(family);
	if (!f) return wanted;
	const out = new Set<number>();
	for (const w of wanted) {
		if (f.weights.includes(w)) out.add(w);
		else out.add(f.weights.reduce((best, x) => (Math.abs(x - w) < Math.abs(best - w) ? x : best), f.weights[0]));
	}
	return [...out].sort((a, b) => a - b);
}
