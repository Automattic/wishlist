import { useQuery } from '@tanstack/react-query';
import { BaseQueryOptions } from '@/types';
import { DbProduct } from '@/products/types';

export const useRecommendedProducts = ( hash?: string, options?: BaseQueryOptions<DbProduct[]> ) => {
	return useQuery( {
		queryKey: [ 'products', hash ],
		queryFn: async () => {
			if ( !hash ) {
				return [];
			}

			const response = await fetch( `/api/products?hash=${hash}` );
			if ( !response.ok ) {
				throw new Error( 'Failed to fetch hash' );
			}

			const data = await response.json();

			return data.products;
		},
		...options,
	} );
};
