import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">
          Produkten hittades inte
        </h2>
        <p className="text-stone-600 mb-8">
          Produkten du söker efter finns inte längre.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          Tillbaka till galleriet
        </Link>
      </div>
    </div>
  );
}
