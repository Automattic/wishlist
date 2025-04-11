import { EmbeddingModel, FlagEmbedding } from "fastembed";
import db from "@/products/db";
import { DbProduct } from "./types";

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGEBaseENV15
});

const PRODUCT_VECTORS_QUERY = db.prepare(`
  SELECT product_vectors.distance, products.*
  FROM product_vectors
  INNER JOIN products ON product_vectors.productId = products.id
  WHERE product_vectors.productEmbedding MATCH ? AND k = 50
  ORDER BY product_vectors.distance
`);

type ProductVectorResult = {
  distance: number;
} & DbProduct;

export const findProducts = async (interests: string[]): Promise<DbProduct[]> => {
  const embeddings = embeddingModel.embed(interests);

  let results: ProductVectorResult[] = [];

  for await (const batch of embeddings) {
    for (const b of batch) {
      results = results.concat(PRODUCT_VECTORS_QUERY.all(b) as ProductVectorResult[]);
    }
  }

  if (results.length === 0) return [];

  const products: DbProduct[] = results.sort((a, b) => a.distance - b.distance).map((result) => result);

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

  // Shuffle products in buckets of 10
  const bucketSize = 10;
  const shuffledProducts: DbProduct[] = [];

  for (let i = 0; i < limitedProducts.length; i += bucketSize) {
    const bucket = limitedProducts.slice(i, i + bucketSize);
    shuffledProducts.push(...bucket.sort(() => Math.random() - 0.5));
  }

  return shuffledProducts.slice(0, 50);
};
