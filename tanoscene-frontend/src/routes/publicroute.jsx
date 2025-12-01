import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authprovider.jsx";

export default function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/profile" replace /> : children;
}
