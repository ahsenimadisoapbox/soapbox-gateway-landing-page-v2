// src/modules/capa/routes.tsx
import { MainLayout } from './components/layout/MainLayout';

// Pages
import Index from './pages/Index';
import CapaDetails from './pages/CapaDetails';
import CapaPlanning from './pages/CapaPlanning';
import Effectiveness from './pages/Effectiveness';
import Workflow from './pages/Workflow';
import Severity from './pages/Severity';
import Timeline from './pages/Timeline';
import Closure from './pages/Closure';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

const capaRoutes = {
  path: '/capa',
  element: <MainLayout />, // Layout + (CAPAProvider later if needed) + Outlet
  children: [
    // Dashboard / Landing
    { index: true, element: <Index /> },

    // CAPA Lifecycle
    { path: 'capa-details', element: <CapaDetails /> },
    { path: 'capa-planning', element: <CapaPlanning /> },
    { path: 'effectiveness', element: <Effectiveness /> },
    { path: 'workflow', element: <Workflow /> },
    { path: 'severity', element: <Severity /> },
    { path: 'timeline', element: <Timeline /> },
    { path: 'closure', element: <Closure /> },

    // System
    { path: 'settings', element: <Settings /> },
    { path: 'help', element: <Help /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default capaRoutes;
