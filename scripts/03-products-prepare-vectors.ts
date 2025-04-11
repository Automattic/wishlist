import { EmbeddingModel, FlagEmbedding } from 'fastembed';
import db from '@/products/db';
import { DbProduct } from '@/products/types';
import pLimit from 'p-limit';

db.exec(`DELETE FROM product_vectors;`);

const products = db.prepare('SELECT * FROM products')
  .all() as DbProduct[];

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGEBaseENV15
});

const insert = db.prepare(`INSERT INTO product_vectors (productId, productEmbedding) VALUES (?, ?)`);

const limit = pLimit(10);

await Promise.all(products.map(product =>
  limit(async () => {
    console.log(`${product.id}: ${product.productName} ${product.description}`);
    const embeddings = embeddingModel.embed([`${product.productName} ${product.description}`]);
    for await (const batch of embeddings) {
      insert.run(product.id, batch[0]);
    }
  })
));
