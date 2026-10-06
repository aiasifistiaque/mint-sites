// The SB-08 preset catalogue: whole sections people insert and then edit
// freely. Words are neutral placeholders a business would replace; pictures
// are placeholders until the tenant picks real ones.
import type { Preset } from '@/types';
import { block, button, card, eyebrow, grid, heading, icon, image, intro, link, preset, row, section, stack, text } from './build';

/* ── Headers ───────────────────────────────────────────────────────────── */

const headerBar = preset('header-bar', 'Header — logo, menu from your pages, button', 'header', 'hba', [
	block('header', { layout: 'split', show: 'both', source: 'site', border: true, sticky: true }, undefined, [
		button('Get in touch', '/contact', 'primary', 'sm'),
	]),
]);

const headerCentered = preset('header-centered', 'Header — menu in the middle, two buttons', 'header', 'hce', [
	block('header', { layout: 'center', show: 'both', source: 'site', border: false }, undefined, [
		button('Log in', '/account', 'ghost', 'sm'),
		button('Book now', '/contact', 'primary', 'sm'),
	]),
]);

const headerStacked = preset('header-stacked', 'Header — logo above a centred menu', 'header', 'hst', [
	block('header', { layout: 'stacked', show: 'name', logoSize: 'lg', source: 'site', border: true }),
]);

/* ── Heroes ────────────────────────────────────────────────────────────── */

const heroSplit = preset('hero-split', 'Hero — text beside a picture', 'hero', 'hsp', [
	section({ paddingY: 'lg' }, [
		grid({ columns: 2, columnsTablet: 2, gap: 12 }, [
			stack({ gap: 6, justify: 'center' }, [
				block('badge', { text: 'New this season', tone: 'primary', variant: 'soft' }),
				heading('Say what you do in one clear line', 1),
				text('A sentence or two on who it is for and what changes for them. Keep it short and concrete.', { size: 'xl', muted: true }),
				row({ gap: 3, wrap: true }, [button('Get started', '/contact', 'primary', 'lg'), button('See how it works', '#how', 'outline', 'lg')]),
			]),
			image(1200, 1000, 'Your best photo', { ratio: '4/3', rounded: 'xl', priority: true }),
		], { align: 'center' }),
	], 'Hero'),
]);

const heroImage = preset('hero-image', 'Hero — big photo behind the title', 'hero', 'him', [
	section({ width: 'container', paddingY: 'xl' }, [
		stack({ gap: 6, align: 'start' }, [
			heading('A place worth the trip', 1, {}, { color: 'white', maxWidth: 'md' }),
			text('Tell people what they will find here, in one inviting sentence.', { size: 'xl' }, { color: 'white', maxWidth: 'md' }),
			row({ gap: 3 }, [button('Plan your visit', '/contact', 'primary', 'lg'), button('Our story', '/about', 'secondary', 'lg')]),
		], { minHeight: { n: 50, unit: 'vh' }, justify: 'end' }),
	], 'Hero — add your photo under Style → Background', { base: { bgColor: 'black', gradient: { from: 'primary', to: 'black', angle: 135 }, bgPosition: 'center', bgSize: 'cover', bgOverlay: 'black', bgOverlayOpacity: 35 } }),
]);

const heroMinimal = preset('hero-minimal', 'Hero — big type, nothing else', 'hero', 'hmi', [
	section({ width: 'container', paddingY: 'xl' }, [
		stack({ gap: 8 }, [
			eyebrow('Studio for brands and products'),
			heading('We design things people remember.', 1, { size: '2xl' }, { maxWidth: 'lg', leading: 'tight' }),
			row({ gap: 6 }, [link('See the work →', '/work', 'primary'), link('Get in touch', '/contact', 'foreground')]),
		]),
	], 'Hero'),
]);

const heroStats = preset('hero-stats', 'Hero — title, buttons and three numbers', 'hero', 'hss', [
	section({ width: 'narrow', paddingY: 'xl' }, [
		stack({ gap: 6, align: 'center' }, [
			heading('Results you can measure', 1),
			text('What you offer and the difference it makes, said simply.', { size: 'xl', muted: true }),
			row({ gap: 3, justify: 'center' }, [button('Start today', '/contact', 'primary', 'lg'), button('Talk to us', '/contact', 'outline', 'lg')]),
		], { textAlign: 'center' }),
		grid({ columns: 3, columnsTablet: 3, columnsMobile: 1, gap: 6 }, [
			block('stat', { value: '12 yrs', label: 'in business', align: 'center' }),
			block('stat', { value: '2,400+', label: 'happy customers', align: 'center' }),
			block('stat', { value: '4.9 ★', label: 'average review', align: 'center' }),
		], { marginTop: 16 }),
	], 'Hero', { base: { gradient: { from: 'accent', to: 'background', angle: 180 } } }),
]);

