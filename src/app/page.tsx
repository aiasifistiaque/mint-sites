// The renderer's own root: real sites are served under /_s/<slug> by host
// (SB-04). Until then this explains what the app is.
export default function Home() {
	return (
		<main className='mx-auto max-w-xl p-8 font-sans text-sm leading-6'>
			<h1 className='text-lg font-semibold'>Mint sites</h1>
			<p>This app draws websites built with the Mint site builder. There is no site at this address.</p>
		</main>
	);
}
