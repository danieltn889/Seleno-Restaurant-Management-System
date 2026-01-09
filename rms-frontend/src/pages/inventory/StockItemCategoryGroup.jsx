import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function StockItemCategoryGroup() {
  const [groups, setGroups] = useState([
    {
      Stock_item_cat_group_id: 1,
      Stock_item_cat_group_name: "Fresh Items",
      Stock_item_cat_group_desc: "Daily used items",
      Stock_item_cat_group_status: "active",
    },
    {
      Stock_item_cat_group_id: 2,
      Stock_item_cat_group_name: "Dry Goods",
      Stock_item_cat_group_desc: "Stored items",
      Stock_item_cat_group_status: "inactive",
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newGroup, setNewGroup] = useState({
    Stock_item_cat_group_name: "",
    Stock_item_cat_group_desc: "",
    Stock_item_cat_group_status: "active",
  });

  /* ---------- EDIT ---------- */
  const openEdit = (group) => {
    setSelectedGroup(group);
    setShowEdit(true);
  };

  const handleEditSave = () => {
    setGroups(
      groups.map((g) =>
        g.Stock_item_cat_group_id === selectedGroup.Stock_item_cat_group_id
          ? selectedGroup
          : g
      )
    );
    setShowEdit(false);
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `${selectedGroup.Stock_item_cat_group_name} updated successfully.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /* ---------- DELETE ---------- */
  const openDelete = (group) => {
    setSelectedGroup(group);
    setShowDelete(true);
  };

  const handleDelete = () => {
    setGroups(
      groups.filter(
        (g) => g.Stock_item_cat_group_id !== selectedGroup.Stock_item_cat_group_id
      )
    );
    setShowDelete(false);
    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: `${selectedGroup.Stock_item_cat_group_name} has been deleted.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /* ---------- ADD ---------- */
  const handleAddSave = () => {
    if (!newGroup.Stock_item_cat_group_name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Group name cannot be empty!",
      });
      return;
    }

    const nextId =
      groups.length > 0
        ? Math.max(...groups.map((g) => g.Stock_item_cat_group_id)) + 1
        : 1;

    const addedGroup = { ...newGroup, Stock_item_cat_group_id: nextId };
    setGroups([...groups, addedGroup]);

    setNewGroup({
      Stock_item_cat_group_name: "",
      Stock_item_cat_group_desc: "",
      Stock_item_cat_group_status: "active",
    });
    setShowAdd(false);

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: `${addedGroup.Stock_item_cat_group_name} has been added successfully.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stock Item Category Groups</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add Group
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3 hidden md:table-cell">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g,index) => (
              <tr
                key={g.Stock_item_cat_group_id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-medium">{index+1}</td>
                <td className="p-3 font-medium">{g.Stock_item_cat_group_name}</td>
                <td className="p-3 hidden md:table-cell">{g.Stock_item_cat_group_desc}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full text-white ${
                      g.Stock_item_cat_group_status === "active"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {g.Stock_item_cat_group_status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(g)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDelete(g)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {groups.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No category groups found
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
            <h3 className="text-xl font-bold mb-4">Add New Group</h3>

            <input
              type="text"
              placeholder="Group Name"
              className="w-full border p-2 mb-3 rounded"
              value={newGroup.Stock_item_cat_group_name}
              onChange={(e) =>
                setNewGroup({ ...newGroup, Stock_item_cat_group_name: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 mb-3 rounded"
              value={newGroup.Stock_item_cat_group_desc}
              onChange={(e) =>
                setNewGroup({ ...newGroup, Stock_item_cat_group_desc: e.target.value })
              }
            />

            <select
              className="w-full border p-2 mb-4 rounded"
              value={newGroup.Stock_item_cat_group_status}
              onChange={(e) =>
                setNewGroup({ ...newGroup, Stock_item_cat_group_status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
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
            <h3 className="text-xl font-bold mb-4">Edit Group</h3>

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={selectedGroup.Stock_item_cat_group_name}
              onChange={(e) =>
                setSelectedGroup({
                  ...selectedGroup,
                  Stock_item_cat_group_name: e.target.value,
                })
              }
            />

            <textarea
              className="w-full border p-2 mb-3 rounded"
              value={selectedGroup.Stock_item_cat_group_desc}
              onChange={(e) =>
                setSelectedGroup({
                  ...selectedGroup,
                  Stock_item_cat_group_desc: e.target.value,
                })
              }
            />

            <select
              className="w-full border p-2 mb-4 rounded"
              value={selectedGroup.Stock_item_cat_group_status}
              onChange={(e) =>
                setSelectedGroup({
                  ...selectedGroup,
                  Stock_item_cat_group_status: e.target.value,
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
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
            <h3 className="text-lg font-bold mb-4">Delete this group?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
