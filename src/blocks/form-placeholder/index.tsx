import type { BlockProps } from '../types';
import { cx, str } from '../util';

const EMAIL = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,24}$/i;
const FIELD = 'w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground';

// A plain HTML form that opens the visitor's email app (mailto, text/plain):
// works with no script and no server until real forms arrive (W-08).
export default function FormPlaceholder({ node, props, attrs, ctx }: BlockProps) {
	const to = [str(props.to), ctx.site?.contact?.email || ''].find(e => EMAIL.test(e)) || '';
	const newsletter = props.kind === 'newsletter';
	const id = (f: string) => `f-${node.id}-${f}`;
	const live = ctx.mode === 'live' && !!to;
	const formProps = live ? { action: `mailto:${to}`, method: 'post', encType: 'text/plain' } : {};
	const email = (
		<div className={cx('flex flex-col gap-1.5', newsletter && 'flex-1')}>
			<label htmlFor={id('email')} className={cx('text-sm font-medium', newsletter && 'sr-only')}>
				Email
			</label>
			<input id={id('email')} name='email' type='email' autoComplete='email' required placeholder={newsletter ? 'you@example.com' : undefined} className={FIELD} />
		</div>
	);
	const submit = (
		<button
			type={live ? 'submit' : 'button'}
			className={cx('mint-btn inline-flex h-11 shrink-0 items-center justify-center bg-primary px-5 text-sm text-primary-foreground hover:opacity-90', !newsletter && 'self-start')}>
			{str(props.button) || 'Send'}
		</button>
	);
	return (
		<form {...attrs} {...formProps} className='flex w-full flex-col gap-3'>
			{newsletter ? (
				<div className='flex flex-col gap-3 sm:flex-row'>
					{email}
					{submit}
				</div>
			) : (
				<>
					<div className='flex flex-col gap-1.5'>
						<label htmlFor={id('name')} className='text-sm font-medium'>
							Name
						</label>
						<input id={id('name')} name='name' autoComplete='name' required className={FIELD} />
					</div>
					{email}
					<div className='flex flex-col gap-1.5'>
						<label htmlFor={id('message')} className='text-sm font-medium'>
							Message
						</label>
						<textarea id={id('message')} name='message' rows={5} required className={FIELD} />
					</div>
					{submit}
				</>
			)}
			{str(props.note) && <p className='text-xs text-muted-foreground'>{str(props.note)}</p>}
			{ctx.mode === 'edit' && !to && <p className='text-xs text-warning'>Add an email in Website settings → Contact so this form can send.</p>}
		</form>
	);
}
