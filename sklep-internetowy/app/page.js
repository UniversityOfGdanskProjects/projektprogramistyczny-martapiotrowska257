"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/app/home.module.css";
import Filter from "./components/Filter";
import KoszykPage from "./koszyk/page";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAuthenticated(false);
          router.push("/login");
          return;
        }

        setIsAuthenticated(true);
        if (window.location.pathname === "/login") {
          router.push("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchList() {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("User not logged in");
        setIsLoading(false);
        return;
      }
      console.log("User authenticated, token:", token);
      try {
        const limit = searchParams.get("limit") || "150";
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const priceSort = searchParams.get("priceSort") || "";

        const response = await fetch(
          "https://api.escuelajs.co/api/v1/products"
        );
        if (!response.ok) {
          throw new Error("Could not fetch list");
        }
        const data = await response.json();
        let detailedData = data;

        if (search) {
          detailedData = detailedData.filter((prod) =>
            prod.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (category) {
          detailedData = detailedData.filter(
            (prod) =>
              prod.category.name.toLowerCase() === category.toLowerCase()
          );
        }

        if (priceSort === "asc") {
          detailedData = detailedData.sort((a, b) => a.price - b.price);
        } else if (priceSort === "desc") {
          detailedData = detailedData.sort((a, b) => b.price - a.price);
        }

        detailedData = detailedData.slice(0, limit);
        setProducts(detailedData);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchList();
  }, [searchParams, isAuthenticated]);

  const updateFilters = (filters) => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.limit) params.set("limit", filters.limit);
    if (filters.priceSort) params.set("priceSort", filters.priceSort);

    router.push(`/?${params.toString()}`);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    console.log("Loading cart from localStorage:", savedCart);

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("Parsed cart:", parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  const addToCart = (product) => {
    console.log("Adding product to cart:", product);

    setCart((prevCart) => {
      console.log("Previous cart state:", prevCart);

      const updatedCart = [...prevCart, { ...product }];

      console.log("Updated cart:", updatedCart);

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
  };

  return (
    <div className={styles.productsBox}>
      <h1>Lista Produktów</h1>
      {isLoading ? (
        <p>Ładowanie...</p>
      ) : (
        <>
          <Filter updateFilters={updateFilters} />
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <Link href={`/${product.id}`}>
                  <img
                    // src={product.images.map((image) =>
                    //   image.replace(/\\\"/g, '"')
                    // )}
                    src={product.images[0]}
                    alt={product.title}
                    className={styles.productImage}
                  />
                  <h2>{product.title}</h2>
                  <p className={styles.price}>Cena: ${product.price}</p>
                </Link>
                <button
                  className={styles.addToCartButton}
                  onClick={() => addToCart(product)}
                >
                  Dodaj do koszyka
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
