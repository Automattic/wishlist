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
