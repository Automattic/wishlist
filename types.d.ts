import { UndefinedInitialDataOptions } from '@tanstack/react-query';

type BaseQueryOptions<TData, TError = Error> = Omit<
	UndefinedInitialDataOptions<TData, TError>,
	'queryKey' | 'queryFn'
>;

type User = {
	display_name: string;
	hash: string;
	avatar_url: string;
}
