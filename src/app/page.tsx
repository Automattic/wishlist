export default function Home() {
	return (
		<div className="flex justify-center leading-[1.2] h-screen">
			<main className="flex flex-col max-w-[1024px] h-full py-[32px] px-[20px]">
				<h1 className="text-[#101517] text-[48px] font-bold">WiSH</h1>
				<h2 className="mt-[114px] text-[#101517] text-[32px]">
					Get 9 gift recommendations for friends
				</h2>
				<form className="flex-1 flex flex-col">
					<div className="mt-[32px]">
						<label htmlFor="email" className="hidden">
							Enter your friend’s email
						</label>
						<input
							id="email"
							name="email"
							className="w-full h-[48px] py-[8px] px-[12px] border border-[#101517] rounded-[8px]"
							placeholder="Enter your friend’s email"
							required
						/>
					</div>
					<div className="mt-[32px]">
						<label htmlFor="budget">How much would you like to spend?</label>
						<select
							id="budget"
							name="budget"
							className="mt-[8px] w-full h-[48px] py-[8px] px-[12px] border border-[#101517] rounded-[8px] appearance-none bg-[url('/images/ico-chevron-down.svg')] bg-no-repeat bg-[position:calc(100%-8px)_center] bg-[length:24px_24px] pr-[32px]"
							defaultValue=""
							required
						>
							<option value="" disabled>
								Select an option
							</option>
							<option value="cheap">Not a lot ($5 — $30)</option>
						</select>
					</div>
					<button
						type="submit"
						className="self-end mt-auto w-full h-[48px] bg-[#101517] rounded-[8px] text-[#fff]"
					>
						Get started
					</button>
					<div className="mt-[24px] text-center">By continuing you agree to our terms</div>
				</form>
			</main>
		</div>
	);
}
