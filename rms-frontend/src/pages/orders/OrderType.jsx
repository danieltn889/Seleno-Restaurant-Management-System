import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export default function OrderType() {
  // 🔹 Dummy data for order types
  const [orderTypes, setOrderTypes] = useState([]);

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [newItem, setNewItem] = useState({
    order_type_name: "",
    order_type_status: "active",
  });

  const userRole = "admin"; // change to "user" to hide delete

  // ------------------- INIT DUMMY DATA -------------------
  useEffect(() => {
    setOrderTypes([
      {
        order_type_id: 1,
        order_type_name: "Dine-In",
        order_type_status: "active",
        order_type_created_date: "2026-01-01",
        order_type_date_updated: "2026-01-02",
      },
      {
        order_type_id: 2,
        order_type_name: "Takeaway",
        order_type_status: "active",
        order_type_created_date: "2026-01-03",
        order_type_date_updated: "2026-01-04",
      },
      {
        order_type_id: 3,
        order_type_name: "Delivery",
        order_type_status: "inactive",
        order_type_created_date: "2026-01-05",
        order_type_date_updated: "2026-01-06",
      },
    ]);
  }, []);

  // ------------------- ADD -------------------
  const handleAddSave = () => {
    if (!newItem.order_type_name.trim()) {
      Swal.fire("Error", "Order type name is required!", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const newOrderType = {
      order_type_id: orderTypes.length > 0 ? Math.max(...orderTypes.map(o => o.order_type_id)) + 1 : 1,
      order_type_name: newItem.order_type_name,
      order_type_status: newItem.order_type_status,
      order_type_created_date: today,
      order_type_date_updated: today,
    };

    setOrderTypes([...orderTypes, newOrderType]);
    Swal.fire("Success", "Order type added successfully!", "success");

    setNewItem({ order_type_name: "", order_type_status: "active" });
    setShowAdd(false);
  };

  // ------------------- EDIT -------------------
  const openEdit = (item) => {
    setSelectedItem(item);
    setShowEdit(true);
  };

  const handleEditSave = () => {
    if (!selectedItem.order_type_name.trim()) {
      Swal.fire("Error", "Order type name is required!", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const updatedOrderType = { ...selectedItem, order_type_date_updated: today };

    setOrderTypes(orderTypes.map(o => o.order_type_id === selectedItem.order_type_id ? updatedOrderType : o));
    Swal.fire("Success", "Order type updated successfully!", "success");
    setShowEdit(false);
  };

  // ------------------- DELETE -------------------
  const openDelete = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const handleDelete = () => {
    setOrderTypes(orderTypes.filter(o => o.order_type_id !== selectedItem.order_type_id));
    Swal.fire("Deleted", "Order type deleted successfully!", "success");
    setShowDelete(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Order Types</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Add Order Type
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">SN</th>
              <th className="p-3">Order Type Name</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden lg:table-cell">Created</th>
              <th className="p-3 hidden lg:table-cell">Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderTypes.length > 0 ? orderTypes.map((o, index) => (
              <tr key={o.order_type_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{index + 1}</td>
                <td className="p-3 font-medium">{o.order_type_name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full text-white ${
                      o.order_type_status === "active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {o.order_type_status}
                  </span>
                </td>
                <td className="p-3 hidden lg:table-cell">{o.order_type_created_date}</td>
                <td className="p-3 hidden lg:table-cell">{o.order_type_date_updated}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(o)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                      <FaEdit />
                    </button>
                    {userRole === "admin" && (
                      <button onClick={() => openDelete(o)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">No order types found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Add New Order Type</h3>

            <input
              type="text"
              placeholder="Order Type Name"
              className="w-full border p-2 mb-3 rounded"
              value={newItem.order_type_name}
              onChange={(e) => setNewItem({ ...newItem, order_type_name: e.target.value })}
            />

            <select
              className="w-full border p-2 mb-4 rounded"
              value={newItem.order_type_status}
              onChange={(e) => setNewItem({ ...newItem, order_type_status: e.target.value })}
            >
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
            <h3 className="text-xl font-bold mb-4">Edit Order Type</h3>

            <input
              type="text"
              className="w-full border p-2 mb-3 rounded"
              value={selectedItem.order_type_name}
              onChange={(e) => setSelectedItem({ ...selectedItem, order_type_name: e.target.value })}
            />

            <select
              className="w-full border p-2 mb-4 rounded"
              value={selectedItem.order_type_status}
              onChange={(e) => setSelectedItem({ ...selectedItem, order_type_status: e.target.value })}
            >
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
            <h3 className="text-lg font-bold mb-4">Delete this order type?</h3>
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