const heroSignup = preset('hero-signup', 'Hero — title with an email sign-up', 'hero', 'hsu', [
	section({ width: 'narrow', paddingY: 'xl' }, [
		stack({ gap: 6, align: 'center' }, [
			block('badge', { text: 'Launching soon', tone: 'accent', variant: 'solid' }),
			heading('Be the first to know', 1),
			text('Leave your email and we will tell you the day it opens. No spam, ever.', { size: 'xl', muted: true }),
			block('form-placeholder', { kind: 'newsletter', button: 'Notify me' }, { maxWidth: 'sm', width: 'full' }),
		], { textAlign: 'center' }),
	], 'Hero'),
]);

/* ── Features ──────────────────────────────────────────────────────────── */

const feature = (ic: string, title: string, line: string) =>
	stack({ gap: 3 }, [icon(ic), heading(title, 3, { size: 'sm' }), text(line, { muted: true })]);

const featuresGrid = preset('features-grid', 'Features — six points with icons', 'features', 'fgr', [
	section({}, [
		intro('Why us', 'Everything you need, nothing you don’t', 'Three to six reasons people choose you, one line each.'),
		grid({ columns: 3, gap: 12 }, [
			feature('lightning', 'Fast', 'Most jobs are done the same week you ask.'),
			feature('shield-check', 'Reliable', 'Fully insured and guaranteed for a year.'),
			feature('chat-circle', 'Personal', 'You talk to the person who does the work.'),
			feature('leaf', 'Sustainable', 'Local materials and as little waste as we can.'),
			feature('currency-dollar', 'Clear prices', 'A fixed quote before anything starts.'),
			feature('star', 'Loved', 'Rated 4.9 by more than 300 customers.'),
		]),
	], 'Features'),
]);

const featuresCards = preset('features-cards', 'Features — three cards with pictures', 'features', 'fca', [
	section({}, [
		intro('What we offer', 'Three ways we can help', 'Pick the one that fits — or ask and we will suggest one.'),
		grid({ columns: 3, gap: 6 }, [
			...['Consulting', 'Design', 'Support'].map(name =>
				card({ variant: 'elevated', padding: 'md' }, [
					image(800, 500, name, { ratio: '16/9' }),
					heading(name, 3, { size: 'sm' }),
					text('A sentence about this service and who it is for.', { muted: true }),
					link('Learn more →', '/services', 'primary'),
				])
			),
		]),
	], 'Features'),
]);

const featuresSplit = preset('features-split', 'Features — picture beside a checklist', 'features', 'fsp', [
	section({}, [
		grid({ columns: 2, gap: 12 }, [
			image(1000, 900, 'Your work in action', { ratio: '4/3', rounded: 'lg' }),
			stack({ gap: 6, justify: 'center' }, [
				eyebrow('How it works'),
				heading('Built around the way you work', 2),
				text('<ul><li><strong>Tell us what you need</strong> — a short call or a message.</li><li><strong>Get a clear plan</strong> — with a fixed price and a date.</li><li><strong>Relax</strong> — we keep you posted until it is done.</li></ul>', { size: 'lg' }),
				button('Start now', '/contact', 'primary'),
			]),
		], { align: 'center' }),
	], 'Features'),
]);

const steps = preset('steps', 'Steps — how it works in three steps', 'features', 'stp', [
	section({}, [
		intro('How it works', 'Three simple steps', 'From the first hello to the finished job.'),
		grid({ columns: 3, gap: 8 }, [
			...[
				['1', 'Book a call', 'Pick a time that suits you — it takes two minutes.'],
				['2', 'Get your plan', 'We send a clear proposal with a price and a date.'],
				['3', 'Enjoy the result', 'We do the work and check in until you are happy.'],
			].map(([n, title, line]) =>
				stack({ gap: 3 }, [
					block('badge', { text: `Step ${n}`, tone: 'primary', variant: 'soft' }),
					heading(title, 3, { size: 'sm' }),
					text(line, { muted: true }),
				])
			),
		]),
	], 'Steps', { base: { bgColor: 'muted' } }),
]);

