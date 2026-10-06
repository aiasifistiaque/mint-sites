import type { BlockProps } from '../types';

const H: Record<number, string> = { 2: 'h-2', 4: 'h-4', 6: 'h-6', 8: 'h-8', 12: 'h-12', 16: 'h-16', 24: 'h-24', 32: 'h-32' };

export default function Spacer({ props, attrs }: BlockProps) {
	return <div {...attrs} aria-hidden className={H[props.size] ?? 'h-8'} />;
}
