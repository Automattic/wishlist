import { z } from 'zod';

export const ShopSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export type Shop = z.infer<typeof ShopSchema>;

export const ProductSchema = z.object({
  productName: z.string(),
  description: z.string(),
  shopName: z.string(),
  productUrl: z.string().url(),
  imageUrl: z.string().url(),
  priceMin: z.coerce.number().optional().nullable(),
  priceMax: z.coerce.number().optional().nullable(),
  currency: z.string().optional().nullable(),
});

export type Product = z.infer<typeof ProductSchema>;

export type DbProduct = Product & {
  id: number | string;
};

export type ProductVectorResult = {
  interest?: string;
  distance: number;
} & DbProduct;
