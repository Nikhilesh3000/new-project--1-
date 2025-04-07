import React, { useState, useEffect } from 'react';
import "./admin_page.css"

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users3');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle approval or denial of user login
  const handleApproval = async (userId, status) => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/approve-user3', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });

      const data = await response.json();
      setMessage(data.message);  // Display success/error message
      fetchUsers();  // Refresh the user list after updating
    } catch (error) {
      setMessage('Error: ' + error.message);  // Display error message
    }
  };

  useEffect(() => {
    fetchUsers();  // Fetch the user list when the component mounts
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">User List</h2>
      <table className="w-full border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Password</th>
            <th className="border p-2">Actions</th> {/* Added Actions column */}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.password}</td>
                <td className="border p-2">{user.status}</td> {/* Display user status */}
                
                <td className="border p-2">
                  {/* Check if user status is 'pending' */}
                  
                    <>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleApproval(user.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                        onClick={() => handleApproval(user.id, 'denied')}
                      >
                        Deny
                      </button>
                    </>
                   : (
                    <span>{user.status ? (user.status === 'approved' ? 'Approved' : 'Denied') : 'No Status'}</span>
                  )
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">No users available</td>
            </tr>
          )}
        </tbody>
      </table>

      {message && <p className="mt-4">{message}</p>} {/* Display success/error message */}
    </div>
  );
};

export default AdminPanel;