const servicesTabs = preset('services-tabs', 'Services — in tabs', 'features', 'svt', [
	section({ width: 'narrow' }, [
		intro('Services', 'Something for every need', 'Choose a tab to see the details.'),
		block('tabs', { variant: 'pills', align: 'center' }, undefined, [
			...['For homes', 'For offices', 'For events'].map(label =>
				block('tab', { label }, undefined, [
					grid({ columns: 2, columnsTablet: 2, gap: 8 }, [
						image(800, 600, label, { ratio: '4/3' }),
						stack({ gap: 4, justify: 'center' }, [
							heading(label, 3),
							text('Describe what is included, how long it takes and what it costs.', { muted: true }),
							button('Ask for a quote', '/contact', 'outline'),
						]),
					], { align: 'center' }),
				])
			),
		]),
	], 'Services'),
]);

/* ── Proof: logos, numbers, testimonials ───────────────────────────────── */

const logos = preset('logos', 'Logos — a moving strip of customers', 'logos', 'lgo', [
	section({ paddingY: 'sm' }, [
		text('Trusted by teams at', { size: 'sm', muted: true }, { textAlign: 'center', marginBottom: 6 }),
		block('marquee', { speed: 'slow', gap: 12, fade: true }, undefined,
			['Northwind', 'Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark'].map(name => text(`<p><strong>${name}</strong></p>`, { size: 'xl', muted: true }))
		),
	], 'Logos'),
]);

const stats = preset('stats', 'Numbers — four figures in a row', 'stats', 'sta', [
	section({}, [
		grid({ columns: 4, columnsTablet: 2, columnsMobile: 2, gap: 8 }, [
			block('stat', { value: '15k', label: 'orders delivered', tone: 'primary' }),
			block('stat', { value: '98%', label: 'would recommend us', tone: 'primary' }),
			block('stat', { value: '24 h', label: 'average reply time', tone: 'primary' }),
			block('stat', { value: '40+', label: 'cities served', tone: 'primary' }),
		]),
	], 'Numbers', { base: { bgColor: 'muted' } }),
]);

const quote = (t: string, author: string, role: string) => block('quote', { text: t, author, role, rating: 5, variant: 'card' });

const testimonialsGrid = preset('testimonials-grid', 'Testimonials — three reviews', 'testimonials', 'tgr', [
	section({}, [
		intro('Reviews', 'What our customers say', 'Real words from real people.'),
		grid({ columns: 3, gap: 6 }, [
			quote('Friendly, on time and the result was even better than the pictures.', 'Amira Hassan', 'Homeowner'),
			quote('They listened, explained everything and stuck to the price. Rare!', 'Tom Becker', 'Café owner'),
			quote('I have recommended them to three friends already.', 'Lena Park', 'Customer since 2021'),
		]),
	], 'Testimonials'),
]);

const testimonialBig = preset('testimonial-single', 'Testimonial — one big quote', 'testimonials', 'tsg', [
	section({ width: 'narrow', paddingY: 'lg' }, [
		block('quote', {
			text: 'Working with them changed how we run the whole business. I wish we had found them years ago.',
			author: 'Daniel Okafor',
			role: 'Founder, Okafor & Sons',
			variant: 'large',
		}),
	], 'Testimonial', { base: { bgColor: 'muted' } }),
]);

const testimonialsCarousel = preset('testimonials-carousel', 'Testimonials — a carousel of reviews', 'testimonials', 'tca', [
	section({}, [
		intro('Reviews', 'Loved by our customers', 'Swipe through what people say.'),
		block('carousel', { perView: 3, perViewTablet: 2, gap: 4, arrows: true, label: 'Customer reviews' }, undefined, [
			quote('The easiest booking I have ever made.', 'Priya Nair', 'Customer'),
			quote('Great value and a lovely team.', 'Marco Rossi', 'Customer'),
			quote('Five stars, would come back tomorrow.', 'Ella Johansson', 'Customer'),
			quote('They went the extra mile for us.', 'Kofi Mensah', 'Customer'),
		]),
	], 'Testimonials'),
]);

/* ── Calls to action ───────────────────────────────────────────────────── */

const ctaBanner = preset('cta-banner', 'Call to action — coloured band', 'cta', 'ctb', [
	section({ width: 'narrow', paddingY: 'lg' }, [
		stack({ gap: 6, align: 'center' }, [
			heading('Ready when you are', 2, {}, { color: 'primary-foreground' }),
			text('One line that makes the next step feel easy.', { size: 'lg' }, { color: 'primary-foreground', opacity: 90 }),
			button('Get started', '/contact', 'secondary', 'lg'),
		], { textAlign: 'center' }),
	], 'Call to action', { base: { bgColor: 'primary' } }),
]);

