import path from 'path';
import type { NextConfig } from 'next';

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
	// No image optimizer: billed per image on Vercel, and every tenant's
	// pictures would go through it. Images are plain <img> (src/blocks/image).
	images: { unoptimized: true },
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
