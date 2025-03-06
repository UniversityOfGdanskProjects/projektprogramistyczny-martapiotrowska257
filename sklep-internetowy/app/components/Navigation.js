"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "@/app/globals.css";

export default function Navigation() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

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
        <li>
          <Link
            href="/logout"
            className="text-white hover:text-pink-200 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link
              href="/panel_administratora"
              className="text-white hover:text-pink-200 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Panel Administratora
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
