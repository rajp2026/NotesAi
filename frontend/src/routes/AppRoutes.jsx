import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layouts/MainLayout";
import HomePage from "../pages/HomePage";
import UploadPage from "../pages/UploadPage";
import DashboardPage from "../pages/DashboardPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;

