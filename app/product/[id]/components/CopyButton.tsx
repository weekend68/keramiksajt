'use client';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Kopiera' }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert(`${label} kopierat!`);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      {label}
    </button>
  );
}
