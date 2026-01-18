'use client';

import { useState } from 'react';
import { createProductAction } from '../actions';
import { PRODUCT_CATEGORIES } from '@/lib/types';

export default function ProductForm() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result as string;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createProductAction(formData);
    } catch (error: any) {
      // Next.js redirect() throws NEXT_REDIRECT which is normal behavior
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        // This is expected, redirect is happening
        return;
      }
      console.error('Error creating product:', error);
      alert('Fel vid skapande av produkt');
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
          Namn *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          placeholder="t.ex. Blå Skål"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
          Beskrivning *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          placeholder="Beskriv produkten..."
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-stone-700 mb-1">
          Pris (kr) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          required
          min="0"
          step="1"
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          placeholder="299"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-1">
          Kategori *
        </label>
        <select
          id="category"
          name="category"
          required
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        >
          <option value="">Välj kategori</option>
          {PRODUCT_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Image Upload - Up to 3 images */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Bilder (upp till 3) *
        </label>

        {[0, 1, 2].map(index => (
          <div key={index}>
            <label htmlFor={`image${index}`} className="block text-xs text-stone-600 mb-1">
              Bild {index + 1} {index === 0 && '(obligatorisk)'}
            </label>
            <input
              type="file"
              id={`image${index}`}
              name={`image${index}`}
              accept="image/*"
              required={index === 0}
              onChange={(e) => handleImageChange(e, index)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm"
            />
            {imagePreviews[index] && (
              <div className="mt-2">
                <img
                  src={imagePreviews[index]}
                  alt={`Förhandsgranskning ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-stone-900 text-white py-3 rounded-lg hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? 'Skapar produkt...' : 'Skapa produkt'}
      </button>
    </form>
  );
}
