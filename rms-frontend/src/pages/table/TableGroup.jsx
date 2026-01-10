// File: src/pages/tables/TableGroup.jsx

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { listTableGroups, addTableGroup, updateTableGroup, deleteTableGroup } from "../../api/services/tables.js";

export default function TableGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newItem, setNewItem] = useState({
    table_group_name: "",
  });

  const [filterText, setFilterText] = useState("");

  const userRole = "admin"; // change to 'user' to hide delete

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await listTableGroups();
      if (res.status === 'success') {
        setGroups(res.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to load table groups", "error");
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      Swal.fire("Error", "Failed to load table groups", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ADD ---------- */
  const handleAddSave = async () => {
    if (!newItem.table_group_name.trim()) {
      Swal.fire("Error", "Group name is required!", "error");
      return;
    }

    try {
      const res = await addTableGroup({ table_group_name: newItem.table_group_name });
      if (res.status === 'success') {
        Swal.fire("Success", "Table group added successfully!", "success");
        setNewItem({ table_group_name: "" });
        setShowAdd(false);
        fetchGroups(); // refetch
      } else {
        Swal.fire("Error", res.message || "Failed to add", "error");
      }
    } catch (error) {
      console.error('Error adding:', error);
      Swal.fire("Error", "Failed to add", "error");
    }
  };

  /* ---------- EDIT ---------- */
  const openEdit = (item) => { setSelectedItem(item); setShowEdit(true); };

  const handleEditSave = async () => {
    if (!selectedItem.table_group_name.trim()) {
      Swal.fire("Error", "Group name is required!", "error");
      return;
    }

    try {
      const res = await updateTableGroup(selectedItem.table_group_id, { table_group_name: selectedItem.table_group_name });
      if (res.status === 'success') {
        Swal.fire("Success", "Table group updated successfully!", "success");
        setShowEdit(false);
        fetchGroups(); // refetch
      } else {
        Swal.fire("Error", res.message || "Failed to update", "error");
      }
    } catch (error) {
      console.error('Error updating:', error);
      Swal.fire("Error", "Failed to update", "error");
    }
  };

  /* ---------- DELETE ---------- */
  const openDelete = (item) => { setSelectedItem(item); setShowDelete(true); };

  const handleDelete = async () => {
    try {
      const res = await deleteTableGroup(selectedItem.table_group_id);
      if (res.status === 'success') {
        Swal.fire("Deleted", "Table group deleted successfully!", "success");
        setShowDelete(false);
        fetchGroups(); // refetch
      } else {
        Swal.fire("Error", res.message || "Failed to delete", "error");
      }
    } catch (error) {
      console.error('Error deleting:', error);
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  /* ---------- FILTER ---------- */
  const filteredGroups = groups.filter((g) =>
    g.table_group_name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Table Groups</h2>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 rounded flex-1"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <FaPlus /> Add Group
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
                 <th className="p-3">#</th>
              <th className="p-3">Group Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((g,index) => (
              <tr key={g.table_group_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{index+1}</td>
                <td className="p-3 font-medium">{g.table_group_name}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(g)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                      <FaEdit />
                    </button>
                    {userRole === "admin" && (
                      <button onClick={() => openDelete(g)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredGroups.length === 0 && (
              <tr>
                <td colSpan="2" className="p-6 text-center text-gray-500">
                  No table groups found
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
            <h3 className="text-xl font-bold mb-4">Add New Table Group</h3>

            <input
              type="text"
              placeholder="Group Name"
              className="w-full border p-2 mb-3 rounded"
              value={newItem.table_group_name}
              onChange={(e) => setNewItem({ ...newItem, table_group_name: e.target.value })}
            />

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
            <h3 className="text-xl font-bold mb-4">Edit Table Group</h3>

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.table_group_name}
              onChange={(e) => setSelectedItem({ ...selectedItem, table_group_name: e.target.value })}
            />

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
            <h3 className="text-lg font-bold mb-4">Delete this table group?</h3>
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
