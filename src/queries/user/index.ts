import { useQuery } from '@tanstack/react-query';
import { BaseQueryOptions, User } from '@/types';

export const useGravatarUser = ( hashedEmail: string, options?: BaseQueryOptions<User> ) => {
	return useQuery( {
		queryKey: [ 'user', hashedEmail ],
		queryFn: async () => {
			const response = await fetch( `https://api.gravatar.com/v3/profiles/${ hashedEmail }` );
			return response.json();
		},
		...options,
	} );
};
