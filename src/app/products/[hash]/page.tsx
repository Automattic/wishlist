'use client';

import { useParams, useSearchParams } from 'next/navigation';

export default function ProductPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const { hash } = params;
	const budget = searchParams.get('budget');

	return (
		<div>
            <h1>Users will access this page from the email, plz migrate the products page to here</h1>
            <br />
			<p>Hash (use it to get the profile data): {hash}</p>
			<p>Budget: {budget}</p>
		</div>
	);
}
