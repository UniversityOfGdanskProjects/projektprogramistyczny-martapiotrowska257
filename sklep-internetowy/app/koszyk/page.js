"use client";

import { useEffect, useState } from "react";

export default function KoszykPage() {
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    const savedUser = sessionStorage.getItem("token");

    console.log("Retrieved cart from sessionStorage:", savedCart);
    console.log("Saved user in sessionStorage:", savedUser);

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (savedUser) {
      setUser(savedUser);
    } else {
      console.log("No user found in sessionStorage.");
    }
  }, []);

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    sessionStorage.setItem("cart", JSON.stringify(newCart));
  };

  const validCoupons = {
    PROMO10: 0.1,
    PROMO20: 0.2,
  };

  const applyCoupon = () => {
    if (validCoupons[coupon]) {
      setDiscount(validCoupons[coupon]);
    } else {
      setDiscount(0);
      alert("Nieprawidłowy kod kuponu!");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const discountedPrice = (totalPrice * (1 - discount)).toFixed(2);

  const placeOrder = async () => {
    if (cart.length === 0) {
      setOrderMessage("Twój koszyk jest pusty.");
      return;
    }

    if (!user) {
      setOrderMessage("Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }

    if (
      !address.street ||
      !address.city ||
      !address.postalCode ||
      !address.country
    ) {
      setOrderMessage("Proszę wypełnić dane adresowe.");
      return;
    }

    if (
      !paymentInfo.cardNumber ||
      !paymentInfo.expiryDate ||
      !paymentInfo.cvv
    ) {
      setOrderMessage("Proszę wypełnić dane płatności.");
      return;
    }

    setIsOrdering(true);
    setOrderMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = {
        ok: true,
        json: () => Promise.resolve({ success: true }),
      };

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

      <div className="mt-6 space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-lg font-bold text-pink-800 mb-3">
            Dane adresowe
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ulica"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Miasto"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Kod pocztowy"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({ ...address, postalCode: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Kraj"
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-lg font-bold text-pink-800 mb-3">
            Dane płatności
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Numer karty"
              value={paymentInfo.cardNumber}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Data ważności"
              value={paymentInfo.expiryDate}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="CVV"
              value={paymentInfo.cvv}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mt-4 p-4 bg-white rounded-lg">
        <h3 className="text-lg font-bold text-pink-800">Kod rabatowy</h3>
        <input
          type="text"
          placeholder="Wpisz kod kuponu"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <button
          onClick={applyCoupon}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Zastosuj kupon
        </button>
      </div>

      {/* Total Price Section */}
      <div className="mt-6 pt-4 border-t border-pink-200">
        <h3 className="text-xl font-bold text-pink-800">
          Suma:{" "}
          <span className="line-through text-gray-500">${totalPrice}</span> $
          {discountedPrice}
        </h3>
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
