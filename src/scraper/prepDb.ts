import Database from "better-sqlite3";
import { EmbeddingModel, FlagEmbedding } from "fastembed";
import * as sqliteVec from "sqlite-vec";

const db = new Database(`${import.meta.dirname}/../../db/products.db`);
sqliteVec.load(db);

const vectorTableResult = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='product_vectors'`).all();

if (vectorTableResult.length > 0) {
  db.exec(`
    DROP TABLE product_vectors;
  `);
}

db.exec(`
  CREATE VIRTUAL TABLE product_vectors USING vec0(
    product_id FLOAT,
    product_embedding float[768]
  );
`);

const products = db.prepare('SELECT * FROM products')
  .all() as any[];

const embeddingModel = await FlagEmbedding.init({
  model: EmbeddingModel.BGEBaseENV15
});

const insert = db.prepare(`INSERT INTO product_vectors (product_id, product_embedding) VALUES (?, ?)`);

for await (const product of products) {
  console.log(234, `${product.id}: ${product.product_name} ${product.description}`);
  const embeddings = embeddingModel.embed([`${product.product_name} ${product.description}`]);
  for await (const batch of embeddings) {
    insert.run(product.id, batch[0]);
  }
}
