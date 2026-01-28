// src/modules/quality-events/routes.tsx
import AppLayout from './components/layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import DraftsPage from './pages/DraftsPage';
import MyWorkPage from './pages/MyWorkPage';
import NotificationsPage from './pages/NotificationsPage';
import SearchPage from './pages/SearchPage';

// Event lifecycle
import TriagePage from './pages/TriagePage';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import QAClassificationPage from './pages/QAClassificationPage';

// Incidents
import IncidentsPage from './pages/IncidentsPage';
import ContainmentPage from './pages/ContainmentPage';
import InvestigationPage from './pages/InvestigationPage';
import CorrectiveActionsPage from './pages/CorrectiveActionsPage';
import QAReviewPage from './pages/QAReviewPage';
import EffectivenessPage from './pages/EffectivenessPage';
import LessonsLearnedPage from './pages/LessonsLearnedPage';

// Analytics
import AnalyticsEventsPage from './pages/AnalyticsEventsPage';
import IncidentsDashboardPage from './pages/IncidentsDashboardPage';
import RiskHeatmapPage from './pages/RiskHeatmapPage';
import ExecutiveOverviewPage from './pages/ExecutiveOverviewPage';

// Audit
import EventRegisterPage from './pages/EventRegisterPage';
import IncidentRegisterPage from './pages/IncidentRegisterPage';
import AuditTrailPage from './pages/AuditTrailPage';
import EvidenceRepositoryPage from './pages/EvidenceRepositoryPage';

// System
import AdministrationPage from './pages/AdministrationPage';
import SecurityPage from './pages/SecurityPage';
import HelpPage from './pages/HelpPage';

import NotFound from './pages/NotFound';

const qualityEventsRoutes = {
  path: '/quality-events',
  element: <AppLayout />, // Layout + Providers + Outlet
  children: [
    // Dashboard
    { index: true, element: <Dashboard /> },

    // Events
    { path: 'events', element: <EventsPage /> },
    { path: 'events/create', element: <CreateEventPage /> },
    { path: 'events/drafts', element: <DraftsPage /> },

    // Work & Search
    { path: 'my-work', element: <MyWorkPage /> },
    { path: 'notifications', element: <NotificationsPage /> },
    { path: 'search', element: <SearchPage /> },

    // Event Lifecycle
    { path: 'triage', element: <TriagePage /> },
    { path: 'risk-assessment', element: <RiskAssessmentPage /> },
    { path: 'classification', element: <QAClassificationPage /> },

    // Incidents
    { path: 'incidents', element: <IncidentsPage /> },
    { path: 'incidents/:id', element: <IncidentsPage /> },
    { path: 'incidents/containment', element: <ContainmentPage /> },
    { path: 'incidents/investigation', element: <InvestigationPage /> },
    { path: 'incidents/corrective-actions', element: <CorrectiveActionsPage /> },
    { path: 'qa-review', element: <QAReviewPage /> },
    { path: 'effectiveness', element: <EffectivenessPage /> },
    { path: 'lessons-learned', element: <LessonsLearnedPage /> },

    // Analytics
    { path: 'analytics/events', element: <AnalyticsEventsPage /> },
    { path: 'analytics/incidents', element: <IncidentsDashboardPage /> },
    { path: 'analytics/risk-heatmap', element: <RiskHeatmapPage /> },
    { path: 'analytics/executive', element: <ExecutiveOverviewPage /> },

    // Audit
    { path: 'audit/events', element: <EventRegisterPage /> },
    { path: 'audit/incidents', element: <IncidentRegisterPage /> },
    { path: 'audit/trail', element: <AuditTrailPage /> },
    { path: 'audit/evidence', element: <EvidenceRepositoryPage /> },

    // System
    { path: 'administration', element: <AdministrationPage /> },
    { path: 'security', element: <SecurityPage /> },
    { path: 'help', element: <HelpPage /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default qualityEventsRoutes;
