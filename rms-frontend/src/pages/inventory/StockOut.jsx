import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

// Dummy StockIn data
const dummyStockIns = [
  { stockin_id: 1, stock_id: 1, stock_name: "Cherry Tomatoes", stockin_qty: 140 },
  { stockin_id: 2, stock_id: 2, stock_name: "Basmati Rice", stockin_qty: 80 },
  { stockin_id: 3, stock_id: 3, stock_name: "Potatoes", stockin_qty: 200 },
];

export default function StockOut({ stockIns = dummyStockIns }) {
  const [stockOuts, setStockOuts] = useState([
    {
      stockout_id: 1,
      stock_id: 1,
      stock_name: "Cherry Tomatoes",
      stockout_qty: 20,
      stockout_status: "completed",
      stockout_created_date: "2026-01-05",
      stockout_updated_date: "2026-01-06",
    },
  ]);

  const [selectedStockOut, setSelectedStockOut] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newStockOut, setNewStockOut] = useState({
    stock_id: "",
    stockout_qty: 0,
    stockout_status: "completed",
  });

  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Helper: get current stock qty from stockin minus stockouts
  const getCurrentQty = (stock_id) => {
    const stockIn = stockIns.find((s) => s.stock_id === stock_id);
    if (!stockIn) return 0;
    const totalOut = stockOuts
      .filter((s) => s.stock_id === stock_id)
      .reduce((acc, s) => acc + s.stockout_qty, 0);
    return stockIn.stockin_qty - totalOut;
  };

  /* ---------- ADD ---------- */
  const handleAddSave = () => {
    if (!newStockOut.stock_id || newStockOut.stockout_qty <= 0) {
      Swal.fire("Error", "Please select stock and enter valid quantity", "error");
      return;
    }

    const currentQty = getCurrentQty(newStockOut.stock_id);
    if (newStockOut.stockout_qty > currentQty) {
      Swal.fire("Error", "Quantity exceeds current stock!", "error");
      return;
    }

    const nextId = stockOuts.length > 0 ? Math.max(...stockOuts.map((s) => s.stockout_id)) + 1 : 1;
    const today = new Date().toISOString().split("T")[0];

    const stockIn = stockIns.find((s) => s.stock_id === newStockOut.stock_id);

    setStockOuts([
      ...stockOuts,
      {
        stockout_id: nextId,
        stock_id: newStockOut.stock_id,
        stock_name: stockIn.stock_name,
        stockout_qty: newStockOut.stockout_qty,
        stockout_status: newStockOut.stockout_status,
        stockout_created_date: today,
        stockout_updated_date: today,
      },
    ]);

    Swal.fire("Success", "Stock out recorded!", "success");
    setNewStockOut({ stock_id: "", stockout_qty: 0, stockout_status: "completed" });
    setShowAdd(false);
  };

  /* ---------- DELETE ---------- */
  const openDelete = (stockOut) => {
    setSelectedStockOut(stockOut);
    setShowDelete(true);
  };

  const handleDelete = () => {
    setStockOuts(stockOuts.filter((s) => s.stockout_id !== selectedStockOut.stockout_id));
    Swal.fire("Deleted", "StockOut deleted!", "success");
    setShowDelete(false);
  };

  /* ---------- FILTER ---------- */
  const filteredStockOuts =
    filterFrom && filterTo
      ? stockOuts.filter(
          (s) =>
            s.stockout_created_date >= filterFrom &&
            s.stockout_created_date <= filterTo
        )
      : stockOuts;

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock Out</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Stock Out
        </button>
      </div>

      {/* Date Filter */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <label className="font-medium">From:</label>
        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="font-medium">To:</label>
        <input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
          className="border p-2 rounded"
        />
        {(filterFrom || filterTo) && (
          <button
            onClick={() => {
              setFilterFrom("");
              setFilterTo("");
            }}
            className="ml-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Stock Name</th>
              <th className="p-3">Qty Out</th>
              <th className="p-3">Current Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockOuts.map((s) => (
              <tr key={s.stockout_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.stock_name}</td>
                <td className="p-3">{s.stockout_qty}</td>
                <td className="p-3">{getCurrentQty(s.stock_id)}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full text-white ${
                      s.stockout_status === "completed" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {s.stockout_status}
                  </span>
                </td>
                <td className="p-3 hidden lg:table-cell">{s.stockout_created_date}</td>
                <td className="p-3 hidden lg:table-cell">{s.stockout_updated_date}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openDelete(s)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStockOuts.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No stock outs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Stock Out</h3>

            <label className="block font-medium mb-1">Select Stock:</label>
            <select
              className="w-full border p-2 mb-3 rounded"
              value={newStockOut.stock_id}
              onChange={(e) =>
                setNewStockOut({ ...newStockOut, stock_id: parseInt(e.target.value) })
              }
            >
              <option value="">-- Select Stock --</option>
              {stockIns.map((s) => (
                <option key={s.stock_id} value={s.stock_id}>
                  {s.stock_name} (Available: {getCurrentQty(s.stock_id)})
                </option>
              ))}
            </select>

            <label className="block font-medium mb-1">Quantity Out:</label>
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={newStockOut.stockout_qty}
              onChange={(e) =>
                setNewStockOut({ ...newStockOut, stockout_qty: parseInt(e.target.value) })
              }
            />

            <label className="block font-medium mb-1">Status:</label>
            <select
              className="w-full border p-2 mb-4 rounded"
              value={newStockOut.stockout_status}
              onChange={(e) =>
                setNewStockOut({ ...newStockOut, stockout_status: e.target.value })
              }
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleAddSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
