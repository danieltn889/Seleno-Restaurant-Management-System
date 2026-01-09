import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useUsers from "../../hooks/useUsers";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUser } = useUsers();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    user_phone: "",
    user_role: "Staff",
    user_status: "active",
  });

  useEffect(() => {
    getUserById(id).then((user) => {
      if (!user) return navigate("/users/list");
      setForm(user);
    });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(Number(id), form);
    Swal.fire("Success", "User updated successfully", "success");
    navigate("/users/list");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <h2 className="text-2xl font-bold text-white">Edit User</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-4 sm:grid-cols-2">
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
          <select name="user_role" value={form.user_role} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Status</label>
          <select name="user_status" value={form.user_status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">Update User</button>
        </div>
      </form>
    </div>
  );
}
