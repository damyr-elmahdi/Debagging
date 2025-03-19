import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";

const AdminDashboard = () => {
  const { user, setToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/login-register");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">245</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">New Posts</h3>
            <p className="text-3xl font-bold text-green-600">18</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Active Sessions</h3>
            <p className="text-3xl font-bold text-purple-600">32</p>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-700">User Management</h3>
              <p className="text-gray-600 mt-2">Create, update, or delete user accounts</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300">
                Manage Users
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-700">Exercise Management</h3>
              <p className="text-gray-600 mt-2">Create and manage fitness exercises</p>
              <Link
                to="/admin/exercises"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-block"
              >
                Manage Exercises
              </Link>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-700">Product Management</h3>
              <p className="text-gray-600 mt-2">Create and manage store products</p>
              <div className="flex space-x-2 mt-4">
                <Link
                  to="/admin/products"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-block"
                >
                  Manage Products
                </Link>
                <Link
                  to="/admin/products/create"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-block"
                >
                  Create Product
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-700">System Settings</h3>
              <p className="text-gray-600 mt-2">Configure application settings and preferences</p>
              <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-300">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;