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
  LIMIT 4;
`);

type ProductVectorResult = {
  rowid: number;
  productId: number;
  distance: number;
}

export const findProducts = async (interests: string[]) => {
  const embeddings = embeddingModel.embed(interests);

  let results: ProductVectorResult[] = [];

  for await (const batch of embeddings) {

    for (const b of batch) {
      results = results.concat(PRODUCT_VECTORS_QUERY.all(b) as ProductVectorResult[]);
    }
  }

  if (results.length === 0) return [];

  return db.prepare(`
    SELECT *
    FROM products
    WHERE id IN (${results.map((result) => result.productId).join(',')});
  `).all() as DbProduct[];
};
