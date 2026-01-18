'use client';

import { useState } from 'react';
import { reserveProductAction } from '../actions';

interface PurchaseModalProps {
  productId: string;
  productName: string;
  productPrice: number;
  onSuccess: () => void;
}

export default function PurchaseModal({
  productId,
  productName,
  productPrice,
  onSuccess,
}: PurchaseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await reserveProductAction(productId, formData);

    if (result.success) {
      setIsOpen(false);
      onSuccess();
    } else {
      setError(result.error || 'Ett fel uppstod');
    }

    setIsSubmitting(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
      >
        Köp denna produkt
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-2xl"
              disabled={isSubmitting}
            >
              ×
            </button>

            {/* Header */}
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Reservera produkt
            </h2>
            <p className="text-stone-600 text-sm mb-6">
              Fyll i dina uppgifter för att reservera <strong>{productName}</strong>
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-stone-900 mb-1">
                  Mobilnummer (för Swish)
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="070-123 45 67"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-stone-100"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Vi behöver ditt mobilnummer för att kunna ta emot Swish-betalningen
                </p>
              </div>

              {/* Delivery Address */}
              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-stone-900 mb-1">
                  Leveransadress
                </label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Gatuadress, Postnummer Ort"
                  required
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-stone-100 resize-none"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Ange fullständig adress där produkten ska levereras
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-stone-700">
                <p className="font-medium mb-2">Efter reservation:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Produkten reserveras i 24 timmar</li>
                  <li>Du får Swish-info för att slutföra köpet</li>
                  <li>Betalning: {productPrice} kr via Swish</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Reserverar...' : 'Reservera produkt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
