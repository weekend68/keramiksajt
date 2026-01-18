import { promises as fs } from 'fs';
import path from 'path';
import { Product, ProductInput } from './types';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

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
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

// Get available products (not sold)
export async function getAvailableProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.status === 'available');
}

// Save products to file
async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

// Create new product
export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await getProducts();

  const newProduct: Product = {
    id: Date.now().toString(),
    ...input,
    status: 'available',
    createdAt: new Date().toISOString(),
    referenceCode: generateReferenceCode(),
  };

  products.push(newProduct);
  await saveProducts(products);

  return newProduct;
}

// Update product
export async function updateProduct(id: string, updates: Partial<ProductInput>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
  };

  await saveProducts(products);
  return products[index];
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);

  if (filtered.length === products.length) return false;

  await saveProducts(filtered);
  return true;
}

// Mark product as sold
export async function markAsSold(id: string): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return null;

  products[index].status = 'sold';
  await saveProducts(products);

  return products[index];
}
