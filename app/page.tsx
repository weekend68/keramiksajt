import Link from 'next/link';
import Image from 'next/image';
import { getAvailableProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getAvailableProducts();

  return (
    <div className="min-h-screen bg-amber-50/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Keramik från hjärtat
          </h1>
          <p className="text-stone-700 text-lg max-w-2xl mx-auto leading-relaxed mb-3">
            Handgjorda keramikverk från min ateljé i Hantverksföreningen Knut, Bagarmossen.
            Varje pjäs är unik, drejad och glaserad med omsorg.
          </p>
          <p className="text-stone-600 text-sm italic max-w-xl mx-auto">
            The future is handmade
          </p>
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-600 text-lg">
              Galleriet vilar just nu. Nya verk läggs upp allt eftersom ugnen öppnas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
                  {/* Product Image */}
                  <div className="aspect-square relative bg-gradient-to-br from-amber-50 to-orange-50">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
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
                    <h2 className="text-xl font-serif font-semibold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors">
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
      <footer className="bg-white border-t border-amber-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Main info */}
            <div className="text-center space-y-2">
              <p className="text-stone-600 text-sm">
                Alla produkter är handgjorda och unika
              </p>
              <p className="text-stone-500 text-sm">
                Frågor? Kontakta mig på <a href="mailto:hej@keramik.se" className="text-amber-700 hover:text-amber-900 underline">hej@keramik.se</a>
              </p>
            </div>

            {/* About the workshop */}
            <div className="border-t border-amber-100 pt-6">
              <h3 className="text-center text-stone-900 font-serif font-semibold mb-3">
                Om verkstaden
              </h3>
              <p className="text-stone-600 text-sm text-center leading-relaxed max-w-2xl mx-auto">
                Jag arbetar i Hantverksföreningen Knut i Bagarmossen – en levande ateljé med keramik och textilt hantverk
                som funnits i över 30 år. Här har jag tillgång till drejskivor, ugnar och allt som behövs för att skapa
                unika keramikverk. Varje pjäs är formad för hand och bränd i 1240°C.
              </p>
              <p className="text-stone-500 text-xs text-center mt-3 italic">
                Hantverksföreningen Knut • Bergsrådsvägen 88, Bagarmossen
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
