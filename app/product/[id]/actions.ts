'use server';

import { revalidatePath } from 'next/cache';
import { reserveProduct } from '@/lib/products';

// Validate Swedish mobile number (10 digits, starts with 07)
function isValidSwedishMobile(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^07[0-9]{8}$/;
  return regex.test(cleaned);
}

export async function reserveProductAction(id: string, formData: FormData) {
  try {
    const mobileNumber = formData.get('mobileNumber') as string;
    const deliveryAddress = formData.get('deliveryAddress') as string;

    // Validation
    if (!mobileNumber || !deliveryAddress) {
      return {
        success: false,
        error: 'Vänligen fyll i både mobilnummer och leveransadress',
      };
    }

    // Validate mobile number
    const cleanedPhone = mobileNumber.trim();
    if (!isValidSwedishMobile(cleanedPhone)) {
      return {
        success: false,
        error: 'Vänligen ange ett giltigt svenskt mobilnummer (t.ex. 070-123 45 67)',
      };
    }

    // Validate address
    if (deliveryAddress.trim().length < 10) {
      return {
        success: false,
        error: 'Vänligen ange en fullständig leveransadress (minst 10 tecken)',
      };
    }

    // Reserve the product
    const result = await reserveProduct(id, cleanedPhone, deliveryAddress.trim());

    if (!result) {
      return {
        success: false,
        error: 'Produkten kunde inte reserveras. Den kan redan vara reserverad av någon annan.',
      };
    }

    // Revalidate paths
    revalidatePath(`/product/${id}`);
    revalidatePath('/');
    revalidatePath('/admin');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to reserve product:', error);
    return {
      success: false,
      error: 'Ett oväntat fel uppstod. Vänligen försök igen.',
    };
  }
}
