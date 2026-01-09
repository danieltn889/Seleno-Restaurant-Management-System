import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

export default function Header({ user, toggleSidebar }) {
  if (!user) return null;

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 bg-white shadow sticky top-0 z-20">
      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-600 text-2xl focus:outline-none"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Page title */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
        Dashboard
      </h1>

      {/* User info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
        <span className="hidden sm:inline-block text-gray-700 font-medium truncate">
          {user.names}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
