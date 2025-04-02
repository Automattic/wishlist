import { useQuery } from '@tanstack/react-query';
import { sha256 } from 'js-sha256';
import { BaseQueryOptions, User } from '../../../types';

export const useGravatarUser = ( email: string, options?: BaseQueryOptions<User> ) => {
	return useQuery( {
		queryKey: [ 'user', email ],
		queryFn: async () => {
			const response = await fetch( `https://api.gravatar.com/v3/profiles/${ sha256( email ) }` );
			return response.json();
		},
		...options,
	} );
};