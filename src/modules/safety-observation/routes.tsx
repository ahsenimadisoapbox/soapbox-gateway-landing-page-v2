// src/modules/safety-observation/routes.tsx
import { AppLayout } from './components/layout/AppLayout';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';
import CompliancePage from './pages/Compliance';
import Assessments from './pages/Assessments';
import Controls from './pages/Controls';
import Mitigations from './pages/Mitigations';
import Audits from './pages/Audits';
import Closures from './pages/Closures';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Security from './pages/Security';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

const safetyObservationRoutes = {
  path: '/safety-observation',
  element: (
    <UserProvider>
      <NotificationProvider>
        <AppLayout />
      </NotificationProvider>
    </UserProvider>
  ),
  children: [
    { index: true, element: <Dashboard /> },

    { path: 'inspections', element: <Inspections /> },
    { path: 'compliance', element: <CompliancePage /> },
    { path: 'assessments', element: <Assessments /> },
    { path: 'controls', element: <Controls /> },
    { path: 'mitigations', element: <Mitigations /> },
    { path: 'audits', element: <Audits /> },
    { path: 'closures', element: <Closures /> },

    { path: 'notifications', element: <Notifications /> },

    { path: 'settings', element: <Settings /> },
    { path: 'security', element: <Security /> },
    { path: 'help', element: <Help /> },

    { path: '*', element: <NotFound /> },
  ],
};

export default safetyObservationRoutes;
