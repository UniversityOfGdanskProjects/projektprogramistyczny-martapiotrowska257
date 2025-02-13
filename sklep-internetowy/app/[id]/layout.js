import Link from "next/link";

export default function ProduktLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          ← Wróć do listy produktów
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">{children}</div>
    </div>
  );
}
