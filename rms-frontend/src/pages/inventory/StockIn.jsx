import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

// Dummy stock list (for FK)
const dummyStocks = [
  { stock_id: 1, stock_name: "Cherry Tomatoes", stock_current_qty: 120 },
  { stock_id: 2, stock_name: "Basmati Rice", stock_current_qty: 50 },
  { stock_id: 3, stock_name: "Potatoes", stock_current_qty: 200 },
];

export default function StockIn() {
  const [stockins, setStockins] = useState([
    {
      stockin_id: 1,
      stock_id: 1,
      stock_name: "Cherry Tomatoes",
      stockin_qty: 20,
      stockin_price_init: 50,
      stockin_status: "completed",
      stock_current_qty: 140,
      stockin_created_date: "2026-01-02",
      stockin_updated_date: "2026-01-03",
    },
    {
      stockin_id: 2,
      stock_id: 2,
      stock_name: "Basmati Rice",
      stockin_qty: 30,
      stockin_price_init: 100,
      stockin_status: "pending",
      stock_current_qty: 80,
      stockin_created_date: "2026-01-03",
      stockin_updated_date: "2026-01-04",
    },
  ]);

  const [selectedStockin, setSelectedStockin] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newStockin, setNewStockin] = useState({
    stock_id: "",
    stockin_qty: 0,
    stockin_price_init: 0,
    stockin_status: "completed",
  });

  // Date range filter
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  /* ---------- ADD ---------- */
  const handleAddSave = () => {
    if (!newStockin.stock_id || newStockin.stockin_qty <= 0) {
      Swal.fire("Error", "Please enter valid stock and quantity", "error");
      return;
    }

    const nextId =
      stockins.length > 0
        ? Math.max(...stockins.map((s) => s.stockin_id)) + 1
        : 1;

    const today = new Date().toISOString().split("T")[0];
    const stockObj = dummyStocks.find((s) => s.stock_id === newStockin.stock_id);

    setStockins([
      ...stockins,
      {
        stockin_id: nextId,
        stock_id: newStockin.stock_id,
        stock_name: stockObj.stock_name,
        stockin_qty: newStockin.stockin_qty,
        stockin_price_init: newStockin.stockin_price_init,
        stockin_status: newStockin.stockin_status,
        stock_current_qty: stockObj.stock_current_qty + newStockin.stockin_qty,
        stockin_created_date: today,
        stockin_updated_date: today,
      },
    ]);

    Swal.fire("Success", "Stock added successfully!", "success");

    setNewStockin({
      stock_id: "",
      stockin_qty: 0,
      stockin_price_init: 0,
      stockin_status: "completed",
    });
    setShowAdd(false);
  };

  /* ---------- EDIT ---------- */
  const openEdit = (stockin) => {
    setSelectedStockin({ ...stockin }); // clone object
    setShowEdit(true);
  };

  const handleEditSave = () => {
    const today = new Date().toISOString().split("T")[0];

    setStockins(
      stockins.map((s) =>
        s.stockin_id === selectedStockin.stockin_id
          ? { ...selectedStockin, stockin_updated_date: today }
          : s
      )
    );

    Swal.fire("Success", "StockIn updated successfully!", "success");
    setShowEdit(false);
  };

  /* ---------- DELETE ---------- */
  const openDelete = (stockin) => {
    setSelectedStockin(stockin);
    setShowDelete(true);
  };

  const handleDelete = () => {
    setStockins(stockins.filter((s) => s.stockin_id !== selectedStockin.stockin_id));
    Swal.fire("Deleted", "StockIn deleted successfully!", "success");
    setShowDelete(false);
  };

  /* ---------- FILTER ---------- */
  const filteredStockins =
    filterFrom && filterTo
      ? stockins.filter(
          (s) =>
            s.stockin_created_date >= filterFrom && s.stockin_created_date <= filterTo
        )
      : stockins;

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock In</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add Stock
        </button>
      </div>

      {/* Filter by date range */}
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
              <th className="p-3">Qty</th>
              <th className="p-3">Init Price</th>
              <th className="p-3">Current Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockins.map((s) => (
              <tr key={s.stockin_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.stock_name}</td>
                <td className="p-3">{s.stockin_qty}</td>
                <td className="p-3">{s.stockin_price_init}</td>
                <td className="p-3">{s.stock_current_qty}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full text-white ${
                      s.stockin_status === "completed" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {s.stockin_status}
                  </span>
                </td>
                <td className="p-3 hidden lg:table-cell">{s.stockin_created_date}</td>
                <td className="p-3 hidden lg:table-cell">{s.stockin_updated_date}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    >
                      <FaEdit />
                    </button>
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
            {filteredStockins.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No stockins found
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
            <h3 className="text-xl font-bold mb-4">Add StockIn</h3>

            <label className="block font-medium mb-1">Select Stock:</label>
            <select
              className="w-full border p-2 mb-3 rounded"
              value={newStockin.stock_id}
              onChange={(e) =>
                setNewStockin({ ...newStockin, stock_id: parseInt(e.target.value) })
              }
            >
              <option value="">-- Select Stock --</option>
              {dummyStocks.map((s) => (
                <option key={s.stock_id} value={s.stock_id}>
                  {s.stock_name} (Current: {s.stock_current_qty})
                </option>
              ))}
            </select>

            <label className="block font-medium mb-1">Quantity:</label>
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={newStockin.stockin_qty}
              onChange={(e) =>
                setNewStockin({ ...newStockin, stockin_qty: parseInt(e.target.value) })
              }
            />

            <label className="block font-medium mb-1">Initial Price:</label>
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={newStockin.stockin_price_init}
              onChange={(e) =>
                setNewStockin({ ...newStockin, stockin_price_init: parseInt(e.target.value) })
              }
            />

            <label className="block font-medium mb-1">Status:</label>
            <select
              className="w-full border p-2 mb-4 rounded"
              value={newStockin.stockin_status}
              onChange={(e) =>
                setNewStockin({ ...newStockin, stockin_status: e.target.value })
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

      {/* ================= EDIT MODAL ================= */}
      {showEdit && selectedStockin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Edit StockIn</h3>

            <label className="block font-medium mb-1">Select Stock:</label>
            <select
              className="w-full border p-2 mb-3 rounded"
              value={selectedStockin.stock_id}
              onChange={(e) => {
                const stockId = parseInt(e.target.value);
                setSelectedStockin({
                  ...selectedStockin,
                  stock_id: stockId,
                  stock_name: dummyStocks.find((s) => s.stock_id === stockId).stock_name,
                });
              }}
            >
              {dummyStocks.map((s) => (
                <option key={s.stock_id} value={s.stock_id}>
                  {s.stock_name} (Current: {s.stock_current_qty})
                </option>
              ))}
            </select>

            <label className="block font-medium mb-1">Quantity:</label>
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={selectedStockin.stockin_qty}
              onChange={(e) =>
                setSelectedStockin({
                  ...selectedStockin,
                  stockin_qty: parseInt(e.target.value),
                })
              }
            />

            <label className="block font-medium mb-1">Initial Price:</label>
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={selectedStockin.stockin_price_init}
              onChange={(e) =>
                setSelectedStockin({
                  ...selectedStockin,
                  stockin_price_init: parseInt(e.target.value),
                })
              }
            />

            <label className="block font-medium mb-1">Status:</label>
            <select
              className="w-full border p-2 mb-4 rounded"
              value={selectedStockin.stockin_status}
              onChange={(e) =>
                setSelectedStockin({ ...selectedStockin, stockin_status: e.target.value })
              }
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDelete && selectedStockin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Delete this StockIn?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
