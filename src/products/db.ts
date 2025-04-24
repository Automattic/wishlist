import sqlite from './adapters/sqlite';
import postgres from './adapters/postgres';
import { z } from 'zod';
import { EmbeddingModel, FlagEmbedding } from 'fastembed';
import { ProductVectorResult } from './types';
import pLimit from 'p-limit';

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGESmallENV15
});

const adapters = {
  SQLITE: sqlite,
  POSTGRES: postgres,
};

type AdapterKey = keyof typeof adapters;

enum SearchType {
  INTERESTS = 'INTERESTS',
  VECTORS = 'VECTORS'
}

const { DATABASE_ADAPTER, SEARCH_TYPE } = z.object({
  DATABASE_ADAPTER: z.enum(Object.keys(adapters) as [AdapterKey, ...AdapterKey[]])
    .default('SQLITE'),
  SEARCH_TYPE: z.nativeEnum(SearchType)
    .default(SearchType.INTERESTS),
}).parse(process.env);

export const clearDb = adapters[DATABASE_ADAPTER].clearDb;
export const clearProductVectors = adapters[DATABASE_ADAPTER].clearProductVectors;
export const setupDb = adapters[DATABASE_ADAPTER].setupDb;
export const findAllProducts = adapters[DATABASE_ADAPTER].findAllProducts;
export const findInterestVector = adapters[DATABASE_ADAPTER].findInterestVector;
export const findProducts = async (interests: string[], priceMin: number = 0, priceMax: number = Number.MAX_SAFE_INTEGER): Promise<ProductVectorResult[]> => {
  const s = new Date();

  console.log(`Finding products for ${interests.length} interests`, { interests });

  let results: ProductVectorResult[] = [];

  if (SEARCH_TYPE === SearchType.INTERESTS) {
    results = await adapters[DATABASE_ADAPTER].findProductsByInterests(interests, priceMin, priceMax);
  } else {
    const limit = pLimit(10);

    const embeddings = await Promise.all(interests.map((interest) => limit(async () => {
      const embeddings = await adapters[DATABASE_ADAPTER].findInterestVector(interest);

      if (embeddings) return embeddings;

      const embedding = await embeddingModel.embed([interest]);

      for await (const batch of embedding) {
        await adapters[DATABASE_ADAPTER].upsertInterestVector(interest, batch[0]);
        return batch[0];
      }

      throw new Error('Failed to calculate embeddings');
    })));

    console.log('Calculated embeddings', embeddings.length);

    results = await adapters[DATABASE_ADAPTER].findProducts(embeddings, priceMin, priceMax);
  }

  console.log(`Took ${new Date().getTime() - s.getTime()}ms`, results.length);

  if (results.length === 0) return [];

  // Sort by distance and deduplicate by ID
  const products: ProductVectorResult[] = results
    .sort((a, b) => a.distance - b.distance)
    .filter((result, index, self) =>
      index === self.findIndex((t) => t.id === result.id)
    );

  // Group products by store and limit to 5 per store
  const storeProducts = new Map<string, ProductVectorResult[]>();
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
  const shuffledProducts: ProductVectorResult[] = [];

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
    await adapters[DATABASE_ADAPTER].insertProductVector(productId, batch[0]);
  }
};
export const updateProduct = adapters[DATABASE_ADAPTER].updateProduct;
export const upsertInterestVector = adapters[DATABASE_ADAPTER].upsertInterestVector;
