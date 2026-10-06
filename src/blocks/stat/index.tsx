import type { BlockProps } from '../types';
import { cx, str } from '../util';

export default function Stat({ props, attrs, ctx }: BlockProps) {
	const edit = (prop: string) => (ctx.mode === 'edit' ? { 'data-mint-text': prop } : {});
	return (
		<div {...attrs} className={cx('flex flex-col gap-1', props.align === 'center' && 'items-center text-center')}>
			<span {...edit('value')} className={cx('font-heading text-4xl font-semibold tracking-tight md:text-5xl', props.tone === 'primary' ? 'text-primary' : 'text-foreground')}>
				{str(props.value)}
			</span>
			<span {...edit('label')} className='text-sm font-medium text-foreground'>
				{str(props.label)}
			</span>
			{str(props.description) && <p className='text-sm text-muted-foreground'>{str(props.description)}</p>}
		</div>
	);
}
