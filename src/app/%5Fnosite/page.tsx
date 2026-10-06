import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'No site here', robots: { index: false } };

// Hosts that aren't a site are rewritten here (src/proxy.ts) → the root 404.
export default function NoSite() {
	notFound();
}
