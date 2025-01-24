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
    <div className={styles.loginBox}>
      <h1>Zarejestruj się</h1>
      <input
        type="text"
        placeholder="Imię"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      {nameError && <p className={styles.errorText}>Imię jest niepoprawne!</p>}
      {emailError && (
        <p className={styles.errorText}>Adres e-mail jest niepoprawny!</p>
      )}
      {passwordError && (
        <p className={styles.errorText}>
          Hasło musi mieć co najmniej 6 znaków!
        </p>
      )}
      {registerSuccess && (
        <p className={styles.successText}>
          Rejestracja pomyślna! Możesz się teraz zalogować.
        </p>
      )}
      <button onClick={handleRegister} disabled={isRegistering}>
        {isRegistering ? "Rejestrowanie..." : "Zarejestruj się"}
      </button>
      <p>
        Masz już konto? <Link href="/login">Zaloguj się</Link>.
      </p>
    </div>
  );
}
