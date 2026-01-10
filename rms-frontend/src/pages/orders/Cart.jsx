import OrderNotePrint from "./OrderNotePrint";
import InvoicePrint from "./InvoicePrint";

export default function Cart({ table, tableOrders, setTableOrders }) {
  if (!tableOrders || !tableOrders[table]) return null;

  const categories = Object.keys(tableOrders[table] || {});

  const updateQuantity = (category, itemId, newQty) => {
    if (newQty <= 0) {
      // Remove item if quantity becomes 0
      setTableOrders((prev) => {
        const catData = prev?.[table]?.[category] || { items: [], status: "PENDING" };
        const items = catData.items.filter((i) => i.menu_item_id !== itemId);
        
        if (items.length === 0) {
          // Remove category if no items left
          const newTableOrders = { ...prev };
          delete newTableOrders[table][category];
          return newTableOrders;
        }
        
        return {
          ...prev,
          [table]: {
            ...prev[table],
            [category]: {
              ...catData,
              items: items,
            },
          },
        };
      });
      return;
    }

    setTableOrders((prev) => {
      const catData = prev?.[table]?.[category] || { items: [], status: "PENDING" };
      const items = catData.items.map((i) =>
        i.menu_item_id === itemId ? { ...i, qty: newQty } : i
      );

      return {
        ...prev,
        [table]: {
          ...prev[table],
          [category]: {
            ...catData,
            items: items,
          },
        },
      };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        Cart for Table {table}
      </h2>

      {/* CATEGORY BLOCKS */}
      {categories.map(cat => {
        const catData = tableOrders[table][cat];
        if (!catData?.items?.length) return null;

        return (
          <div
            key={cat}
            className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-400"
          >
            <h3 className="font-semibold text-yellow-600 text-lg mb-2">{cat}</h3>
            
            {/* Items */}
            <div className="space-y-2">
              {catData.items.map(i => (
                <div key={i.menu_item_id} className="flex items-center justify-between text-gray-700 bg-white p-2 rounded border">
                  <span className="flex-1">{i.menu_item_name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(cat, i.menu_item_id, i.qty - 1)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                      disabled={i.qty <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{i.qty}</span>
                    <button
                      onClick={() => updateQuantity(cat, i.menu_item_id, i.qty + 1)}
                      className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-2 font-semibold w-16 text-right">{(i.menu_price || 0) * i.qty} RWF</span>
                </div>
              ))}
            </div>

            {/* Print Order Note Button */}
            <div className="mt-3">
              <OrderNotePrint
                table={table}
                category={cat}
                items={catData.items}
                servedBy={{ firstname: "John", lastname: "Doe" }}
                orderId={`ORD-${table}-${cat}-${Date.now()}`}
                orderDate={new Date().toLocaleString()}
              />
            </div>
          </div>
        );
      })}

      {/* CUSTOMER INVOICE SECTION */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-400 text-center">
        <h3 className="text-lg font-semibold text-indigo-700 mb-3">
          Customer Invoice
        </h3>
        <p className="text-gray-700 mb-2">
          This will combine all items from all categories.
        </p>

        <InvoicePrint
          table={table}
          tableOrders={tableOrders}
          servedBy={{ firstname: "John", lastname: "Doe" }}
          orderId={`INV-${table}-${Date.now()}`}
          orderDate={new Date().toLocaleString()}
        />
      </div>
    </div>
  );
}
