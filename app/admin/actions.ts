'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProduct, updateProduct, deleteProduct } from '@/lib/products';
import { ProductInput } from '@/lib/types';
import { put } from '@vercel/blob';

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
      const blob = await put(imageFile.name, imageFile, {
        access: 'public',
      });

      imagePath = blob.url;
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
      const blob = await put(imageFile.name, imageFile, {
        access: 'public',
      });

      imagePath = blob.url;
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
