import { useQuery } from '@tanstack/react-query';
import { BaseQueryOptions } from '../../types';
import { DbProduct } from '@/products/types';

const delay = ( ms: number ) => new Promise( resolve => setTimeout( resolve, ms ) );

export const useRecommendedProducts = ( hash?: string, options?: BaseQueryOptions<DbProduct[]> ) => {
	return useQuery( {
		queryKey: [ 'products', hash ],
		queryFn: async () => {
			await delay( 2000 );
			return mockProducts;
		},
		...options,
	} );
};

const mockProducts: DbProduct[] = [
	{
		id: 1,
		productName: 'USB-C 65W Charger',
		description: 'USB-C 65W Charger',
		shopName: 'Mironet',
		productUrl: 'https://www.mironet.cz/nabijecka-gan-gravastar-alpha65-65w-zluta-43790',
		imageUrl: 'https://images.mironet.cz/foto/3/96118195/cze_pl_Nabijecka-GaN-GravaStar-Alpha65-65W-zluta-43790_1.jpg',
		priceMin: 59.95,
		priceMax: 59.95,
		currency: 'USD',
	},
	{
		id: 2,
		productName: 'Amazon Kindle',
		description: 'Amazon Kindle',
		shopName: 'Mironet',
		productUrl: 'https://www.mironet.cz/nabijecka-gan-gravastar-alpha65-65w-zluta-43790',
		imageUrl: '/images/amazon-kindle.jpg',
		priceMin: 10.9,
		priceMax: 10.9,
		currency: 'USD',
	},
	{
		id: 3,
		productName: 'Sunglasses',
		description: 'Sunglasses',
		shopName: 'Mironet',
		productUrl: 'https://www.mironet.cz/nabijecka-gan-gravastar-alpha65-65w-zluta-43790',
		imageUrl: '/images/sun-glasses.webp',
		priceMin: 22.9,
		priceMax: 22.9,
		currency: 'USD',
	},
	{
		id: 4,
		productName: 'Perfume',
		description: 'Perfume',
		shopName: 'Mironet',
		productUrl: 'https://www.mironet.cz/nabijecka-gan-gravastar-alpha65-65w-zluta-43790',
		imageUrl: '/images/perfume.jpg',
		priceMin: 11.9,
		priceMax: 11.9,
		currency: 'USD',
	},
	{
		id: 5,
		productName: 'AirPods',
		description: 'AirPods',
		shopName: 'Mironet',
		productUrl: 'https://www.mironet.cz/nabijecka-gan-gravastar-alpha65-65w-zluta-43790',
		imageUrl: '/images/apple-airpods.jpeg',
		priceMin: 34.9,
		priceMax: 34.9,
		currency: 'USD',
	},
];
