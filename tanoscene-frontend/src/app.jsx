// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/mainlayout.jsx";
import AuthLayout from "./layouts/authlayout.jsx";

import ProtectedRoute from "./routes/protectedroute.jsx";
import PublicRoute from "./routes/publicroute.jsx";

import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import FAQ from "./pages/faq.jsx";
import Profile from "./pages/profile.jsx";
import Settings from "./pages/settings.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import NotFound from "./pages/notfound.jsx";

export default function App() {
  return (
    <Routes>

      {/* Public pages with navbar */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />

      <Route
        path="/faq"
        element={
          <MainLayout>
            <FAQ />
          </MainLayout>
        }
      />

      {/* Protected Pages */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/profile/:username" 
        element={
          <MainLayout> 
            <Profile /> 
          </MainLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Login / Signup (No Navbar) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <AuthLayout>
              <Signup />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
