import React, { useState } from "react";
import {
  Users,
  CalendarDays,
  Building2,
  LogOut,
  Menu,
  X,
  Target,
} from "lucide-react";

const Header = ({ user, activeTab, setActiveTab, logout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reusable TabButton component.
  // It changes active tab and closes the mobile menu on click.
  const TabButton = ({ label, icon: Icon, tabKey }) => (
    <button
      onClick={() => {
        setActiveTab(tabKey);
        setIsMobileMenuOpen(false);
      }}
      className={`${
        activeTab === tabKey
          ? "border-indigo-500 text-gray-900"
          : "border-transparent text-gray-500"
      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Title */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-indigo-600">Admin Portal</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-8 items-center">
            {/* Only show Sub Admins tab for super_admin */}
            {user?.role === "superadmin" && (
              <TabButton label="Sub Admins" icon={Users} tabKey="subadmins" />
            )}
            <TabButton label="Events" icon={CalendarDays} tabKey="events" />
            <TabButton label="Chapters" icon={Building2} tabKey="chapters" />
            <TabButton
              label="Opportunities"
              icon={Target}
              tabKey="opportunities"
            />
          </div>

          {/* User Info + Logout (Desktop) */}
          <div className="hidden sm:flex items-center">
            <span className="text-gray-500 mr-4">{user?.email || "Guest"}</span>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden flex flex-col space-y-3 mt-4 pb-4 border-t pt-4">
            {/* Only show Sub Admins tab for super_admin */}
            {user?.role === "superadmin" ? (
              <TabButton label="Sub Admins" icon={Users} tabKey="subadmins" />
            ) : (
              <button
                disabled
                title="Access Restricted"
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                <Users className="w-5 h-5 mr-2" />
                Sub Admins <span className="ml-1">&#128274;</span>
              </button>
            )}
            <TabButton label="Events" icon={CalendarDays} tabKey="events" />
            <TabButton label="Chapters" icon={Building2} tabKey="chapters" />
            <TabButton
              label="Opportunities"
              icon={Target}
              tabKey="opportunities"
            />

            <div className="flex flex-col mt-4">
              <span className="text-gray-500 mb-2">
                {user?.email || "Guest"}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
