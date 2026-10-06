// Small scripts for blocks that need a little JavaScript on published pages —
// printed inline, each only on pages that have that block (like overlays.ts).
// Every block still shows its content without them.
import type { Node } from '@/types';

/** Which block types a set of trees uses. */
export function usedTypes(trees: Node[][]): Set<string> {
	const out = new Set<string>();
	const visit = (nodes?: Node[]) => {
		if (!Array.isArray(nodes)) return;
		for (const n of nodes) {
			if (!n) continue;
			if (typeof n.type === 'string') out.add(n.type);
			visit(n.children);
			if (n.slots) Object.values(n.slots).forEach(visit);
		}
	};
	trees.forEach(visit);
	return out;
}

// Tabs: click or arrow keys pick a tab (WAI-ARIA tabs pattern).
const TABS = `document.querySelectorAll('[data-mint-tabs]').forEach(w=>{
const tabs=[...w.querySelectorAll(':scope>[role=tablist]>[role=tab]')];
const pick=(t,focus)=>{tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;const p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});if(focus)t.focus()};
tabs.forEach((t,i)=>{t.addEventListener('click',()=>pick(t));t.addEventListener('keydown',e=>{const k=e.key,n=tabs.length;let j=k==='ArrowRight'?(i+1)%n:k==='ArrowLeft'?(i-1+n)%n:k==='Home'?0:k==='End'?n-1:-1;if(j>=0){e.preventDefault();pick(tabs[j],true)}})});
});`;

// Carousel: show the arrows, step by one slide, disable at the ends.
const CAROUSEL = `document.querySelectorAll('[data-mint-carousel]').forEach(w=>{
const t=w.querySelector('.mint-carousel-track');if(!t)return;
const b=[...w.querySelectorAll('[data-mint-carousel-btn]')];
const step=()=>{const s=t.firstElementChild;return s?s.getBoundingClientRect().width+parseFloat(getComputedStyle(t).columnGap||'0'):t.clientWidth};
const sync=()=>b.forEach(x=>{x.disabled=x.dataset.mintCarouselBtn==='prev'?t.scrollLeft<4:t.scrollLeft+t.clientWidth>=t.scrollWidth-4});
b.forEach(x=>{x.hidden=false;x.addEventListener('click',()=>t.scrollBy({left:(x.dataset.mintCarouselBtn==='prev'?-1:1)*step(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}))});
t.addEventListener('scroll',sync,{passive:true});sync();
});`;

// Gallery: a click on a picture opens it in the gallery's <dialog>.
const GALLERY = `document.querySelectorAll('[data-mint-gallery]').forEach(w=>{
const d=document.getElementById(w.dataset.mintGallery);if(!d)return;
const items=[...w.querySelectorAll('[data-mint-lb-src]')];const img=d.querySelector('img'),cap=d.querySelector('[data-mint-lb-caption]');let at=0;
const show=i=>{at=(i+items.length)%items.length;const b=items[at];img.src=b.dataset.mintLbSrc;img.alt=b.dataset.mintLbAlt||'';if(cap)cap.textContent=b.dataset.mintLbAlt||''};
items.forEach((b,i)=>b.addEventListener('click',()=>{show(i);d.showModal()}));
d.addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('[data-mint-lb]');if(el){const a=el.dataset.mintLb;a==='close'?d.close():show(at+(a==='prev'?-1:1));return}if(e.target===d)d.close()});
d.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(at+1);if(e.key==='ArrowLeft')show(at-1)});
});`;

// Countdown: tick every second; swap to the "over" text at zero.
const COUNTDOWN = `document.querySelectorAll('[data-mint-countdown]').forEach(w=>{
const to=Date.parse(w.dataset.mintCountdown),u=w.querySelector('[data-mint-cd-units]'),end=w.querySelector('[data-mint-cd-ended]');
const N={days:86400,hours:3600,minutes:60,seconds:1};
const tick=()=>{let s=Math.max(0,Math.floor((to-Date.now())/1000));if(!s){u&&u.classList.add('hidden');end&&end.classList.remove('hidden');return clearInterval(h)}
for(const k in N){const v=Math.floor(s/N[k]);s-=v*N[k];const el=w.querySelector('[data-mint-cd='+k+']');if(el)el.textContent=String(v).padStart(2,'0')}};
const h=setInterval(tick,1000);tick();
});`;

const SCRIPTS: [string, string][] = [
	['tabs', TABS],
	['carousel', CAROUSEL],
	['gallery', GALLERY],
	['countdown', COUNTDOWN],
];

/** The scripts a page needs, as one inline script body, or '' for none. */
export function interactiveScript(types: Set<string>): string {
	const parts = SCRIPTS.filter(([t]) => types.has(t)).map(([, s]) => s);
	return parts.length ? `(()=>{${parts.join('\n')}})();` : '';
}
