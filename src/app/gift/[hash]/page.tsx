'use client';

import { RecommendedProduct } from '@/types/recommendations';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
export default function GiftPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const { hash } = params;
	const budget = searchParams.get('budget');
	const [ recommendations, setRecommendations ] = useState<RecommendedProduct[] | null>( null );
	useEffect(() => {
		const fetchRecommendations = async () => {
			const response = await fetch( `/api/recommendations?emailHash=${hash}&budget=${budget}` );
			const fetchedRecommendations = await response.json() as { recommendations: RecommendedProduct[] };
			setRecommendations( fetchedRecommendations.recommendations );
		};
		fetchRecommendations();
	}, [hash, budget]);

	const handleProduct = async (productId: string, action: string) => {
		const response = await fetch( `/api/recommendations/action`, {
			method: 'POST',
			body: JSON.stringify({ emailHash: hash, productId, action }),
		} );
		console.log( await response.json() );
	};

	return (
		<div>
            <h1>Users will access this page from the email, plz migrate the products page to here</h1>
            <br />
			<p>Hash (use it to get the profile and gifts): {hash}</p>
			<p>Budget: {budget}</p>
			<p>Recommendations: </p>
			{recommendations && recommendations.map((recommendation: RecommendedProduct) => (
				<div key={recommendation.id}>
					<p>{recommendation.name} {recommendation.price}</p>
					<p>{recommendation.description}</p>
					<Image src={recommendation.imageUrl} alt={recommendation.name} width={200} height={200} />
					<button style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', padding: '5px 10px', borderRadius: '5px' }} onClick={() => handleProduct(recommendation.id, 'wishlist')}>Add to Wishlist</button>
					<button style={{ marginRight: '10px', backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px' }} onClick={() => handleProduct(recommendation.id, 'discard')}>Discard</button>
				</div>
			))}
		</div>
	);
}
