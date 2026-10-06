// npm run manifest → block-manifest.json (commit it; the backend copies it
// with backend/scripts/siteBuilder/syncManifest.mjs).
import { writeFileSync } from 'fs';
import path from 'path';
import { buildManifest } from '../src/manifest';

const manifest = buildManifest();
const file = path.join(__dirname, '..', 'block-manifest.json');
writeFileSync(file, JSON.stringify(manifest, null, '\t') + '\n');
console.log(
	`block-manifest.json ${manifest.version}: ${manifest.blocks.length} blocks, ${manifest.presets.length} presets, ` +
		`${manifest.themes.length} theme(s), ${manifest.icons.length} icons`
);
