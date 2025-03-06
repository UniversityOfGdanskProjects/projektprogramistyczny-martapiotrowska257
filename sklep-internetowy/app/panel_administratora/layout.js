export default function AdminPanelLayout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <span className="sr-only">Panel Administratora</span>
      {children}
    </div>
  );
}