const ctaCard = preset('cta-card', 'Call to action — card with two buttons', 'cta', 'ctc', [
	section({}, [
		card({ variant: 'filled', padding: 'lg', gap: 6 }, [
			grid({ columns: 2, columnsTablet: 2, gap: 6 }, [
				stack({ gap: 3 }, [heading('Have a question?', 2, { size: 'lg' }), text('We usually answer within a few hours on weekdays.', { muted: true })]),
				row({ gap: 3, justify: 'end', wrap: true }, [button('Call us', 'tel:+10000000000', 'outline'), button('Send a message', '/contact', 'primary')]),
			], { align: 'center' }),
		], { radius: 'xl' }),
	], 'Call to action'),
]);

const countdownBanner = preset('countdown-banner', 'Event — countdown to a date', 'cta', 'cdb', [
	section({ width: 'narrow', paddingY: 'lg' }, [
		stack({ gap: 6, align: 'center' }, [
			eyebrow('Grand opening'),
			heading('Doors open in', 2),
			block('countdown', { to: '2027-01-01T10:00:00Z', endedText: 'We’re open — come and see us!', size: 'lg' }),
			button('Add to calendar', '/contact', 'primary'),
		], { textAlign: 'center' }),
	], 'Countdown', { base: { bgColor: 'muted' } }),
]);

/* ── Pricing ───────────────────────────────────────────────────────────── */

const plan = (name: string, price: string, line: string, points: string[], featured = false) =>
	card({ variant: featured ? 'elevated' : 'outline', padding: 'lg', gap: 4 }, [
		...(featured ? [block('badge', { text: 'Most popular', tone: 'primary', variant: 'solid' })] : []),
		heading(name, 3, { size: 'sm' }),
		row({ gap: 2, align: 'end', stackOnMobile: false }, [heading(price, 4, { size: 'xl' }), text('/ month', { size: 'sm', muted: true })]),
		text(line, { muted: true }),
		text(`<ul>${points.map(p => `<li>${p}</li>`).join('')}</ul>`, { size: 'sm' }),
		{ ...button(`Choose ${name}`, '/contact', featured ? 'primary' : 'outline', 'md', { fullWidth: true }), style: { base: { marginTop: 'auto' } } },
	], featured ? { borderWidth: 2, borderColor: 'primary' } : undefined);

const pricingThree = preset('pricing-three', 'Pricing — three plans', 'pricing', 'prt', [
	section({}, [
		intro('Pricing', 'Simple, honest prices', 'No setup fees. Cancel any time.'),
		grid({ columns: 3, gap: 6 }, [
			plan('Starter', '$19', 'For trying it out.', ['One location', 'Email support', 'Basic reports']),
			plan('Growth', '$49', 'For most small businesses.', ['Three locations', 'Priority support', 'All reports', 'Online booking'], true),
			plan('Pro', '$99', 'For busy teams.', ['Unlimited locations', 'Phone support', 'Custom reports', 'A personal account manager']),
		], { align: 'stretch' }),
	], 'Pricing'),
]);

const pricingTwo = preset('pricing-two', 'Pricing — two options side by side', 'pricing', 'prw', [
	section({ width: 'narrow' }, [
		intro('Prices', 'Pick what suits you', 'Both include everything you need to get going.'),
		grid({ columns: 2, columnsTablet: 2, gap: 6 }, [
			plan('Single', '$30', 'One visit, no commitment.', ['60 minutes', 'Free first consultation']),
			plan('Membership', '$90', 'Four visits a month.', ['4 × 60 minutes', 'Book any time', '10% off products'], true),
		]),
	], 'Pricing'),
]);

/* ── FAQ, team, gallery ────────────────────────────────────────────────── */

const faq = preset('faq', 'Questions — an accordion of answers', 'faq', 'faq', [
	section({ width: 'narrow' }, [
		intro('Questions', 'Things people ask us', 'Can’t find an answer? Just get in touch.'),
		block('accordion', { single: true }, undefined, [
			...[
				['How do I book?', 'Use the button at the top of any page, or call us during opening hours.'],
				['What does it cost?', 'Prices are on our pricing page; we always confirm before starting.'],
				['Can I cancel?', 'Yes — free of charge up to 24 hours before.'],
				['Where are you?', 'Our address and a map are on the contact page.'],
			].map(([q, a]) => block('accordion-item', { title: q }, undefined, [text(a, { muted: true })])),
		]),
	], 'Questions'),
]);

