'use client';

import { Product } from '@/lib/types';
import { deleteProductAction } from '../actions';
import Image from 'next/image';
import { useState } from 'react';
import EditProductModal from './EditProductModal';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Är du säker på att du vill ta bort "${name}"?`)) {
      try {
        await deleteProductAction(id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Fel vid borttagning av produkt');
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        Inga produkter ännu. Skapa din första produkt!
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-colors"
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 relative bg-stone-100 rounded flex-shrink-0">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                    Ingen bild
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-stone-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-stone-900">
                      {product.price} kr
                    </div>
                    <div className={`text-xs px-2 py-1 rounded mt-1 ${
                      product.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-stone-200 text-stone-800'
                    }`}>
                      {product.status === 'available' ? 'Tillgänglig' : 'Såld'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-stone-500 uppercase">
                    {product.category}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <code className="text-xs text-stone-500 font-mono">
                    {product.referenceCode}
                  </code>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Ta bort
                  </button>
                  <a
                    href={`/product/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-stone-200 text-stone-700 rounded hover:bg-stone-300 transition-colors"
                  >
                    Visa
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </>
  );
}
