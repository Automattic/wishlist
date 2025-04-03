import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { readFileSync } from "node:fs";
import { z } from "zod";
import batchPromises from "batch-promises";
import axios from "axios";
import { load as cheerio } from "cheerio";

const ShopValidator = z.object({
  name: z.string(),
  url: z.string().url(),
});

type Shop = z.infer<typeof ShopValidator>;

const ProductValidator = z.object({
  productName: z.string(),
  description: z.string(),
  shopName: z.string(),
  productUrl: z.string().url(),
  imageUrl: z.string().url(),
  priceMin: z.coerce.number().optional().nullable(),
  priceMax: z.coerce.number().optional().nullable(),
  currency: z.string().optional().nullable(),
});

type Product = z.infer<typeof ProductValidator>;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

const db = new Database(`${import.meta.dirname}/../../db/products.db`);
sqliteVec.load(db);

const setupDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT,
      description TEXT,
      shop_name TEXT,
      product_url TEXT UNIQUE,
      image_url TEXT,
      price_min FLOAT,
      price_max FLOAT,
      currency TEXT
    )
  `);

  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS product_vectors USING vec0(
      product_id FLOAT,
      product_embedding FLOAT[768]
    );
  `);
};

const readShops = async (filename: string) => {
  const content = await readFileSync(filename, 'utf-8')
    .split('\n')
    .map((line) => {
      let [name, url] = line.split(',');

      if (!url?.startsWith('http')) {
        url = `https://${url}`;
      }

      return { name, url };
    });

  return content.map((shop) => {
    try {
      return z.object({
        name: z.string(),
        url: z.string().url(),
      }).parse(shop);
    } catch (error) {
      return null;
    }
  }).filter((shop) => shop !== null);
};

const scrapeProductDetails = async (productUrl: string): Promise<{
  imageUrl?: string | null;
  description?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  currency?: string | null;
}> => {
  try {
    const response = await axios.get(productUrl, { headers: HEADERS, timeout: 10000 });

    if (response.status !== 200) {
      return { description: null, imageUrl: null };
    }

    const $ = cheerio(response.data);

    let imageUrl = null;
    const ogImage = $('meta[property="og:image"]');
    if (ogImage.length && ogImage.attr('content')) {
      imageUrl = ogImage.attr('content');
    }

    if (!imageUrl) {
      const imageElement = $('.wp-post-image');
      if (imageElement.length && imageElement.attr('src')) {
        imageUrl = imageElement.attr('src');
      }
    }

    let description = null;
    const ogDescription = $('meta[property="og:description"]');
    if (ogDescription.length && ogDescription.attr('content')) {
      description = ogDescription.attr('content');
    }

    let price = null;
    const priceElement = $('meta[property="product:price:amount"]');
    if (priceElement.length && priceElement.attr('content')) {
      price = parseFloat(priceElement.attr('content') ?? '');
      if (Number.isNaN(price)) {
        price = null;
      }
    }

    let currency = null;
    const currencyElement = $('meta[property="product:price:currency"]');
    if (currencyElement.length && currencyElement.attr('content')) {
      currency = currencyElement.attr('content');
    }

    return {
      description,
      imageUrl,
      priceMin: price,
      priceMax: price,
      currency,
    };
  } catch (error) {
    return { };
  }
};

const saveProduct = async (shop: Shop, product: Product) => {
  const existingProduct = await db.prepare('SELECT id FROM products WHERE product_url = ?').all([product.productUrl]);

  if (existingProduct.length > 0) {
    db.prepare(`
      UPDATE products
      SET product_name = :productName,
          description = :description,
          shop_name = :shopName,
          image_url = :imageUrl,
          price_min = :priceMin,
          price_max = :priceMax,
          currency = :currency
      WHERE product_url = :productUrl
    `).run(product);

    console.log(`[${shop.name}]: Updated product ${product.productName}`);
  } else {
    db.prepare(`
      INSERT INTO products (product_name, description, shop_name, product_url, image_url, price_min, price_max, currency)
      VALUES (:productName, :description, :shopName, :productUrl, :imageUrl, :priceMin, :priceMax, :currency)
    `).run(product);

    console.log(`[${shop.name}]: Saved product ${product.productName}`);
  }
};

const saveProductData = async (shop: Shop, productData: any) => {
  const productName = productData.title?.rendered?.trim();
  const productUrl = productData.link;

  let { description, imageUrl, priceMin, priceMax, currency } = await scrapeProductDetails(productUrl);

  if (!description && productData.excerpt?.rendered) {
    description = cheerio(`<div>${productData.excerpt?.rendered}</div>`)('div').text();
    description = description.replace(/\s+/g, ' ').trim();
  }

  const product = ProductValidator.parse({
    productName,
    description,
    shopName: shop.name,
    productUrl,
    imageUrl,
    priceMin,
    priceMax,
    currency,
  });

  await saveProduct(shop, product);
};

const scrapeShop = async (shop: Shop) => {
  console.log(`Scraping ${shop.name}...`);

  let page = 1;
  let productSaved = 0;

  while (true) {
    const apiUrl = new URL(`/wp-json/wp/v2/product?page=${page}&per_page=50`, shop.url).toString();
    console.log(`[${shop.name}]: Fetching page ${page}`);

    let response;

    try {
      response = await axios.get(apiUrl, { headers: HEADERS, timeout: 15000 });
    } catch (error: any) {
      if (error.response && ([400, 404].includes(error.response.status))) {
        break;
      }

      console.log(`[${shop.name}]: API error: ${error.message}`);

      break;
    }

    const productData = response.data;

    if (!productData || productData.length === 0) {
      break;
    }

    for (const product of productData) {
      try {
        await saveProductData(shop, product);

        productSaved += 1;
      } catch (error) {
        console.log(`[${shop.name}]: Error saving product: ${error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 100));
    }

    page += 1;
  }
};

const argv = await yargs(hideBin(process.argv))
  .option('workers', {
    type: 'number',
    default: 1,
    description: 'Number of parallel workers'
  })
  .option('csv', {
    type: 'string',
    default: 'shops.csv',
    description: 'CSV file containing shop URLs (shop_name, url)'
  })
  .help()
  .alias('help', 'h')
  .argv;

setupDb();

const shops = await readShops(argv.csv);

console.log(`Found ${shops.length} shops`);

await batchPromises(argv.workers, shops, scrapeShop);
