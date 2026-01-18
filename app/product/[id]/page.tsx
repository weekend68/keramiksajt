import Link from 'next/link';
import { getProductById } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductContent from './components/ProductContent';

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
  const swishNumber = process.env.SWISH_NUMBER || '070 634 50 78';

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
        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <ProductContent product={product} swishNumber={swishNumber} />
        </div>

        {/* Nice Copy Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Om hantverket */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              Om hantverket
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Denna pjäs är skapad i min ateljé på Hantverksföreningen Knut i Bagarmossen.
              Där har jag tillgång till drejskivor, ugnar och ett kreativt sammanhang med andra hantverkare
              som arbetar med keramik och textil. Föreningen har funnits i över 30 år och är en levande
              mötesplats för hantverk.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Varje pjäs är formad för hand i stengods och bränd i 1240°C, vilket ger styrka och hållbarhet
              för daglig användning. Små variationer i form, färg och glasyr är en del av hantverkets charm
              och gör varje produkt helt unik.
            </p>
          </div>

          {/* The future is handmade */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              The future is handmade
            </h2>
            <ul className="space-y-3 text-stone-600">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
                <span><strong>Unikt</strong> - Ingen produkt är identisk, varje pjäs har sin egen karaktär</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
                <span><strong>Hållbart</strong> - Håller i generationer och är skapat med omtanke för miljön</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
                <span><strong>Lokalt hantverk</strong> - Stödjer lokala hantverkare och bevarar traditionella tekniker</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
                <span><strong>Gemenskap</strong> - Del av en 30-årig hantverkstradition i Bagarmossen</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
