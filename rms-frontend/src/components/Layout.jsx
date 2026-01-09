import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header user={user} toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
