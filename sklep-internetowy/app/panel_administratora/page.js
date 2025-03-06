"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState({}); // Store orders for each user
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/");
    }
  }, []);

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const userResponse = await fetch(
          "https://api.escuelajs.co/api/v1/users"
        );
        const userData = await userResponse.json();
        setUsers(userData);

        // Fetch products
        const productResponse = await fetch(
          "https://api.escuelajs.co/api/v1/products"
        );
        const productData = await productResponse.json();
        setProducts(productData);

        // Fetch cart data for each user
        userData.forEach(async (user) => {
          const cartResponse = await fetch(`/api/cart/${user.id}`);
          const cartData = await cartResponse.json();
          setOrders((prev) => ({ ...prev, [user.id]: cartData }));
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({
        title: "",
        price: "",
        category: "",
        description: "",
        images: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-pink-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-pink-800">
        Panel Administratora
      </h1>
      <p className="text-pink-700 text-xl font-bold mb-2">
        Witaj w panelu administracyjnym!
      </p>
      <div className="bg-white p-4 rounded-lg border border-pink-200">
        <input
          type="text"
          placeholder="Szukaj użytkownika..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 mb-4 border border-pink-200 rounded-lg"
        />
        <h2 className="text-pink-700 text-xl font-bold mb-2">
          Lista użytkowników i zamówień:
        </h2>
        <ul className="mt-4 space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="p-4 border border-pink-100 rounded-lg hover:bg-pink-50 transition-colors"
            >
              <div className="font-bold">
                {user.name} - {user.email}
              </div>
              {orders[user.id] && orders[user.id].length > 0 ? (
                <div className="mt-2 pl-4">
                  <p className="font-semibold text-pink-600">Zamówienia:</p>
                  <ul className="list-disc pl-4">
                    {orders[user.id].map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {item.title} - Ilość: {item.quantity} - Cena:{" "}
                        {item.price} zł
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">Brak zamówień</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
