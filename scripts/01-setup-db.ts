import { clearDb, setupDb } from '../src/products/db';

await clearDb();
await setupDb();
