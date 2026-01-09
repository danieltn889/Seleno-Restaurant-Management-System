// Example: src/pages/examples/UserManagementExample.jsx
import { useState, useEffect } from 'react';
import { listUsers, addUser, updateUser, deleteUser } from '@/api/services';
import Swal from 'sweetalert2';

const UserManagementExample = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    const result = await listUsers();
    
    if (result.status === 'success') {
      setUsers(result.data);
    } else {
      Swal.fire('Error', result.message, 'error');
    }
    setLoading(false);
  };

  // Add new user
  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New User',
      html:
        '<input id="firstname" class="swal2-input" placeholder="First Name">' +
        '<input id="lastname" class="swal2-input" placeholder="Last Name">' +
        '<input id="email" class="swal2-input" placeholder="Email">' +
        '<input id="phone" class="swal2-input" placeholder="Phone">' +
        '<select id="role" class="swal2-input">' +
        '<option value="">Select Role</option>' +
        '<option value="Admin">Admin</option>' +
        '<option value="Manager">Manager</option>' +
        '<option value="Cashier">Cashier</option>' +
        '<option value="Waiter">Waiter</option>' +
        '</select>',
      focusConfirm: false,
      preConfirm: () => {
        return {
          firstname: document.getElementById('firstname').value,
          lastname: document.getElementById('lastname').value,
          email: document.getElementById('email').value,
          user_phone: document.getElementById('phone').value,
          user_role: document.getElementById('role').value,
          user_status: 'active'
        };
      }
    });

    if (formValues) {
      setLoading(true);
      const result = await addUser(formValues);
      
      if (result.status === 'success') {
        Swal.fire('Success', 'User added successfully', 'success');
        fetchUsers(); // Refresh list
      } else {
        Swal.fire('Error', result.message, 'error');
      }
      setLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Update User',
      html:
        `<input id="firstname" class="swal2-input" placeholder="First Name" value="${user.firstname}">` +
        `<input id="lastname" class="swal2-input" placeholder="Last Name" value="${user.lastname}">` +
        `<input id="email" class="swal2-input" placeholder="Email" value="${user.email}">` +
        `<input id="phone" class="swal2-input" placeholder="Phone" value="${user.user_phone}">` +
        '<select id="role" class="swal2-input">' +
        `<option value="Admin" ${user.user_role === 'Admin' ? 'selected' : ''}>Admin</option>` +
        `<option value="Manager" ${user.user_role === 'Manager' ? 'selected' : ''}>Manager</option>` +
        `<option value="Cashier" ${user.user_role === 'Cashier' ? 'selected' : ''}>Cashier</option>` +
        `<option value="Waiter" ${user.user_role === 'Waiter' ? 'selected' : ''}>Waiter</option>` +
        '</select>' +
        '<select id="status" class="swal2-input">' +
        `<option value="active" ${user.user_status === 'active' ? 'selected' : ''}>Active</option>` +
        `<option value="inactive" ${user.user_status === 'inactive' ? 'selected' : ''}>Inactive</option>` +
        '</select>',
      focusConfirm: false,
      preConfirm: () => {
        return {
          userid: user.userid,
          firstname: document.getElementById('firstname').value,
          lastname: document.getElementById('lastname').value,
          email: document.getElementById('email').value,
          user_phone: document.getElementById('phone').value,
          user_role: document.getElementById('role').value,
          user_status: document.getElementById('status').value
        };
      }
    });

    if (formValues) {
      setLoading(true);
      const result = await updateUser(formValues);
      
      if (result.status === 'success') {
        Swal.fire('Success', 'User updated successfully', 'success');
        fetchUsers(); // Refresh list
      } else {
        Swal.fire('Error', result.message, 'error');
      }
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userid, username) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete user ${username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      const result = await deleteUser(userid);
      
      if (result.status === 'success') {
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers(); // Refresh list
      } else {
        Swal.fire('Error', result.message, 'error');
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={handleAddUser}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Add User
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 && !loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.userid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.userid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.firstname} {user.lastname}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.user_phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                      {user.user_role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.user_status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.user_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleUpdateUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.userid, `${user.firstname} ${user.lastname}`)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementExample;
