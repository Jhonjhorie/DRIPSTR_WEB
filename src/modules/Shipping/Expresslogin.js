import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/constants/supabase";

const ExpressLogin = () => {
  const [username, setUsername] = useState("");
  const navigate= useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Query the "admins" table to check if the username exists
      const { data, error: queryError } = await supabase
        .from("express_admins")
        .select("id, username, password, role") // Select id, username & password
        .eq("username", username)
        .single();
    
      if (queryError || !data) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }
    
      // Compare the entered password with the stored password
      if (data.password !== password) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }
    
      // Manually generate a session token
      const adminToken = `admin-${new Date().getTime()}`;
      localStorage.setItem("adminToken", adminToken);
      localStorage.setItem("username", data.username);
      localStorage.setItem("id", data.id);
      localStorage.setItem("role", data.role);
    
      navigate("/express/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header for larger screens */}
      <div className="hidden sm:block bg-purple-700 p-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-white">Dripstr Express</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="sm:hidden flex justify-center mb-8">
            <div className="bg-purple-600 text-white p-3 rounded-full shadow-lg">
              <h1 className="text-xl font-bold">D</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Purple header section */}
            <div className="bg-purple-600 p-6">
              <h2 className="text-xl md:text-2xl font-bold text-white text-center">
                Dripstr Express Login
              </h2>
              <p className="text-purple-200 text-center mt-1 text-sm">
                Access portal for authorized personnel only
              </p>
            </div>
            
            {/* Form section */}
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-black-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-black"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                  
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              
           
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>© 2025 Dripstr Inc. All rights reserved.</p>
            <p className="mt-1">For Express partners only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpressLogin;