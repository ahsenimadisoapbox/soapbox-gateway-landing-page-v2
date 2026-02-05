// src/modules/complaints-customer/routes.tsx
import { MainLayout } from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ComplaintsRegister from './pages/ComplaintsRegister';
import ComplaintDetail from './pages/ComplaintDetail';
import ActionItems from './pages/ActionItems';
import Incidents from './pages/Incidents';
import Audits from './pages/Audits';
import CAPA from './pages/CAPA';
import RiskRegister from './pages/RiskRegister';
import Reports from './pages/Reports';
import CustomerPortal from './pages/CustomerPortal';
import SettingsPage from './pages/Settings';
import SecurityPage from './pages/Security';
import UsersPage from './pages/Users';
import HelpPage from './pages/Help';
import NotFound from './pages/NotFound';

const complaintsCustomerRoutes = {
  path: '/complaints-customer',
  element: <MainLayout />, // Layout + ComplaintsCustomerProvider + Outlet
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Complaints
    { path: 'complaints', element: <ComplaintsRegister /> },
    { path: 'complaints/:id', element: <ComplaintDetail /> },

    // Actions & Related Modules
    { path: 'action-items', element: <ActionItems /> },
    { path: 'incidents', element: <Incidents /> },
    { path: 'audits', element: <Audits /> },
    { path: 'capa', element: <CAPA /> },
    { path: 'risk', element: <RiskRegister /> },

    // Reports & Portal
    { path: 'reports', element: <Reports /> },
    { path: 'customer-portal', element: <CustomerPortal /> },

    // System
    { path: 'users', element: <UsersPage /> },
    { path: 'settings', element: <SettingsPage /> },
    { path: 'security', element: <SecurityPage /> },
    { path: 'help', element: <HelpPage /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default complaintsCustomerRoutes;
