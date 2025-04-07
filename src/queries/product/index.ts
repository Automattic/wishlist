import Database from "better-sqlite3";
import { EmbeddingModel, FlagEmbedding } from "fastembed";
import * as sqliteVec from "sqlite-vec";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { BaseQueryOptions } from '../../../types';

const db = new Database('db.db');
sqliteVec.load(db);

type Product = {
	id: number;
	product_name: string;
	description: string;
	shop_name: string;
	product_url: string;
	image_url: string;
	price_min: number;
	price_max: number;
	currency: string;
}

export const findProducts = async (query: string) => {
	const embeddingModel = await FlagEmbedding.init({
		model: EmbeddingModel.BGEBaseENV15
	});

	const embeddings = embeddingModel.embed(query.split(','));

	let results: {
		product_id: number;
		distance: number;
	}[] = [];

	const q = db.prepare(`
		select
			rowid,
			product_id,
			distance
		from product_vectors
		where product_embedding match ?
		order by distance
		limit 4;
	`);

	for await (const batch of embeddings) {
		for (const b of batch) {
			results = results.concat(q.all(b) as any);
		}
	}

	const productIds = results.map((result) => result.product_id);

	const productQuery = db.prepare(`
		select
			*
		from products
		where id in (${productIds.join(',')});
	`);

	return productQuery.all() as Product[];
}

export const useRecommendedProducts = ( hash?: string, options?: BaseQueryOptions<Product[]> ) => {
	return useQuery( {
		queryKey: [ 'products', hash ],
		queryFn: async () => {
			const res = await axios.get(`https://api.gravatar.com/v3/profiles/${hash}`);
			console.log(res.data);
			return [];
			return findProducts('test');
		},
		...options,
	} );
};
