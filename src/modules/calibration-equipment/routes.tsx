// src/modules/calibration-equipment/routes.tsx
import { AppLayout } from './components/layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import EquipmentPage from './pages/EquipmentPage';
import CalibrationPage from './pages/CalibrationPage';
import OOTPage from './pages/OOTPage';
import PMPage from './pages/PMPage';
import RiskPage from './pages/RiskPage';
import AuditPage from './pages/AuditPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import SecurityPage from './pages/SecurityPage';
import HelpPage from './pages/HelpPage';
import NotFound from './pages/NotFound';
import { CalibrationEquipmentLayout } from './components/layout/CalibrationEquipmentLayout';

const calibrationEquipmentRoutes = {
  path: '/calibration-equipment',
  element: <CalibrationEquipmentLayout />, // Layout + Provider (if added later) + Outlet
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Equipment & Calibration
    { path: 'equipment', element: <EquipmentPage /> },
    { path: 'calibration', element: <CalibrationPage /> },

    // Compliance & Monitoring
    { path: 'oot', element: <OOTPage /> },
    { path: 'pm', element: <PMPage /> },
    { path: 'risk', element: <RiskPage /> },
    { path: 'audit', element: <AuditPage /> },

    // Reports
    { path: 'reports', element: <ReportsPage /> },

    // System
    { path: 'settings', element: <SettingsPage /> },
    { path: 'security', element: <SecurityPage /> },
    { path: 'help', element: <HelpPage /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default calibrationEquipmentRoutes;
