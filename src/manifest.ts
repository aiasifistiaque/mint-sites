// The block manifest (D5): blocks, presets, themes, token + style schemas,
// icons, embed hosts and limits. `npm run manifest` writes it to
// block-manifest.json; the backend keeps a synced copy and validates every
// tree against it, and the editor and the AI read it from the backend.
import { createHash } from 'crypto';
import { BLOCK_DEFS } from '@/blocks/defs';
import { EMBED_HOSTS } from '@/blocks/embed/schema';
import { ICON_NAMES } from '@/blocks/icon/icons';
import { PRESETS } from '@/presets';
import { styleManifest } from '@/render/styleSchema';
import { FONTS_MANIFEST, TOKENS_SCHEMA } from '@/render/tokens';
import { THEMES } from '@/themes';
import type { Manifest } from '@/types';

export const LIMITS = { maxNodes: 1500, maxDepth: 30, maxBytes: 512 * 1024 };

/** JSON with object keys sorted, so the hash only changes when content does. */
export function stableStringify(value: unknown): string {
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
	if (value && typeof value === 'object')
		return `{${Object.keys(value)
			.sort()
			.filter(k => (value as any)[k] !== undefined)
			.map(k => `${JSON.stringify(k)}:${stableStringify((value as any)[k])}`)
			.join(',')}}`;
	return JSON.stringify(value);
}

export function buildManifest(): Manifest {
	const content = {
		blocks: [...BLOCK_DEFS].sort((a, b) => a.type.localeCompare(b.type)),
		presets: [...PRESETS].sort((a, b) => a.key.localeCompare(b.key)),
		themes: [...THEMES].sort((a, b) => a.key.localeCompare(b.key)),
		tokens: TOKENS_SCHEMA,
		fonts: FONTS_MANIFEST,
		style: styleManifest(),
		icons: ICON_NAMES,
		embeds: [...EMBED_HOSTS].sort(),
		limits: LIMITS,
	};
	const version = createHash('sha1').update(stableStringify(content)).digest('hex').slice(0, 12);
	return { version, ...content } as Manifest;
}
