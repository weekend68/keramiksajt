'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProduct, updateProduct, deleteProduct } from '@/lib/products';
import { ProductInput } from '@/lib/types';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function createProductAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath = '';

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(imageFile.name);
      const filename = `${uniqueSuffix}${ext}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadsDir, filename);

      // Ensure uploads directory exists
      await mkdir(uploadsDir, { recursive: true });

      // Save file
      await writeFile(filepath, buffer);

      // Store path relative to public directory
      imagePath = `/uploads/${filename}`;
    }

    const productInput: ProductInput = {
      name,
      description,
      price,
      category,
      image: imagePath,
    };

    await createProduct(productInput);

    revalidatePath('/');
    revalidatePath('/admin');
    redirect('/admin');
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;
    const keepExistingImage = formData.get('keepExistingImage') as string;

    let imagePath: string | undefined = undefined;

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(imageFile.name);
      const filename = `${uniqueSuffix}${ext}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadsDir, filename);

      await mkdir(uploadsDir, { recursive: true });
      await writeFile(filepath, buffer);

      imagePath = `/uploads/${filename}`;
    } else if (keepExistingImage) {
      // Keep existing image - don't update image field
      imagePath = undefined;
    }

    const updates: Partial<ProductInput> = {
      name,
      description,
      price,
      category,
    };

    // Only update image if new one was uploaded
    if (imagePath !== undefined) {
      updates.image = imagePath;
    }

    await updateProduct(id, updates);

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/product/${id}`);
    redirect('/admin');
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProductAction(id: string) {
  try {
    await deleteProduct(id);
    revalidatePath('/');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}
