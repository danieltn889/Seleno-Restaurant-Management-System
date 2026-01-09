import { useState } from "react";

const dummyMenu = [
  { id: 1, category: "Restaurant", name: "Chef Salad", price: 6000 },
  { id: 2, category: "Restaurant", name: "Grilled Chicken", price: 12000 },
  { id: 3, category: "Bar", name: "Heineken", price: 3000 },
  { id: 4, category: "Bar", name: "Cocktail", price: 7000 },
  { id: 5, category: "Coffee", name: "Cappuccino", price: 2500 },
  { id: 6, category: "Coffee", name: "Espresso", price: 2000 },
];

export default function MenuList({ category, table, tableOrders, setTableOrders, orderStatus }) {
  const [qtys, setQtys] = useState({});

  const addItem = (item) => {
    const qty = qtys[item.id] || 1;

    setTableOrders((prev) => {
      const catData = prev?.[table]?.[category] || { items: [], status: "PENDING" };
      const items = catData.items;
      const existing = items.find((i) => i.id === item.id);

      const newItems = existing
        ? items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + qty } : i
          )
        : [...items, { ...item, qty }];

      return {
        ...prev,
        [table]: {
          ...prev[table],
          [category]: {
            ...catData,
            items: newItems,
          },
        },
      };
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">{category} Menu</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {dummyMenu
          .filter((i) => i.category === category)
          .map((item) => (
            <div
              key={item.id}
              className="border rounded p-3 hover:shadow transition flex flex-col"
            >
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.price} RWF</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={qtys[item.id] || 1}
                  onChange={(e) =>
                    setQtys({ ...qtys, [item.id]: parseInt(e.target.value) })
                  }
                  className="border w-16 p-1 rounded"
                />
                <button
                  onClick={() => addItem(item)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded font-semibold"
                  disabled={orderStatus === "PAID"}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
