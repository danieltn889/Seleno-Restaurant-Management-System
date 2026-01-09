import { useState } from "react";

export default function MenuItems() {
  const [items] = useState([
    {
      menu_item_id: 1,
      menu_item_name: "Burger Ingredients",
      menu_item_desc: "Buns, meat, vegetables",
      menu_item_created_date: "2026-01-01",
    },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Menu Items</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item.menu_item_id}
            className="rounded-xl shadow-md p-4 hover:shadow-lg transition"
          >
            <h4 className="font-semibold text-lg">{item.menu_item_name}</h4>
            <p className="text-sm text-gray-500 mt-1">
              {item.menu_item_desc}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Created: {item.menu_item_created_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
