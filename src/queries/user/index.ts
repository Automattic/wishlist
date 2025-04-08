import { useQuery } from '@tanstack/react-query';
import { BaseQueryOptions, User } from '@/types';

export const useGravatarUser = ( hash: string, options?: BaseQueryOptions<User> ) => {
	return useQuery( {
		queryKey: [ 'user', hash ],
		queryFn: async () => {
			const response = await fetch( `https://api.gravatar.com/v3/profiles/${ hash }` );
			return response.json();
		},
		...options,
	} );
};
