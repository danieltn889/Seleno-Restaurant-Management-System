import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function SpecialOrder() {
  // Simulated logged-in user ID
  const loggedInUserId = 1; // <-- replace with real user ID from auth

  // 🔹 Dummy data for special orders
  const [specialOrders, setSpecialOrders] = useState([]);

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [newItem, setNewItem] = useState({
    special_order_name: "",
    special_order_desc: "",
    special_order_price: "",
    special_order_status: "active",
  });

  const userRole = "admin"; // change to "user" to hide delete

  // ------------------- INIT DUMMY DATA -------------------
  useEffect(() => {
    setSpecialOrders([
      {
        special_order_id: 1,
        special_order_name: "Chef Special Pizza",
        special_order_desc: "Extra cheese, pepperoni",
        special_order_price: 12000,
        special_order_status: "active",
        userid: 1,
      },
      {
        special_order_id: 2,
        special_order_name: "Grilled Salmon",
        special_order_desc: "Served with veggies",
        special_order_price: 18000,
        special_order_status: "active",
        userid: 1,
      },
      {
        special_order_id: 3,
        special_order_name: "Chocolate Lava Cake",
        special_order_desc: "Warm and gooey",
        special_order_price: 6000,
        special_order_status: "inactive",
        userid: 2,
      },
    ]);
  }, []);

  // ------------------- ADD -------------------
  const handleAddSave = () => {
    if (!newItem.special_order_name.trim() || !newItem.special_order_price) {
      Swal.fire("Error", "Name and Price are required!", "error");
      return;
    }

    const nextId =
      specialOrders.length > 0
        ? Math.max(...specialOrders.map((o) => o.special_order_id)) + 1
        : 1;

    const newOrder = {
      ...newItem,
      special_order_id: nextId,
      special_order_price: Number(newItem.special_order_price),
      userid: loggedInUserId, // assign logged-in user
    };

    setSpecialOrders([...specialOrders, newOrder]);
    Swal.fire("Success", "Special order added successfully!", "success");

    setNewItem({
      special_order_name: "",
      special_order_desc: "",
      special_order_price: "",
      special_order_status: "active",
    });

    setShowAdd(false);
  };

  // ------------------- EDIT -------------------
  const openEdit = (item) => {
    setSelectedItem(item);
    setShowEdit(true);
  };

  const handleEditSave = () => {
    if (!selectedItem.special_order_name.trim() || !selectedItem.special_order_price) {
      Swal.fire("Error", "Name and Price are required!", "error");
      return;
    }

    setSpecialOrders(
      specialOrders.map((o) =>
        o.special_order_id === selectedItem.special_order_id
          ? { ...selectedItem, special_order_price: Number(selectedItem.special_order_price) }
          : o
      )
    );

    Swal.fire("Success", "Special order updated successfully!", "success");
    setShowEdit(false);
  };

  // ------------------- DELETE -------------------
  const openDelete = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const handleDelete = () => {
    setSpecialOrders(
      specialOrders.filter((o) => o.special_order_id !== selectedItem.special_order_id)
    );
    Swal.fire("Deleted", "Special order deleted successfully!", "success");
    setShowDelete(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Special Orders</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add Special Order
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">SN</th>
              <th className="p-3">Name</th>
              <th className="p-3 hidden md:table-cell">Description</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden lg:table-cell">User ID</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {specialOrders.length > 0 ? (
              specialOrders.map((o, index) => (
                <tr key={o.special_order_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{index + 1}</td>
                  <td className="p-3 font-medium">{o.special_order_name}</td>
                  <td className="p-3 hidden md:table-cell">{o.special_order_desc}</td>
                  <td className="p-3">{o.special_order_price}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm rounded-full text-white ${
                        o.special_order_status === "active" ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {o.special_order_status}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell">{o.userid}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEdit(o)}
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      {userRole === "admin" && (
                        <button
                          onClick={() => openDelete(o)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No special orders found
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
            <h3 className="text-xl font-bold mb-4">Add Special Order</h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 mb-3 rounded"
              value={newItem.special_order_name}
              onChange={(e) => setNewItem({ ...newItem, special_order_name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 mb-3 rounded"
              value={newItem.special_order_desc}
              onChange={(e) => setNewItem({ ...newItem, special_order_desc: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 mb-3 rounded"
              value={newItem.special_order_price}
              onChange={(e) => setNewItem({ ...newItem, special_order_price: e.target.value })}
            />
            <select
              className="w-full border p-2 mb-4 rounded"
              value={newItem.special_order_status}
              onChange={(e) => setNewItem({ ...newItem, special_order_status: e.target.value })}
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
            <h3 className="text-xl font-bold mb-4">Edit Special Order</h3>

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.special_order_name}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, special_order_name: e.target.value })
              }
            />
            <textarea
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.special_order_desc}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, special_order_desc: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.special_order_price}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, special_order_price: e.target.value })
              }
            />
            <select
              className="w-full border p-2 mb-4 rounded"
              value={selectedItem.special_order_status}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, special_order_status: e.target.value })
              }
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
            <h3 className="text-lg font-bold mb-4">Delete this special order?</h3>
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
