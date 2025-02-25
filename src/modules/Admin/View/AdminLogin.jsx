import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    // Query the "admins" table to check if the username exists
    const { data, error: queryError } = await supabase
      .from("admins")
      .select("id, username, password") // Select id, username & password
      .eq("username", username)
      .single();
  
    if (queryError || !data) {
      setError("Invalid username or password");
      return;
    }
  
    // Compare the entered password with the stored password
    if (data.password !== password) {
      setError("Invalid username or password");
      return;
    }
  
    // Manually generate a session token
    const adminToken = `admin-${new Date().getTime()}`;
    localStorage.setItem("adminToken", adminToken);
    localStorage.setItem("username", data.username);
    localStorage.setItem("id", data.id);  // Store id for future use
  
    // Redirect to the dashboard
    navigate("/admin/dashboard");
  };
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="w-full max-w-sm p-6 bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-200 mb-6">DRIPSTR Admin</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Username:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-400 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-400 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
