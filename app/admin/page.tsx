import { getProducts } from '@/lib/products';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const products = await getProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Create/Edit Product Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Skapa ny produkt
          </h2>
          <ProductForm />
        </div>

        {/* Right: Product List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Alla produkter ({products.length})
          </h2>
          <ProductList products={products} />
        </div>
      </div>
    </main>
  );
}
