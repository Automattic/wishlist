import { EmbeddingModel, FlagEmbedding } from "fastembed";
import db from "@/products/db";
import { DbProduct } from "./types";

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGEBaseENV15
});

const PRODUCT_VECTORS_QUERY = db.prepare(`
  SELECT rowid, productId, distance
  FROM product_vectors
  WHERE productEmbedding match ?
  ORDER BY distance
  LIMIT 50;
`);

type ProductVectorResult = {
  rowid: number;
  productId: number;
  distance: number;
}

export const findProducts = async (interests: string[]): Promise<DbProduct[]> => {
  const embeddings = embeddingModel.embed(interests);

  let results: ProductVectorResult[] = [];

  for await (const batch of embeddings) {

    for (const b of batch) {
      results = results.concat(PRODUCT_VECTORS_QUERY.all(b) as ProductVectorResult[]);
    }
  }

  if (results.length === 0) return [];

  const products = db.prepare(`
    SELECT *
    FROM products
    WHERE id IN (${results.map((result) => result.productId).join(',')});
  `).all() as DbProduct[];

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
