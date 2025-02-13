"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import headers from "@/app/headers";
import Filter from "@/app/components/Filter";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.escuelajs.co/api/v1/products`, {
      method: "GET",
      headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Fetched products:", data);
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);

  // products.map((product) => {
  //   const images = product.images;
  //   const cleanImages = JSON.parse(images[0].replace(/\\\"/g, '"'));
  //   console.log(product.images[0]);
  // });

  const handleFilters = ({ search, price, category, limit }) => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (price) {
      filtered = filtered.filter((product) => product.price === price);
    }

    if (category) {
      filtered = filtered.filter(
        (product) => product.category.name === category
      );
    }

    setFilteredProducts(
      filtered.slice(0, Math.max(1, parseInt(limit, 10) || 20))
    );
  };

  return (
    <div className={styles.productsBox}>
      <h1>Lista Produktów</h1>
      {isLoading ? (
        <p>Ładowanie...</p>
      ) : (
        <>
          <Filter updateFilters={handleFilters} />
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <Link href={`/${product.id}`}>
                  <img
                    src={product.images.map((image) =>
                      image.replace(/\\\"/g, '"')
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
