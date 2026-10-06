// The editor's canvas (backend docs/site-builder D9, SB-05): the tenant panel
// frames this page and drives it over postMessage (src/edit). Only the panel
// origins in PANEL_ORIGINS may frame it (next.config.ts) or talk to it.
import type { Metadata } from 'next';
import EditRoot from '@/edit/EditRoot';
import { buildManifest } from '@/manifest';

export const metadata: Metadata = { title: 'Canvas', robots: { index: false } };

let version: string | null = null;

export default function EditPage() {
	version ??= buildManifest().version;
	const origins = (process.env.PANEL_ORIGINS || '')
		.split(',')
		.map(s => s.trim().replace(/\/$/, ''))
		.filter(Boolean);
	return (
		<EditRoot
			origins={origins}
			manifestVersion={version}
		/>
	);
}
