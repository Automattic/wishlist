'use client';

import { useGravatarUser } from '@/queries/user';
import { useRecommendedProducts } from '@/queries/product';

const Wrapper = ( { children } ) =>
	<div className="h-full flex flex-col items-center justify-center gap-5">{ children }</div>;

export default function ProductList() {
	const {
		data: userData,
		isError: isFetchUserError,
		isFetching: isFetchingUser,
	} = useGravatarUser( 'joao.heringer@automattic.com' );

	const {
		data: products,
		isError: isFetchProductsError,
		isFetching: isFetchingProducts,
	} = useRecommendedProducts( userData?.hash, {
		enabled: !! userData?.hash,
	} );

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
			{ products?.map( ( product ) => (
				<div className="flex flex-col gap-4 rounded-sm p-4 shadow-md" key={ product.id }>
					<img src={product.image} />
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
