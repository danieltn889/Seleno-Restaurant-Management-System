import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { listUsers, updateUser } from "../../api/services/users";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    user_phone: "",
    user_role: "Waiter",
    user_status: "active",
  });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await listUsers();
      if (response.status === 'success') {
        const user = response.data.find(u => u.userid == id);
        if (!user) return navigate("/users/list");
        setUserData(user);
        setForm({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          email: user.email || "",
          user_phone: user.user_phone || "",
          user_role: user.user_role || "Waiter",
          user_status: user.user_status || "active",
        });
      } else {
        navigate("/users/list");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateUser({ userid: Number(id), ...form });
      Swal.fire("Success", "User updated successfully", "success");
      navigate("/users/list");
    } catch (error) {
      Swal.fire("Error", "Failed to update user", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <h2 className="text-2xl font-bold text-white">Edit User</h2>
      </div>

      {loading ? (
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading user data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 grid gap-4 sm:grid-cols-2">
        {/* User ID - Read Only */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">User ID</label>
          <input type="text" value={userData?.userid || ""} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" readOnly />
        </div>
        
        {/* Created Date - Read Only */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Created Date</label>
          <input type="text" value={userData?.user_created_date || ""} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" readOnly />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">First Name</label>
          <input type="text" name="firstname" value={form.firstname} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Last Name</label>
          <input type="text" name="lastname" value={form.lastname} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Phone</label>
          <input type="text" name="user_phone" value={form.user_phone} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Role</label>
          <select name="user_role" value={form.user_role} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
            <option value="Waiter">Waiter</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Status</label>
          <select name="user_status" value={form.user_status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        {/* Updated Date - Read Only */}
        <div className="flex flex-col sm:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Last Updated</label>
          <input type="text" value={userData?.user_updated_date || ""} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" readOnly />
        </div>
        <div className="sm:col-span-2 flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/users/list")} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition font-semibold">Back</button>
          <button 
            type="submit" 
            disabled={updating}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {updating ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
