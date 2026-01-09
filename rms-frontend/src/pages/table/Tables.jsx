import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

// 🔹 Dummy table groups
const tableGroups = [
  { table_group_id: 1, table_group_name: "VIP" },
  { table_group_id: 2, table_group_name: "Regular" },
  { table_group_id: 3, table_group_name: "Outdoor" },
];

// 🔹 Simulate logged-in user
const loggedInUserId = 101;

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newItem, setNewItem] = useState({
    table_group_id: "",
    table_name: "",
    table_desc: "",
    userid: loggedInUserId,
  });

  const [filterGroupId, setFilterGroupId] = useState(""); // for filter

  const userRole = "admin"; // change to 'user' to hide delete

  // ------------------- FETCH TABLES (dummy) -------------------
  useEffect(() => {
    setTables([
      {
        table_id: 1,
        table_group_id: 1,
        table_group_name: "VIP",
        table_name: "Table A1",
        table_desc: "Near window",
        userid: 101,
        table_created_date: "2026-01-01",
        table_updated_date: "2026-01-02",
      },
      {
        table_id: 2,
        table_group_id: 2,
        table_group_name: "Regular",
        table_name: "Table B1",
        table_desc: "Center of hall",
        userid: 102,
        table_created_date: "2026-01-03",
        table_updated_date: "2026-01-04",
      },
      {
        table_id: 3,
        table_group_id: 1,
        table_group_name: "VIP",
        table_name: "Table A2",
        table_desc: "Corner",
        userid: 101,
        table_created_date: "2026-01-05",
        table_updated_date: "2026-01-06",
      },
    ]);
  }, []);

  // ------------------- ADD -------------------
  const handleAddSave = () => {
    if (!newItem.table_group_id || !newItem.table_name.trim()) {
      Swal.fire("Error", "All required fields must be filled!", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const groupName = tableGroups.find(g => g.table_group_id === Number(newItem.table_group_id))?.table_group_name;

    const newTable = {
      table_id: tables.length > 0 ? Math.max(...tables.map(t => t.table_id)) + 1 : 1,
      table_group_id: Number(newItem.table_group_id),
      table_group_name: groupName,
      table_name: newItem.table_name,
      table_desc: newItem.table_desc,
      userid: loggedInUserId,
      table_created_date: today,
      table_updated_date: today,
    };

    setTables([...tables, newTable]);
    Swal.fire("Success", "Table added successfully!", "success");

    setNewItem({ table_group_id: "", table_name: "", table_desc: "", userid: loggedInUserId });
    setShowAdd(false);
  };

  // ------------------- EDIT -------------------
  const openEdit = (item) => { setSelectedItem(item); setShowEdit(true); };

  const handleEditSave = () => {
    if (!selectedItem.table_group_id || !selectedItem.table_name.trim()) {
      Swal.fire("Error", "All required fields must be filled!", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const groupName = tableGroups.find(g => g.table_group_id === Number(selectedItem.table_group_id))?.table_group_name;

    const updatedTable = { ...selectedItem, table_group_name: groupName, table_updated_date: today };

    setTables(tables.map(t => t.table_id === selectedItem.table_id ? updatedTable : t));
    Swal.fire("Success", "Table updated successfully!", "success");
    setShowEdit(false);
  };

  // ------------------- DELETE -------------------
  const openDelete = (item) => { setSelectedItem(item); setShowDelete(true); };
  const handleDelete = () => {
    setTables(tables.filter(t => t.table_id !== selectedItem.table_id));
    Swal.fire("Deleted", "Table deleted successfully!", "success");
    setShowDelete(false);
  };

  // ------------------- FILTERED TABLES -------------------
  const filteredTables = filterGroupId
    ? tables.filter(t => t.table_group_id === Number(filterGroupId))
    : tables;

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tables</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add Table
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          className="border p-2 rounded"
          value={filterGroupId}
          onChange={(e) => setFilterGroupId(e.target.value)}
        >
          <option value="">All Table Groups</option>
          {tableGroups.map(g => (
            <option key={g.table_group_id} value={g.table_group_id}>{g.table_group_name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Table Name</th>
              <th className="p-3">Group</th>
              <th className="p-3">Description</th>
              <th className="p-3">User ID</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTables.length > 0 ? filteredTables.map((t,index) => (
              <tr key={t.table_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index+1}</td>
                <td className="p-3 font-medium">{t.table_name}</td>
                <td className="p-3">{t.table_group_name}</td>
                <td className="p-3">{t.table_desc}</td>
                <td className="p-3">{t.userid}</td>
                <td className="p-3 hidden lg:table-cell">{t.table_created_date}</td>
                <td className="p-3 hidden lg:table-cell">{t.table_updated_date}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(t)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                      <FaEdit />
                    </button>
                    {userRole === "admin" && (
                      <button onClick={() => openDelete(t)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">No tables found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Add New Table</h3>

            {/* Table Group */}
            <select
              className="w-full border p-2 mb-3 rounded"
              value={newItem.table_group_id}
              onChange={(e) => setNewItem({ ...newItem, table_group_id: Number(e.target.value) })}
            >
              <option value="">Select Table Group</option>
              {tableGroups.map(g => (
                <option key={g.table_group_id} value={g.table_group_id}>{g.table_group_name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Table Name"
              className="w-full border p-2 mb-3 rounded"
              value={newItem.table_name}
              onChange={(e) => setNewItem({ ...newItem, table_name: e.target.value })}
            />

            <input
              type="text"
              placeholder="Description"
              className="w-full border p-2 mb-4 rounded"
              value={newItem.table_desc}
              onChange={(e) => setNewItem({ ...newItem, table_desc: e.target.value })}
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
            <h3 className="text-xl font-bold mb-4">Edit Table</h3>

            <select
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.table_group_id}
              onChange={(e) => setSelectedItem({ ...selectedItem, table_group_id: Number(e.target.value) })}
            >
              <option value="">Select Table Group</option>
              {tableGroups.map(g => (
                <option key={g.table_group_id} value={g.table_group_id}>{g.table_group_name}</option>
              ))}
            </select>

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.table_name}
              onChange={(e) => setSelectedItem({ ...selectedItem, table_name: e.target.value })}
            />

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.table_desc}
              onChange={(e) => setSelectedItem({ ...selectedItem, table_desc: e.target.value })}
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
            <h3 className="text-lg font-bold mb-4">Delete this table?</h3>
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
