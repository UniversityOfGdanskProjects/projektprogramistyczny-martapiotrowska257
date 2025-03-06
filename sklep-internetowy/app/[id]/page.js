"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./id.module.css";
import headers from "@/app/headers";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
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
        setProduct(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <p>Ładowanie...</p>;
  if (!product) return <p>Nie znaleziono produktu</p>;

  return (
    <div className={styles.productContainer}>
      <img
        // src={product.images.map((image) =>
        //   JSON.parse(image.replace(/\\\"/g, '"'))
        // )}
        src={product.images[0]}
        alt={product.title}
        className={styles.productImage}
      />
      <h1>{product.title}</h1>
      <p className={styles.price}>Cena: ${product.price}</p>
      <p className={styles.description}>{product.description}</p>
    </div>
  );
}
