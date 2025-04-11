import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { readFileSync } from "node:fs";
import { z } from "zod";
import pLimit from "p-limit";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { Product, ProductSchema, Shop } from "@/products/types";
import db from "@/products/db";

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

const readShops = async (filename: string) => {
  const content = await readFileSync(filename, 'utf-8')
    .split('\n')
    .map((line) => {
      const parts = line.split(',');

      const name = parts[0];
      let url = parts[1];

      if (!url?.startsWith('http')) url = `https://${url}`;

      return { name, url };
    });

  return content.map((shop) => {
    try {
      return z.object({
        name: z.string(),
        url: z.string().url(),
      }).parse(shop);
    } catch {
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

    if (!description) {
      const descriptionElement = $('.woocommerce-product-details__short-description');
      if (descriptionElement.length && descriptionElement.text()) {
        description = descriptionElement.text();
      }
    }

    let price = null;
    const priceElement = $('meta[property="product:price:amount"]');
    if (priceElement.length && priceElement.attr('content')) {
      price = parseFloat(priceElement.attr('content') ?? '');
      if (Number.isNaN(price)) {
        price = null;
      }
    }

    if (price === null) {
      const priceElement = $('.woocommerce-Price-amount');
      if (priceElement.length && priceElement.text()) {
        price = parseFloat(priceElement.text().replace('$', ''));
        if (Number.isNaN(price)) {
          price = null;
        }
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
  } catch {
    return { };
  }
};

const saveProduct = async (shop: Shop, product: Product) => {
  const existingProduct = await db.prepare('SELECT id FROM products WHERE productUrl = ?').all([product.productUrl]);

  if (existingProduct.length > 0) {
    db.prepare(`
      UPDATE products
      SET productName = :productName,
          description = :description,
          shopName = :shopName,
          imageUrl = :imageUrl,
          priceMin = :priceMin,
          priceMax = :priceMax,
          currency = :currency
      WHERE productUrl = :productUrl
    `).run(product);

    console.log(`[${shop.name}]: Updated product ${product.productName}`);
  } else {
    db.prepare(`
      INSERT INTO products (productName, description, shopName, productUrl, imageUrl, priceMin, priceMax, currency)
      VALUES (:productName, :description, :shopName, :productUrl, :imageUrl, :priceMin, :priceMax, :currency)
    `).run(product);

    console.log(`[${shop.name}]: Saved product ${product.productName}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveProductData = async (shop: Shop, productData: any) => {
  let productName = productData.title?.rendered?.trim();

  if (productName) {
    productName = cheerio(`<div>${productName}</div>`)('div').text().trim();
  }

  const productUrl = productData.link;

  // eslint-disable-next-line prefer-const
  let { description, imageUrl, priceMin, priceMax, currency } = await scrapeProductDetails(productUrl);

  if (!description && productData.excerpt?.rendered) {
    description = cheerio(`<div>${productData.excerpt?.rendered}</div>`)('div').text();
    description = description.replace(/\s+/g, ' ').trim();
  }

  const product = ProductSchema.parse({
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

  while (true) {
    const apiUrl = new URL(`/wp-json/wp/v2/product?page=${page}&per_page=50`, shop.url).toString();
    console.log(`[${shop.name}]: Fetching page ${page}`);

    let response;

    try {
      response = await axios.get(apiUrl, { headers: HEADERS, timeout: 15000 });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && ([400, 404].includes(error.response.status))) {
        break;
      }

      console.log(`[${shop.name}]: API error: ${error}`);

      break;
    }

    const productData = response.data;

    if (!productData || productData.length === 0) {
      break;
    }

    for (const product of productData) {
      try {
        await saveProductData(shop, product);
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

const shops = await readShops(argv.csv);

console.log(`Found ${shops.length} shops`);

const limit = pLimit(argv.workers);

await Promise.all(shops.map((shop) => limit(() => scrapeShop(shop))));
