export default function Checkout({ table, tableOrders, setTableOrders, userRole }) {
  if (!tableOrders[table]) return null;

  const approveCategory = (cat) => {
    setTableOrders((prev) => ({
      ...prev,
      [table]: {
        ...prev[table],
        [cat]: { ...prev[table][cat], status: "PAID" },
      },
    }));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Checkout / Payment</h2>
      {Object.keys(tableOrders[table]).map((cat) => {
        const catData = tableOrders[table][cat];
        if (!catData?.items || catData.items.length === 0) return null;

        const total = catData.items.reduce((sum, i) => sum + i.price * i.qty, 0);

        return (
          <div key={cat} className="mb-4 border-b pb-2">
            <h3 className="font-semibold text-yellow-600">{cat}</h3>
            <p>Total: {total} RWF</p>
            <p>Status: {catData.status}</p>
            {userRole === "cashier" && catData.status === "PENDING" && (
              <button
                onClick={() => approveCategory(cat)}
                className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
              >
                Approve & Pay
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
