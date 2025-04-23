import pLimit from 'p-limit';
import { clearProductVectors, findAllProducts, insertProductVector } from '@/products/db';
import { DbProduct } from '@/products/types';

await clearProductVectors();

const products = await findAllProducts();

const limit = pLimit(10);

let i = 0;

await Promise.all(products.map((product: DbProduct) =>
  limit(async () => {
    console.log(`${++i}/${products.length}: ${product.id}: ${product.productName} ${product.description}`);
    await insertProductVector(product.id, `${product.productName} ${product.description}`);
  })
));
