// Everything one page of a site needs: the theme's font stylesheet, the token
// variables, one <style> with every node's compiled styles, and the header,
// page and footer trees inside a themed wrapper.
import type { Node, RenderContext, SavedSection, TokenOverrides } from '@/types';
import { getTheme } from '@/themes';
import { collectAnchors } from './actions';
import { compileStyles } from './compileStyles';
import { RenderTree } from './RenderTree';
import { interactiveScript, usedTypes } from './interactive';
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
	/** the design's saved sections (only the ones these trees use are drawn) */
	sections?: Record<string, SavedSection> | null;
	ctx?: Omit<RenderContext, 'anchors' | 'sections'>;
};

/** The saved sections the trees place (section-ref blocks), by id. */
export function usedSections(trees: Node[][], sections: Record<string, SavedSection> | null | undefined): Record<string, SavedSection> {
	const out: Record<string, SavedSection> = {};
	if (!sections) return out;
	const visit = (nodes?: Node[]) => {
		if (!Array.isArray(nodes)) return;
		for (const n of nodes) {
			const id = n?.type === 'section-ref' ? n.props?.section : null;
			if (typeof id === 'string' && Object.hasOwn(sections, id) && Array.isArray(sections[id]?.tree)) out[id] = sections[id];
			visit(n?.children);
			if (n?.slots) Object.values(n.slots).forEach(visit);
		}
	};
	trees.forEach(visit);
	return out;
}

export function SiteDocument({ theme, tokens, colorScheme = 'light', header = [], tree, footer = [], sections, ctx }: SiteDocumentProps) {
	const merged = mergeTokens(getTheme(theme).tokens, tokens);
	const all = [...header, ...tree, ...footer];
	const used = usedSections([all], sections);
	const savedTrees = Object.values(used).map(s => s.tree);
	const live = (ctx?.mode ?? 'live') === 'live';
	const href = fontHref(merged, { mono: !live || JSON.stringify([all, savedTrees]).includes('<code') });
	const context: RenderContext = { mode: 'live', ...ctx, anchors: collectAnchors([all, ...savedTrees]), sections: used };
	const script = live ? interactiveScript(usedTypes([all, ...savedTrees])) : '';
	return (
		<>
			{href && (
				<>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
					{live ? (
						// Published pages don't wait for Google Fonts: the text shows in the
						// fallback at once and swaps when the font arrives (display=swap) —
						// a stylesheet added from script doesn't block the first paint.
						<>
							<link rel='preload' as='style' href={href} />
							<script dangerouslySetInnerHTML={{ __html: `(()=>{const l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(href)};document.head.appendChild(l)})()` }} />
							<noscript>
								<link rel='stylesheet' href={href} />
							</noscript>
						</>
					) : (
						<link rel='stylesheet' href={href} precedence='default' />
					)}
				</>
			)}
			<style dangerouslySetInnerHTML={{ __html: tokensToCss(merged, colorScheme === 'system' ? 'system' : 'toggle') }} />
			<style data-mint-nodes='' dangerouslySetInnerHTML={{ __html: compileStyles([...all, ...savedTrees.flat()]) }} />
			<div className='mint-site flex flex-col' {...(colorScheme !== 'system' ? { 'data-theme': colorScheme } : {})}>
				{header.length > 0 && <RenderTree nodes={header} ctx={context} />}
				<main className='flex-1'>
					<RenderTree nodes={tree} ctx={context} />
				</main>
				{footer.length > 0 && <RenderTree nodes={footer} ctx={context} />}
			</div>
			{live && hasOverlays([all, ...savedTrees]) && <script dangerouslySetInnerHTML={{ __html: OVERLAY_SCRIPT }} />}
			{script && <script dangerouslySetInnerHTML={{ __html: script }} />}
		</>
	);
}
