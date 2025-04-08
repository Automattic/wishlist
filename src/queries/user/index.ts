import { useQuery } from '@tanstack/react-query';
import { sha256 } from 'js-sha256';
import isEmail from '@/utils/is-email';

import { BaseQueryOptions, User } from '@/types';

export const useGravatarUser = ( emailOrHash: string, options?: BaseQueryOptions<User> ) => {
	emailOrHash = isEmail( emailOrHash ) ? sha256( emailOrHash ) : emailOrHash;

	return useQuery( {
		queryKey: [ 'user', emailOrHash ],
		queryFn: async () => {
			const response = await fetch( `https://api.gravatar.com/v3/profiles/${ emailOrHash }` );
			return response.json();
		},
		...options,
	} );
};
