export default function KoszykLayout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <span className="sr-only">Koszyk</span>
      {children}
    </div>
  );
}
