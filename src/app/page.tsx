'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import _debounce from 'lodash.debounce';
import { useGravatarUser } from '@/queries/user';
import { sha256 } from 'js-sha256';
import isEmail from '@/utils/is-email';
import clsx from 'clsx';

export default function Home() {
	const [emailVal, setEmailVal] = useState('');
	const [debouncedEmailVal, setDebouncedEmailVal] = useState('');
	const [budgetVal, setBudgetVal] = useState('');
	const isEmailValid = isEmail(debouncedEmailVal);
	const router = useRouter();

	const { data } = useGravatarUser(sha256(debouncedEmailVal), {
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
		<div className="flex justify-center h-screen">
			<main className="flex flex-col max-w-[1024px] h-full py-[32px] px-[20px]">
				<h1 className="text-[var(--color-light-black)] text-[48px] font-bold">
					WiSH
				</h1>
				<h2 className="mt-[114px] mb-[32px] text-[var(--color-light-black)] text-[32px]">
					Get 9 gift recommendations for friends
				</h2>
				<label htmlFor="email" className="hidden">
					Enter your friend’s email
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
				<label htmlFor="budget" className="mt-[32px]">
					How much would you like to spend?
				</label>
				<select
					id="budget"
					name="budget"
					className="mt-[8px] w-full h-[49px] py-[10px] px-[15px] border border-[var(--color-light-black)] rounded-[8px] appearance-none bg-[url('/images/ico-chevron-down.svg')] bg-no-repeat bg-[position:calc(100%-8px)_center] bg-[length:24px_24px] pr-[32px]"
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
						'self-end mt-auto w-full h-[48px] bg-[var(--color-light-black)] rounded-[8px] text-[var(--color-white)] cursor-pointer',
						{ 'opacity-50': !data?.hash || !budgetVal }
					)}
					disabled={!data?.hash || !budgetVal}
					onClick={() =>
						router.push(`/gift/${data.hash}?budget=${budgetVal}`)
					}
				>
					Get started
				</button>
				<div className="mt-[24px] text-center">
					By continuing you agree to our terms
				</div>
			</main>
		</div>
	);
}
