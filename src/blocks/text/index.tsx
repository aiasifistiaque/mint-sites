import { sanitizeRichText } from '@/render/sanitize';
import type { BlockProps } from '../types';
import { cx } from '../util';

const SIZE: Record<string, string> = { sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl leading-relaxed' };

export default function Text({ props, attrs, ctx }: BlockProps) {
	return (
		<div
			{...attrs}
			{...(ctx.mode === 'edit' && { 'data-mint-text': 'html', 'data-mint-rich': '' })}
			className={cx('mint-prose', SIZE[props.size] ?? 'text-base', props.muted && 'text-muted-foreground')}
			dangerouslySetInnerHTML={{ __html: sanitizeRichText(props.html) }}
		/>
	);
}
