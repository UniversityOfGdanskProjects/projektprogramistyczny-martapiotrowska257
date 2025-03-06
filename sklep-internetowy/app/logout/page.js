"use client";

import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    router.push("/");
  }

  async function fetchUserName() {
    await fetch("https://api.escuelajs.co/api/v1/auth/profile");
  }

  return (
    <div className="p-6 bg-pink-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-800">Wylogowanie</h2>
      <p className="text-pink-600 mb-4">
        Aktualnie jesteś zalogowany jako: {localStorage.getItem("user")}
      </p>
      <div className="space-y-4">
        <button onClick={handleLogout} className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Wyloguj się
          </div>
        </button>
      </div>
    </div>
  );
}
