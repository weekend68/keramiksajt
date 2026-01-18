import Link from 'next/link';
import Image from 'next/image';
import { getAvailableProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getAvailableProducts();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">Keramik Galleri</h1>
          <p className="text-stone-600 text-lg">Handgjord keramik - unika verk i stengods</p>
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg">
              Inga produkter tillgängliga för tillfället.
            </p>
            <p className="text-stone-400 mt-2">
              Nya verk läggs upp allt eftersom de blir klara.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                  {/* Product Image */}
                  <div className="aspect-square relative bg-gradient-to-br from-stone-100 to-stone-50">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        Ingen bild
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-stone-900 mb-2 group-hover:text-stone-700">
                      {product.name}
                    </h2>
                    <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-stone-900">
                        {product.price} kr
                      </span>
                      <span className="text-sm text-stone-500 uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-stone-500 text-sm">
            Alla produkter är handgjorda och unika
          </p>
        </div>
      </footer>
    </div>
  );
}
