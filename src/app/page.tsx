export default function Home() {
	return (
		<main>
			<h1>GIFTER</h1>
			<p>Get 9 gift recommendations for a friends</p>
			<form>
				<label htmlFor="email">Enter your email</label>
				<input id="email" placeholder="Enter your friend’s email" />
				<label htmlFor="budget">How much would you like to spend?</label>
				<input id="budget" placeholder="Not a lot ($5 — $30)" />
				<input type="submit" />
			</form>
			<small>By continuing you agree to our terms</small>
		</main>
	);
}
