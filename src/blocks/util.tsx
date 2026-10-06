import type { PropDef, RenderContext } from '@/types';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** A string prop, or '' when it's missing or not text. */
export const str = (v: unknown) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');

/** `value` if it's one of `allowed`, else `fallback`. */
export const oneOf = <T,>(value: unknown, allowed: readonly T[], fallback: T): T =>
	allowed.includes(value as T) ? (value as T) : fallback;

/** Select options from values: opts(['sm', 'md']) or opts([['sm', 'Small']]). */
export const opts = (values: (string | number | [string | number, string])[]): PropDef['options'] =>
	values.map(v => (Array.isArray(v) ? { value: v[0], label: v[1] } : { value: v, label: String(v) }));

export const SPACE_OPTIONS = opts([0, 1, 2, 3, 4, 6, 8, 12, 16]);

/** A dashed note shown only in the editor's canvas when a block has nothing to draw yet. */
export function EditHint({ ctx, children, attrs }: { ctx: RenderContext; children: string; attrs?: object }) {
	if (ctx.mode !== 'edit') return null;
	return (
		<div
			{...attrs}
			className='flex min-h-16 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground'>
			{children}
		</div>
	);
}
