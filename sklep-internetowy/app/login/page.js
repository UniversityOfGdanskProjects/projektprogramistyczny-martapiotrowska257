"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./login.module.css";
import headers from "@/app/headers";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
        const { access_token } = tokens;
        console.log(access_token);
        setIsLoggingIn(false);
      });
  }

  return (
    <div className={styles.loginBox}>
      <h1>Zaloguj się</h1>
      <input
        type="email"
        placeholder="Adres e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="p-[3px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          Zaloguj się
        </div>
      </button>

      <p>
        Nie masz konta? <Link href="/register">Zarejestruj się</Link>.
      </p>
    </div>
  );
}
