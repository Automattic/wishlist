import sqlite from './adapters/sqlite';
import postgres from './adapters/postgres';
import { z } from 'zod';
import { EmbeddingModel, FlagEmbedding } from 'fastembed';
import { DbProduct, ProductVectorResult } from './types';

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGESmallENV15
});

const adapters = {
  SQLITE: sqlite,
  POSTGRES: postgres,
};

type AdapterKey = keyof typeof adapters;

const { DATABASE_ADAPTER } = z.object({
  DATABASE_ADAPTER: z.enum(Object.keys(adapters) as [AdapterKey, ...AdapterKey[]])
    .default('SQLITE'),
}).parse(process.env);

export const clearDb = adapters[DATABASE_ADAPTER].clearDb;
export const clearProductVectors = adapters[DATABASE_ADAPTER].clearProductVectors;
export const setupDb = adapters[DATABASE_ADAPTER].setupDb;
export const findAllProducts = adapters[DATABASE_ADAPTER].findAllProducts;
export const findProducts = async (interests: string[]): Promise<DbProduct[]> => {
  const embeddings = embeddingModel.embed(interests);

  let results: ProductVectorResult[] = [];

  const s = new Date();

  for await (const batch of embeddings) {
    results = results.concat(await adapters[DATABASE_ADAPTER].findProducts(batch));
  }

  console.log(`Took ${new Date().getTime() - s.getTime()}ms`, results.length);

  if (results.length === 0) return [];

  // Sort by distance and deduplicate by ID
  const products: DbProduct[] = results
    .sort((a, b) => a.distance - b.distance)
    .filter((result, index, self) =>
      index === self.findIndex((t) => t.id === result.id)
    );

  // Group products by store and limit to 5 per store
  const storeProducts = new Map<string, DbProduct[]>();
  products.forEach(product => {
    if (!storeProducts.has(product.shopName)) {
      storeProducts.set(product.shopName, []);
    }
    if (storeProducts.get(product.shopName)!.length < 5) {
      storeProducts.get(product.shopName)!.push(product);
    }
  });

  // Flatten the products back into a single array
  const limitedProducts = Array.from(storeProducts.values()).flat();

  // Shuffle products in buckets of 10 to add some randomness
  const bucketSize = 10;
  const shuffledProducts: DbProduct[] = [];

  for (let i = 0; i < limitedProducts.length; i += bucketSize) {
    const bucket = limitedProducts.slice(i, i + bucketSize);
    shuffledProducts.push(...bucket.sort(() => Math.random() - 0.5));
  }

  return shuffledProducts.slice(0, 50);
};
export const findProductsByUrl = adapters[DATABASE_ADAPTER].findProductsByUrl;
export const insertProduct = adapters[DATABASE_ADAPTER].insertProduct;
export const insertProductVector = async (productId: string | number, productEmbedding: string) => {
  const embeddings = embeddingModel.embed([productEmbedding]);

  for await (const batch of embeddings) {
    for (const b of batch) {
      await adapters[DATABASE_ADAPTER].insertProductVector(productId, b);
    }
  }
};
export const updateProduct = adapters[DATABASE_ADAPTER].updateProduct;
