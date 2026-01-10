import { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { listSpecialOrders, addSpecialOrder, updateSpecialOrder, deleteSpecialOrder } from "../../api/services/orders";

export default function SpecialOrder() {
  const { user } = useContext(AuthContext);
  const [specialOrders, setSpecialOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // ------------------- INIT DATA -------------------
  useEffect(() => {
    const fetchSpecialOrders = async () => {
      try {
        const res = await listSpecialOrders();
        if (res.status === 'success') {
          setSpecialOrders(res.data || []);
        }
      } catch (error) {
        console.error('Error fetching special orders:', error);
        Swal.fire('Error', 'Failed to load special orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialOrders();
  }, []);

  // ------------------- ADD -------------------
  const handleAddSave = async () => {
    if (!newItem.special_order_name.trim() || !newItem.special_order_price) {
      Swal.fire("Error", "Name and Price are required!", "error");
      return;
    }

    if (!user?.userid) {
      Swal.fire("Error", "User not authenticated", "error");
      return;
    }

    try {
      const res = await addSpecialOrder({
        special_order_name: newItem.special_order_name,
        special_order_desc: newItem.special_order_desc,
        special_order_price: Number(newItem.special_order_price),
        special_order_status: newItem.special_order_status,
        // userid: user.userid, // Temporarily removed until backend schema is fixed
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Special order added successfully!", "success");
        setNewItem({
          special_order_name: "",
          special_order_desc: "",
          special_order_price: "",
          special_order_status: "active",
        });
        setShowAdd(false);
        // Refetch
        const fetchRes = await listSpecialOrders();
        if (fetchRes.status === 'success') setSpecialOrders(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to add", "error");
      }
    } catch (error) {
      console.error('Error adding:', error);
      Swal.fire("Error", "Failed to add", "error");
    }
  };

  // ------------------- EDIT -------------------
  const openEdit = (item) => {
    setSelectedItem(item);
    setNewItem({
      special_order_name: item.special_order_name,
      special_order_desc: item.special_order_desc,
      special_order_price: item.special_order_price,
      special_order_status: item.special_order_status,
    });
    setShowEdit(true);
  };

  const handleEditSave = async () => {
    if (!selectedItem.special_order_name.trim() || !selectedItem.special_order_price) {
      Swal.fire("Error", "Name and Price are required!", "error");
      return;
    }

    try {
      const res = await updateSpecialOrder({
        special_order_id: selectedItem.special_order_id,
        special_order_name: selectedItem.special_order_name,
        special_order_desc: selectedItem.special_order_desc,
        special_order_price: Number(selectedItem.special_order_price),
        special_order_status: selectedItem.special_order_status,
      });
      if (res.status === 'success') {
        Swal.fire("Success", "Special order updated successfully!", "success");
        setShowEdit(false);
        setSelectedItem(null);
        setNewItem({
          special_order_name: "",
          special_order_desc: "",
          special_order_price: "",
          special_order_status: "active",
        });
        // Refetch
        const fetchRes = await listSpecialOrders();
        if (fetchRes.status === 'success') setSpecialOrders(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to update", "error");
      }
    } catch (error) {
      console.error('Error updating:', error);
      Swal.fire("Error", "Failed to update", "error");
    }
  };

  // ------------------- DELETE -------------------
  const openDelete = (item) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteSpecialOrder(selectedItem.special_order_id);
      if (res.status === 'success') {
        Swal.fire("Deleted", "Special order deleted successfully!", "success");
        setShowDelete(false);
        setSelectedItem(null);
        // Refetch
        const fetchRes = await listSpecialOrders();
        if (fetchRes.status === 'success') setSpecialOrders(fetchRes.data || []);
      } else {
        Swal.fire("Error", res.message || "Failed to delete", "error");
      }
    } catch (error) {
      console.error('Error deleting:', error);
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  return loading ? (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  ) : (
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
