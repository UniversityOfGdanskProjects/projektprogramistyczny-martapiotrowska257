export default function LogoutLayout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <span className="sr-only">Logout</span>
      {children}
    </div>
  );
}
