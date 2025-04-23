import sqliteAdapter from '../src/products/adapters/sqlite';
import postgresAdapter from '../src/products/adapters/postgres';
import pLimit from 'p-limit';
import { DbProduct } from '@/products/types';

await postgresAdapter.clearDb();
await postgresAdapter.setupDb();

const sqliteProducts = await sqliteAdapter.findAllProducts();

const limit = pLimit(10);

await Promise.all(sqliteProducts.map((product: DbProduct) =>
  limit(async () => {
    console.log(`Copying product ${product.id} to postgres`);
    await postgresAdapter.insertProduct(product);
  })
));
