'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import _debounce from 'lodash.debounce';
import { useGravatarUser } from '../queries/user/index';
import isEmail from '../utils/is-email';
import clsx from 'clsx';

export default function Home() {
	const [emailVal, setEmailVal] = useState('');
	const [debouncedEmailVal, setDebouncedEmailVal] = useState('');
	const [budgetVal, setBudgetVal] = useState('');
	const isEmailValid = isEmail(debouncedEmailVal);
	const router = useRouter();

	const { data } = useGravatarUser(debouncedEmailVal, {
		enabled: !!debouncedEmailVal && isEmailValid,
	});

	const debouncedSetEmailVal = useCallback(
		_debounce(
			(value: string) => setDebouncedEmailVal(value.toLowerCase().trim()),
			500
		),
		[]
	);

	return (
		<main className="h-full lg:bg-[var(--color-light-gray)]">
			<div className="flex flex-col bg-[var(--color-light-gray)] py-[24px] px-[20px] overflow-hidden">
				<h1 className="text-[var(--color-light-black)] text-[48px] lg:text-[24px] font-[700]">
					WiSH
				</h1>
				<div className="flex gap-[24px] w-[6856px] animate-marquee my-[40px] lg:mt-[125px] lg:mb-[48px]">
					<div className="flex gap-[24px]">
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-1.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-2.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-3.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-4.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-5.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-6.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-7.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-8.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-9.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-10.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-11.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-12.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-13.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-14.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-15.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-16.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-17.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-18.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-19.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-20.jpeg"
							width="148"
							height="175"
							alt=""
						/>
					</div>
					<div className="flex gap-[24px]">
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-1.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-2.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-3.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-4.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-5.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-6.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-7.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-8.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-9.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-10.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-11.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-12.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-13.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-14.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-15.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-16.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-17.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-18.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-19.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover w-[148px] h-[175px]"
							src="/images/product-20.jpeg"
							width="148"
							height="175"
							alt=""
						/>
					</div>
				</div>
				<div className="w-full lg:max-w-[360px] mx-auto">
					<p className="text-[var(--color-light-black)] text-[36px] font-[700]">
						Get 9 gift recommendations for friends
					</p>
				</div>
			</div>
			<div className="flex flex-col py-[24px] px-[20px] lg:pt-[8px] lg:max-w-[400px] mx-auto">
				<label
					htmlFor="email"
					className="mb-[8px] text-[var(--color-light-black)]"
				>
					Add your friend
				</label>
				<div className="relative">
					{data?.avatar_url && (
						<Image
							src={data.avatar_url}
							alt={data.display_name}
							width="32"
							height="32"
							className="absolute top-[9px] left-[15px] rounded-[50%]"
						/>
					)}
					<input
						id="email"
						name="email"
						className={clsx(
							'w-full h-[49px] py-[10px] px-[15px] border lg:border-none border-[var(--color-light-gray)] rounded-[8px] bg-[var(--color-white)]',
							{ 'pl-[52px]': !!data?.avatar_url }
						)}
						placeholder="Enter your friend’s email"
						value={emailVal}
						onChange={({ target }) => {
							setEmailVal(target.value);
							debouncedSetEmailVal(target.value);
						}}
					/>
					{!!debouncedEmailVal && !isEmailValid && (
						<div className="mt-[8px] text-[var(--color-red)] text-[14px]">
							Invalid email
						</div>
					)}
					{!!data?.error && (
						<div className="mt-[8px] text-[var(--color-red)] text-[14px]">
							{data.error}
						</div>
					)}
				</div>
				<label
					htmlFor="budget"
					className="mt-[24px] mb-[8px] text-[var(--color-light-black)]"
				>
					How much would you like to spend?
				</label>
				<select
					id="budget"
					name="budget"
					className="h-[49px] py-[10px] px-[15px] border lg:border-none border-[var(--color-light-gray)] rounded-[8px] appearance-none bg-[url('/icons/ico-chevron-down.svg')] bg-no-repeat bg-[position:calc(100%-8px)_center] bg-[length:24px_24px] pr-[32px] bg-[var(--color-white)]"
					value={budgetVal}
					onChange={({ target }) => setBudgetVal(target.value)}
				>
					<option value="" disabled>
						Select an option
					</option>
					<option value="TBC-1">Not a lot ($5 — $30)</option>
					<option value="TBC-2">Budget ($30 — $60)</option>
					<option value="TBC-3">Standard ($60 — $100)</option>
					<option value="TBC-4">Premium ($100 — $150)</option>
					<option value="TBC-5">Luxury ($150+)</option>
				</select>
				<button
					className={clsx(
						'mt-[32px] h-[48px] bg-[var(--color-light-black)] rounded-[8px] text-[var(--color-white)] cursor-pointer',
						{ 'opacity-50': !data?.hash || !budgetVal }
					)}
					disabled={!data?.hash || !budgetVal}
					onClick={() => router.push(`/gift/${data.hash}?budget=${budgetVal}`)}
				>
					Get recommendations
				</button>
				<div className="mt-[24px] text-[14px] text-center">
					By continuing you agree to our terms
				</div>
			</div>
		</main>
	);
}
