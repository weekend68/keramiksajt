export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // path to image
  category: string;
  status: 'available' | 'sold';
  createdAt: string;
  referenceCode: string; // unique code for Swish payment reference
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
