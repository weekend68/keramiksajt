'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { updateProductAction } from '../actions';
import Image from 'next/image';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function EditProductModal({ product, onClose }: EditProductModalProps) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await updateProductAction(product.id, formData);
      onClose();
    } catch (error: any) {
      // Next.js redirect() throws NEXT_REDIRECT which is normal behavior
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        // This is expected, redirect is happening
        return;
      }
      console.error('Error updating product:', error);
      alert('Fel vid uppdatering av produkt');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900">
              Redigera produkt
            </h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-stone-700 mb-1">
                Namn *
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                defaultValue={product.name}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-stone-700 mb-1">
                Beskrivning *
              </label>
              <textarea
                id="edit-description"
                name="description"
                defaultValue={product.description}
                required
                rows={4}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium text-stone-700 mb-1">
                Pris (kr) *
              </label>
              <input
                type="number"
                id="edit-price"
                name="price"
                defaultValue={product.price}
                required
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-stone-700 mb-1">
                Kategori *
              </label>
              <select
                id="edit-category"
                name="category"
                defaultValue={product.category}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              >
                <option value="">Välj kategori</option>
                <option value="Tallrik">Tallrik</option>
                <option value="Skål">Skål</option>
                <option value="Fat">Fat</option>
                <option value="Lampfot">Lampfot</option>
                <option value="Vas">Vas</option>
                <option value="Kopp">Kopp</option>
                <option value="Annat">Annat</option>
              </select>
            </div>

            {/* Current Images */}
            {product.images && product.images.length > 0 && imagePreviews.length === 0 && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Nuvarande bilder ({product.images.length})
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative w-full h-32">
                      <Image
                        src={img}
                        alt={`${product.name} bild ${idx + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="150px"
                      />
                    </div>
                  ))}
                </div>
                <input type="hidden" name="keepExistingImages" value="true" />
                <p className="text-xs text-stone-500 mt-1">
                  Ladda upp nya bilder nedan för att ersätta dessa
                </p>
              </div>
            )}

            {/* Image Upload - Up to 3 images */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {product.images && product.images.length > 0 ? 'Byt bilder (valfritt)' : 'Bilder (upp till 3)'}
              </label>

              {[0, 1, 2].map(index => (
                <div key={index}>
                  <label htmlFor={`edit-image${index}`} className="block text-xs text-stone-600 mb-1">
                    Bild {index + 1}
                  </label>
                  <input
                    type="file"
                    id={`edit-image${index}`}
                    name={`image${index}`}
                    accept="image/*"
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

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-stone-900 text-white py-3 rounded-lg hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Sparar...' : 'Spara ändringar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
