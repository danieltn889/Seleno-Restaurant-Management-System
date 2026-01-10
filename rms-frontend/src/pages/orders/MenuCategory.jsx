import { useState, useEffect } from "react";
import { listMenuCategories } from "../../api/services/menu";

export default function MenuCategory({ category, setCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await listMenuCategories();
        if (res.status === 'success') {
          setCategories(res.data.map(cat => cat.menu_cat_name));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="text-center p-2">Loading categories...</div>;

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
