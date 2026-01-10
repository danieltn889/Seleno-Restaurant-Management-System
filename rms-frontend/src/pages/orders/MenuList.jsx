import { useState, useEffect } from "react";
import { listMenuItems } from "../../api/services/menu";

export default function MenuList({ category, table, tableOrders, setTableOrders, orderStatus }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qtys, setQtys] = useState({});

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await listMenuItems();
        if (res.status === 'success') {
          setMenuItems(res.data || []);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const addItem = (item) => {
    const qty = qtys[item.menu_item_id] || 1;

    setTableOrders((prev) => {
      const catData = prev?.[table]?.[category] || { items: [], status: "PENDING" };
      const items = catData.items;
      const existing = items.find((i) => i.menu_item_id === item.menu_item_id);

      const newItems = existing
        ? items.map((i) =>
            i.menu_item_id === item.menu_item_id ? { ...i, qty: i.qty + qty } : i
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

  if (loading) return <div className="text-center p-4">Loading menu...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">{category} Menu</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {menuItems
          .filter((i) => i.category === category)
          .map((item) => (
            <div
              key={item.menu_item_id}
              className="border rounded p-3 hover:shadow transition flex flex-col"
            >
              <p className="font-semibold">{item.menu_item_name}</p>
              <p className="text-sm text-gray-500">{item.menu_price || 0} RWF</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={qtys[item.menu_item_id] || 1}
                  onChange={(e) =>
                    setQtys({ ...qtys, [item.menu_item_id]: parseInt(e.target.value) })
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
