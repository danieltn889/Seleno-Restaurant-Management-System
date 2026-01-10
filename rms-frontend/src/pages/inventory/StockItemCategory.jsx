import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { listStockItemCategories, addStockItemCategory, updateStockItemCategory, deleteStockItemCategory, listStockCategories, listStockGroups } from "../../api/services/inventory";

export default function StockItemCategory() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, catsRes, groupsRes] = await Promise.all([
          listStockItemCategories(),
          listStockCategories(),
          listStockGroups(),
        ]);
        if (itemsRes.status === 'success') setItems(itemsRes.data || []);
        if (catsRes.status === 'success') setCategories(catsRes.data || []);
        if (groupsRes.status === 'success') setGroups(groupsRes.data || []);
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
          const [itemsRes, catsRes, groupsRes] = await Promise.all([
            listStockItemCategories(),
            listStockCategories(),
            listStockGroups(),
          ]);
          if (itemsRes.status === 'success') setItems(itemsRes.data || []);
          if (catsRes.status === 'success') setCategories(catsRes.data || []);
          if (groupsRes.status === 'success') setGroups(groupsRes.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Filter items dynamically
  const filteredItems = items.filter((i) => {
    return (
      (selectedCategoryFilter === "" || i.stockcat_id === Number(selectedCategoryFilter)) &&
      (selectedGroupFilter === "" || i.stock_item_cat_group_id === Number(selectedGroupFilter))
    );
  });

  /* ---------- ADD ---------- */
  const handleAddSave = async () => {
    if (!newItem.stock_item_cat_name.trim()) {
      Swal.fire("Error", "Name is required", "error");
      return;
    }
    try {
      const res = await addStockItemCategory({
        stockcat_id: newItem.stockcat_id,
        group_id: newItem.stock_item_cat_group_id,
        name: newItem.stock_item_cat_name,
        desc: newItem.stock_item_cat_desc,
        status: newItem.stock_item_cat_status,
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Item category added", "success");
        setNewItem({
          stockcat_id: "",
          stock_item_cat_group_id: "",
          stock_item_cat_name: "",
          stock_item_cat_desc: "",
          stock_item_cat_status: "active",
        });
        setShowAdd(false);
        // Refetch
        const fetchRes = await listStockItemCategories();
        if (fetchRes.status === 'success') setItems(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to add", "error");
      }
    } catch (error) {
      console.error('Error adding:', error);
      Swal.fire("Error", "Failed to add", "error");
    }
  };

  /* ---------- EDIT ---------- */
  const openEdit = (item) => {
    setSelectedItem(item);
    setNewItem({
      stockcat_id: item.stockcat_id,
      stock_item_cat_group_id: item.stock_item_cat_group_id,
      stock_item_cat_name: item.stock_item_cat_name,
      stock_item_cat_desc: item.stock_item_cat_desc || "",
      stock_item_cat_status: item.stock_item_cat_status,
    });
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!newItem.stock_item_cat_name.trim()) {
      Swal.fire("Error", "Name is required", "error");
      return;
    }
    try {
      const res = await updateStockItemCategory({
        stock_item_cat_id: selectedItem.stock_item_cat_id,
        name: newItem.stock_item_cat_name,
        desc: newItem.stock_item_cat_desc,
        status: newItem.stock_item_cat_status,
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Item category updated", "success");
        setShowEdit(false);
        setSelectedItem(null);
        setNewItem({
          stockcat_id: "",
          stock_item_cat_group_id: "",
          stock_item_cat_name: "",
          stock_item_cat_desc: "",
          stock_item_cat_status: "active",
        });
        // Refetch
        const fetchRes = await listStockItemCategories();
        if (fetchRes.status === 'success') setItems(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to update", "error");
      }
    } catch (error) {
      console.error('Error updating:', error);
      Swal.fire("Error", "Failed to update", "error");
    }
  };

  /* ---------- DELETE ---------- */
  const openDelete = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteStockItemCategory(selectedItem.stock_item_cat_id);
      if (res.status === 'success') {
        Swal.fire("Success", "Item category deleted", "success");
        setShowDelete(false);
        setSelectedItem(null);
        // Refetch
        const fetchRes = await listStockItemCategories();
        if (fetchRes.status === 'success') setItems(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to delete", "error");
      }
    } catch (error) {
      console.error('Error deleting:', error);
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  return loading ? (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading item categories...</span>
    </div>
  ) : (
    <div className="p-4 sm:p-6 bg-white rounded shadow">
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
          {categories.map((c) => <option key={c.stockcat_id} value={c.stockcat_id}>{c.stockcat_name}</option>)}
        </select>
        <select className="border p-2 rounded" value={selectedGroupFilter} onChange={(e) => setSelectedGroupFilter(e.target.value)}>
          <option value="">All Groups</option>
          {groups.map((g) => <option key={g.stock_item_cat_group_id} value={g.stock_item_cat_group_id}>{g.stock_item_cat_group_name}</option>)}
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredItems.map((i, index) => (
          <div key={i.stock_item_cat_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{i.stock_item_cat_name}</h3>
                <p className="text-sm text-gray-500">#{index + 1}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full text-white font-medium ${
                  i.stock_item_cat_status === "active" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {i.stock_item_cat_status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <p><span className="font-medium">Category:</span> {categories.find(c => c.stockcat_id === i.stockcat_id)?.stockcat_name}</p>
              <p><span className="font-medium">Group:</span> {groups.find(g => g.stock_item_cat_group_id === i.stock_item_cat_group_id)?.group_name}</p>
              {i.stock_item_cat_desc && <p><span className="font-medium">Description:</span> {i.stock_item_cat_desc}</p>}
              <p><span className="font-medium">Created:</span> {i.stock_item_cat_created_date}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => openEdit(i)}
                className="text-yellow-500 hover:text-yellow-700 transition p-2"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => openDelete(i)}
                className="text-red-500 hover:text-red-700 transition p-2"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No item categories found
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
                <td className="p-3">{categories.find(c => c.stockcat_id === i.stockcat_id)?.stockcat_name}</td>
                <td className="p-3">{groups.find(g => g.stock_item_cat_group_id === i.stock_item_cat_group_id)?.group_name}</td>
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
            {filteredItems.length === 0 && <tr><td colSpan="9" className="p-6 text-center text-gray-500">No categories found</td></tr>}
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
              {categories.map((c) => <option key={c.stockcat_id} value={c.stockcat_id}>{c.stockcat_name}</option>)}
            </select>

            <select className="w-full border p-2 mb-3 rounded" value={newItem.stock_item_cat_group_id} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_group_id: Number(e.target.value) })}>
              <option value="">Select Category Group</option>
              {groups.map((g) => <option key={g.stock_item_cat_group_id} value={g.stock_item_cat_group_id}>{g.stock_item_cat_group_name}</option>)}
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

            <select className="w-full border p-2 mb-3 rounded" value={newItem.stockcat_id} onChange={(e) => setNewItem({ ...newItem, stockcat_id: Number(e.target.value) })}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.stockcat_id} value={c.stockcat_id}>{c.stockcat_name}</option>)}
            </select>

            <select className="w-full border p-2 mb-3 rounded" value={newItem.stock_item_cat_group_id} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_group_id: Number(e.target.value) })}>
              <option value="">Select Category Group</option>
              {groups.map((g) => <option key={g.stock_item_cat_group_id} value={g.stock_item_cat_group_id}>{g.stock_item_cat_group_name}</option>)}
            </select>

            <input type="text" className="w-full border p-2 mb-3 rounded" value={newItem.stock_item_cat_name} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_name: e.target.value })} />
            <textarea className="w-full border p-2 mb-3 rounded" value={newItem.stock_item_cat_desc} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_desc: e.target.value })} />
            <select className="w-full border p-2 mb-4 rounded" value={newItem.stock_item_cat_status} onChange={(e) => setNewItem({ ...newItem, stock_item_cat_status: e.target.value })}>
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
