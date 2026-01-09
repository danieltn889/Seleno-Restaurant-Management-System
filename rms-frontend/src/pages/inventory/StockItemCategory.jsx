import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function StockItemCategory() {
  // 🔹 Dummy data for stock categories
  const stockCategories = [
    { stockcat_id: 101, stockcat_name: "Vegetables" },
    { stockcat_id: 102, stockcat_name: "Grains" },
    { stockcat_id: 103, stockcat_name: "Fruits" },
  ];

  // 🔹 Dummy data for stock category groups
  const stockCategoryGroups = [
    { stock_item_cat_group_id: 1, stock_item_cat_group_name: "Fresh" },
    { stock_item_cat_group_id: 2, stock_item_cat_group_name: "Imported" },
    { stock_item_cat_group_id: 3, stock_item_cat_group_name: "Organic" },
  ];

  const [items, setItems] = useState([
    {
      stock_item_cat_id: 1,
      stockcat_id: 101,
      stock_item_cat_group_id: 1,
      stock_item_cat_name: "Tomatoes",
      stock_item_cat_desc: "Fresh red tomatoes",
      stock_item_cat_status: "active",
      stock_item_cat_created_date: "2026-01-01",
      stock_item_cat_updated_date: "2026-01-03",
    },
    {
      stock_item_cat_id: 2,
      stockcat_id: 102,
      stock_item_cat_group_id: 2,
      stock_item_cat_name: "Rice",
      stock_item_cat_desc: "Imported rice",
      stock_item_cat_status: "inactive",
      stock_item_cat_created_date: "2026-01-02",
      stock_item_cat_updated_date: "2026-01-04",
    },
    {
      stock_item_cat_id: 3,
      stockcat_id: 103,
      stock_item_cat_group_id: 1,
      stock_item_cat_name: "Potatoes",
      stock_item_cat_desc: "Organic potatoes",
      stock_item_cat_status: "active",
      stock_item_cat_created_date: "2026-01-02",
      stock_item_cat_updated_date: "2026-01-05",
    },
  ]);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newItem, setNewItem] = useState({
    stockcat_id: "",
    stock_item_cat_group_id: "",
    stock_item_cat_name: "",
    stock_item_cat_desc: "",
    stock_item_cat_status: "active",
  });

  const userRole = "admin"; // change to 'user' to hide delete

  // Filter items dynamically
  const filteredItems = items.filter((i) => {
    return (
      (selectedCategoryFilter === "" || i.stockcat_id === Number(selectedCategoryFilter)) &&
      (selectedGroupFilter === "" || i.stock_item_cat_group_id === Number(selectedGroupFilter))
    );
  });

  /* ---------- ADD ---------- */
  const handleAddSave = () => {
    if (!newItem.stock_item_cat_name.trim() || !newItem.stockcat_id || !newItem.stock_item_cat_group_id) {
      Swal.fire("Error", "All required fields must be filled!", "error");
      return;
    }

    const nextId = items.length > 0 ? Math.max(...items.map((i) => i.stock_item_cat_id)) + 1 : 1;
    const today = new Date().toISOString().split("T")[0];

    setItems([...items, { ...newItem, stock_item_cat_id: nextId, stock_item_cat_created_date: today, stock_item_cat_updated_date: today }]);
    Swal.fire("Success", "Category added successfully!", "success");
    setNewItem({ stockcat_id: "", stock_item_cat_group_id: "", stock_item_cat_name: "", stock_item_cat_desc: "", stock_item_cat_status: "active" });
    setShowAdd(false);
  };

  /* ---------- EDIT ---------- */
  const openEdit = (item) => { setSelectedItem(item); setShowEdit(true); };

  const handleEditSave = () => {
    if (!selectedItem.stock_item_cat_name.trim() || !selectedItem.stockcat_id || !selectedItem.stock_item_cat_group_id) {
      Swal.fire("Error", "All required fields must be filled!", "error");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    setItems(items.map((i) => i.stock_item_cat_id === selectedItem.stock_item_cat_id ? { ...selectedItem, stock_item_cat_updated_date: today } : i));
    Swal.fire("Success", "Category updated successfully!", "success");
    setShowEdit(false);
  };

  /* ---------- DELETE ---------- */
  const openDelete = (item) => { setSelectedItem(item); setShowDelete(true); };

  const handleDelete = () => {
    setItems(items.filter((i) => i.stock_item_cat_id !== selectedItem.stock_item_cat_id));
    Swal.fire("Deleted", "Category deleted successfully!", "success");
    setShowDelete(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Stock Item Categories</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select className="border p-2 rounded" value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {stockCategories.map((c) => <option key={c.stockcat_id} value={c.stockcat_id}>{c.stockcat_name}</option>)}
        </select>
        <select className="border p-2 rounded" value={selectedGroupFilter} onChange={(e) => setSelectedGroupFilter(e.target.value)}>
          <option value="">All Groups</option>
          {stockCategoryGroups.map((g) => <option key={g.stock_item_cat_group_id} value={g.stock_item_cat_group_id}>{g.stock_item_cat_group_name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3 hidden md:table-cell">Description</th>
              <th className="p-3">Category</th>
              <th className="p-3">Group</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((i,index) => (
              <tr key={i.stock_item_cat_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{index+1}</td>
                <td className="p-3 font-medium">{i.stock_item_cat_name}</td>
                <td className="p-3 hidden md:table-cell">{i.stock_item_cat_desc}</td>
                <td className="p-3">{stockCategories.find(c => c.stockcat_id === i.stockcat_id)?.stockcat_name}</td>
                <td className="p-3">{stockCategoryGroups.find(g => g.stock_item_cat_group_id === i.stock_item_cat_group_id)?.stock_item_cat_group_name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-sm rounded-full text-white ${i.stock_item_cat_status === "active" ? "bg-green-500" : "bg-gray-500"}`}>{i.stock_item_cat_status}</span>
                </td>
                <td className="p-3 hidden lg:table-cell">{i.stock_item_cat_created_date}</td>
                <td className="p-3 hidden lg:table-cell">{i.stock_item_cat_updated_date}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(i)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"><FaEdit /></button>
                    {userRole === "admin" && <button onClick={() => openDelete(i)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600"><FaTrash /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && <tr><td colSpan="8" className="p-6 text-center text-gray-500">No categories found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Add New Category</h3>

            <select className="w-full border p-2 mb-3 rounded" value={newItem.stockcat_id} onChange={(e) => setNewItem({ ...newItem, stockcat_id: Number(e.target.value) })}>
              <option value="">Select Category</option>
              {stockCategories.map((c) => <option key={c.stockcat_id} value={c.stockcat_id}>{c.stockcat_name}</option>)}
            </select>

            <select className="w-full border p-2 mb-3 rounded" value={newItem.stock_item_cat_group_id} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_group_id: Number(e.target.value) })}>
              <option value="">Select Category Group</option>
              {stockCategoryGroups.map((g) => <option key={g.stock_item_cat_group_id} value={g.stock_item_cat_group_id}>{g.stock_item_cat_group_name}</option>)}
            </select>

            <input type="text" placeholder="Name" className="w-full border p-2 mb-3 rounded" value={newItem.stock_item_cat_name} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_name: e.target.value })} />
            <textarea placeholder="Description" className="w-full border p-2 mb-3 rounded" value={newItem.stock_item_cat_desc} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_desc: e.target.value })} />
            <select className="w-full border p-2 mb-4 rounded" value={newItem.stock_item_cat_status} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleAddSave} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Edit Category</h3>

            <select className="w-full border p-2 mb-3 rounded" value={selectedItem.stockcat_id} onChange={(e) => setSelectedItem({ ...selectedItem, stockcat_id: Number(e.target.value) })}>
              <option value="">Select Category</option>
              {stockCategories.map((c) => <option key={c.stockcat_id} value={c.stockcat_id}>{c.stockcat_name}</option>)}
            </select>

            <select className="w-full border p-2 mb-3 rounded" value={selectedItem.stock_item_cat_group_id} onChange={(e) => setSelectedItem({ ...selectedItem, stock_item_cat_group_id: Number(e.target.value) })}>
              <option value="">Select Category Group</option>
              {stockCategoryGroups.map((g) => <option key={g.stock_item_cat_group_id} value={g.stock_item_cat_group_id}>{g.stock_item_cat_group_name}</option>)}
            </select>

            <input type="text" className="w-full border p-2 mb-3 rounded" value={selectedItem.stock_item_cat_name} onChange={(e) => setSelectedItem({ ...selectedItem, stock_item_cat_name: e.target.value })} />
            <textarea className="w-full border p-2 mb-3 rounded" value={selectedItem.stock_item_cat_desc} onChange={(e) => setSelectedItem({ ...selectedItem, stock_item_cat_desc: e.target.value })} />
            <select className="w-full border p-2 mb-4 rounded" value={selectedItem.stock_item_cat_status} onChange={(e) => setSelectedItem({ ...selectedItem, stock_item_cat_status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Delete this category?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
