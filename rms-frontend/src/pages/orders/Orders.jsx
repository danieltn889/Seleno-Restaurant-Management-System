import { useState } from "react";
import MenuCategory from "./MenuCategory";
import TableSelector from "./TableSelector";
import MenuList from "./MenuList";
import Cart from "./Cart";

export default function Orders() {
  const [category, setCategory] = useState("");
  const [table, setTable] = useState("");
  
  // Table orders structure: { [table]: { [category]: { items: [] } } }
  const [tableOrders, setTableOrders] = useState({});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Place Order</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* LEFT: Menu Selection */}
        <div className="lg:col-span-2 space-y-4">
          <MenuCategory
            category={category}
            setCategory={setCategory}
          />

          {category && <TableSelector setTable={setTable} selectedTable={table} />}

          {category && table && (
            <MenuList
              category={category}
              table={table}
              tableOrders={tableOrders}
              setTableOrders={setTableOrders}
            />
          )}
        </div>

        {/* RIGHT: Cart */}
        <div className="space-y-4">
          {table && (
            <Cart
              table={table}
              tableOrders={tableOrders}
              setTableOrders={setTableOrders}
            />
          )}
        </div>
      </div>
    </div>
  );
}
