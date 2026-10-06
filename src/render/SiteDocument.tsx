// Everything one page of a site needs: the theme's font stylesheet, the token
// variables, one <style> with every node's compiled styles, and the header,
// page and footer trees inside a themed wrapper.
import type { Node, RenderContext, TokenOverrides } from '@/types';
import { getTheme } from '@/themes';
import { collectAnchors } from './actions';
import { compileStyles } from './compileStyles';
import { RenderTree } from './RenderTree';
import { hasOverlays, OVERLAY_SCRIPT } from './overlays';
import { fontHref, mergeTokens, tokensToCss } from './tokens';

export type SiteDocumentProps = {
	theme?: string;
	tokens?: TokenOverrides | null;
	/** 'light' / 'dark' force one; 'system' follows the visitor */
	colorScheme?: 'light' | 'dark' | 'system';
	header?: Node[];
	tree: Node[];
	footer?: Node[];
	ctx?: Omit<RenderContext, 'anchors'>;
};

export function SiteDocument({ theme, tokens, colorScheme = 'light', header = [], tree, footer = [], ctx }: SiteDocumentProps) {
	const merged = mergeTokens(getTheme(theme).tokens, tokens);
	const href = fontHref(merged);
	const all = [...header, ...tree, ...footer];
	const context: RenderContext = { mode: 'live', ...ctx, anchors: collectAnchors([all]) };
	return (
		<>
			{href && (
				<>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
					<link rel='stylesheet' href={href} precedence='default' />
				</>
			)}
			<style dangerouslySetInnerHTML={{ __html: tokensToCss(merged, colorScheme === 'system' ? 'system' : 'toggle') }} />
			<style data-mint-nodes='' dangerouslySetInnerHTML={{ __html: compileStyles(all) }} />
			<div className='mint-site flex flex-col' {...(colorScheme !== 'system' ? { 'data-theme': colorScheme } : {})}>
				{header.length > 0 && <RenderTree nodes={header} ctx={context} />}
				<main className='flex-1'>
					<RenderTree nodes={tree} ctx={context} />
				</main>
				{footer.length > 0 && <RenderTree nodes={footer} ctx={context} />}
			</div>
			{context.mode === 'live' && hasOverlays([all]) && <script dangerouslySetInnerHTML={{ __html: OVERLAY_SCRIPT }} />}
		</>
	);
}
