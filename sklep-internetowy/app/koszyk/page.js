"use client";

import { useEffect, useState } from "react";

export default function KoszykPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Get cart from localStorage when page loads
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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
    </div>
  );
}
