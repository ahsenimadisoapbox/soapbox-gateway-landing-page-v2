import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { calibrationEquipmentNavigation } from "./navigation";

// Pages
import Dashboard from "./pages/Dashboard";
import EquipmentPage from "./pages/EquipmentPage";
import CalibrationPage from "./pages/CalibrationPage";
import OOTPage from "./pages/OOTPage";
import PMPage from "./pages/PMPage";
import RiskPage from "./pages/RiskPage";
import AuditPage from "./pages/AuditPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import SecurityPage from "./pages/SecurityPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";

const calibrationEquipmentRoutes = {
  path: "/calibration-equipment",
  element: (
    <ModuleLayout
      moduleName="Calibration & Equipment"
      navigation={calibrationEquipmentNavigation}
      className="p-6"
    />
  ),
  children: [
    { index: true, element: <Dashboard /> },

    // Equipment & Calibration
    { path: "equipment", element: <EquipmentPage /> },
    { path: "calibration", element: <CalibrationPage /> },

    // Compliance & Monitoring
    { path: "oot", element: <OOTPage /> },
    { path: "pm", element: <PMPage /> },
    { path: "risk", element: <RiskPage /> },
    { path: "audit", element: <AuditPage /> },

    // Reports
    { path: "reports", element: <ReportsPage /> },

    // System
    { path: "settings", element: <SettingsPage /> },
    { path: "security", element: <SecurityPage /> },
    { path: "help", element: <HelpPage /> },

    { path: "*", element: <NotFound /> },
  ],
};

export default calibrationEquipmentRoutes;
