import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user } = useContext(AppContext);

  console.log("ProtectedRoute rendering with:", { token, user, requiredRole });

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login-register" replace />;
  }
  
  if (!user) {
    console.log("User data not loaded yet");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-blue-600 font-semibold animate-pulse">
          Loading user data...
        </div>
      </div>
    );
  }
  
  // Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    console.log(`User role (${user.role}) doesn't match required role (${requiredRole})`);
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/client/dashboard" replace />;
    }
  }

  console.log("Access granted to protected route");
  return children;
};

export default ProtectedRoute;