const member = (name: string, role: string) =>
	stack({ gap: 3 }, [image(600, 700, name, { ratio: '3/4', rounded: 'lg' }), stack({ gap: 1 }, [heading(name, 3, { size: 'sm' }), text(role, { size: 'sm', muted: true })])]);

const team = preset('team', 'Team — people with photos', 'team', 'tea', [
	section({}, [
		intro('Our team', 'The people behind it', 'Small, friendly and good at what we do.'),
		grid({ columns: 4, columnsTablet: 2, columnsMobile: 2, gap: 6 }, [
			member('Alex Morgan', 'Founder'),
			member('Jamie Chen', 'Lead designer'),
			member('Sara Ali', 'Customer care'),
			member('Noah Weber', 'Operations'),
		]),
	], 'Team'),
]);

const gallery = preset('gallery', 'Gallery — a grid of photos that open big', 'gallery', 'gal', [
	section({}, [
		intro('Gallery', 'A look inside', 'A few of our favourite moments.'),
		block('gallery', {
			items: [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ src: `placeholder:800x800:Photo ${n}`, alt: `Photo ${n}` })),
			columns: 4,
			ratio: '1/1',
			gap: 4,
			lightbox: true,
		}),
	], 'Gallery'),
]);

/* ── Contact and newsletter ────────────────────────────────────────────── */

const contact = preset('contact', 'Contact — details, map and a form', 'contact', 'con', [
	section({}, [
		grid({ columns: 2, gap: 12 }, [
			stack({ gap: 6 }, [
				eyebrow('Contact'),
				heading('Come and say hello', 2),
				text('<p><strong>Address</strong><br>12 Market Street, Your City</p><p><strong>Opening hours</strong><br>Mon–Fri 9–18 · Sat 10–16</p><p><strong>Phone</strong><br><a href="tel:+10000000000">+1 000 000 0000</a></p>'),
				block('social-links', { source: 'site', variant: 'circle', size: 20 }),
				block('map', { address: '', zoom: 16, height: 240 }),
			]),
			card({ variant: 'outline', padding: 'lg', gap: 4 }, [heading('Send us a message', 3, { size: 'sm' }), block('form-placeholder', { kind: 'contact', button: 'Send message' })]),
		]),
	], 'Contact'),
]);

const newsletter = preset('newsletter', 'Newsletter — email sign-up band', 'contact', 'nws', [
	section({ width: 'narrow', paddingY: 'lg' }, [
		stack({ gap: 4, align: 'center' }, [
			icon('envelope-simple', { color: 'primary' }, 32),
			heading('Get our monthly letter', 2, { size: 'lg' }),
			text('News, offers and the odd useful tip. One email a month.', { muted: true }),
			block('form-placeholder', { kind: 'newsletter', button: 'Subscribe', note: 'You can unsubscribe at any time.' }, { maxWidth: 'sm', width: 'full' }),
		], { textAlign: 'center' }),
	], 'Newsletter', { base: { bgColor: 'muted' } }),
]);

/* ── Blog and products (filled with your data in SB-09 / SB-10) ────────── */

const post = (title: string, date: string) =>
	card({ variant: 'plain', padding: 'none', gap: 3 }, [
		image(800, 500, title, { ratio: '16/9', rounded: 'lg' }),
		text(date, { size: 'sm', muted: true }),
		heading(title, 3, { size: 'sm' }),
		text('The first line or two of the post, to make people want to read on.', { muted: true }),
	], undefined, { type: 'link', href: '/blog' });

const blogList = preset('blog-list', 'Blog — three latest posts', 'blog', 'blg', [
	section({}, [
		row({ justify: 'between', align: 'end', wrap: true }, [
			stack({ gap: 2 }, [eyebrow('Blog'), heading('Latest stories', 2)]),
			link('All posts →', '/blog', 'primary'),
		], { marginBottom: 8 }),
		grid({ columns: 3, gap: 8 }, [post('How we started', 'March 2026'), post('Five tips for spring', 'April 2026'), post('Behind the scenes', 'May 2026')]),
	], 'Blog'),
]);

const product = (name: string, price: string) =>
	card({ variant: 'plain', padding: 'none', gap: 2 }, [
		image(800, 800, name, { ratio: '1/1', rounded: 'lg' }),
		heading(name, 3, { size: 'sm' }),
		text(price, { muted: true }),
	], undefined, { type: 'link', href: '/shop' });

