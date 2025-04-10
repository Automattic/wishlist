export type RecommendedProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

export type RecommendationResponse = {
  emailHash: string;
  recommendations: RecommendedProduct[];
};

export type ProductAction = 'wishlist' | 'discard';

export type ProductActionRequest = {
  emailHash: string;
  productId: string;
  action: ProductAction;
};

export type ProductActionResponse = {
  emailHash: string;
  productId: string;
  action: ProductAction;
  success: boolean;
  timestamp: string;
}; 