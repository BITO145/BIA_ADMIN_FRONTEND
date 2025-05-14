import React, { useState } from "react";
import Header from "../components/Header";
import SubAdminManagement from "../components/SubAdminManagement";
import EventManagement from "../components/EventManagement";
import ChapterManagement from "../components/ChapterManagement";
import { logoutService } from "../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../slices/auth/authSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Logout initiated...");
      await logoutService();
      dispatch(logout());
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={handleLogout}
      />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "subadmins" && user.role === "superadmin" && (
          <SubAdminManagement />
        )}
        {activeTab === "events" && <EventManagement />}
        {activeTab === "chapters" && <ChapterManagement />}
      </div>
    </div>
  );
};

export default Dashboard;