const productGrid = preset('product-grid', 'Products — four items in a grid', 'products', 'pgr', [
	section({}, [
		row({ justify: 'between', align: 'end', wrap: true }, [heading('Best sellers', 2), link('Shop all →', '/shop', 'primary')], { marginBottom: 8 }),
		grid({ columns: 4, columnsTablet: 2, columnsMobile: 2, gap: 6 }, [
			product('Linen shirt', '$48'),
			product('Canvas tote', '$24'),
			product('Ceramic mug', '$18'),
			product('Wool scarf', '$36'),
		]),
	], 'Products'),
]);

/* ── Footers ───────────────────────────────────────────────────────────── */

const column = (title: string, links: [string, string][]) =>
	stack({ gap: 3 }, [heading(title, 2, { size: 'sm' }, { fontSize: 'sm' }), stack({ gap: 2 }, links.map(([t, h]) => link(t, h)))]);

const footerColumns = preset('footer-columns', 'Footer — logo, link columns and socials', 'footer', 'fco', [
	section({ tag: 'footer', paddingY: 'md' }, [
		grid({ columns: 4, columnsTablet: 2, columnsMobile: 1, gap: 8 }, [
			stack({ gap: 4 }, [block('logo', { show: 'both' }), text('A line about what you do and where.', { size: 'sm', muted: true }), block('social-links', { source: 'site' })]),
			column('Company', [['About', '/about'], ['Team', '/about#team'], ['Careers', '/careers']]),
			column('Help', [['Contact', '/contact'], ['FAQ', '/faq'], ['Shipping', '/shipping']]),
			column('Legal', [['Privacy', '/privacy'], ['Terms', '/terms']]),
		]),
		block('divider', { thickness: 1 }, { marginTop: 12, marginBottom: 6 }),
		text('© Your business. All rights reserved.', { size: 'sm', muted: true }),
	], 'Footer', { base: { bgColor: 'muted' } }),
]);

const footerCentered = preset('footer-centered', 'Footer — centred menu and socials', 'footer', 'fce', [
	section({ tag: 'footer', paddingY: 'md' }, [
		stack({ gap: 6, align: 'center' }, [
			block('logo', { show: 'name', size: 'lg' }),
			block('nav-menu', { source: 'site', direction: 'row', gap: 6 }),
			block('social-links', { source: 'site', variant: 'circle' }),
			text('© Your business', { size: 'sm', muted: true }),
		], { textAlign: 'center' }),
	], 'Footer'),
]);

/* ── Pages ─────────────────────────────────────────────────────────────── */

const notFound = preset('not-found', 'Page not found (404)', 'pages', 'nfd', [
	section({ width: 'narrow', paddingY: 'xl' }, [
		stack({ gap: 6, align: 'center' }, [
			text('404', {}, { fontSize: '6xl', fontWeight: 700, color: 'primary', leading: 'none' }),
			heading('We can’t find that page', 1, { size: 'lg' }),
			text('It may have moved, or the link might be wrong.', { size: 'lg', muted: true }),
			row({ gap: 3, justify: 'center' }, [button('Go to the home page', '/', 'primary'), button('Contact us', '/contact', 'outline')]),
		], { textAlign: 'center' }),
	], 'Not found'),
]);

const pageTitle = preset('page-title', 'Page title — breadcrumbs, title and intro', 'pages', 'ptl', [
	section({ paddingY: 'md' }, [
		stack({ gap: 4 }, [block('breadcrumbs', {}), heading('Page title', 1, { size: 'xl' }), text('One sentence on what this page is about.', { size: 'lg', muted: true }, { maxWidth: 'md' })]),
	], 'Page title', { base: { bgColor: 'muted' } }),
]);

export const SECTION_PRESETS: Preset[] = [
	headerBar,
	headerCentered,
	headerStacked,
	heroSplit,
	heroImage,
	heroMinimal,
	heroStats,
	heroSignup,
	featuresGrid,
	featuresCards,
	featuresSplit,
	steps,
	servicesTabs,
	logos,
	stats,
	testimonialsGrid,
	testimonialBig,
	testimonialsCarousel,
	ctaBanner,
	ctaCard,
	countdownBanner,
	pricingThree,
	pricingTwo,
	faq,
	team,
	gallery,
	contact,
	newsletter,
	blogList,
	productGrid,
	footerColumns,
	footerCentered,
	notFound,
	pageTitle,
];
