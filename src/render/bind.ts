// Data on a page (backend docs/site-builder "Binding", SB-09): a node's
// `bind` (prop → { from, field }) and `{{ }}` in its text — "By
// {{record.author.name}} · {{record.createdAt | date}}". Paths only, no
// expressions; filters date, datetime, money, number, upper, lower,
// truncate:n, default:'…'. A missing value is empty (the editor shows the
// prop as it is). The backend keeps a copy for template pages' SEO
// (library/siteBuilder/bind.ts) — change both together.
import type { Binding, Node, PropDef } from '@/types';
import { escapeHtml } from './sanitize';

export type Scope = { item?: any; record?: any; site?: any; content?: Record<string, any>; currency?: string; locale?: string };

/* eslint-disable @typescript-eslint/no-explicit-any */

const PATH = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)*$/;

/** A value at a dotted path: 'author.name', 'images.0'. */
export const pathValue = (obj: any, path: string): any => {
	if (!PATH.test(path)) return undefined;
	let v = obj;
	for (const k of path.split('.')) {
		if (v === null || v === undefined || typeof v !== 'object') return undefined;
		if (k === '__proto__' || k === 'constructor' || k === 'prototype') return undefined;
		v = v[k];
	}
	return v;
};

/** What a linked record or a list shows as text. */
export const asText = (v: any): string => {
	if (v === null || v === undefined) return '';
	if (Array.isArray(v)) return v.map(asText).filter(Boolean).join(', ');
	if (v instanceof Date) return v.toISOString();
	if (typeof v === 'object') return asText(v.name ?? v.title ?? v.label ?? v.code ?? '');
	return String(v);
};

const applyFilter = (v: any, filter: string, scope: Scope): any => {
	const [name, ...rest] = filter.split(':');
	const arg = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
	const locale = scope.locale || 'en';
	switch (name.trim()) {
		case 'date':
		case 'datetime': {
			const d = v ? new Date(v) : null;
			if (!d || Number.isNaN(d.getTime())) return '';
			return name.trim() === 'date'
				? d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
				: d.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' });
		}
		case 'money': {
			const n = Number(v);
			if (v === '' || v === null || v === undefined || !Number.isFinite(n)) return '';
			try {
				return scope.currency ? new Intl.NumberFormat(locale, { style: 'currency', currency: scope.currency }).format(n) : n.toFixed(2);
			} catch {
				return n.toFixed(2);
			}
		}
		case 'number': {
			const n = Number(v);
			return Number.isFinite(n) ? new Intl.NumberFormat(locale).format(n) : '';
		}
		case 'upper':
			return asText(v).toUpperCase();
		case 'lower':
			return asText(v).toLowerCase();
		case 'truncate': {
			const n = Math.max(1, Math.min(Number(arg) || 100, 5000));
			const s = asText(v);
			return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
		}
		case 'default':
			return asText(v) ? v : arg;
		default:
			return v;
	}
};

/** One `{{ … }}` expression's value. */
export const evaluate = (expr: string, scope: Scope): any => {
	const [head, ...filters] = expr.split('|');
	const path = head.trim();
	const dot = path.indexOf('.');
	const root = dot < 0 ? path : path.slice(0, dot);
	const rest = dot < 0 ? '' : path.slice(dot + 1);
	let v: any;
	if (root === 'item' || root === 'record' || root === 'site') v = rest ? pathValue((scope as any)[root], rest) : (scope as any)[root];
	else if (root === 'content') {
		// content.<slug>.<field> — slugs have dashes, so the slug is the next part up to a dot
		const cut = rest.indexOf('.');
		v = cut < 0 ? undefined : pathValue(scope.content?.[rest.slice(0, cut)], rest.slice(cut + 1));
	}
	return filters.reduce((acc, f) => applyFilter(acc, f, scope), v);
};

/** Text with every `{{ … }}` filled in (`escape` for HTML). */
export const interpolate = (text: string, scope: Scope, escape?: (s: string) => string) =>
	typeof text === 'string' && text.includes('{{')
		? text.replace(/\{\{\s*([^{}]{1,200}?)\s*\}\}/g, (_, expr) => {
				const s = asText(evaluate(expr, scope));
				return escape ? escape(s) : s;
			})
		: text;

/** What a binding points at, or undefined when there's nothing there. */
export const bindingValue = (b: Binding | undefined, scope: Scope): any => {
	if (!b || typeof b !== 'object' || typeof b.field !== 'string') return undefined;
	switch (b.from) {
		case 'item':
		case 'record':
		case 'site':
			return pathValue(scope[b.from], b.field);
		case 'content':
			return typeof b.slug === 'string' ? pathValue(scope.content?.[b.slug], b.field) : undefined;
		default:
			// 'customer' is filled in the browser by mint.js
			return undefined;
	}
};

const looksLikeHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);

/** A bound value as the prop's kind wants it. */
const coerce = (v: any, def: PropDef | undefined): any => {
	const kind = def?.kind;
	if (kind === 'images') return (Array.isArray(v) ? v : [v]).map(x => (typeof x === 'object' && x ? x.url ?? x.src ?? '' : String(x ?? ''))).filter(Boolean);
	if (kind === 'image' || kind === 'video') return typeof v === 'object' && v ? String(v.url ?? v.src ?? '') : asText(v);
	if (kind === 'number') return Number(v);
	if (kind === 'boolean') return !!v;
	if (kind === 'richtext') {
		// The text block holds HTML: a record's editor field is HTML already, plain text becomes a paragraph.
		const s = asText(v);
		return looksLikeHtml(s) ? s : s ? `<p>${escapeHtml(s)}</p>` : '';
	}
	return asText(v);
};

/**
 * A node's props with its data filled in: bound props from the scope, and
 * `{{ }}` in its text. `bound` names the props that came from data (the
 * editor doesn't edit those as text on the canvas).
 */
export const withData = (node: Node, props: Record<string, any>, defs: Map<string, PropDef>, scope: Scope | undefined, edit: boolean) => {
	if (!scope) return { props, bound: [] as string[] };
	let out = props;
	const bound: string[] = [];
	for (const [key, b] of Object.entries(node.bind || {})) {
		const v = bindingValue(b, scope);
		if (v === undefined || v === null || v === '') continue;
		if (out === props) out = { ...props };
		out[key] = coerce(v, defs.get(key));
		bound.push(key);
	}
	for (const [key, v] of Object.entries(out)) {
		if (typeof v !== 'string' || !v.includes('{{')) continue;
		const html = defs.get(key)?.kind === 'richtext';
		const filled = interpolate(v, scope, html ? escapeHtml : undefined);
		// The editor keeps a placeholder visible when there's no value yet.
		if (filled === v || (edit && !filled.trim())) continue;
		if (out === props) out = { ...props };
		out[key] = filled;
		bound.push(key);
	}
	return { props: out, bound };
};
