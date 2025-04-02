export default function Home() {
	return (
		<main className="flex flex-col items-center text-center">
			<h1 className="text-black font-sans text-[44px] font-semibold leading-[1.2]">
				GIFTER
			</h1>
			<p className="text-black font-sans text-[24px] font-semibold leading-[1.2]">Get 9 gift recommendations for a friends</p>
			<form className="w-full">
				<div>
					<label htmlFor="email" className="hidden">Enter your email</label>
					<input id="email" className="w-full border border-[#B3B3B3] h-[63px] p-[10px]" placeholder="Enter your friend’s email" required />
				</div>
				<div>
					<label htmlFor="name">Enter your friend’s name</label>
					<input id="name" className="w-full border border-[#B3B3B3] h-[63px] p-[10px]" placeholder="Enter your friend’s name" required />
				</div>
				<button type="submit">Get started</button>
			</form>
			<small>By continuing you agree to our terms</small>
		</main>
	);
}
