import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { listStockGroups, addStockGroup, updateStockGroup, deleteStockGroup } from "../../api/services/inventory";

export default function StockGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [form, setForm] = useState({
    group_name: "",
    group_desc: "",
    status: "active",
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await listStockGroups();
        if (res.status === 'success') setGroups(res.data || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
        Swal.fire('Error', 'Failed to load groups', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    // Refresh data when the window regains focus (user returns from add/edit pages)
    const handleFocus = () => {
      const fetchGroups = async () => {
        try {
          const res = await listStockGroups();
          if (res.status === 'success') setGroups(res.data || []);
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
      };
      fetchGroups();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleAdd = async () => {
    if (!form.group_name.trim()) {
      Swal.fire("Error", "Group name is required", "error");
      return;
    }
    try {
      const res = await addStockGroup(form);
      if (res.status === 'success') {
        Swal.fire("Success", "Group added successfully", "success");
        setForm({ group_name: "", group_desc: "", status: "active" });
        setShowAdd(false);
        // Refetch
        const fetchRes = await listStockGroups();
        if (fetchRes.status === 'success') setGroups(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to add group", "error");
      }
    } catch (error) {
      console.error('Error adding group:', error);
      Swal.fire("Error", "Failed to add group", "error");
    }
  };

  const openEdit = (group) => {
    setSelectedGroup(group);
    setForm({
      group_name: group.stock_item_cat_group_name,
      group_desc: group.stock_item_cat_group_desc,
      status: group.stock_item_cat_group_status,
    });
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!form.group_name.trim()) {
      Swal.fire("Error", "Group name is required", "error");
      return;
    }
    try {
      const res = await updateStockGroup({
        stock_item_cat_group_id: selectedGroup.stock_item_cat_group_id,
        ...form,
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Group updated successfully", "success");
        setShowEdit(false);
        setSelectedGroup(null);
        setForm({ group_name: "", group_desc: "", status: "active" });
        // Refetch
        const fetchRes = await listStockGroups();
        if (fetchRes.status === 'success') setGroups(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to update group", "error");
      }
    } catch (error) {
      console.error('Error updating group:', error);
      Swal.fire("Error", "Failed to update group", "error");
    }
  };

  const openDelete = (group) => {
    setSelectedGroup(group);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteStockGroup(selectedGroup.stock_item_cat_group_id);
      if (res.status === 'success') {
        Swal.fire("Success", "Group deleted successfully", "success");
        setShowDelete(false);
        setSelectedGroup(null);
        // Refetch
        const fetchRes = await listStockGroups();
        if (fetchRes.status === 'success') setGroups(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to delete group", "error");
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      Swal.fire("Error", "Failed to delete group", "error");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading groups...</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">Stock Groups</h2>

      <div className="flex justify-between mb-6">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Group
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {groups.map(g => (
          <div key={g.stock_item_cat_group_id} className="bg-white shadow p-4 rounded flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{g.stock_item_cat_group_name}</h4>
              <p className="text-sm text-gray-500">{g.stock_item_cat_group_desc}</p>
              <span className={`text-xs px-2 py-1 rounded ${g.stock_item_cat_group_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {g.stock_item_cat_group_status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(g)}
                className="text-yellow-500 hover:text-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => openDelete(g)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-center text-gray-500 py-8">No groups found</div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-lg bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">#</th>
              <th className="p-4 text-left font-semibold text-gray-700">Name</th>
              <th className="p-4 text-left font-semibold text-gray-700">Description</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g, index) => (
              <tr key={g.stock_item_cat_group_id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800">{g.stock_item_cat_group_name}</td>
                <td className="p-4 text-gray-500">{g.stock_item_cat_group_desc || '-'}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full text-white font-medium ${
                      g.stock_item_cat_group_status === "active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {g.stock_item_cat_group_status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <button
                    onClick={() => openEdit(g)}
                    className="text-yellow-500 hover:text-yellow-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDelete(g)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No groups found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Group</h3>
            <input
              className="w-full border p-2 mb-2"
              placeholder="Group name"
              value={form.group_name}
              onChange={(e) => setForm({ ...form, group_name: e.target.value })}
            />
            <input
              className="w-full border p-2 mb-2"
              placeholder="Description"
              value={form.group_desc}
              onChange={(e) => setForm({ ...form, group_desc: e.target.value })}
            />
            <select
              className="w-full border p-2 mb-4"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Group</h3>
            <input
              className="w-full border p-2 mb-2"
              placeholder="Group name"
              value={form.group_name}
              onChange={(e) => setForm({ ...form, group_name: e.target.value })}
            />
            <input
              className="w-full border p-2 mb-2"
              placeholder="Description"
              value={form.group_desc}
              onChange={(e) => setForm({ ...form, group_desc: e.target.value })}
            />
            <select
              className="w-full border p-2 mb-4"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 border">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 bg-yellow-600 text-white">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Delete Group</h3>
            <p>Are you sure you want to delete "{selectedGroup?.group_name}"?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 border">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
