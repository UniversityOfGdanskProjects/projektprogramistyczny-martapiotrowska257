"use client";

import { useEffect, useState } from "react";

export default function KoszykPage() {
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    console.log("Retrieved cart from sessionStorage:", savedCart); // Debugging line

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedUser = sessionStorage.getItem("user");
    console.log("Retrieved user from sessionStorage:", savedUser); // Debugging line

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser("");
    }
  }, []);

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    sessionStorage.setItem("cart", JSON.stringify(newCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = async () => {
    if (cart.length === 0) {
      setOrderMessage("Twój koszyk jest pusty.");
      return;
    }

    if (!user) {
      setOrderMessage("Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }
    setIsOrdering(true);
    setOrderMessage("");

    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          totalPrice,
          user: user.id, // Now user is defined
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas składania zamówienia.");
      }

      setOrderMessage("Zamówienie zostało złożone!");
      setCart([]);
      sessionStorage.removeItem("cart");
    } catch (error) {
      setOrderMessage(error.message);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="p-6 bg-pink-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-800">
        Koszyk ({cart.length} przedmiotów)
      </h2>
      <div className="space-y-4">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow border border-pink-200"
          >
            <span className="text-pink-700 font-medium">{item.title}</span>
            <span className="text-pink-600">${item.price}</span>
            <button
              onClick={() => removeFromCart(index)}
              className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Usuń produkt
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-pink-200">
        <h3 className="text-xl font-bold text-pink-800">Suma: ${totalPrice}</h3>
      </div>
      <button
        onClick={placeOrder}
        disabled={isOrdering}
        className={`mt-4 px-6 py-3 rounded-lg font-bold text-white ${
          isOrdering ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isOrdering ? "Przetwarzanie..." : "Złóż zamówienie"}
      </button>
      {orderMessage && (
        <p className="mt-4 text-pink-700 font-medium">{orderMessage}</p>
      )}
    </div>
  );
}
