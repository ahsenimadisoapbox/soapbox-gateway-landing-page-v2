// src/modules/audit/routes.tsx
import { MainLayout } from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import AuditPlanning from './pages/AuditPlanning';
import Checklists from './pages/Checklists';
import Findings from './pages/Findings';
import CAPA from './pages/CAPA';
import Reports from './pages/Reports';
import NotificationsEscalations from './pages/NotificationsEscalations';
import Auditors from './pages/Auditors';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const auditRoutes = {
  path: '/audit',
  element: <MainLayout />, // Layout + AuditProvider (if any) + Outlet
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Audit Planning & Execution
    { path: 'planning', element: <AuditPlanning /> },
    { path: 'checklists', element: <Checklists /> },
    { path: 'findings', element: <Findings /> },

    // Actions & CAPA
    { path: 'capa', element: <CAPA /> },

    // Monitoring & Reports
    { path: 'reports', element: <Reports /> },

    // Notifications
    { path: 'notifications', element: <NotificationsEscalations /> },
    { path: 'escalations', element: <NotificationsEscalations /> },

    // People & Admin
    { path: 'auditors', element: <Auditors /> },
    { path: 'admin', element: <Admin /> },

    // System
    { path: 'settings', element: <Settings /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default auditRoutes;
