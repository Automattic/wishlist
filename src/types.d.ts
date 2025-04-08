import { UndefinedInitialDataOptions } from '@tanstack/react-query';

type BaseQueryOptions<TData, TError = Error> = Omit<
	UndefinedInitialDataOptions<TData, TError>,
	'queryKey' | 'queryFn'
>;

type User = Parial<{
	error: string;
	display_name: string;
	hash: string;
	avatar_url: string;
}>;

type Product = {
	id: number;
	name: string;
	image: string;
	rating: number;
	price: number;
};
