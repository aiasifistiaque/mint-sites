// A published page as visitors get it: the site document (theme, styles,
// header, page, footer) plus the site's scripts — the tracker (pixels, the
// tenant's code tags) and mint.js when any widget is on.
import type { RenderData } from '@/lib/api';
import type { Node } from '@/types';
import { SiteDocument } from './SiteDocument';

export function LivePage({ data, slug, tree }: { data: RenderData; slug: string; tree?: Node[] }) {
	return (
		<>
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
					data-project={data.tags.tracker.project}
				/>
			)}
			{data.widgets.enabled.length > 0 && (
				<script
					async
					src={`${data.widgets.apiBase}/public/mint.js`}
					data-project={slug}
				/>
			)}
		</>
	);
}
