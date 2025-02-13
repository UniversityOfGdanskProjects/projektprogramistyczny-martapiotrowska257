export default function LoginLayout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <span className="sr-only">Login</span>
      {children}
    </div>
  );
}
