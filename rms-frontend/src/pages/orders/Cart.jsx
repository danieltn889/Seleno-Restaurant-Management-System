import OrderNotePrint from "./OrderNotePrint";
import InvoicePrint from "./InvoicePrint";

export default function Cart({ table, tableOrders }) {
  if (!tableOrders || !tableOrders[table]) return null;

  const categories = Object.keys(tableOrders[table] || {});

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
            <div className="space-y-1">
              {catData.items.map(i => (
                <div key={i.id} className="flex justify-between text-gray-700">
                  <span>{i.name} x {i.qty}</span>
                  <span>{i.price * i.qty} RWF</span>
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
        />
      </div>
    </div>
  );
}
