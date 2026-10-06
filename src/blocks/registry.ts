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
];

export const REGISTRY: Record<string, BlockEntry> = Object.fromEntries(entries.map(e => [e.def.type, e]));
