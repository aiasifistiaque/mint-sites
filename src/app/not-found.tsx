// A host that isn't one of the sites (src/proxy.ts), or a path the renderer
// itself doesn't have.
export default function NotFound() {
	return (
		<main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '15vh auto', padding: '0 16px', lineHeight: 1.6 }}>
			<h1 style={{ fontSize: 22, fontWeight: 600 }}>No site here</h1>
			<p style={{ color: '#666' }}>
				This address isn’t connected to a site built with MINT, or the site hasn’t been published yet.
			</p>
		</main>
	);
}
