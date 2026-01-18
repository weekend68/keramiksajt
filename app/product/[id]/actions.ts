'use server';

import { revalidatePath } from 'next/cache';
import { reserveProduct } from '@/lib/products';

// Clean and validate Swedish mobile number (accepts any format, extracts 10 digits starting with 07)
function cleanAndValidateSwedishMobile(phone: string): { valid: boolean; cleaned: string } {
  // Remove everything that's not a digit
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if exactly 10 digits and starts with 07
  const isValid = digitsOnly.length === 10 && digitsOnly.startsWith('07');

  return { valid: isValid, cleaned: digitsOnly };
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

    // Clean and validate mobile number
    const { valid, cleaned: cleanedPhone } = cleanAndValidateSwedishMobile(mobileNumber);
    if (!valid) {
      return {
        success: false,
        error: 'Vänligen ange ett svenskt mobilnummer med 10 siffror som börjar på 07',
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
