'use client';

import { useState } from 'react';
import { createProductAction } from '../actions';

export default function ProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
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
          <option value="tallrik">Tallrik</option>
          <option value="skål">Skål</option>
          <option value="fat">Fat</option>
          <option value="lampfot">Lampfot</option>
          <option value="annat">Annat</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-stone-700 mb-1">
          Bild *
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Förhandsgranskning"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
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
