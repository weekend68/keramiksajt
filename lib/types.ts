export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // path to image
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
  image: string;
  category: string;
}
