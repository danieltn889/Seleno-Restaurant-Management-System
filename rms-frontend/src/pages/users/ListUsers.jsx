import { useEffect, useState } from "react";
import { listUsers, deleteUser } from "../../api/services/users";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function ListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Refresh data when the window regains focus (user returns from add/edit pages)
    const handleFocus = () => {
      fetchUsers();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await listUsers();
    if (res.status === 'success') {
      setUsers(res.data);
    }
    setLoading(false);
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
      const res = await deleteUser(id);
      if (res.status === 'success') {
        setUsers(users.filter((u) => u.userid !== id));
        Swal.fire("Deleted!", "User deleted successfully.", "success");
      } else {
        Swal.fire("Error", res.message || "Failed to delete user", "error");
      }
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
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      ) : (
        <>
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        ) : (
          filteredUsers.map((user, idx) => (
            <div key={user.userid} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.firstname} {user.lastname}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-white text-xs ${user.user_status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                  {user.user_status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium">{user.user_phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Role:</span>
                  <p className="font-medium">{user.user_role}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user.userid)}
                  className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition"
                >
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(user.userid)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
                >
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-2 text-left text-gray-600 font-medium">#</th>
              <th className="w-32 px-4 py-2 text-left text-gray-600 font-medium">Name</th>
              <th className="w-48 px-4 py-2 text-left text-gray-600 font-medium">Email</th>
              <th className="w-32 px-4 py-2 text-left text-gray-600 font-medium">Phone</th>
              <th className="w-24 px-4 py-2 text-left text-gray-600 font-medium">Role</th>
              <th className="w-20 px-4 py-2 text-left text-gray-600 font-medium">Status</th>
              <th className="w-32 px-4 py-2 text-center text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? [
              <tr key="no-users">
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            ] : filteredUsers.map((user, idx) => (
              <tr key={user.userid} className="hover:bg-gray-50">
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
                    onClick={() => handleEdit(user.userid)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.userid)}
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
      </>
      )}
    </div>
  );
}
