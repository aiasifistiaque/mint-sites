// Overlays on published pages (D12): pop-ups and drawers are native <dialog>s,
// popovers use the HTML popover attribute. This script — printed inline, only
// on pages that have an overlay — wires buttons and links whose action is
// open / close / toggle, closes a dialog on a click on its scrim, and puts a
// popover under the element that opened it. The browser does the rest: Esc,
// the focus trap and aria-modal (showModal), focus going back on close.
import type { Node } from '@/types';

export const OVERLAY_TYPES = new Set(['modal', 'drawer', 'popover']);

/** Does any tree have an overlay, or an action that opens one? */
export function hasOverlays(trees: Node[][]): boolean {
	const visit = (nodes?: Node[]): boolean =>
		Array.isArray(nodes) &&
		nodes.some(
			n =>
				!!n &&
				(OVERLAY_TYPES.has(n.type) ||
					['open', 'close', 'toggle'].includes(n.action?.type as string) ||
					visit(n.children) ||
					Object.values(n.slots || {}).some(visit))
		);
	return trees.some(visit);
}

// Kept small and dependency-free: it ships as text in the page.
export const OVERLAY_SCRIPT = `(()=>{
const get=t=>document.getElementById('n-'+t);
const place=(o,b)=>{if(!b)return;const r=b.getBoundingClientRect(),w=o.offsetWidth;o.style.margin='0';o.style.position='fixed';o.style.top=Math.min(r.bottom+8,innerHeight-o.offsetHeight-8)+'px';o.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px'};
document.addEventListener('click',e=>{
const el=e.target instanceof Element?e.target:null;if(!el)return;
const b=el.closest('[data-mint-action]');
const a=b&&b.getAttribute('data-mint-action'),t=b&&b.getAttribute('data-mint-target');
if(t&&(a==='open'||a==='close'||a==='toggle')){
const o=get(t);if(!o)return;e.preventDefault();
if(o.tagName==='DIALOG'){if(a==='close'||(a==='toggle'&&o.open))o.close();else if(!o.open)o.showModal()}
else if(o.showPopover){const on=o.matches(':popover-open');if(a==='close'||(a==='toggle'&&on))o.hidePopover();else if(!on){o.showPopover();place(o,b)}}
return}
if(el.tagName==='DIALOG'&&el.hasAttribute('data-mint-overlay')){const r=el.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)el.close()}
});
})();`;
