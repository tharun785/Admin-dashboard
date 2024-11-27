 
import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'HR Executive', status: 'Inactive' },
    { id: 3, name: 'Alice Johnson', role: 'Software Developer', status: 'Active' },
    // Add more users for testing pagination
    ...Array.from({ length: 30 }, (_, i) => ({
      id: i + 4,
      name: `User ${i + 4}`,
      role: i % 2 === 0 ? 'Software Developer' : 'HR Executive',
      status: i % 3 === 0 ? 'Active' : 'Inactive',
    })),
  ]);

  const [newUser, setNewUser] = useState({ name: '', role: '', status: 'Active' });
  const [editUser, setEditUser] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: 1, role: 'Admin' });
  const [searchQuery, setSearchQuery] = useState({ name: '', role: '' });
  const [filterRole, setFilterRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleAddUser = () => {
    if (newUser.name && newUser.role) {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      setNewUser({ name: '', role: '', status: 'Active' });
    } else {
      alert('Please provide name and role.');
    }
  };

  const handleEditUser = () => {
    if (editUser) {
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      setEditUser(null);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleStatusChange = (id) => {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.name.toLowerCase()) &&
      user.role.toLowerCase().includes(searchQuery.role.toLowerCase()) &&
      (!filterRole || user.role === filterRole)
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add User Section */}
      {currentUser.role === 'Admin' && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">{editUser ? 'Edit User' : 'Add New User'}</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter name"
              value={editUser ? editUser.name : newUser.name}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, name: e.target.value })
                  : setNewUser({ ...newUser, name: e.target.value })
              }
              className="border rounded px-4 py-2 w-1/3"
            />
            <select
              value={editUser ? editUser.role : newUser.role}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, role: e.target.value })
                  : setNewUser({ ...newUser, role: e.target.value })
              }
              className="border rounded px-4 py-2 w-1/3"
            >
              <option value="">Select Role</option>
              <option value="Software Developer">Software Developer</option>
              <option value="HR Executive">HR Executive</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              onClick={editUser ? handleEditUser : handleAddUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Search and Filter Users</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery.name}
            onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
            className="border rounded px-4 py-2 w-1/3"
          />
          <input
            type="text"
            placeholder="Search by role"
            value={searchQuery.role}
            onChange={(e) => setSearchQuery({ ...searchQuery, role: e.target.value })}
            className="border rounded px-4 py-2 w-1/3"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border rounded px-4 py-2 w-1/3"
          >
            <option value="">All Roles</option>
            <option value="Software Developer">Software Developer</option>
            <option value="HR Executive">HR Executive</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Users List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded shadow-sm flex flex-col bg-gray-50">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Name: {user.name}</h4>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  Status: {user.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Role: {user.role}</p>
              <div className="flex justify-end gap-2">
                {currentUser.role === 'Admin' && (
                  <>
                    <button
                      onClick={() => setEditUser(user)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleStatusChange(user.id)}
                  className="text-gray-600 hover:underline"
                >
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
