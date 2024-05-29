"use client";
import Sidebar from "../../components/UI/Sidebar/sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 4 }}>{children}</div>
    </div>
  );
}
