// type → { def, Component }. Explicit imports so only the blocks a page uses
// end up in it. Server components by default; a block with `client: true`
// must be imported through next/dynamic here so its JS loads only on pages
// that have it, e.g.:
//   const Modal = dynamic(() => import('./modal'));
import type { BlockEntry } from './types';
import Button from './button';
import { def as buttonDef } from './button/schema';
import Container from './container';
import { def as containerDef } from './container/schema';
import Divider from './divider';
import { def as dividerDef } from './divider/schema';
import Drawer from './drawer';
import { def as drawerDef } from './drawer/schema';
import Embed from './embed';
import { def as embedDef } from './embed/schema';
import Grid from './grid';
import { def as gridDef } from './grid/schema';
import Heading from './heading';
import { def as headingDef } from './heading/schema';
import Icon from './icon';
import { def as iconDef } from './icon/schema';
import Image from './image';
import { def as imageDef } from './image/schema';
import Link from './link';
import { def as linkDef } from './link/schema';
import Modal from './modal';
import { def as modalDef } from './modal/schema';
import Popover from './popover';
import { def as popoverDef } from './popover/schema';
import Section from './section';
import { def as sectionDef } from './section/schema';
import SectionRef from './section-ref';
import { def as sectionRefDef } from './section-ref/schema';
import Spacer from './spacer';
import { def as spacerDef } from './spacer/schema';
import Stack from './stack';
import { def as stackDef } from './stack/schema';
import Text from './text';
import { def as textDef } from './text/schema';
import Video from './video';
import { def as videoDef } from './video/schema';

import Accordion from './accordion';
import { def as accordionDef } from './accordion/schema';
import AccordionItem from './accordion-item';
import { def as accordionItemDef } from './accordion-item/schema';
import Badge from './badge';
import { def as badgeDef } from './badge/schema';
import Breadcrumbs from './breadcrumbs';
import { def as breadcrumbsDef } from './breadcrumbs/schema';
import Card from './card';
import { def as cardDef } from './card/schema';
import Carousel from './carousel';
import { def as carouselDef } from './carousel/schema';
import Countdown from './countdown';
import { def as countdownDef } from './countdown/schema';
import FormPlaceholder from './form-placeholder';
import { def as formPlaceholderDef } from './form-placeholder/schema';
import Gallery from './gallery';
import { def as galleryDef } from './gallery/schema';
import Header from './header';
import { def as headerDef } from './header/schema';
import Logo from './logo';
import { def as logoDef } from './logo/schema';
import MapBlock from './map';
import { def as mapDef } from './map/schema';
import Marquee from './marquee';
import { def as marqueeDef } from './marquee/schema';
import NavMenu from './nav-menu';
import { def as navMenuDef } from './nav-menu/schema';
import Quote from './quote';
import { def as quoteDef } from './quote/schema';
import SocialLinks from './social-links';
import { def as socialLinksDef } from './social-links/schema';
import Stat from './stat';
import { def as statDef } from './stat/schema';
import Tab from './tab';
import { def as tabDef } from './tab/schema';
import Tabs from './tabs';
import { def as tabsDef } from './tabs/schema';
import Collection from './collection';
import { def as collectionDef } from './collection/schema';

const entries: BlockEntry[] = [
	{ def: sectionDef, Component: Section },
	{ def: containerDef, Component: Container },
	{ def: stackDef, Component: Stack },
	{ def: gridDef, Component: Grid },
	{ def: spacerDef, Component: Spacer },
	{ def: dividerDef, Component: Divider },
	{ def: headingDef, Component: Heading },
	{ def: textDef, Component: Text },
	{ def: buttonDef, Component: Button },
	{ def: linkDef, Component: Link },
	{ def: iconDef, Component: Icon },
	{ def: imageDef, Component: Image },
	{ def: videoDef, Component: Video },
	{ def: embedDef, Component: Embed },
	{ def: sectionRefDef, Component: SectionRef },
	// Overlays are server components too: the browser's <dialog> / popover do the work,
	// plus a few lines of script only on pages that have one (src/render/overlays.ts).
	{ def: modalDef, Component: Modal },
	{ def: drawerDef, Component: Drawer },
	{ def: popoverDef, Component: Popover },
	// SB-08: navigation, content and media blocks.
	{ def: headerDef, Component: Header },
	{ def: logoDef, Component: Logo },
	{ def: navMenuDef, Component: NavMenu },
	{ def: socialLinksDef, Component: SocialLinks },
	{ def: breadcrumbsDef, Component: Breadcrumbs },
	{ def: cardDef, Component: Card },
	{ def: tabsDef, Component: Tabs },
	{ def: tabDef, Component: Tab },
	{ def: accordionDef, Component: Accordion },
	{ def: accordionItemDef, Component: AccordionItem },
	{ def: statDef, Component: Stat },
	{ def: badgeDef, Component: Badge },
	{ def: quoteDef, Component: Quote },
	{ def: countdownDef, Component: Countdown },
	{ def: carouselDef, Component: Carousel },
	{ def: galleryDef, Component: Gallery },
	{ def: marqueeDef, Component: Marquee },
	{ def: mapDef, Component: MapBlock },
	{ def: formPlaceholderDef, Component: FormPlaceholder },
	// SB-09: data.
	{ def: collectionDef, Component: Collection },
];

export const REGISTRY: Record<string, BlockEntry> = Object.fromEntries(entries.map(e => [e.def.type, e]));
