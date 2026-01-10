import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaTimes, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { listStockCategories, addStockCategory, updateStockCategory, deleteStockCategory } from "../../api/services/inventory";

export default function StockCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    stockcat_name: "",
    stockcat_status: "active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listStockCategories();
        if (res.status === 'success') setCategories(res.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Refresh data when the window regains focus (user returns from add/edit pages)
    const handleFocus = () => {
      const fetchData = async () => {
        try {
          const res = await listStockCategories();
          if (res.status === 'success') setCategories(res.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    const response = await addStockCategory({
      stockcat_name: form.stockcat_name,
      stockcat_status: form.stockcat_status,
    });

    if (response.status === 'success') {
      setForm({ stockcat_name: "", stockcat_status: "active" });
      setShowAdd(false);
      Swal.fire({
        icon: "success",
        title: "Category added!",
        text: `${form.stockcat_name} has been added successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });
      // Refetch
      const res = await listStockCategories();
      if (res.status === 'success') setCategories(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to add category", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    const response = await deleteStockCategory(selectedId);

    if (response.status === 'success') {
      setShowDelete(false);
      Swal.fire({
        icon: "success",
        title: "Category deleted!",
        text: `Category has been deleted.`,
        timer: 2000,
        showConfirmButton: false,
      });
      // Refetch
      const res = await listStockCategories();
      if (res.status === 'success') setCategories(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to delete category", "error");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = async () => {
    const response = await updateStockCategory({
      stockcat_id: selectedId,
      stockcat_name: form.stockcat_name,
      stockcat_status: form.stockcat_status,
    });

    if (response.status === 'success') {
      setShowEdit(false);
      Swal.fire({
        icon: "success",
        title: "Category updated!",
        text: `${form.stockcat_name} has been updated.`,
        timer: 2000,
        showConfirmButton: false,
      });
      // Refetch
      const res = await listStockCategories();
      if (res.status === 'success') setCategories(res.data || []);
    } else {
      Swal.fire("Error", response.message || "Failed to update category", "error");
    }
  };

  const openEditModal = (cat) => {
    setSelectedId(cat.stockcat_id);
    setForm({
      stockcat_name: cat.stockcat_name,
      stockcat_status: cat.stockcat_status,
    });
    setShowEdit(true);
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading categories...</span>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Stock Categories</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              <FaPlus /> Add Category
            </button>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {categories.map((cat, index) => (
              <div key={cat.stockcat_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{cat.stockcat_name}</h3>
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full text-white font-medium ${
                      cat.stockcat_status === "active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {cat.stockcat_status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Created: {cat.stockcat_date_created}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="text-yellow-500 hover:text-yellow-700 transition p-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedId(cat.stockcat_id);
                      setShowDelete(true);
                    }}
                    className="text-red-500 hover:text-red-700 transition p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No categories found
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse rounded-lg shadow-lg bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700">#</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="p-4 hidden md:table-cell font-semibold text-gray-700">Created</th>
                  <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat.stockcat_id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-800">{cat.stockcat_name}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full text-white font-medium ${
                          cat.stockcat_status === "active" ? "bg-green-500" : "bg-gray-500"
                        }`}
                      >
                        {cat.stockcat_status}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-gray-500">{cat.stockcat_date_created}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="text-yellow-500 hover:text-yellow-700 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(cat.stockcat_id);
                          setShowDelete(true);
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= ADD MODAL ================= */}
          {showAdd && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-xl font-bold text-gray-800">Add Stock Category</h3>
                  <button onClick={() => setShowAdd(false)}>
                    <FaTimes className="text-gray-600 hover:text-gray-800" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Category name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.stockcat_name}
                    onChange={e => setForm({ ...form, stockcat_name: e.target.value })}
                  />
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={form.stockcat_status}
                    onChange={e => setForm({ ...form, stockcat_status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                    Cancel
                  </button>
                  <button onClick={handleAdd} disabled={!form.stockcat_name} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= EDIT MODAL ================= */}
          {showEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-xl font-bold text-gray-800">Edit Stock Category</h3>
                  <button onClick={() => setShowEdit(false)}>
                    <FaTimes className="text-gray-600 hover:text-gray-800" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Category name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                    value={form.stockcat_name}
                    onChange={e => setForm({ ...form, stockcat_name: e.target.value })}
                  />
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                    value={form.stockcat_status}
                    onChange={e => setForm({ ...form, stockcat_status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowEdit(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                    Cancel
                  </button>
                  <button onClick={handleEdit} disabled={!form.stockcat_name} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition">
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= DELETE MODAL ================= */}
          {showDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-2xl animate-fadeIn">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  Delete this category?
                </h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
