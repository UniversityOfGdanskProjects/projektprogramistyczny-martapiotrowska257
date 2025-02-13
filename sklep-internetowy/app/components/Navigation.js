import Link from "next/link";
import "@/app/globals.css";

export default function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 shadow-lg">
      <ul className="flex space-x-8 justify-center items-center">
        <li>
          <Link
            href="/"
            className="text-white hover:text-pink-200 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Strona główna
          </Link>
        </li>
        <li>
          <Link
            href="/koszyk"
            className="text-white hover:text-pink-200 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Koszyk
          </Link>
        </li>
        <li>
          <Link
            href="/login"
            className="text-white hover:text-pink-200 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
