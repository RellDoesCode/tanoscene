import React from "react";
import Navbar from "../components/navbar.jsx";

export default function AuthLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
