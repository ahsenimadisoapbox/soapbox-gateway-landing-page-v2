// src/modules/validation/routes.tsx
import { MainLayout } from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Deviations from './pages/Deviations';
import ContinuousValidation from './pages/ContinuousValidation';
import Reports from './pages/Reports';
import InspectorMode from './pages/InspectorMode';
import Settings from './pages/Settings';
import Security from './pages/Security';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import MyTasks from './pages/MyTasks';
import NotificationsPage from './pages/NotificationsPage';
import ValidationCalendar from './pages/ValidationCalendar';
import GlobalSearch from './pages/GlobalSearch';
import AuditPackGenerator from './pages/AuditPackGenerator';

const validationRoutes = {
  path: '/validation',
  element: <MainLayout />, // Layout + ValidationProvider + Outlet
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Core
    { path: 'projects', element: <Projects /> },
    { path: 'projects/:id', element: <Projects /> },
    { path: 'deviations', element: <Deviations /> },
    { path: 'deviations/:id', element: <Deviations /> },

    // Tasks & Workflow
    { path: 'my-tasks', element: <MyTasks /> },
    { path: 'notifications', element: <NotificationsPage /> },
    { path: 'calendar', element: <ValidationCalendar /> },
    { path: 'continuous-validation', element: <ContinuousValidation /> },

    // Tools
    { path: 'search', element: <GlobalSearch /> },
    { path: 'audit-pack', element: <AuditPackGenerator /> },
    { path: 'reports', element: <Reports /> },
    { path: 'inspector', element: <InspectorMode /> },

    // System
    { path: 'settings', element: <Settings /> },
    { path: 'security', element: <Security /> },
    { path: 'help', element: <Help /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default validationRoutes;
