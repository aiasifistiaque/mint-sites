// A published page as visitors get it: the site document (theme, styles,
// header, page, footer) plus the site's scripts — the tenant's own (Site setup
// → Add script, SB-30), its structured data (SB-31), the tracker (pixels) and
// mint.js when any widget is on.
import type { RenderData } from '@/lib/api';
import type { Node } from '@/types';
import { SiteDocument } from './SiteDocument';
import { SiteCodeBody, SiteCodeHead } from './SiteCode';
import { JsonLd } from './JsonLd';

/** `notFound`: the 404 (drawn with another page's data) — no structured data. */
export function LivePage({ data, tree, origin, notFound }: { data: RenderData; slug: string; tree?: Node[]; origin?: string; notFound?: boolean }) {
	const code = data.tags.code;
	return (
		<>
			<SiteCodeHead html={code?.head} />
			<SiteCodeBody
				html={code?.bodyStart}
				place='bodyStart'
			/>
			{!notFound && (
				<JsonLd
					data={data}
					origin={origin || data.site.origin || ''}
				/>
			)}
			<SiteDocument
				theme={data.design.theme}
				tokens={data.design.tokens}
				colorScheme={data.design.colorScheme}
				header={data.layout?.header}
				tree={tree ?? data.page.tree}
				footer={data.layout?.footer}
				sections={data.design.sections}
				ctx={{
					mode: 'live',
					pages: data.links,
					site: { name: data.site.name, tagline: data.site.tagline, logo: data.site.logo, contact: data.site.contact, social: data.site.social },
					menu: data.menu,
					path: data.page.path,
					crumbs: data.crumbs,
					collections: data.data?.nodes,
					media: data.media,
					scope: {
						record: data.data?.record ?? undefined,
						site: { name: data.site.name, tagline: data.site.tagline, ...data.site.contact },
						content: data.data?.contents,
						currency: data.data?.currency,
						locale: data.site.locale,
					},
				}}
			/>
			{data.tags.tracker && (
				<script
					async
					src={data.tags.tracker.src}
					data-key={data.tags.tracker.key}
					{...(data.tags.tracker.noCode && code && { 'data-no-code': '' })}
				/>
			)}
			{data.widgets.enabled.length > 0 && (
				<script
					async
					src={`${data.widgets.apiBase}/public/mint.js`}
					data-key={data.widgets.key}
				/>
			)}
			<SiteCodeBody
				html={code?.bodyEnd}
				place='bodyEnd'
			/>
		</>
	);
}
