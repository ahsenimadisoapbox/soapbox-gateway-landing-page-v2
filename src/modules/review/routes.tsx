// src/modules/review/routes.tsx
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Actions } from './pages/Actions';
import { Attendance } from './pages/Attendance';
import { CAPA } from './pages/CAPA';
import { Decisions } from './pages/Decisions';
import { Reviews } from './pages/Reviews';
import { ReviewCalendar } from './pages/ReviewCalendar';
import { ISOInputs } from './pages/ISOInputs';
import { Reports } from './pages/Reports';
import { Security } from './pages/Security';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import NotFound from './pages/NotFound';

const reviewRoutes = {
  path: '/review',
  element: <MainLayout />, // Layout + ReviewProvider + Outlet
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Review Execution
    { path: 'reviews', element: <Reviews /> },
    { path: 'iso-inputs', element: <ISOInputs /> },
    { path: 'decisions', element: <Decisions /> },

    // Actions & CAPA
    { path: 'actions', element: <Actions /> },
    { path: 'capa', element: <CAPA /> },

    // Monitoring
    { path: 'attendance', element: <Attendance /> },
    { path: 'reports', element: <Reports /> },
    { path: 'calendar', element: <ReviewCalendar /> },

    // System
    { path: 'settings', element: <Settings /> },
    { path: 'security', element: <Security /> },
    { path: 'help', element: <Help /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default reviewRoutes;
