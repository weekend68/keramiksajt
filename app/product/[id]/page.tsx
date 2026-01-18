import Link from 'next/link';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import { notFound } from 'next/navigation';
import CopyButton from './components/CopyButton';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Get Swish number from environment
  const swishNumber = process.env.SWISH_NUMBER || '123 456 78 90';

  return (
    <div className="min-h-screen bg-amber-50/30">
      {/* Header */}
      <header className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-stone-600 hover:text-stone-900 text-sm">
            ← Tillbaka till galleriet
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Product Image - 60% on desktop */}
            <div className="md:col-span-3 aspect-square md:aspect-auto relative bg-amber-50">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600">
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
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-stone-900">
                    {product.price} kr
                  </span>
                </div>
              </div>

              {/* Swish Payment Info */}
              <div className="bg-amber-100 border-2 border-amber-500 rounded-2xl p-6">
                <h2 className="text-xl font-serif font-semibold text-stone-900 mb-2">
                  Köp med Swish
                </h2>

                {/* Trust Indicators */}
                <div className="flex gap-4 mb-4 text-sm text-stone-600">
                  <span>✓ Handgjord</span>
                  <span>✓ Unik produkt</span>
                </div>

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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
