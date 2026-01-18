import { kv } from '@vercel/kv';
import { Product, ProductInput } from './types';

// Keys structure:
// - product:{id} -> Product object
// - products:ids -> Set of all product IDs

// Generate unique reference code (format: KER-XXXX)
function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'KER-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Read all products
export async function getProducts(): Promise<Product[]> {
  try {
    const ids = await kv.smembers('products:ids') as string[] || [];
    if (ids.length === 0) return [];

    const products = await Promise.all(
      ids.map(id => kv.get<Product>(`product:${id}`))
    );

    return products.filter(Boolean) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await kv.get<Product>(`product:${id}`);
    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get available products (not sold)
export async function getAvailableProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.status === 'available');
}

// Create new product
export async function createProduct(input: ProductInput): Promise<Product> {
  const id = Date.now().toString();
  const product: Product = {
    id,
    ...input,
    status: 'available',
    createdAt: new Date().toISOString(),
    referenceCode: generateReferenceCode(),
  };

  await kv.set(`product:${id}`, product);
  await kv.sadd('products:ids', id);

  return product;
}

// Update product
export async function updateProduct(id: string, updates: Partial<ProductInput>): Promise<Product | null> {
  const product = await getProductById(id);

  if (!product) return null;

  const updatedProduct: Product = {
    ...product,
    ...updates,
  };

  await kv.set(`product:${id}`, updatedProduct);
  return updatedProduct;
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
  const product = await getProductById(id);

  if (!product) return false;

  await kv.del(`product:${id}`);
  await kv.srem('products:ids', id);

  return true;
}

// Mark product as sold
export async function markAsSold(id: string): Promise<Product | null> {
  const product = await getProductById(id);

  if (!product) return null;

  product.status = 'sold';
  await kv.set(`product:${id}`, product);

  return product;
}
