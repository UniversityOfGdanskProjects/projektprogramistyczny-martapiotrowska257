"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import headers from "@/app/headers";

export default function Home() {
  const [products, setProducts] = useState([]);
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

  return (
    <div className={styles.productsBox}>
      <h1>Lista Produktów</h1>
      {isLoading ? (
        <p>Ładowanie...</p>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Link href={`/${product.id}`}>
                <img
                  // Use the first image URL from the images array
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
      )}
    </div>
  );
}
