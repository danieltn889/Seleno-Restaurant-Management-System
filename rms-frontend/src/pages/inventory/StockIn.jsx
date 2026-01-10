import { useState, useEffect, useContext } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { listStocks, listStockIn, addStockIn, updateStockIn, deleteStockIn } from "../../api/services/inventory";
import { AuthContext } from "../../context/AuthContext";

export default function StockIn() {
  const { user } = useContext(AuthContext);
  const [stockins, setStockins] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksRes, stockinsRes] = await Promise.all([
          listStocks(),
          listStockIn()
        ]);
        if (stocksRes.status === 'success') {
          setStocks(stocksRes.data);
        }
        if (stockinsRes.status === 'success') {
          setStockins(stockinsRes.data);
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
  const handleAddSave = async () => {
    if (!newStockin.stock_id || newStockin.stockin_qty <= 0) {
      Swal.fire("Error", "Please enter valid stock and quantity", "error");
      return;
    }

    if (!user?.userid) {
      Swal.fire("Error", "User not authenticated", "error");
      return;
    }

    const response = await addStockIn({
      stock_id: newStockin.stock_id,
      stockin_qty: newStockin.stockin_qty,
      stockin_price_init: newStockin.stockin_price_init || 0,
      userid: user.userid,
    });

    if (response.status === 'success') {
      Swal.fire("Success", "Stock added successfully!", "success");
      // Refetch data
      const [stocksRes, stockinsRes] = await Promise.all([
        listStocks(),
        listStockIn()
      ]);
      if (stocksRes.status === 'success') setStocks(stocksRes.data);
      if (stockinsRes.status === 'success') setStockins(stockinsRes.data);
      setNewStockin({
        stock_id: "",
        stockin_qty: 0,
        stockin_price_init: 0,
        stockin_status: "completed",
      });
      setShowAdd(false);
    } else {
      Swal.fire("Error", response.message || "Failed to add stock", "error");
    }
  };

  /* ---------- EDIT ---------- */
  const openEdit = (stockin) => {
    setSelectedStockin({ ...stockin }); // clone object
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!selectedStockin.stock_id || selectedStockin.stockin_qty <= 0) {
      Swal.fire("Error", "Please enter valid stock and quantity", "error");
      return;
    }

    try {
      const response = await updateStockIn({
        stockin_id: selectedStockin.stockin_id,
        stock_id: selectedStockin.stock_id,
        stockin_qty: selectedStockin.stockin_qty,
        stockin_price_init: selectedStockin.stockin_price_init,
        stockin_status: selectedStockin.stockin_status,
      });

      if (response.status === 'success') {
        Swal.fire("Success", "Stock in record updated successfully!", "success");
        setShowEdit(false);
        setSelectedStockin(null);
        // Refetch data
        const stockinsRes = await listStockIn();
        if (stockinsRes.status === 'success') setStockins(stockinsRes.data || []);
      } else {
        Swal.fire("Error", response.message || "Failed to update stock in record", "error");
      }
    } catch (error) {
      console.error('Error updating stock in:', error);
      Swal.fire("Error", "Failed to update stock in record", "error");
    }
  };

  /* ---------- DELETE ---------- */
  const openDelete = (stockin) => {
    setSelectedStockin(stockin);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteStockIn(selectedStockin.stockin_id);

      if (response.status === 'success') {
        Swal.fire("Success", "Stock in record deleted successfully!", "success");
        setShowDelete(false);
        setSelectedStockin(null);
        // Refetch data
        const stockinsRes = await listStockIn();
        if (stockinsRes.status === 'success') setStockins(stockinsRes.data || []);
      } else {
        Swal.fire("Error", response.message || "Failed to delete stock in record", "error");
      }
    } catch (error) {
      console.error('Error deleting stock in:', error);
      Swal.fire("Error", "Failed to delete stock in record", "error");
    }
  };

  // Helper: get stock name from stocks
  const getStockName = (stock_id) => {
    const stock = stocks.find(s => s.stock_id === stock_id);
    return stock ? stock.stock_name : "Unknown";
  };

  // Helper: get stock description from stocks
  const getStockDescription = (stock_id) => {
    const stock = stocks.find(s => s.stock_id === stock_id);
    return stock ? stock.stock_desc : "";
  };

  /* ---------- FILTER ---------- */
  const filteredStockins =
    filterFrom && filterTo
      ? stockins.filter(
          (s) =>
            s.stockin_created_date >= filterFrom && s.stockin_created_date <= filterTo
        )
      : stockins;

  return loading ? (
    <div className="text-center py-8">Loading...</div>
  ) : (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock In</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add Stock In
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredStockins.map((s, index) => (
          <div key={s.stockin_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{getStockName(s.stock_id)}</h3>
                {getStockDescription(s.stock_id) && (
                  <p className="text-sm text-gray-600 mt-1">{getStockDescription(s.stock_id)}</p>
                )}
                <p className="text-sm text-gray-500">#{index + 1}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full text-white font-medium ${
                  s.stockin_status === "completed" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {s.stockin_status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <p><span className="font-medium">Quantity:</span> {s.stockin_qty}</p>
              <p><span className="font-medium">Initial Price:</span> {s.stockin_price_init}</p>
              <p><span className="font-medium">Current Qty:</span> {s.stock_current_qty}</p>
              <p><span className="font-medium">Created:</span> {s.stockin_created_date}</p>
              <p><span className="font-medium">Updated:</span> {s.stockin_updated_date}</p>
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
        {filteredStockins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No stockins found
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Stock Name</th>
              <th className="p-3">Qty</th>
              <th className="p-3 hidden md:table-cell">Init Price</th>
              <th className="p-3 hidden md:table-cell">Current Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStockins.map((s) => (
              <tr key={s.stockin_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{getStockName(s.stock_id)}</td>
                <td className="p-3">{s.stockin_qty}</td>
                <td className="p-3 hidden md:table-cell">{s.stockin_price_init}</td>
                <td className="p-3 hidden md:table-cell">{s.stock_current_qty}</td>
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
              {stocks.map((s) => (
                <option key={s.stock_id} value={s.stock_id}>
                  {s.stock_name} (Current: {s.stock_qty || 0})
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
                  stock_name: stocks.find((s) => s.stock_id === stockId)?.stock_name || "",
                });
              }}
            >
              {stocks.map((s) => (
                <option key={s.stock_id} value={s.stock_id}>
                  {s.stock_name} (Current: {s.stock_qty || 0})
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
