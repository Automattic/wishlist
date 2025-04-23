import { DbProduct, ProductVectorResult } from "../types";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

type ProductVectorResultPostgres = {
  id: string;
  productname: string;
  description: string;
  shopname: string;
  producturl: string;
  imageurl: string;
  pricemin: number;
  pricemax: number;
  currency: string;
  distance: number;
}

type DbProductPostgres = {
  id: string;
  productname: string;
  description: string;
  shopname: string;
  producturl: string;
  imageurl: string;
  pricemin: number;
  pricemax: number;
  currency: string;
}

const formatProducts = <T extends DbProduct | ProductVectorResult>(
  products: (DbProductPostgres | ProductVectorResultPostgres)[]
): T[] => {
  return products.map((product) => {
    const formatted = {
      ...product,
      productName: product.productname,
      shopName: product.shopname,
      productUrl: product.producturl,
      imageUrl: product.imageurl,
      priceMin: product.pricemin,
      priceMax: product.pricemax,
    };
    return formatted as unknown as T;
  });
};

const { DATABASE_URL } = z.object({
  DATABASE_URL: z.string(),
}).parse(process.env);

const sql = neon(DATABASE_URL);

export const clearDb = async () => {
  await sql`DROP TABLE IF EXISTS product_vectors`;
  await sql`DROP TABLE IF EXISTS products`;
};

export const setupDb = async () => {
  await sql`CREATE EXTENSION IF NOT EXISTS pg_uuidv7`;
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
      productName TEXT,
      description TEXT,
      shopName TEXT,
      productUrl TEXT UNIQUE,
      imageUrl TEXT,
      priceMin FLOAT,
      priceMax FLOAT,
      currency TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS product_vectors (
      productId UUID REFERENCES products(id),
      productEmbedding vector(384)
    );
  `;
};

export const clearProductVectors = async () => {
  await sql`
    DELETE FROM product_vectors;
  `;
};

export const findAllProducts = async (): Promise<DbProduct[]> => {
  const products = await sql`
    SELECT * FROM products;
  ` as DbProductPostgres[];

  return formatProducts(products);
};

export const findProducts = async (embeddings: number[][]): Promise<ProductVectorResult[]> => {
  const results: ProductVectorResultPostgres[] = [];

  for (const embedding of embeddings) {
    const result = await sql`
      SELECT p.*, v.productEmbedding <-> ${`[${embedding.join(",")}]`} AS distance
      FROM products AS p
      INNER JOIN product_vectors AS v ON p.id = v.productId
      ORDER BY distance
      LIMIT 50
    ` as ProductVectorResultPostgres[];

    results.push(...result);
  }

  return formatProducts(results);
};

export const findProductsByInterests = async (interests: string[]): Promise<ProductVectorResult[]> => {
  // Create a tsquery string by joining interests with OR operator
  const tsquery = interests.map(interest => `'${interest}'`).join(' | ');

  const results = await sql`
    SELECT p.*,
           ts_rank(
             setweight(to_tsvector('english', p.productName), 'A') ||
             setweight(to_tsvector('english', p.description), 'B'),
             to_tsquery('english', ${tsquery})
           ) as rank
    FROM products AS p
    WHERE to_tsvector('english', p.productName || ' ' || p.description) @@ to_tsquery('english', ${tsquery})
    ORDER BY rank DESC
    LIMIT 50
  ` as ProductVectorResultPostgres[];

  console.log(results, interests);

  return formatProducts(results);
};

export const findProductsByUrl = async (urls: string[]): Promise<DbProduct[]> => {
  const products = await sql`
    SELECT * FROM products
    WHERE productUrl = ANY(${urls});
  ` as DbProductPostgres[];

  return formatProducts(products);
};

export const insertProduct = async (product: DbProduct): Promise<void> => {
  await sql`
    INSERT INTO products (
      productName,
      description,
      shopName,
      productUrl,
      imageUrl,
      priceMin,
      priceMax,
      currency
    ) VALUES (
      ${product.productName},
      ${product.description},
      ${product.shopName},
      ${product.productUrl},
      ${product.imageUrl},
      ${product.priceMin},
      ${product.priceMax},
      ${product.currency}
    );
  `;
};

export const insertProductVector = async (productId: string | number, productEmbedding: number[]): Promise<void> => {
  await sql`
    INSERT INTO product_vectors (
      productId,
      productEmbedding
    ) VALUES (
      ${productId},
      ${`[${productEmbedding.join(",")}]`}
    );
  `;
};

export const updateProduct = async (product: Omit<DbProduct, 'id'>): Promise<void> => {
  await sql`
    UPDATE products
    SET productName = ${product.productName},
        description = ${product.description},
        shopName = ${product.shopName},
        productUrl = ${product.productUrl},
        imageUrl = ${product.imageUrl},
        priceMin = ${product.priceMin},
        priceMax = ${product.priceMax},
        currency = ${product.currency}
    WHERE productUrl = ${product.productUrl};
  `;
};

const postgresAdapter = {
  clearDb,
  clearProductVectors,
  setupDb,
  findAllProducts,
  findProducts,
  findProductsByUrl,
  insertProduct,
  insertProductVector,
  updateProduct,
};

export default postgresAdapter;
