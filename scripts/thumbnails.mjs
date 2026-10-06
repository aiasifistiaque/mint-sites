// Preset thumbnails (SB-08): shoots /__mint/fixture?preset=<key> with headless
// Chrome at 1280 px wide, scales it to 480 px and writes
// public/__mint/presets/<key>.png — or .jpg when a photo or gradient makes
// the PNG too big — served as /__mint/presets/… (the proxy leaves /__mint
// alone), plus src/presets/thumbnails.json. Commit them; each ≤ 40 KB. Then
// run npm run manifest.
//
//   npm run dev                       (the fixture is dev-only)
//   node scripts/thumbnails.mjs [key …]
//
// Env: BASE (default http://localhost:3300), CHROME_PATH (default: macOS
// Chrome). Uses macOS `sips` to scale; elsewhere scale with any tool and keep
// the size limit.
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = (process.env.BASE || 'http://localhost:3300').replace(/\/$/, '');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = path.join(import.meta.dirname, '..', 'public', '__mint', 'presets');
const MAX = 40 * 1024;
/** How tall each preset is at 1280 px (the shot is cut there); 800 when not listed. */
const HEIGHT = {
	'header-simple': 80, 'header-bar': 80, 'header-centered': 80, 'header-stacked': 130,
	'footer-simple': 280, 'footer-centered': 300, 'footer-columns': 380,
	logos: 170, stats: 240, 'page-title': 300, 'cta-card': 260, 'testimonial-single': 380, 'cta-banner': 400, steps: 420,
	newsletter: 420, 'countdown-banner': 480, faq: 500, 'not-found': 520, 'features-split': 520, 'testimonials-grid': 520,
	'features-grid': 560, 'product-grid': 580, 'blog-list': 600, 'hero-minimal': 600, 'testimonials-carousel': 600,
	'hero-signup': 620, 'features-cards': 640, 'services-tabs': 680, 'pricing-two': 700, 'pricing-three': 720,
	'hero-image': 720, 'hero-split': 720,
};

const manifest = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '..', 'block-manifest.json'), 'utf8'));
const wanted = process.argv.slice(2);
const keys = manifest.presets.map(p => p.key).filter(k => !wanted.length || wanted.includes(k));
fs.mkdirSync(OUT, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'thumbs-'));
const profile = path.join(tmp, 'profile');

// Chrome writes the screenshot and then often lingers (its updater): wait
// for the file, then close it.
async function shoot(file, url, height) {
	const chrome = spawn(CHROME, [
		'--headless=new',
		'--disable-gpu',
		'--hide-scrollbars',
		'--no-first-run',
		'--disable-component-update',
		'--disable-background-networking',
		`--user-data-dir=${profile}`,
		`--window-size=1280,${height}`,
		'--virtual-time-budget=4000',
		`--screenshot=${file}`,
		url,
	], { stdio: 'ignore' });
	const started = Date.now();
	let last = -1;
	while (Date.now() - started < 60_000) {
		await new Promise(r => setTimeout(r, 500));
		const size = fs.existsSync(file) ? fs.statSync(file).size : -1;
		if (size > 0 && size === last) break;
		last = size;
	}
	chrome.kill('SIGKILL');
	if (!fs.existsSync(file)) throw new Error(`no screenshot for ${url}`);
}

let failed = 0;
for (const key of keys) {
	const raw = path.join(tmp, `${key}.png`);
	const png = path.join(OUT, `${key}.png`);
	const jpg = path.join(OUT, `${key}.jpg`);
	await shoot(raw, `${BASE}/__mint/fixture?preset=${encodeURIComponent(key)}`, HEIGHT[key] || 800);
	// PNG for flat sections; JPEG when a photo or gradient makes the PNG too big.
	fs.rmSync(png, { force: true });
	fs.rmSync(jpg, { force: true });
	execFileSync('sips', ['-Z', '480', raw, '--out', png], { stdio: 'ignore' });
	let file = png;
	if (fs.statSync(png).size > MAX) {
		fs.rmSync(png);
		execFileSync('sips', ['-Z', '480', '-s', 'format', 'jpeg', '-s', 'formatOptions', '75', raw, '--out', jpg], { stdio: 'ignore' });
		file = jpg;
	}
	const size = fs.statSync(file).size;
	const ok = size <= MAX;
	if (!ok) failed++;
	console.log(`${ok ? '✓' : '✗'} ${path.basename(file)} ${(size / 1024).toFixed(1)} KB`);
}
fs.rmSync(tmp, { recursive: true, force: true });

// key → file, read by src/presets/index.ts (then run npm run manifest).
const index = Object.fromEntries(
	fs.readdirSync(OUT).filter(f => /\.(png|jpg)$/.test(f)).sort().map(f => [f.replace(/\.(png|jpg)$/, ''), `/__mint/presets/${f}`])
);
fs.writeFileSync(path.join(import.meta.dirname, '..', 'src', 'presets', 'thumbnails.json'), JSON.stringify(index, null, '\t') + '\n');
if (failed) {
	console.error(`${failed} thumbnail(s) over 40 KB`);
	process.exit(1);
}
