import type { Metadata } from 'next';
import './globals.css';

// No fonts at build time: each site's theme fonts load at runtime from Google
// Fonts (src/render/SiteDocument.tsx) — a build-time fetch fails on Vercel.
export const metadata: Metadata = { title: 'Mint site' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
