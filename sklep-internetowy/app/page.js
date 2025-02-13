"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
// import "@/app/globals.css";
import styles from "@/app/home.module.css";
import Filter from "./components/Filter";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchList() {
      try {
        const limit = searchParams.get("limit") || "150";
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";

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

        detailedData = detailedData.slice(0, limit);
        setProducts(detailedData);
      } catch (error) {
        setErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchList();
  }, [searchParams]);

  const updateFilters = (filters) => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.limit) params.set("limit", filters.limit);

    router.push(`/?${params.toString()}`);
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
                    src={product.images.map((image) =>
                      JSON.parse(image.replace(/\\\"/g, '"'))
                    )}
                    alt={product.title}
                    className={styles.productImage}
                  />
                  <h2>{product.title}</h2>
                  <p className={styles.price}>Cena: ${product.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
