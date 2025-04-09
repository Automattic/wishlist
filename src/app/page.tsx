'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import _debounce from 'lodash.debounce';
import { useGravatarUser } from '@/queries/user';
import isEmail from '@/utils/is-email';
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
		<main>
			<div className="flex flex-col gap-[40px] bg-[var(--color-light-gray)] py-[24px] px-[20px] overflow-hidden">
				<h1 className="text-[var(--color-light-black)] text-[48px] font-[700]">
					WiSH
				</h1>
				<div className="flex gap-[24px] w-[6856px] animate-marquee">
					<div className="flex gap-[24px]">
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/apple-watch.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/nike-shoes.png"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/apple-airpods.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/grow-your-own.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/drink-ware.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/camera.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/ugg-shoes.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/amazon-kindle.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/fur-hat.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/candle.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/coffee-machine.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/hair-dryer.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/ceo-glow.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/perfume.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/recess-pickleball.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/sun-glasses.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/journal.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/light.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/earphone.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/switch.jpeg"
							width="148"
							height="175"
							alt=""
						/>
					</div>
					<div className="flex gap-[24px]">
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/apple-watch.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/nike-shoes.png"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/apple-airpods.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/grow-your-own.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/drink-ware.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/camera.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/ugg-shoes.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/amazon-kindle.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/fur-hat.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/candle.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/coffee-machine.jpeg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/hair-dryer.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/ceo-glow.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/perfume.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/recess-pickleball.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/sun-glasses.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/journal.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/light.jpg"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/earphone.webp"
							width="148"
							height="175"
							alt=""
						/>
						<Image
							className="rounded-[20px] object-cover bg-[var(--color-white)] w-[148px] h-[175px]"
							src="/images/switch.jpeg"
							width="148"
							height="175"
							alt=""
						/>
					</div>
				</div>
				<p className="text-[var(--color-light-black)] text-[36px] font-[700]">
					Get 9 gift recommendations for friends
				</p>
			</div>
			<div className="flex flex-col py-[24px] px-[20px]">
				<label htmlFor="email" className="mb-[8px]">
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
							'w-full h-[49px] py-[10px] px-[15px] border border-[var(--color-light-black)] rounded-[8px]',
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
				<label htmlFor="budget" className="mt-[24px] mb-[8px]">
					How much would you like to spend?
				</label>
				<select
					id="budget"
					name="budget"
					className="h-[49px] py-[10px] px-[15px] border border-[var(--color-light-black)] rounded-[8px] appearance-none bg-[url('/icons/ico-chevron-down.svg')] bg-no-repeat bg-[position:calc(100%-8px)_center] bg-[length:24px_24px] pr-[32px]"
					value={budgetVal}
					onChange={({ target }) => setBudgetVal(target.value)}
				>
					<option value="" disabled>
						Select an option
					</option>
					<option value="TBC-1">Not a lot ($5 — $30)</option>
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
