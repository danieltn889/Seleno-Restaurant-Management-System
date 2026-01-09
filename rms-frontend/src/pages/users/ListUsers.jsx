import { useEffect, useState } from "react";
import useUsers from "../../hooks/useUsers";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ListUsers() {
  const { listUsers, deleteUser } = useUsers();
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await listUsers();
    setUsers(data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete user?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      Swal.fire("Deleted!", "User deleted successfully.", "success");
    }
  };

  const handleEdit = (id) => navigate(`/users/edit/${id}`);
  const handleAdd = () => navigate("/users/add");

  // Filtered data for search
  const filteredUsers = users.filter(
    (u) =>
      u.firstname.toLowerCase().includes(filterText.toLowerCase()) ||
      u.lastname.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(filterText.toLowerCase()) ||
      u.user_phone.includes(filterText)
  );

  return (
    <div className="max-w-7xl mx-auto mt-6 bg-white shadow-lg rounded-xl p-4">
      {/* Header + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">User List</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* Search input */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Responsive table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">#</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Email</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Phone</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Role</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-2 text-center text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
            {filteredUsers.map((user, idx) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{user.firstname} {user.lastname}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.user_phone}</td>
                <td className="px-4 py-2">{user.user_role}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-white text-sm ${user.user_status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                    {user.user_status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
