import { useQuery } from '@tanstack/react-query';
import { BaseQueryOptions } from '@/types';
import { DbProduct } from '@/products/types';

export const useRecommendedProducts = ( hash?: string, budget?: string, options?: BaseQueryOptions<DbProduct[]> ) => {
	return useQuery( {
		queryKey: [ 'products', hash, budget ],
		queryFn: async () => {
			if ( !hash ) {
				return [];
			}

			const response = await fetch( `/api/products?hash=${hash}&budget=${budget}` );
			if ( !response.ok ) {
				throw new Error( 'Failed to fetch hash' );
			}

			const data = await response.json();

			return data.products;
		},
		...options,
	} );
};
