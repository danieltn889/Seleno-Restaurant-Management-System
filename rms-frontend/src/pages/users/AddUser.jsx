import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useUsers from "../../hooks/useUsers";

export default function AddUser() {
  const { addUser } = useUsers();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    user_role: "Staff",
    user_status: "active",
    user_phone: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser(form);
      Swal.fire("Success", "User added successfully", "success");
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        user_role: "Staff",
        user_status: "active",
        user_phone: "",
      });
      navigate("/users/list"); // redirect after success
    } catch (err) {
      Swal.fire("Error", "Failed to add user", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <h2 className="text-2xl font-bold text-white">Add User</h2>
        <p className="text-white/80 mt-1">Fill the form to add a new user</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">First Name</label>
          <input type="text" name="firstname" value={form.firstname} onChange={handleChange} placeholder="John"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Last Name</label>
          <input type="text" name="lastname" value={form.lastname} onChange={handleChange} placeholder="Doe"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@mail.com"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Phone</label>
          <input type="text" name="user_phone" value={form.user_phone} onChange={handleChange} placeholder="0780019550"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Role</label>
          <select name="user_role" value={form.user_role} onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Status</label>
          <select name="user_status" value={form.user_status} onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Add User
          </button>
        </div>
      </form>
    </div>
  );
}
