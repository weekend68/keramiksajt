'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import CopyButton from './CopyButton';
import PurchaseModal from './PurchaseModal';

interface ProductContentProps {
  product: Product;
  swishNumber: string;
}

export default function ProductContent({ product, swishNumber }: ProductContentProps) {
  const [isReserved, setIsReserved] = useState(product.status === 'reserved');
  const paymentBoxRef = useRef<HTMLDivElement>(null);

  const handleReservationSuccess = () => {
    setIsReserved(true);
    // Force a page refresh to get updated data
    window.location.reload();
  };

  // Scroll to payment box when product is reserved
  useEffect(() => {
    if (isReserved && product.status === 'reserved' && paymentBoxRef.current) {
      setTimeout(() => {
        paymentBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isReserved, product.status]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
      {/* Product Images Gallery - 60% on desktop */}
      <div className="md:col-span-3 bg-amber-50">
        {product.images && product.images.length > 0 ? (
          <div className="space-y-2">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square relative bg-amber-50">
                <Image
                  src={image}
                  alt={`${product.name} - Bild ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-square flex items-center justify-center text-stone-600">
            Ingen bild
          </div>
        )}
      </div>

      {/* Product Details - 40% on desktop */}
      <div className="md:col-span-2 p-8">
        <div className="mb-6">
          <span className="text-sm text-stone-600 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-2">
            {product.name}
          </h1>
          <p className="text-stone-600 mt-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="border-t border-amber-100 pt-6 mb-8">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-stone-900">
              {product.price} kr
            </span>
          </div>
          <p className="text-sm text-green-700 font-medium">
            ✓ Fri frakt ingår
          </p>
        </div>

        {/* Purchase/Reservation Status */}
        {product.status === 'sold' && (
          <div className="bg-stone-100 border-2 border-stone-300 rounded-2xl p-6 text-center">
            <p className="text-stone-600 font-medium">
              Denna produkt är såld
            </p>
            <p className="text-stone-500 text-sm mt-2">
              Nya produkter läggs upp regelbundet!
            </p>
          </div>
        )}

        {product.status === 'reserved' && !isReserved && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center">
            <p className="text-stone-700 font-medium mb-2">
              Denna produkt är för tillfället reserverad
            </p>
            <p className="text-stone-600 text-sm">
              Nya produkter läggs upp regelbundet!
            </p>
          </div>
        )}

        {product.status === 'available' && (
          <>
            <PurchaseModal
              productId={product.id}
              productName={product.name}
              productPrice={product.price}
              onSuccess={handleReservationSuccess}
            />
            <p className="text-xs text-stone-500 text-center mt-2">
              Säker betalning via Swish
            </p>
          </>
        )}

        {isReserved && product.status === 'reserved' && (
          <div ref={paymentBoxRef} className="bg-amber-100 border-2 border-amber-500 rounded-2xl p-6">
            <h2 className="text-xl font-serif font-semibold text-stone-900 mb-2">
              Produkt reserverad!
            </h2>
            <p className="text-stone-700 mb-4 text-sm">
              Produkten är nu reserverad i 24 timmar. Swisha för att slutföra köpet.
            </p>

            <div className="space-y-4">
              {/* Swish Number */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Swish-nummer:
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-4 py-3 rounded border border-amber-500 text-lg font-mono">
                    {swishNumber}
                  </code>
                  <CopyButton text={swishNumber.replace(/\s/g, '')} label="Kopiera" />
                </div>
              </div>

              {/* Reference Code */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Produktreferens (använd som meddelande):
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-4 py-3 rounded border border-amber-500 text-lg font-mono font-bold">
                    {product.referenceCode}
                  </code>
                  <CopyButton text={product.referenceCode} label="Kopiera" />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-1">
                  Belopp:
                </label>
                <div className="bg-white px-4 py-3 rounded border border-amber-500 text-lg font-semibold">
                  {product.price} kr
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-stone-600 bg-white p-4 rounded-lg">
              <p className="font-medium mb-2">Så här gör du:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Öppna Swish-appen</li>
                <li>Ange Swish-nummer: {swishNumber}</li>
                <li>Ange belopp: {product.price} kr</li>
                <li>Lägg till referenskod som meddelande: <strong>{product.referenceCode}</strong></li>
                <li>Bekräfta betalningen</li>
              </ol>
              <p className="mt-3 text-stone-600">
                Jag kontaktar dig för leveransdetaljer efter betalning!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
