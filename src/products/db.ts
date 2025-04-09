import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

const db = new Database(`${import.meta.dirname}/../../db/products.db`);
sqliteVec.load(db);

export default db;

export const clearDb = () => {
  db.exec(`
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS product_vectors;
  `);
};

export const setupDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productName TEXT,
      description TEXT,
      shopName TEXT,
      productUrl TEXT UNIQUE,
      imageUrl TEXT,
      priceMin FLOAT,
      priceMax FLOAT,
      currency TEXT
    )
  `);

  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS product_vectors USING vec0(
      productId FLOAT,
      productEmbedding FLOAT[768]
    );
  `);
};
