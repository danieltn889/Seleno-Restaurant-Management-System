import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { listStockGroups, addStockGroup, updateStockGroup, deleteStockGroup } from "../../api/services/inventory";

export default function StockItemCategoryGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newGroup, setNewGroup] = useState({
    stock_item_cat_group_name: "",
    stock_item_cat_group_desc: "",
    stock_item_cat_group_status: "active",
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

  /* ---------- ADD ---------- */
  const handleAddSave = async () => {
    if (!newGroup.stock_item_cat_group_name.trim()) {
      Swal.fire("Error", "Group name is required", "error");
      return;
    }
    try {
      const res = await addStockGroup({
        group_name: newGroup.stock_item_cat_group_name,
        group_desc: newGroup.stock_item_cat_group_desc,
        status: newGroup.stock_item_cat_group_status,
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Group added successfully", "success");
        setNewGroup({ stock_item_cat_group_name: "", stock_item_cat_group_desc: "", stock_item_cat_group_status: "active" });
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

  /* ---------- EDIT ---------- */
  const openEdit = (group) => {
    setSelectedGroup(group);
    setNewGroup({
      stock_item_cat_group_name: group.stock_item_cat_group_name,
      stock_item_cat_group_desc: group.stock_item_cat_group_desc,
      stock_item_cat_group_status: group.stock_item_cat_group_status,
    });
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!newGroup.stock_item_cat_group_name.trim()) {
      Swal.fire("Error", "Group name is required", "error");
      return;
    }
    try {
      const res = await updateStockGroup({
        group_id: selectedGroup.stock_item_cat_group_id,
        group_name: newGroup.stock_item_cat_group_name,
        group_desc: newGroup.stock_item_cat_group_desc,
        status: newGroup.stock_item_cat_group_status,
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Group updated successfully", "success");
        setShowEdit(false);
        setSelectedGroup(null);
        setNewGroup({ stock_item_cat_group_name: "", stock_item_cat_group_desc: "", stock_item_cat_group_status: "active" });
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

  /* ---------- DELETE ---------- */
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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-screen">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading groups...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Stock Item Category Groups</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          <FaPlus /> Add Group
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {groups.map((g, index) => (
          <div key={g.stock_item_cat_group_id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{g.stock_item_cat_group_name}</h3>
                <p className="text-sm text-gray-500">#{index + 1}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full text-white font-medium ${
                  g.stock_item_cat_group_status === "active" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {g.stock_item_cat_group_status}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              {g.stock_item_cat_group_desc}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => openEdit(g)}
                className="text-yellow-500 hover:text-yellow-700 transition p-2"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => openDelete(g)}
                className="text-red-500 hover:text-red-700 transition p-2"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No groups found
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
              <th className="p-4 hidden md:table-cell font-semibold text-gray-700">Description</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g,index) => (
              <tr
                key={g.stock_item_cat_group_id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-800">{index+1}</td>
                <td className="p-4 font-medium text-gray-800">{g.stock_item_cat_group_name}</td>
                <td className="p-4 hidden md:table-cell text-gray-500">{g.stock_item_cat_group_desc}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full text-white font-medium ${
                      g.stock_item_cat_group_status === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
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
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => openDelete(g)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
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

      {/* ================= ADD MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-800">Add Stock Item Category Group</h3>
              <button onClick={() => setShowAdd(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Group name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={newGroup.stock_item_cat_group_name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, stock_item_cat_group_name: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={newGroup.stock_item_cat_group_desc}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, stock_item_cat_group_desc: e.target.value })
                }
              />

              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={newGroup.stock_item_cat_group_status}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, stock_item_cat_group_status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              <button onClick={handleAddSave} disabled={!newGroup.stock_item_cat_group_name} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
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
              <h3 className="text-xl font-bold text-gray-800">Edit Stock Item Category Group</h3>
              <button onClick={() => setShowEdit(false)}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Group name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                value={newGroup.stock_item_cat_group_name}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    stock_item_cat_group_name: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                value={newGroup.stock_item_cat_group_desc}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    stock_item_cat_group_desc: e.target.value,
                  })
                }
              />

              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                value={newGroup.stock_item_cat_group_status}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    stock_item_cat_group_status: e.target.value,
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={!newGroup.stock_item_cat_group_name} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition">
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
              Delete this group?
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
    </div>
  );
}
