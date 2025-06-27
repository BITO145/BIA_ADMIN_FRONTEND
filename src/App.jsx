import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./Routes/protectedRoute";
import MemberDetail from "./components/MemberDetail";

const App = () => (
  <Router>
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/members/:id" element={<MemberDetail />} />
      </Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />{" "}
    </Routes>
  </Router>
);

export default App;
