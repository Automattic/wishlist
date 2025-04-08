import { useQuery } from '@tanstack/react-query';
import { BaseQueryOptions, Product } from '../../types';

const delay = ( ms: number ) => new Promise( resolve => setTimeout( resolve, ms ) );

export const useRecommendedProducts = ( hash?: string, options?: BaseQueryOptions<Product[]> ) => {
	return useQuery( {
		queryKey: [ 'products', hash ],
		queryFn: async () => {
			await delay( 2000 );
			return mockProducts;
		},
		...options,
	} );
};

const mockProducts: Product[] = [
	{
		id: 1,
		name: 'USB-C 65W Charger',
		image: 'https://images.mironet.cz/foto/3/96118195/cze_pl_Nabijecka-GaN-GravaStar-Alpha65-65W-zluta-43790_1.jpg',
		rating: 4.5,
		price: 59.95,
	},
	{
		id: 2,
		name: 'Product 02',
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlndpwDalSNF8TzBG6T7kGv73l0IOReNJpKw&s',
		rating: 4,
		price: 10.9,
	},
	{
		id: 3,
		name: 'Product 03',
		image: 'https://karanzi.websites.co.in/obaju-turquoise/img/product-placeholder.png',
		rating: 4,
		price: 22.9,
	},
	{
		id: 4,
		name: 'Product 04',
		image: 'https://karanzi.websites.co.in/obaju-turquoise/img/product-placeholder.png',
		rating: 4,
		price: 11.9,
	},
	{
		id: 5,
		name: 'Product 05',
		image: 'https://karanzi.websites.co.in/obaju-turquoise/img/product-placeholder.png',
		rating: 4,
		price: 34.9,
	},
];