"use client";

import { useEffect, useState } from "react";

export default function Filter({ updateFilters }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("20");
  const [productCategories, setProductCategories] = useState([]);
  const [priceSort, setPriceSort] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`https://api.escuelajs.co/api/v1/categories`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const categories = data.map((category) => category.name);
        setProductCategories(categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setProductCategories([]);
      });
  }, []);

  const fetchSearchSuggestions = async (query) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products?title=${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search suggestions");
      }
      const data = await response.json();
      setSearchSuggestions(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchSuggestions([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchSearchSuggestions(query);
  };

  const applyFilters = () => {
    updateFilters({ search, category, limit, priceSort });
  };

  return (
    <div className="p-6 bg-pink-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-800">Szukaj produktu</h2>
      <div className="mb-4 relative">
        <label className="block text-pink-700 text-sm font-bold mb-2">
          Nazwa:{" "}
        </label>
        <input
          className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-pink-700 leading-tight focus:outline-none focus:shadow-outline focus:border-pink-400"
          type="text"
          value={search}
          onChange={handleSearchChange}
        />
        {searchSuggestions.length > 0 && (
          <ul className="absolute bg-white shadow-lg rounded-lg w-full mt-2 border border-pink-200">
            {searchSuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-3 py-2 cursor-pointer hover:bg-pink-100"
                onClick={() => {
                  setSearch(suggestion.title);
                  setSearchSuggestions([]);
                }}
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-pink-700 text-sm font-bold mb-2">
          Kategoria:{" "}
        </label>
        <select
          className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-pink-700 leading-tight focus:outline-none focus:shadow-outline focus:border-pink-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Wszystkie</option>
          {productCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-pink-700 text-sm font-bold mb-2">
          Limit:{" "}
        </label>
        <input
          className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-pink-700 leading-tight focus:outline-none focus:shadow-outline focus:border-pink-400"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          min="1"
          max="100"
        />
      </div>
      <div className="mb-4">
        <label className="block text-pink-700 text-sm font-bold mb-2">
          Sortowanie po cenie:{" "}
        </label>
        <select
          className="shadow appearance-none border border-pink-200 rounded w-full py-2 px-3 text-pink-700 leading-tight focus:outline-none focus:shadow-outline focus:border-pink-400"
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
        >
          <option value="">Brak</option>
          <option value="asc">Rosnąco</option>
          <option value="desc">Malejąco</option>
        </select>
      </div>
      <button
        className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
}
