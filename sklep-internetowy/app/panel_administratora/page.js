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
    description: "",
    categoryId: "",
    images: ["https://placeimg.com/640/480/any"],
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
      images: ["https://placeimg.com/640/480/any"],
    }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(
        "https://api.escuelajs.co/api/v1/products/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );
      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({
        title: "",
        price: "",
        description: "",
        categoryId: "",
        images: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`, {
        method: "DELETE",
      });
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
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

      {/* Product Management Section */}
      <div className="bg-white p-4 rounded-lg border border-pink-200 mb-6">
        <h2 className="text-pink-700 text-xl font-bold mb-2">
          Dodaj nowy produkt
        </h2>
        <div className="space-y-3">
          <input
            name="title"
            value={newProduct.title}
            onChange={handleInputChange}
            placeholder="Nazwa produktu"
            className="w-full p-2 border border-pink-200 rounded-lg"
          />
          <input
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Cena"
            type="number"
            className="w-full p-2 border border-pink-200 rounded-lg"
          />
          <input
            name="categoryId"
            value={newProduct.categoryId}
            onChange={handleInputChange}
            placeholder="ID Kategorii (np. 1)"
            type="number"
            className="w-full p-2 border border-pink-200 rounded-lg"
          />
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="Opis produktu"
            className="w-full p-2 border border-pink-200 rounded-lg"
            rows="3"
          ></textarea>
          <button
            onClick={handleAddProduct}
            className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
          >
            Dodaj produkt
          </button>
        </div>
      </div>

      {/* Products List Section */}
      <div className="bg-white p-4 rounded-lg border border-pink-200 mb-6">
        <h2 className="text-pink-700 text-xl font-bold mb-2">
          Lista produktów:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 border border-pink-100 rounded-lg"
            >
              <h3 className="font-bold">{product.title}</h3>
              <p>Cena: {product.price} zł</p>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Usuń
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User Management Section */}
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
