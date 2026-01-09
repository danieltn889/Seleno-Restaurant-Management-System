import { useState } from "react";

export default function MenuCategory({ category, setCategory }) {
  // Dummy menu categories (Restaurant, Bar, Coffee)
  const [categories] = useState([
    "Restaurant",
    "Bar",
    "Coffee",
    "Dessert",
  ]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Click on Department</h2>
      <div className="grid grid-cols-2 gap-2">
        {categories?.map((cat, index) => (
          <button
            key={index}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded text-white font-medium ${
              category === cat ? "bg-yellow-600" : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
