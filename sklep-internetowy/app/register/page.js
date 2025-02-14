"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./register.module.css";
import headers from "@/app/headers";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  function handleRegister() {
    if (name.length === 0) {
      setNameError(true);
      return;
    }

    if (email.length === 0 || !email.includes("@")) {
      setEmailError(true);
      return;
    }

    if (password.length < 6) {
      setPasswordError(true);
      return;
    }

    setIsRegistering(true);
    setRegisterSuccess(false);

    fetch("https://api.escuelajs.co/api/v1/users/", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        avatar: "https://picsum.photos/800",
      }),
      headers,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setRegisterSuccess(true);
        setIsRegistering(false);
      });
  }

  useEffect(() => {
    setNameError(false);
    setEmailError(email.length > 0 && !email.includes("@"));
    setPasswordError(password.length > 0 && password.length < 6);
  }, [name, email, password]);

  return (
    <div className="p-6 bg-pink-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-800">Zarejestruj się</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
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
        {nameError && <p className="text-red-500">Imię jest niepoprawne!</p>}
        {emailError && (
          <p className="text-red-500">Adres e-mail jest niepoprawny!</p>
        )}
        {passwordError && (
          <p className="text-red-500">Hasło musi mieć co najmniej 6 znaków!</p>
        )}
        {registerSuccess && (
          <p className="text-green-500">
            Rejestracja pomyślna! Możesz się teraz zalogować.
          </p>
        )}

        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="p-[3px] relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            {isRegistering ? "Rejestrowanie..." : "Zarejestruj się"}
          </div>
        </button>

        <p className="text-center text-pink-700">
          Masz już konto?{" "}
          <Link
            href="/login"
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Zaloguj się
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
