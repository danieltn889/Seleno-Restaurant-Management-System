import { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { listStocks, addStock, updateStock, deleteStock, listStockItemCategories } from "../../api/services/inventory";
import { AuthContext } from "../../context/AuthContext";

export default function Stocks() {
  const { user } = useContext(AuthContext);
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStock, setSelectedStock] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newStock, setNewStock] = useState({
    stock_item_cat_id: "",
    stock_name: "",
    stock_desc: "",
    stock_status: "available",
    stock_qty: 0,
  });

  const userRole = "admin"; // only admin can delete

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksRes, catsRes] = await Promise.all([
          listStocks(),
          listStockItemCategories(),
        ]);
        if (stocksRes.status === 'success') setStocks(stocksRes.data || []);
        if (catsRes.status === 'success') setCategories(catsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---------- ADD ---------- */
  const handleAddSave = async () => {
    if (!newStock.stock_name.trim() || !newStock.stock_item_cat_id) {
      Swal.fire("Error", "Name and category are required", "error");
      return;
    }
    try {
      const res = await addStock(newStock);
      if (res.status === 'success') {
        Swal.fire("Success", "Stock added successfully", "success");
        setNewStock({
          stock_item_cat_id: "",
          stock_name: "",
          stock_desc: "",
          stock_status: "available",
          stock_qty: 0,
        });
        setShowAdd(false);
        // Refetch
        const fetchRes = await listStocks();
        if (fetchRes.status === 'success') setStocks(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to add stock", "error");
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      Swal.fire("Error", "Failed to add stock", "error");
    }
  };

  /* ---------- EDIT ---------- */
  const openEdit = (stock) => {
    setSelectedStock(stock);
    setNewStock({
      stock_item_cat_id: stock.stock_item_cat_id,
      stock_name: stock.stock_name,
      stock_desc: stock.stock_desc,
      stock_status: stock.stock_status,
      stock_qty: stock.stock_qty,
    });
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!newStock.stock_name.trim() || !newStock.stock_item_cat_id) {
      Swal.fire("Error", "Name and category are required", "error");
      return;
    }
    try {
      const res = await updateStock({
        stock_id: selectedStock.stock_id,
        ...newStock,
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Stock updated successfully", "success");
        setShowEdit(false);
        setSelectedStock(null);
        setNewStock({
          stock_item_cat_id: "",
          stock_name: "",
          stock_desc: "",
          stock_status: "available",
          stock_qty: 0,
        });
        // Refetch
        const fetchRes = await listStocks();
        if (fetchRes.status === 'success') setStocks(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to update stock", "error");
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      Swal.fire("Error", "Failed to update stock", "error");
    }
  };

  /* ---------- DELETE ---------- */
  const openDelete = (stock) => {
    setSelectedStock(stock);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteStock(selectedStock.stock_id);
      if (res.status === 'success') {
        Swal.fire("Success", "Stock deleted successfully", "success");
        setShowDelete(false);
        setSelectedStock(null);
        // Refetch
        const fetchRes = await listStocks();
        if (fetchRes.status === 'success') setStocks(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to delete stock", "error");
      }
    } catch (error) {
      console.error('Error deleting stock:', error);
      Swal.fire("Error", "Failed to delete stock", "error");
    }
  };

  /* Helper: Get Category Name */
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.stock_item_cat_id === catId);
    return cat ? cat.stock_item_cat_name : "Unknown";
  };

  return loading ? <div className="text-center p-4">Loading...</div> : (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stocks</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add Stock
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {stocks.map((s, index) => (
          <div key={s.stock_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{s.stock_name}</h3>
                <p className="text-sm text-gray-500">#{index + 1}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full text-white font-medium ${
                  s.stock_status === "active" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {s.stock_status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <p><span className="font-medium">Category:</span> {getCategoryName(s.stock_item_cat_id)}</p>
              <p><span className="font-medium">Quantity:</span> {s.stock_qty}</p>
              {s.stock_desc && <p><span className="font-medium">Description:</span> {s.stock_desc}</p>}
              <p><span className="font-medium">Created:</span> {s.stock_created_date}</p>
              <p><span className="font-medium">Updated:</span> {s.stock_updated_date}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => openEdit(s)}
                className="text-yellow-500 hover:text-yellow-700 transition p-2"
              >
                <FaEdit />
              </button>
              {userRole === "admin" && (
                <button
                  onClick={() => openDelete(s)}
                  className="text-red-500 hover:text-red-700 transition p-2"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
        {stocks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No stocks found
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3 hidden md:table-cell">Category</th>
              <th className="p-3 hidden md:table-cell">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3">Qty</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.stock_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{s.stock_name}</td>
                <td className="p-3 hidden md:table-cell">{getCategoryName(s.stock_item_cat_id)}</td>
                <td className="p-3 hidden md:table-cell">{s.stock_desc}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full text-white ${
                      s.stock_status === "available" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {s.stock_status}
                  </span>
                </td>
                <td className="p-3">{s.stock_qty}</td>
                <td className="p-3 hidden lg:table-cell">{s.stock_created_date}</td>
                <td className="p-3 hidden lg:table-cell">{s.stock_updated_date}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    >
                      <FaEdit />
                    </button>
                    {userRole === "admin" && (
                      <button
                        onClick={() => openDelete(s)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No stocks found
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
            <h3 className="text-xl font-bold mb-4">Add Item in stock</h3>

            <select
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_item_cat_id}
              onChange={(e) =>
                setNewStock({ ...newStock, stock_item_cat_id: parseInt(e.target.value) })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.stock_item_cat_id} value={c.stock_item_cat_id}>
                  {c.stock_item_cat_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Name.."
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_name}
              onChange={(e) => setNewStock({ ...newStock, stock_name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_desc}
              onChange={(e) => setNewStock({ ...newStock, stock_desc: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_qty}
              onChange={(e) => setNewStock({ ...newStock, stock_qty: parseInt(e.target.value) })}
            />
            <select
              className="w-full border p-2 mb-4 rounded"
              value={newStock.stock_status}
              onChange={(e) => setNewStock({ ...newStock, stock_status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
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
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Edit Stock</h3>

            <select
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_item_cat_id}
              onChange={(e) =>
                setNewStock({
                  ...newStock,
                  stock_item_cat_id: parseInt(e.target.value),
                })
              }
            >
              {categories.map((c) => (
                <option key={c.stock_item_cat_id} value={c.stock_item_cat_id}>
                  {c.stock_item_cat_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_name}
              onChange={(e) => setNewStock({ ...newStock, stock_name: e.target.value })}
            />
            <textarea
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_desc}
              onChange={(e) => setNewStock({ ...newStock, stock_desc: e.target.value })}
            />
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={newStock.stock_qty}
              onChange={(e) => setNewStock({ ...newStock, stock_qty: parseInt(e.target.value) })}
            />
            <select
              className="w-full border p-2 mb-4 rounded"
              value={newStock.stock_status}
              onChange={(e) => setNewStock({ ...newStock, stock_status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
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
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Delete this stock?</h3>
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
