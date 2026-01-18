export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // up to 3 images
  category: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: string;
  referenceCode: string; // unique code for Swish payment reference
  reservedBy?: string; // mobile number
  reservedAt?: string; // timestamp
  deliveryAddress?: string; // delivery address
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
}

// Available categories
export const PRODUCT_CATEGORIES = [
  'Tallrik',
  'Skål',
  'Fat',
  'Lampfot',
  'Vas',
  'Kopp',
  'Annat'
] as const;
export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
