'use client';

import { useGravatarUser } from '@/queries/user';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface Product {
	id: string;
	name: string;
	price: number;
	image: string;
}

const Wrapper = ( { children }: { children: ReactNode } ) =>
	<div className="h-full flex flex-col items-center justify-center gap-5">{ children }</div>;

export default function ProductList() {
	const {
		data: userData,
		isError: isFetchUserError,
		isFetching: isFetchingUser,
	} = useGravatarUser( 'stefano.sala@automattic.com' );

	const {
		data: products,
		isError: isFetchProductsError,
		isFetching: isFetchingProducts,
	} = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const response = await fetch(`/api/products?hash=${userData?.hash}`);
			if (!response.ok) {
				throw new Error('Failed to fetch products');
			}
			return response.json();
		},
		enabled: !!userData?.hash,
	});

	if ( isFetchingUser ) {
		return <Wrapper>
			<div className="rounded-full w-[120] h-[120] bg-gray-400 animate-pulse" />
			<div className="mb-20">
				Fetching user data
			</div>
		</Wrapper>;
	}

	if ( isFetchUserError ) {
		return <div>User not found</div>;
	}

	if ( ! userData ) {
		return null;
	}

	if ( isFetchingProducts ) {
		return <Wrapper>
			<img
				src={ `${ userData.avatar_url }?s=512` }
				alt={ userData.display_name }
				className="rounded-full w-[120]" />
			<div className="mb-20">
				Fetching recommendations for { userData.display_name }
			</div>
		</Wrapper>;
	}

	if ( isFetchProductsError ) {
		return <div>Unable to fetch recommended products</div>;
	}

	return (
		<div className="p-6 flex flex-col gap-6">
			{ products?.map( ( product: Product ) => (
				<div className="flex flex-col gap-4 rounded-sm p-4 shadow-md" key={ product.id }>
					<img src={product.image} alt={product.name} />
					<div className="flex flex-col">
						<span className="text-2xl">{ product.name }</span>
						<span className="text-2xl font-semibold">${ product.price.toFixed(2) }</span>
						<div className="flex gap-4 mt-4">
							<button className="flex-1 border-1 rounded-md h-12">Not for me</button>
							<button className="flex-1 bg-black text-white rounded-md">Add to wishlist</button>
						</div>
					</div>
				</div>
			) ) }
		</div>
	);
}
