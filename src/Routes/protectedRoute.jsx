// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/auth/authSlice";
import { Navigate, Outlet } from "react-router-dom";
import { selectAuthInitialized } from "../slices/auth/authSlice";

const ProtectedRoute = () => {
  const user = useSelector(selectUser);
  const initialized = useSelector((state) => state.auth.initialized);

  // If the app has not finished rehydrating, you can render a loading indicator.
  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
