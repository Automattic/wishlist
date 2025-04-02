'use client';

import { useGravatarUser } from '@/queries/user';
import { useRecommendedProducts } from '@/queries/product';

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
		return <div>Loading user data...</div>;
	}

	if ( isFetchUserError ) {
		return <div>User not found</div>;
	}

	if ( ! userData ) {
		return null;
	}

	if ( isFetchingProducts ) {
		return <div>
			<img src={ userData.avatar_url } alt={ userData.display_name } />
			<div>
				Fetching { userData.display_name } recommended products
			</div>
		</div>;
	}

	if ( isFetchProductsError ) {
		return <div>Unable to fetch recommended products</div>;
	}

	return (
		<div>
			{ products?.map( ( product ) => (
				<div key={ product.id }>{ product.name }</div>
			) ) }
		</div>
	);
}
