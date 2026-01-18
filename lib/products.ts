import { supabase } from './supabase';
import { Product, ProductInput } from './types';

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
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Map database fields to Product type (snake_case to camelCase)
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image: item.image,
      category: item.category,
      status: item.status as 'available' | 'sold',
      createdAt: item.created_at,
      referenceCode: item.reference_code,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    // Map database fields to Product type (snake_case to camelCase)
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: data.category,
      status: data.status as 'available' | 'sold',
      createdAt: data.created_at,
      referenceCode: data.reference_code,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get available products (not sold)
export async function getAvailableProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching available products:', error);
      return [];
    }

    // Map database fields to Product type (snake_case to camelCase)
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image: item.image,
      category: item.category,
      status: item.status as 'available' | 'sold',
      createdAt: item.created_at,
      referenceCode: item.reference_code,
    }));
  } catch (error) {
    console.error('Error fetching available products:', error);
    return [];
  }
}

// Create new product
export async function createProduct(input: ProductInput): Promise<Product> {
  const id = Date.now().toString();
  const now = new Date().toISOString();

  const productData = {
    id,
    name: input.name,
    description: input.description,
    price: input.price,
    image: input.image,
    category: input.category,
    status: 'available',
    created_at: now,
    reference_code: generateReferenceCode(),
  };

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  // Map database fields to Product type (snake_case to camelCase)
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: parseFloat(data.price),
    image: data.image,
    category: data.category,
    status: data.status as 'available' | 'sold',
    createdAt: data.created_at,
    referenceCode: data.reference_code,
  };
}

// Update product
export async function updateProduct(id: string, updates: Partial<ProductInput>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating product:', error);
      return null;
    }

    // Map database fields to Product type (snake_case to camelCase)
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: data.category,
      status: data.status as 'available' | 'sold',
      createdAt: data.created_at,
      referenceCode: data.reference_code,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Mark product as sold
export async function markAsSold(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ status: 'sold' })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error marking product as sold:', error);
      return null;
    }

    // Map database fields to Product type (snake_case to camelCase)
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: data.category,
      status: data.status as 'available' | 'sold',
      createdAt: data.created_at,
      referenceCode: data.reference_code,
    };
  } catch (error) {
    console.error('Error marking product as sold:', error);
    return null;
  }
}
