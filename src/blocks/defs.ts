// Every block's schema, without its component — what the manifest script and
// the tests import. Add a new block here and in registry.ts.
import type { BlockDef } from '@/types';
import { def as button } from './button/schema';
import { def as container } from './container/schema';
import { def as divider } from './divider/schema';
import { def as drawer } from './drawer/schema';
import { def as embed } from './embed/schema';
import { def as grid } from './grid/schema';
import { def as heading } from './heading/schema';
import { def as icon } from './icon/schema';
import { def as image } from './image/schema';
import { def as link } from './link/schema';
import { def as modal } from './modal/schema';
import { def as popover } from './popover/schema';
import { def as section } from './section/schema';
import { def as sectionRef } from './section-ref/schema';
import { def as spacer } from './spacer/schema';
import { def as stack } from './stack/schema';
import { def as text } from './text/schema';
import { def as video } from './video/schema';
import { def as accordion } from './accordion/schema';
import { def as accordionItem } from './accordion-item/schema';
import { def as badge } from './badge/schema';
import { def as breadcrumbs } from './breadcrumbs/schema';
import { def as card } from './card/schema';
import { def as carousel } from './carousel/schema';
import { def as countdown } from './countdown/schema';
import { def as formPlaceholder } from './form-placeholder/schema';
import { def as gallery } from './gallery/schema';
import { def as header } from './header/schema';
import { def as logo } from './logo/schema';
import { def as map } from './map/schema';
import { def as marquee } from './marquee/schema';
import { def as navMenu } from './nav-menu/schema';
import { def as quote } from './quote/schema';
import { def as socialLinks } from './social-links/schema';
import { def as stat } from './stat/schema';
import { def as tab } from './tab/schema';
import { def as tabs } from './tabs/schema';

export const BLOCK_DEFS: BlockDef[] = [
	section,
	container,
	stack,
	grid,
	spacer,
	divider,
	heading,
	text,
	button,
	link,
	icon,
	image,
	video,
	embed,
	sectionRef,
	modal,
	drawer,
	popover,
	accordion,
	accordionItem,
	badge,
	breadcrumbs,
	card,
	carousel,
	countdown,
	formPlaceholder,
	gallery,
	header,
	logo,
	map,
	marquee,
	navMenu,
	quote,
	socialLinks,
	stat,
	tab,
	tabs,
];
