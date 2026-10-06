// Dev only: draws fixtures/home.json (every block) with the Studio theme,
// between the header and footer presets. ?theme=dark for dark tokens.
// 404 in production unless MINT_FIXTURES=1.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import home from '../../../../fixtures/home.json';
import { PRESETS } from '@/presets';
import { SiteDocument } from '@/render/SiteDocument';
import type { Node } from '@/types';

export const metadata: Metadata = { title: 'Block fixture', robots: { index: false } };

const preset = (key: string) => PRESETS.find(p => p.key === key)?.tree ?? [];

export default async function Fixture({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
	if (process.env.NODE_ENV === 'production' && process.env.MINT_FIXTURES !== '1') notFound();
	const { theme } = await searchParams;
	return (
		<SiteDocument
			theme='studio'
			colorScheme={theme === 'dark' ? 'dark' : 'light'}
			header={preset('header-simple')}
			tree={home.tree as Node[]}
			footer={preset('footer-simple')}
		/>
	);
}
