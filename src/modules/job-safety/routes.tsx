// src/modules/job-safety/routes.tsx
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import MyPendingActions from './pages/MyPendingActions';
import CreateJSA from './pages/CreateJSA';
import EditJSA from './pages/EditJSA';
import StepsManagement from './pages/StepsManagement';
import HazardIdentification from './pages/HazardIdentification';
import ControlMeasures from './pages/ControlMeasures';
import RiskMatrix from './pages/RiskMatrix';
import ReviewL1 from './pages/ReviewL1';
import ReviewL2 from './pages/ReviewL2';
import JSALibrary from './pages/JSALibrary';
import ActiveJSAs from './pages/ActiveJSAs';
import Archive from './pages/Archive';
import AuditLog from './pages/AuditLog';
import JobBreakdown from './pages/JobBreakdown';
import Administration from './pages/Administration';
import Security from './pages/Security';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

const jobSafetyRoutes = {
  path: '/job-safety',
  element: <Layout />, // Layout + JobSafetyProvider (later) + Outlet
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Dashboard & Overview
    { path: 'my-pending-actions', element: <MyPendingActions /> },

    // Creation & Editing
    { path: 'create-jsa', element: <CreateJSA /> },
    { path: 'edit-jsa', element: <EditJSA /> },

    // Steps, Hazards & Controls
    { path: 'steps-management', element: <StepsManagement /> },
    { path: 'hazard-identification', element: <HazardIdentification /> },
    { path: 'control-measures', element: <ControlMeasures /> },
    { path: 'job-breakdown', element: <JobBreakdown /> },

    // Risk Assessment
    { path: 'risk-matrix', element: <RiskMatrix /> },

    // Workflow & Approval
    { path: 'review-l1', element: <ReviewL1 /> },
    { path: 'review-l2', element: <ReviewL2 /> },

    // Library & Archive
    { path: 'jsa-library', element: <JSALibrary /> },
    { path: 'active-jsas', element: <ActiveJSAs /> },
    { path: 'archive', element: <Archive /> },

    // Audit & System
    { path: 'audit-log', element: <AuditLog /> },
    { path: 'administration', element: <Administration /> },
    { path: 'security', element: <Security /> },
    { path: 'help', element: <Help /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default jobSafetyRoutes;
