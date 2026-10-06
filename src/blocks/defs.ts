// Every block's schema, without its component — what the manifest script and
// the tests import. Add a new block here and in registry.ts.
import type { BlockDef } from '@/types';
import { def as button } from './button/schema';
import { def as container } from './container/schema';
import { def as divider } from './divider/schema';
import { def as embed } from './embed/schema';
import { def as grid } from './grid/schema';
import { def as heading } from './heading/schema';
import { def as icon } from './icon/schema';
import { def as image } from './image/schema';
import { def as link } from './link/schema';
import { def as section } from './section/schema';
import { def as spacer } from './spacer/schema';
import { def as stack } from './stack/schema';
import { def as text } from './text/schema';
import { def as video } from './video/schema';

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
];
