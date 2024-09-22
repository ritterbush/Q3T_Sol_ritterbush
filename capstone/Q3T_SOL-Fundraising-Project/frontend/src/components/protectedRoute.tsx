// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

const ProtectedRoute: React.FC = () => {
  // If user is authenticated, render the child components (Outlet)
  // Otherwise, navigate to the login page
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth/sign-in" />;
};

export default ProtectedRoute;
