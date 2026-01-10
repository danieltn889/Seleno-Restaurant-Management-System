import { useState, useEffect, useContext } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { listStocks, listStockOut, addStockOut, updateStockOut, deleteStockOut } from "../../api/services/inventory";
import { AuthContext } from "../../context/AuthContext";

export default function StockOut() {
  const { user } = useContext(AuthContext);
  const [stockOuts, setStockOuts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksRes, stockoutsRes] = await Promise.all([
          listStocks(),
          listStockOut()
        ]);
        if (stocksRes.status === 'success') {
          setStocks(stocksRes.data);
        }
        if (stockoutsRes.status === 'success') {
          setStockOuts(stockoutsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper: get current stock qty from stocks
  const getCurrentQty = (stock_id) => {
    const stock = stocks.find((s) => s.stock_id === stock_id);
    return stock ? stock.stock_qty : 0;
  };

  /* ---------- ADD ---------- */
  const handleAddSave = async () => {
    if (!newStockOut.stock_id || newStockOut.stockout_qty <= 0) {
      Swal.fire("Error", "Please select stock and enter valid quantity", "error");
      return;
    }

    if (!user?.userid) {
      Swal.fire("Error", "User not authenticated", "error");
      return;
    }

    const currentQty = getCurrentQty(newStockOut.stock_id);
    if (newStockOut.stockout_qty > currentQty) {
      Swal.fire("Error", "Insufficient stock quantity", "error");
      return;
    }

    const response = await addStockOut({
      stock_id: newStockOut.stock_id,
      stockout_qty: newStockOut.stockout_qty,
      userid: user.userid,
    });

    if (response.status === 'success') {
      Swal.fire("Success", "Stock deducted successfully!", "success");
      // Refetch data
      const [stocksRes, stockoutsRes] = await Promise.all([
        listStocks(),
        listStockOut()
      ]);
      if (stocksRes.status === 'success') setStocks(stocksRes.data);
      if (stockoutsRes.status === 'success') setStockOuts(stockoutsRes.data);
      setNewStockOut({
        stock_id: "",
        stockout_qty: 0,
        stockout_status: "completed",
      });
      setShowAdd(false);
    } else {
      Swal.fire("Error", response.message || "Failed to deduct stock", "error");
    }
  };

  /* ---------- EDIT ---------- */
  const openEdit = (stockOut) => {
    setSelectedStockOut({ ...stockOut });
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!selectedStockOut.stock_id || selectedStockOut.stockout_qty <= 0) {
      Swal.fire("Error", "Please enter valid stock and quantity", "error");
      return;
    }

    // Check if sufficient stock is available
    const currentQty = getCurrentQty(selectedStockOut.stock_id);
    if (selectedStockOut.stockout_qty > currentQty) {
      Swal.fire("Error", "Insufficient stock quantity", "error");
      return;
    }

    try {
      const response = await updateStockOut({
        stockout_id: selectedStockOut.stockout_id,
        stock_id: selectedStockOut.stock_id,
        stockout_qty: selectedStockOut.stockout_qty,
        stockout_status: selectedStockOut.stockout_status,
      });

      if (response.status === 'success') {
        Swal.fire("Success", "Stock out record updated successfully!", "success");
        setShowEdit(false);
        setSelectedStockOut(null);
        // Refetch data
        const [stocksRes, stockoutsRes] = await Promise.all([
          listStocks(),
          listStockOut()
        ]);
        if (stocksRes.status === 'success') setStocks(stocksRes.data);
        if (stockoutsRes.status === 'success') setStockOuts(stockoutsRes.data);
      } else {
        Swal.fire("Error", response.message || "Failed to update stock out record", "error");
      }
    } catch (error) {
      console.error('Error updating stock out:', error);
      Swal.fire("Error", "Failed to update stock out record", "error");
    }
  };

  /* ---------- DELETE ---------- */
  const openDelete = (stockOut) => {
    setSelectedStockOut(stockOut);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteStockOut(selectedStockOut.stockout_id);

      if (response.status === 'success') {
        Swal.fire("Success", "Stock out record deleted successfully!", "success");
        setShowDelete(false);
        setSelectedStockOut(null);
        // Refetch data
        const [stocksRes, stockoutsRes] = await Promise.all([
          listStocks(),
          listStockOut()
        ]);
        if (stocksRes.status === 'success') setStocks(stocksRes.data);
        if (stockoutsRes.status === 'success') setStockOuts(stockoutsRes.data);
      } else {
        Swal.fire("Error", response.message || "Failed to delete stock out record", "error");
      }
    } catch (error) {
      console.error('Error deleting stock out:', error);
      Swal.fire("Error", "Failed to delete stock out record", "error");
    }
  };

  // Helper: get stock description from stocks
  const getStockDescription = (stock_id) => {
    const stock = stocks.find(s => s.stock_id === stock_id);
    return stock ? stock.stock_desc : "";
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

  if (loading) return <div className="text-center p-4">Loading...</div>;

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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredStockOuts.map((s, index) => (
          <div key={s.stockout_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{stocks.find(st => st.stock_id === s.stock_id)?.stock_name || "Unknown"}</h3>
                {getStockDescription(s.stock_id) && (
                  <p className="text-sm text-gray-600 mt-1">{getStockDescription(s.stock_id)}</p>
                )}
                <p className="text-sm text-gray-500">#{index + 1}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full text-white font-medium ${
                  s.stockout_status === "completed" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {s.stockout_status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <p><span className="font-medium">Quantity Out:</span> {s.stockout_qty}</p>
              <p><span className="font-medium">Current Qty:</span> {getCurrentQty(s.stock_id)}</p>
              <p><span className="font-medium">Created:</span> {s.stockout_created_date}</p>
              <p><span className="font-medium">Updated:</span> {s.stockout_updated_date}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => openEdit(s)}
                className="text-yellow-500 hover:text-yellow-700 transition p-2"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => openDelete(s)}
                className="text-red-500 hover:text-red-700 transition p-2"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {filteredStockOuts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No stockouts found
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Stock Name</th>
              <th className="p-3">Qty Out</th>
              <th className="p-3 hidden md:table-cell">Current Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockOuts.map((s) => (
              <tr key={s.stockout_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{stocks.find(st => st.stock_id === s.stock_id)?.stock_name || "Unknown"}</td>
                <td className="p-3">{s.stockout_qty}</td>
                <td className="p-3 hidden md:table-cell">{getCurrentQty(s.stock_id)}</td>
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
                setNewStockOut({ ...newStockOut, stock_id: e.target.value ? parseInt(e.target.value) : "" })
              }
            >
              <option value="">-- Select Stock --</option>
              {stocks.map((s) => (
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
                setNewStockOut({ ...newStockOut, stockout_qty: e.target.value ? parseInt(e.target.value) : 0 })
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

      {/* ================= EDIT MODAL ================= */}
      {showEdit && selectedStockOut && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Edit Stock Out</h3>

            <label className="block font-medium mb-1">Select Stock:</label>
            <select
              className="w-full border p-2 mb-3 rounded"
              value={selectedStockOut.stock_id}
              onChange={(e) => {
                const stockId = e.target.value ? parseInt(e.target.value) : "";
                setSelectedStockOut({
                  ...selectedStockOut,
                  stock_id: stockId,
                });
              }}
            >
              <option value="">-- Select Stock --</option>
              {stocks.map((s) => (
                <option key={s.stock_id} value={s.stock_id}>
                  {s.stock_name} (Available: {getCurrentQty(s.stock_id)})
                </option>
              ))}
            </select>

            <label className="block font-medium mb-1">Quantity Out:</label>
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={selectedStockOut.stockout_qty}
              onChange={(e) =>
                setSelectedStockOut({
                  ...selectedStockOut,
                  stockout_qty: e.target.value ? parseInt(e.target.value) : 0,
                })
              }
            />

            <label className="block font-medium mb-1">Status:</label>
            <select
              className="w-full border p-2 mb-4 rounded"
              value={selectedStockOut.stockout_status}
              onChange={(e) =>
                setSelectedStockOut({ ...selectedStockOut, stockout_status: e.target.value })
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
      {showDelete && selectedStockOut && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Delete this Stock Out?</h3>
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
