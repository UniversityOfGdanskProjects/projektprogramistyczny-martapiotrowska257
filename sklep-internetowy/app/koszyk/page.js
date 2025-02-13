"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
// import styles from "./koszyk.module.css";
import headers from "@/app/headers";

export default function KoszykPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products/", {
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
        console.log("Fetched products:", data);
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);

  return <div>koszyk pusty</div>;
}
