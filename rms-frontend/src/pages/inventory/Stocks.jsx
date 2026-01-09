import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

// Dummy categories for FK
const dummyCategories = [
  { stock_item_cat_id: 1, Stock_item_cat_name: "Tomatoes" },
  { stock_item_cat_id: 2, Stock_item_cat_name: "Rice" },
  { stock_item_cat_id: 3, Stock_item_cat_name: "Potatoes" },
];

export default function Stocks() {
  const [stocks, setStocks] = useState([
    {
      stock_id: 1,
      stock_item_cat_id: 1,
      stock_name: "Cherry Tomatoes",
      stock_desc: "Small fresh tomatoes",
      stock_status: "active",
      stock_qty: 120,
      stock_created_date: "2026-01-01",
      stock_updated_date: "2026-01-03",
    },
    {
      stock_id: 2,
      stock_item_cat_id: 2,
      stock_name: "Basmati Rice",
      stock_desc: "Imported premium rice",
      stock_status: "inactive",
      stock_qty: 50,
      stock_created_date: "2026-01-02",
      stock_updated_date: "2026-01-04",
    },
  ]);

  const [selectedStock, setSelectedStock] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newStock, setNewStock] = useState({
    stock_item_cat_id: "",
    stock_name: "",
    stock_desc: "",
    stock_status: "active",
    stock_qty: 0,
  });

  const userRole = "admin"; // only admin can delete

  /* ---------- ADD ---------- */
  const handleAddSave = () => {
    if (!newStock.stock_name.trim()) return;

    const nextId =
      stocks.length > 0 ? Math.max(...stocks.map((s) => s.stock_id)) + 1 : 1;
    const today = new Date().toISOString().split("T")[0];

    setStocks([
      ...stocks,
      {
        ...newStock,
        stock_id: nextId,
        stock_created_date: today,
        stock_updated_date: today,
      },
    ]);

    Swal.fire("Success", "Stock added successfully!", "success");

    setNewStock({
      stock_item_cat_id: "",
      stock_name: "",
      stock_desc: "",
      stock_status: "active",
      stock_qty: 0,
    });

    setShowAdd(false);
  };

  /* ---------- EDIT ---------- */
  const openEdit = (stock) => {
    setSelectedStock(stock);
    setShowEdit(true);
  };

  const handleEditSave = () => {
    const today = new Date().toISOString().split("T")[0];

    setStocks(
      stocks.map((s) =>
        s.stock_id === selectedStock.stock_id
          ? { ...selectedStock, stock_updated_date: today }
          : s
      )
    );

    Swal.fire("Success", "Stock updated successfully!", "success");
    setShowEdit(false);
  };

  /* ---------- DELETE ---------- */
  const openDelete = (stock) => {
    setSelectedStock(stock);
    setShowDelete(true);
  };

  const handleDelete = () => {
    setStocks(stocks.filter((s) => s.stock_id !== selectedStock.stock_id));
    Swal.fire("Deleted", "Stock deleted successfully!", "success");
    setShowDelete(false);
  };

  /* Helper: Get Category Name */
  const getCategoryName = (catId) => {
    const cat = dummyCategories.find((c) => c.stock_item_cat_id === catId);
    return cat ? cat.Stock_item_cat_name : "N/A";
  };

  return (
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

      {/* Responsive Table */}
      <div className="overflow-x-auto">
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
                      s.stock_status === "active" ? "bg-green-500" : "bg-gray-500"
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
              {dummyCategories.map((c) => (
                <option key={c.stock_item_cat_id} value={c.stock_item_cat_id}>
                  {c.Stock_item_cat_name}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              value={selectedStock.stock_item_cat_id}
              onChange={(e) =>
                setSelectedStock({
                  ...selectedStock,
                  stock_item_cat_id: parseInt(e.target.value),
                })
              }
            >
              {dummyCategories.map((c) => (
                <option key={c.stock_item_cat_id} value={c.stock_item_cat_id}>
                  {c.Stock_item_cat_name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={selectedStock.stock_name}
              onChange={(e) => setSelectedStock({ ...selectedStock, stock_name: e.target.value })}
            />
            <textarea
              className="w-full border p-2 mb-3 rounded"
              value={selectedStock.stock_desc}
              onChange={(e) => setSelectedStock({ ...selectedStock, stock_desc: e.target.value })}
            />
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={selectedStock.stock_qty}
              onChange={(e) => setSelectedStock({ ...selectedStock, stock_qty: parseInt(e.target.value) })}
            />
            <select
              className="w-full border p-2 mb-4 rounded"
              value={selectedStock.stock_status}
              onChange={(e) => setSelectedStock({ ...selectedStock, stock_status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
