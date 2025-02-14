"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./login.module.css";
import headers from "@/app/headers";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  function handleLogin() {
    setIsLoggingIn(true);
    fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers,
    })
      .then((res) => res.json())
      .then((tokens) => {
        if (tokens.access_token) {
          sessionStorage.setItem("token", tokens.access_token);
          sessionStorage.setItem("user", JSON.stringify(tokens.user)); // Storing user info correctly
          window.dispatchEvent(new Event("storage")); // Trigger storage event
          router.push("/");
        } else {
          alert("Błąd logowania. Sprawdź dane i spróbuj ponownie.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  }

  return (
    <div className="p-6 bg-pink-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-800">Zaloguj się</h2>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button onClick={handleLogin} className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Zaloguj się
          </div>
        </button>
        <p className="text-center text-pink-700">
          Nie masz konta?{" "}
          <Link
            href="/register"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Zarejestruj się
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
