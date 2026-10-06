import path from 'path';
import type { NextConfig } from 'next';

// Hosts whose images go through next/image; anything else is drawn with a plain
// <img> (src/blocks/image). Comma list, e.g. "bucket.s3.amazonaws.com,cdn.example.com".
const mediaHosts = (process.env.MEDIA_HOSTS || '')
	.split(',')
	.map(h => h.trim())
	.filter(Boolean);

// The tenant panel's addresses: only they may frame the editor's canvas.
const panelOrigins = (process.env.PANEL_ORIGINS || '')
	.split(',')
	.map(o => o.trim().replace(/\/$/, ''))
	.filter(Boolean);

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	// The monorepo root has its own lockfile; this app is its own root.
	turbopack: { root: path.join(__dirname) },
	images: {
		remotePatterns: mediaHosts.map(hostname => ({ protocol: 'https' as const, hostname })),
	},
	env: { NEXT_PUBLIC_MEDIA_HOSTS: mediaHosts.join(',') },
	async headers() {
		return [
			{
				source: '/__mint/edit',
				headers: [{ key: 'Content-Security-Policy', value: `frame-ancestors ${panelOrigins.join(' ') || "'none'"}` }],
			},
			// Sites themselves are never framed by anyone.
			{ source: '/((?!__mint/edit).*)', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] },
		];
	},
};

export default nextConfig;
